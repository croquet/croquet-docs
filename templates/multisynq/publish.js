// multisynq/publish.js
const _ = require('lodash')
const env = require('jsdoc/env')
const fs = require('fs-extra')
const helper = require('jsdoc/util/templateHelper')
const logger = require('jsdoc/util/logger')
const path = require('jsdoc/path')
const { taffy } = require('@jsdoc/salty')
const template = require('jsdoc/template')
const htmlMinify = require('html-minifier-terser')

const { createNavigationScript, createNavigationStyles } = require('./helpers/navigation.js')

// Used to parse markdown from markdown files
const markdown = require('jsdoc/util/markdown')

const {
  buildFooter,
  codepen,
  createDynamicStyleSheet,
  createDynamicsScripts,
  getBaseURL,
  getFavicon,
  getMetaTagData,
  getTheme,
  includeCss,
  includeScript,
  moduleHeader,
  resizeable,
  returnPathOfScriptScr,
  returnPathOfStyleSrc,
  copyStaticFolder,
  getProcessedYield,
  lsSync,
} = require('./clean-jsdoc-theme-helper')

const { HTML_MINIFY_OPTIONS, SECTION_TYPE, defaultSections } = require('./clean-jsdoc-theme-defaults')

const htmlsafe = helper.htmlsafe
const linkto = helper.linkto
const resolveAuthorLinks = helper.resolveAuthorLinks
const hasOwnProp = Object.prototype.hasOwnProperty

const themeOpts = (env && env.opts && env.opts.theme_opts) || {}

let data
let view
/**
 * @type {Array<{title: string, link: string, description: string}>}
 */
const searchList = []
const hasSearch = themeOpts.search === undefined ? true : Boolean(themeOpts.search)

// eslint-disable-next-line no-restricted-globals
let outdir = path.resolve(path.normalize(env.opts.destination))

function mkdirSync(filepath) { return fs.mkdirSync(filepath, { recursive: true }) } //prettier-ignore
function find(spec) { return helper.find(data, spec) } //prettier-ignore
function tutoriallink(tutorial) { return helper.toTutorial(tutorial, null, { tag: 'em', classname: 'disabled', prefix: 'Tutorial: '}) } //prettier-ignore
function getAncestorLinks(doclet) { return helper.getAncestorLinks(data, doclet) } //prettier-ignore

function sourceToDestination(parentDir, sourcePath, destDir) {
  const relativeSource = path.relative(parentDir, sourcePath)
  return path.resolve(path.join(destDir, relativeSource))
}

function hashToLink(doclet, hash, dependencies) {
  let url
  if (!/^(#.+)/.test(hash)) return hash
  url = helper.createLink(doclet, dependencies)
  url = url.replace(/(#.+|$)/, hash)
  return `<a href="${url}">${hash}</a>`
}

function needsSignature({ kind, type, meta }) {
  let needsSig = false

  // function and class definitions always get a signature
  if (kind === 'function' || kind === 'class') needsSig = true
  // typedefs that contain functions get a signature, too
  else if (kind === 'typedef' && type && type.names && type.names.length) {
    for (let i = 0, l = type.names.length; i < l; i++) {
      if (type.names[i].toLowerCase() === 'function') {
        needsSig = true
        break
      }
    }
  }

  // And namespaces that are functions get a signature (but finding them is a bit messy)
  else if (kind === 'namespace' && meta && meta.code && meta.code.type && meta.code.type.match(/[Ff]unction/)) needsSig = true
  return needsSig
}

function getSignatureAttributes({ optional, nullable }) {
  const attributes = []
  if (optional) attributes.push('opt')
  if (nullable === true) attributes.push('nullable')
  else if (nullable === false) attributes.push('non-null')
  return attributes
}

function updateItemName(item) {
  const attributes = getSignatureAttributes(item)
  let itemName = item.name || ''
  if (item.variable) itemName = '&hellip;' + itemName
  if (attributes && attributes.length) itemName = `${itemName}<span class="signature-attributes">${attributes.join(', ')}</span>`
  return itemName
}

function addParamAttributes(params) { return params.filter(({ name }) => name && !name.includes('.')).map(updateItemName) } //prettier-ignore

function buildItemTypeStrings(item) {
  const types = []
  if (item && item.type && item.type.names) item.type.names.forEach(function (name) { types.push(linkto(name, htmlsafe(name))) }) //prettier-ignore
  return types
}

function buildAttribsString(attribs) {
  let attribsString = ''
  if (attribs && attribs.length) attribsString = htmlsafe(`(${attribs.join(', ')}) `)
  return attribsString
}

function addNonParamAttributes(items) {
  let types = []
  items.forEach(function (item) { types = types.concat(buildItemTypeStrings(item)) }) //prettier-ignore
  return types
}

function addSignatureParams(f) {
  const params = f.params ? addParamAttributes(f.params) : []
  f.signature = `${f.signature || ''}(${params.join(', ')})`
}

function addSignatureReturns(f) {
  const attribs = []
  let attribsString = ''
  let returnTypes = []
  let returnTypesString = ''
  const source = f.yields || f.returns

  // jam all the return-type attributes into an array. this could create odd results (for example,
  // if there are both nullable and non-nullable return types), but let's assume that most people
  // who use multiple @return tags aren't using Closure Compiler type annotations, and vice-versa.
  if (source) {
    source.forEach((item) => {
      helper.getAttribs(item).forEach((attrib) => {
        if (!attribs.includes(attrib)) attribs.push(attrib)
      })
    })

    attribsString = buildAttribsString(attribs)
  }

  if (source) returnTypes = addNonParamAttributes(source)
  if (returnTypes.length) returnTypesString = ` &rarr; ${attribsString}{${returnTypes.join('|')}}`
  let signatureOutput = ''
  if (f.signature) signatureOutput = '<span class="signature">' + (f.signature || '') + '</span>'
  if (returnTypesString) signatureOutput += '<span class="type-signature">' + returnTypesString + '</span>'
  f.signature = signatureOutput
}

function addSignatureTypes(f) {
  const types = f.type ? buildItemTypeStrings(f) : []
  f.signature = `${f.signature || ''}<span class="type-signature">` + `${types.length ? ` :${types.join('|')}` : ''}</span>`
}

function addAttribs(f) {
  const attribs = helper.getAttribs(f)
  const attribsString = buildAttribsString(attribs)
  f.attribs = `<span class="type-signature">${attribsString}</span>`
}

function shortenPaths(files, commonPrefix) {
  Object.keys(files).forEach(function (file) {
    files[file].shortened = files[file].resolved
      .replace(commonPrefix, '')
      // always use forward slashes
      .replace(/\\/g, '/')
  })

  return files
}

function getPathFromDoclet({ meta }) {
  if (!meta) return null
  return meta.path && meta.path !== 'null' ? path.join(meta.path, meta.filename) : meta.filename
}

function createPrettyAnchor(elementType, ancestor, name, href) {
  return `<${elementType} ${href ? `href="${href}"` : ''} class="has-anchor">
    <span class="ancestors">
      ${ancestor}~
    </span>
    ${name}
  </${elementType}>`
}

function prefixModuleToItemAnchor(item) {
  let { anchor } = item
  let anchorLink = anchor.split('href="')[1].split('"')[0]
  let cleanLink = anchorLink.replace(/\.html$/, '')
  let prettyAnchor

  cleanLink.replace(/module-([^-]+)(?:-|\.)(.*)/, (_match, modulename, methodname) => {
    prettyAnchor = createPrettyAnchor('a', modulename, methodname, anchorLink)
  })

  return prettyAnchor || anchor
}

async function generate(title, docs, filename, resolveLinks) {
  let docData
  let html
  let outpath

  docData = {
    env: env,
    title: title,
    docs: docs,
    filename,
  }

  outpath = path.join(outdir, filename)
  html = view.render('container.tmpl', docData)

  if (resolveLinks !== false) html = helper.resolveLinks(html) // turn {@link foo} into <a href="foodoc.html">foo</a>
  const minifiedHtml = await htmlMinify.minify(html, HTML_MINIFY_OPTIONS)
  fs.writeFileSync(outpath, minifiedHtml, 'utf8')
}

function generateSourceFiles(sourceFiles, encoding = 'utf8') {
  Object.keys(sourceFiles).forEach(function (file) {
    let source
    // links are keyed to the shortened path in each doclet's `meta.shortpath` property
    const sourceOutFile = helper.getUniqueFilename(sourceFiles[file].shortened)

    helper.registerLink(sourceFiles[file].shortened, sourceOutFile)

    try {
      source = {
        kind: 'source',
        title: sourceOutFile.replace('.html', ''),
        code: helper.htmlsafe(fs.readFileSync(sourceFiles[file].resolved, encoding)),
      }
    } catch (e) {
      logger.error('Error while generating source file %s: %s', file, e.message)
    }

    generate(`Source: ${sourceFiles[file].shortened}`, [source], sourceOutFile, false)
  })
}

/**
 * Look for classes or functions with the same name as modules (which indicates that the module
 * exports only that class or function), then attach the classes or functions to the `module`
 * property of the appropriate module doclets. The name of each class or function is also updated
 * for display purposes. This function mutates the original arrays.
 *
 * @private
 * @param {Array.<module:jsdoc/doclet.Doclet>} doclets - The array of classes and functions to
 * check.
 * @param {Array.<module:jsdoc/doclet.Doclet>} modules - The array of module doclets to search.
 */
function attachModuleSymbols(doclets, modules) {
  const symbols = {}

  // build a lookup table
  doclets.forEach((symbol) => {
    symbols[symbol.longname] = symbols[symbol.longname] || []
    symbols[symbol.longname].push(symbol)
  })

  modules.forEach((module) => {
    if (symbols[module.longname]) {
      module.modules = symbols[module.longname]
        // Only show symbols that have a description. Make an exception for classes, because
        // we want to show the constructor-signature heading no matter what.
        .filter(({ description, kind }) => description || kind === 'class')
        .map((symbol) => {
          symbol = _.cloneDeep(symbol)
          if (symbol.kind === 'class' || symbol.kind === 'function') symbol.name = `${symbol.name.replace('module:', '(require("')}"))`
          return symbol
        })
    }
  })
}

function buildSidebarMembers({ items, itemHeading, itemsSeen, linktoFn, sectionName }) {
  const navProps = {
    name: itemHeading,
    items: [],
    id: `sidebar-${itemHeading.toLowerCase()}`,
  }

  if (!items?.length) return null

  if (items.length) {
    items.forEach(function (item) {
      const currentItem = {
        name: item.name,
        anchor: item.longname ? linktoFn(item.longname, item.name) : linktoFn('', item.name),
        children: [],
      }

      const methods =
        sectionName === SECTION_TYPE.Tutorials || sectionName === SECTION_TYPE.Global
          ? []
          : find({
              kind: 'function',
              memberof: item.longname,
              inherited: { '!is': Boolean(themeOpts.exclude_inherited) },
            })

      if (!hasOwnProp.call(itemsSeen, item.longname)) {
        currentItem.anchor = linktoFn(item.longname, item.name.replace(/^module:/, ''))

        if (methods.length) {
          methods.forEach(function (method) {
            const itemChild = {
              name: method.longName,
              link: linktoFn(method.longname, method.name),
            }
            currentItem.children.push(itemChild)
          })
        }
        itemsSeen[item.longname] = true
      }
      navProps.items.push(currentItem)
    })
  }

  return navProps
}

function buildSidebarSubpackagesMember(subpackages, allpackages) {
  // Subpackages are used at the root level
  const subpackagesLink = (name) => `./${name}`

  // Allpackages are used inside each subpackage
  // Hence they have to reference the parent package
  const allpackagesLink = (name) => (name === 'worldcore' ? '../' : `../${name}`)

  return {
    name: 'Packages',
    items: subpackages
      .map((name) => {
        return {
          name,
          anchor: `<a href="${subpackagesLink(name)}">${name}</a>`,
          children: [],
        }
      })
      .concat(
        allpackages.map((name) => {
          return {
            name,
            anchor: `<a href="${allpackagesLink(name)}">${name}</a>`,
            children: [],
          }
        })
      ),
    id: 'sidebar-packages',
  }
}

function buildSearchListForData() {
  const searchList = []

  data().each((item) => {
    if (item.kind !== 'package' && !item.inherited) {
      const content = item.description || ''
      searchList.push({
        title: item.longname,
        link: linkto(item.longname, item.name),
        description: cleanupDescription(content),
        titles: [item.name],
        subtitles: [], // JSDoc items don't typically have subtitles
        links: [], // Extract links from the description if needed
        keywords: generateKeywords(content, 50),
      })
    }
  })

  return searchList
}

function linktoExternal(longName, name) { return linkto(longName, name.replace(/(^"|"$)/g, '')) } //prettier-ignore

/**
 * This function is added by clean-jsdoc-theme devs
 * This function is added by clean-jsdoc-theme devs
 * This function is added by clean-jsdoc-theme devs
 *
 */
function buildNavbar() {
  return {
    menu: themeOpts.menu || undefined,
    search: hasSearch,
  }
}

/**
 * This function is added by clean-jsdoc-theme devs
 * This function is added by clean-jsdoc-theme devs
 * This function is added by clean-jsdoc-theme devs
 *
 * @param {object} members The members that will be used to create the sidebar.
 * @param {array<object>} members.classes
 * @param {array<object>} members.externals
 * @param {array<object>} members.globals
 * @param {array<object>} members.mixins
 * @param {array<object>} members.modules
 * @param {array<object>} members.namespaces
 * @param {array<object>} members.tutorials
 * @param {array<object>} members.events
 * @param {array<object>} members.interfaces
 * @return {string} The HTML for the navigation sidebar.
 */
function buildSidebar(members) {
  let home = themeOpts.subdirectory ? themeOpts.subdirectory : './'
  let logoSrc = `${home}/images/${themeOpts.logo || 'multisynq_vertical_blue.svg'}`
  const title = themeOpts.title || `<div class="navbar-heading" id="navbar-heading"><a href="./"><img src="${logoSrc}"/></a></div>`

  const isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i)
  const nav = { sections: [] }

  if (!isHTML(title)) nav.title = { title, isHTML: false }
  else nav.title = { title, isHTML: true }

  const seen = {}
  const seenTutorials = {}
  const seenGlobal = {}

  const sectionsOrder = themeOpts.sections || defaultSections

  // console.log('Debug: Members object', JSON.stringify(members, null, 2))
  console.log('members.path --> ', members?.path)

  const sections = {
    [SECTION_TYPE.Modules]: buildSidebarMembers({
      itemHeading: 'Modules',
      items: members.modules,
      itemsSeen: seen,
      linktoFn: linkto,
      sectionName: SECTION_TYPE.Modules,
    }),
    [SECTION_TYPE.Classes]: buildSidebarMembers({
      itemHeading: 'Classes',
      items: members.classes,
      itemsSeen: seen,
      linktoFn: linkto,
      sectionName: SECTION_TYPE.Classes,
    }),
    [SECTION_TYPE.Externals]: buildSidebarMembers({
      itemHeading: 'Externals',
      items: members.externals,
      itemsSeen: seen,
      linktoFn: linktoExternal,
      sectionName: SECTION_TYPE.Externals,
    }),
    [SECTION_TYPE.Events]: buildSidebarMembers({
      itemHeading: 'Events',
      items: members.events,
      itemsSeen: seen,
      linktoFn: linkto,
      sectionName: SECTION_TYPE.Events,
    }),
    [SECTION_TYPE.Namespaces]: buildSidebarMembers({
      itemHeading: 'Namespaces',
      items: members.namespaces,
      itemsSeen: seen,
      linktoFn: linkto,
      sectionName: SECTION_TYPE.Namespaces,
    }),
    [SECTION_TYPE.Mixins]: buildSidebarMembers({
      itemHeading: 'Mixins',
      items: members.mixins,
      itemsSeen: seen,
      linktoFn: linkto,
      sectionName: SECTION_TYPE.Mixins,
    }),
    [SECTION_TYPE.Interfaces]: buildSidebarMembers({
      itemHeading: 'Interfaces',
      items: members.interfaces,
      itemsSeen: seen,
      linktoFn: linkto,
      sectionName: SECTION_TYPE.Interfaces,
    }),
    [SECTION_TYPE.Global]: buildSidebarMembers({
      itemHeading: 'Global',
      items: members.globals,
      itemsSeen: seenGlobal,
      linktoFn: linkto,
      sectionName: SECTION_TYPE.Global,
    }),
  }

  // Add non-empty sections to nav
  sectionsOrder.forEach((section) => {
    if (sections[section] && sections[section].items && sections[section].items.length > 0) {
      console.log(`Debug: Adding section ${section} with ${sections[section].items.length} items`)
      nav.sections.push(sections[section])
    } else console.log(`Debug: Skipping empty section ${section}`)
  })

  // Add extra sidebar items
  if (themeOpts.extra_sidebar_items) {
    let otherItems = []

    themeOpts.extra_sidebar_items.forEach((item) => {
      const isDir = fs.lstatSync(item.path).isDirectory()
      if (isDir) {
        const structure = readStructureJson(item.path) || []
        const sidebarItem = {
          name: item.title,
          items: [],
          id: `sidebar-${item.title.toLowerCase().replace(/\s+/g, '-')}`,
        }

        structure.forEach((structureItem) => {
          const filePath = path.join(item.path, `${structureItem.filename}.md`)
          addSidebarForMdFile(structureItem.filename, item.path, filePath, sidebarItem, item.title.toLowerCase())
        })

        if (sidebarItem.items.length > 0) nav.sections.push(sidebarItem)
      } else {
        const fileName = path.basename(item.path, '.md')
        const category = `other-${item.title.toLowerCase().replace(/\s+/g, '_')}`
        otherItems.push({ fileName, path: item.path, title: item.title, category })
      }
    })

    if (otherItems.length > 0) {
      const otherSidebarItem = {
        name: 'Other',
        items: [],
        id: 'sidebar-other',
      }

      otherItems.forEach((item) => {
        addSidebarForMdFile(item.fileName, path.dirname(item.path), item.path, otherSidebarItem, item.category, true)
      })

      nav.sections.push(otherSidebarItem)
    }
  }

  // console.log('Debug: Final nav object', JSON.stringify(nav, null, 2))
  return nav
}

/**
    @param {TAFFY} taffyData See <http://taffydb.com/>.
    @param {object} opts
    @param {Tutorial} tutorials
 */
exports.publish = async function (taffyData, opts, tutorials) {
  let classes
  let conf
  let externals
  let files
  let fromDir
  let globalUrl
  let indexUrl
  let interfaces
  let members
  let mixins
  let modules
  let namespaces
  let outputSourceFiles
  let packageInfo
  let packages
  const sourceFilePaths = []
  let sourceFiles = {}
  let staticFileFilter
  let staticFilePaths
  let staticFiles
  let staticFileScanner
  let templatePath

  const extra_md = themeOpts['extra_md'] || []
  const extra_directories = themeOpts['extra_directories'] || []
  const extra_sidebar_items = themeOpts['extra_sidebar_items'] || []

  data = taffyData

  conf = env.conf.templates || {}
  conf.default = conf.default || {}

  templatePath = path.normalize(opts.template)
  view = new template.Template(path.join(templatePath, 'tmpl'))

  // claim some special filenames in advance, so the All-Powerful Overseer of Filename Uniqueness
  // doesn't try to hand them out later
  indexUrl = helper.getUniqueFilename('index')
  // don't call registerLink() on this one! 'index' is also a valid longname

  globalUrl = helper.getUniqueFilename('global')
  helper.registerLink('global', globalUrl)

  // set up templating
  view.layout = conf.default.layoutFile ? path.resolve(conf.default.layoutFile) : 'layout.tmpl'

  // set up tutorials for helper
  helper.setTutorials(tutorials)
  data = helper.prune(data)

  // eslint-disable-next-line no-extra-boolean-cast, no-implicit-coercion
  if (themeOpts.sort !== false) data.sort('longname, version, since')
  helper.addEventListeners(data)

  data().each((doclet) => {
    let sourcePath

    doclet.attribs = ''

    if (doclet.examples) {
      doclet.examples = doclet.examples.map((example) => {
        let caption
        let code

        if (example.match(/^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i)) {
          caption = RegExp.$1
          code = RegExp.$3
        }

        return {
          caption: caption || '',
          code: code || example,
        }
      })
    }

    if (doclet.see) doclet.see.forEach(function (seeItem, i) { doclet.see[i] = hashToLink(doclet, seeItem) }) //prettier-ignore

    // build a list of source files
    if (doclet.meta) {
      sourcePath = getPathFromDoclet(doclet)
      sourceFiles[sourcePath] = {
        resolved: sourcePath,
        shortened: null,
      }
      if (sourceFilePaths.indexOf(sourcePath) === -1) sourceFilePaths.push(sourcePath)
    }

    // added by clean-jsdoc-theme-dev. to process yields.
    if (doclet.yields) doclet.yields = getProcessedYield(doclet.yields)
  })

  // update outdir if necessary, then create outdir
  packageInfo = (find({ kind: 'package' }) || [])[0]
  if (packageInfo && packageInfo.name) outdir = path.join(outdir, packageInfo.name, packageInfo.version || '')
  mkdirSync(outdir)

  // copy external static folders
  copyStaticFolder(themeOpts, outdir)

  // copy the template's static files to outdir
  fromDir = path.join(templatePath, 'static')
  staticFiles = lsSync(fromDir)

  staticFiles.forEach((fileName) => {
    const toPath = sourceToDestination(fromDir, fileName, outdir)
    mkdirSync(path.dirname(toPath))
    fs.copyFileSync(fileName, toPath)
  })

  // copy user-specified static files to outdir
  if (conf.default.staticFiles) {
    // The canonical property name is `include`. We accept `paths` for backwards compatibility
    // with a bug in JSDoc 3.2.x.
    staticFilePaths = conf.default.staticFiles.include || conf.default.staticFiles.paths || []
    staticFileFilter = new (require('jsdoc/src/filter').Filter)(conf.default.staticFiles)
    staticFileScanner = new (require('jsdoc/src/scanner').Scanner)()

    staticFilePaths.forEach((filePath) => {
      filePath = path.resolve(env.pwd, filePath)
      const extraStaticFiles = staticFileScanner.scan([filePath], 10, staticFileFilter)

      extraStaticFiles.forEach((fileName) => {
        const toPath = sourceToDestination(filePath, fileName, outdir)

        mkdirSync(path.dirname(toPath))
        fs.copyFileSync(fileName, toPath)
      })
    })
  }

  if (sourceFilePaths.length) sourceFiles = shortenPaths(sourceFiles, path.commonPrefix(sourceFilePaths))

  data().each(function (doclet) {
    let docletPath
    const url = helper.createLink(doclet)

    helper.registerLink(doclet.longname, url)

    // add a shortened version of the full path
    if (doclet.meta) {
      docletPath = getPathFromDoclet(doclet)
      docletPath = sourceFiles[docletPath].shortened
      if (docletPath) doclet.meta.shortpath = docletPath
    }
  })

  data().each(function (doclet) {
    const url = helper.longnameToUrl[doclet.longname]

    if (url.indexOf('#') > -1) doclet.id = helper.longnameToUrl[doclet.longname].split(/#/).pop()
    else doclet.id = doclet.name

    if (needsSignature(doclet)) {
      addSignatureParams(doclet)
      addSignatureReturns(doclet)
      addAttribs(doclet)
    }
  })

  // do this after the urls have all been generated
  data().each((doclet) => {
    doclet.ancestors = getAncestorLinks(doclet)

    if (doclet.kind === 'member') {
      addSignatureTypes(doclet)
      addAttribs(doclet)
    }

    if (doclet.kind === 'constant') {
      addSignatureTypes(doclet)
      addAttribs(doclet)
      doclet.kind = 'member'
    }
  })

  members = helper.getMembers(data)
  members.tutorials = tutorials.children

  // output pretty-printed source files by default
  outputSourceFiles = Boolean(conf.default && conf.default.outputSourceFiles !== false)

  // add template helpers
  view.find                = find // prettier-ignore
  view.linkto              = linkto // prettier-ignore
  view.resolveAuthorLinks  = resolveAuthorLinks // prettier-ignore
  view.tutoriallink        = tutoriallink // prettier-ignore
  view.htmlsafe            = htmlsafe // prettier-ignore
  view.outputSourceFiles   = outputSourceFiles // prettier-ignore
  view.footer              = buildFooter(themeOpts) // prettier-ignore
  view.displayModuleHeader = moduleHeader(themeOpts) // prettier-ignore
  view.favicon             = getFavicon(themeOpts) // prettier-ignore
  view.dynamicStyle        = createDynamicStyleSheet(themeOpts) // prettier-ignore
  view.dynamicStyleSrc     = returnPathOfStyleSrc(themeOpts) // prettier-ignore
  view.dynamicScript       = createDynamicsScripts(themeOpts) // prettier-ignore
  view.dynamicScriptSrc    = returnPathOfScriptScr(themeOpts) // prettier-ignore
  view.includeScript       = includeScript(themeOpts, outdir) // prettier-ignore
  view.includeCss          = includeCss(themeOpts, outdir) // prettier-ignore
  view.meta                = getMetaTagData(themeOpts) // prettier-ignore
  view.theme               = getTheme(themeOpts) // prettier-ignore
  view.navigationScript    = createNavigationScript() // prettier-ignore
  view.navigationStyles    = createNavigationStyles() // prettier-ignore
  // once for all
  view.sidebar             = buildSidebar(view, members) // prettier-ignore
  view.navbar              = buildNavbar(themeOpts) // prettier-ignore
  view.resizeable          = resizeable(themeOpts) // prettier-ignore
  view.codepen             = codepen(themeOpts) // prettier-ignore
  view.baseURL             = getBaseURL(themeOpts) // prettier-ignore
  view.excludeInherited           = Boolean(themeOpts.exclude_inherited) // prettier-ignore
  view.shouldRemoveScrollbarStyle = Boolean(themeOpts.shouldRemoveScrollbarStyle)

  attachModuleSymbols(find({ longname: { left: 'module:' } }), members.modules)

  if (themeOpts.prefixModuleToSidebarItems_experimental) {
    view.sidebar.sections.forEach((section, i) => {
      view.sidebar.sections[i].items = section.items.map((item) => {
        item.anchor = prefixModuleToItemAnchor(item)
        return item
      })
    })
  }

  // generate the pretty-printed source files first so other pages can link to them
  if (outputSourceFiles) generateSourceFiles(sourceFiles, opts.encoding)
  if (members.globals.length) await generate('Global', [{ kind: 'globalobj' }], globalUrl)

  // index page displays information from package.json and lists files
  files = find({ kind: 'file' })
  packages = find({ kind: 'package' })
  // added by clean-jsdoc-theme-devs
  const homepageTitle = themeOpts.homepageTitle || 'Multisynq'
  const includeFilesListInHomepage = themeOpts.includeFilesListInHomepage || false

  await generate(
    homepageTitle,
    packages
      .concat([
        {
          kind: 'mainpage',
          readme: opts.readme,
          longname: opts.mainpagetitle ? opts.mainpagetitle : 'Main Page',
        },
      ])
      .concat(includeFilesListInHomepage ? files : []),
    indexUrl
  )

  // set up the lists that we'll use to generate pages
  classes    = taffy(members.classes) //prettier-ignore
  modules    = taffy(members.modules) //prettier-ignore
  namespaces = taffy(members.namespaces) //prettier-ignore
  mixins     = taffy(members.mixins) //prettier-ignore
  externals  = taffy(members.externals) //prettier-ignore
  interfaces = taffy(members.interfaces) //prettier-ignore

  Object.keys(helper.longnameToUrl).forEach(async function (longname) {
    const myClasses    = helper.find(classes,    { longname: longname }) //prettier-ignore
    const myExternals  = helper.find(externals,  { longname: longname }) //prettier-ignore
    const myInterfaces = helper.find(interfaces, { longname: longname }) //prettier-ignore
    const myMixins     = helper.find(mixins,     { longname: longname }) //prettier-ignore
    const myModules    = helper.find(modules,    { longname: longname }) //prettier-ignore
    const myNamespaces = helper.find(namespaces, { longname: longname }) //prettier-ignore

    if (myModules.length)    await generate(`Module: ${myModules[0].name}`,       myModules,    helper.longnameToUrl[longname]) //prettier-ignore
    if (myClasses.length)    await generate(`Class: ${myClasses[0].name}`,        myClasses,    helper.longnameToUrl[longname]) //prettier-ignore
    if (myNamespaces.length) await generate(`Namespace: ${myNamespaces[0].name}`, myNamespaces, helper.longnameToUrl[longname]) //prettier-ignore
    if (myMixins.length)     await generate(`Mixin: ${myMixins[0].name}`,         myMixins,     helper.longnameToUrl[longname]) //prettier-ignore
    if (myExternals.length)  await generate(`External: ${myExternals[0].name}`,   myExternals,  helper.longnameToUrl[longname]) //prettier-ignore
    if (myInterfaces.length) await generate(`Interface: ${myInterfaces[0].name}`, myInterfaces, helper.longnameToUrl[longname]) //prettier-ignore
  })

  // TODO: move the tutorial functions to templateHelper.js
  async function generateTutorial(title, tutorial, filename) {
    const tutorialData = {
      title: title,
      header: tutorial.title,
      content: tutorial.parse(),
      children: tutorial.children,
      filename,
    }

    const tutorialPath = path.join(outdir, filename)
    let html = view.render('tutorial.tmpl', tutorialData)

    // yes, you can use {@link} in tutorials too!
    html = helper.resolveLinks(html) // turn {@link foo} into <a href="foodoc.html">foo</a>
    const minifiedHTML = await htmlMinify.minify(html, HTML_MINIFY_OPTIONS)
    fs.writeFileSync(tutorialPath, minifiedHTML, 'utf8')

    // added by clean-jsdoc-theme-devs
    // adding support for tutorial
    if (!hasSearch) return

    try {
      const baseName = path.basename(tutorialPath)
      let body = /<body.*?>([\s\S]*)<\/body>/.exec(tutorialData.content)
      let description = ''

      if (!Array.isArray(body)) body = /<article.*?>([\s\S]*)<\/article>/.exec(tutorialData.content)
      if (Array.isArray(body) && typeof body[1] === 'string') {
        description = body[1]
          // Replacing all html tags
          .replace(/(<([^>]+)>)/g, '')
          // Replacing all kind of line breaks
          .replace(/(\r\n|\n|\r)/gm, ' ')
          // Replacing all multi spaces with single space
          .replace(/\s+/gm, ' ')
          // Taking only first 100 characters
          .substring(0, 100)
      }

      if (typeof baseName === 'string' && baseName) {
        searchList.push({
          title: tutorialData.header,
          link: `<a href="${baseName}">${baseName}</a>`,
          description,
        })
      }
    } catch (error) {
      console.error('There was some error while creating search array for tutorial.')
      console.error(error)
    }
  }

  // tutorials can have only one parent so there is no risk for loops
  function saveChildren({ children }) {
    children.forEach(function (child) {
      generateTutorial(`Tutorial: ${child.title}`, child, helper.tutorialToUrl(child.name))
      saveChildren(child)
    })
  }

  saveChildren(tutorials)

  // added by clean-jsdoc-theme-devs
  // output search file if search
  if (hasSearch) {
    const searchList = buildSearchListForData()
    const extraMdSearchList = processExtraMdForSearch(extra_md)
    const extraSidebarSearchList = processExtraSidebarItemsForSearch(themeOpts.extra_sidebar_items || [])

    const allTitles = []
    const allSubtitles = []
    const allLinks = []
    const allKeywords = []

    ;[...searchList, ...extraMdSearchList, ...extraSidebarSearchList].forEach((item) => {
      allTitles.push(...(item.titles || []))
      allSubtitles.push(...(item.subtitles || []))
      allLinks.push(...(item.links || []))
      allKeywords.push(...(item.keywords || []))
    })

    mkdirSync(path.join(outdir, 'data'))
    fs.writeFileSync(
      path.join(outdir, 'data', 'search.json'),
      JSON.stringify({
        list: [...searchList, ...extraMdSearchList, ...extraSidebarSearchList],
        titles: [...new Set(allTitles)],
        subtitles: [...new Set(allSubtitles)],
        links: allLinks.filter((link, index, self) => index === self.findIndex((t) => t.url === link.url && t.text === link.text)),
        keywords: [...new Set(allKeywords)],
      })
    )
  }

  // Render extra_md files
  extra_md.forEach(renderExtraMd)

  extra_directories.forEach((dir) => {
    const source = path.resolve(dir.path)
    const destination = path.resolve(outdir, dir.destination)
    fs.copySync(source, destination)
  })

  extra_sidebar_items.forEach((item) => {
    const isDir = fs.lstatSync(item.path).isDirectory()
    const extraSection = view.sidebar.sections.find((section) => section.name === 'Additional Resources')

    if (isDir) {
      const dirName = path.basename(item.path)
      const files = fs.readdirSync(item.path).filter((file) => file.endsWith('.md'))

      const dirItem = {
        name: item.title,
        anchor: `<span class="sidebar-section-title">${item.title}</span>`,
        children: [],
      }

      files.forEach((file) => {
        const filePath = path.join(item.path, file)
        const fileName = path.basename(file, '.md')
        const content = fs.readFileSync(filePath, 'utf8')
        const title = content.split('\n')[0].replace(/^#\s*/, '') // Extract title from first line

        dirItem.children.push({
          name: title,
          anchor: `<a href="${extraItemToUrl(dirName, fileName)}">${title}</a>`,
          children: [],
        })

        saveExtraItems(dirName, item.path, 'extra_md.tmpl')
      })

      extraSection?.items?.push(dirItem)
    } else {
      const fileName = path.basename(item.path, '.md')
      const content = fs.readFileSync(item.path, 'utf8')
      const title = content.split('\n')[0].replace(/^#\s*/, '') // Extract title from first line

      extraSection.items.push({
        name: title,
        anchor: `<a href="${extraItemToUrl(item.path, fileName)}">${title}</a>`,
        children: [],
      })

      saveExtraItems(item.path, path.dirname(item.path), 'extra_md.tmpl', { [fileName]: item })
    }
  })

  // if (otherItems.length > 0) addOtherCategoryToNav(view, otherItems)

  function renderExtraMd(md) {
    const { title, path: inputPath } = md
    const fileName = path.basename(inputPath)
    const outName = fileName.replace(/\.md$/, '.html')

    const content = fs.readFileSync(inputPath, 'utf8')
    const processedContent = processMarkdownContent(content, inputPath, outdir)

    const templateData = {
      title: title,
      header: '',
      content: markdown.getParser()(processedContent),
      children: [],
    }

    const outputPath = path.join(outdir, outName)
    const html = view.render('extra_md.tmpl', templateData)
    fs.writeFileSync(outputPath, html, 'utf8')
  }
}

function addSidebarForMdFile(file, structurePath, filePath, sidebarItem, category, isOther = false) {
  const filename = path.basename(file, '.md')
  let structure = null

  if (!isOther) structure = readStructureJson(structurePath)

  const content = fs.readFileSync(filePath, 'utf8')
  const fallbackTitle = content.split('\n')[0].replace(/^#\s*/, '') // Extract title from first line

  let name
  if (structure) {
    const structureItem = structure.find((item) => item.filename === filename)
    name = structureItem?.title || fallbackTitle
  } else name = fallbackTitle

  // Use the full path for individual files, and the directory name for files in directories
  const urlCategory = isOther ? filePath : path.basename(structurePath)
  const anchor = `<a href="${extraItemToUrl(urlCategory, filename)}">${name}</a>`
  sidebarItem.items.push({ name, anchor, children: [] })
}

function readStructureJson(dirPath) {
  const structurePath = path.join(dirPath, 'structure.json')
  if (fs.existsSync(structurePath)) {
    const structure = JSON.parse(fs.readFileSync(structurePath, 'utf8'))
    return Object.entries(structure).map(([filename, data]) => ({ filename, ...data }))
  }
  return null
}

function saveExtraItems(category, dirPath, defaultTemplate = 'extra_md.tmpl', singleItem = null) {
  let structure
  if (singleItem) structure = [{ filename: Object.keys(singleItem)[0], ...Object.values(singleItem)[0] }]
  else {
    structure = readStructureJson(dirPath)
    if (!structure) {
      const files = fs.readdirSync(dirPath).filter((file) => file.endsWith('.md'))
      structure = files.map((file) => ({ filename: path.basename(file, '.md') }))
    }
  }

  structure.forEach((item) => {
    const { filename, ...data } = item
    const filePath = singleItem ? data.path : path.join(dirPath, `${filename}.md`)
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')
      const processedContent = processMarkdownContent(content, filePath, outdir)
      const parsedContent = markdown.getParser()(processedContent)

      const templateData = {
        title: data.title || filename,
        header: data.title || filename,
        content: parsedContent,
        children: [],
      }

      const outputFileName = extraItemToUrl(category, filename)
      const outputPath = path.join(outdir, outputFileName)

      const templateToUse = data.template || defaultTemplate
      const html = view.render(templateToUse, templateData)

      const resolvedHtml = helper.resolveLinks(html)
      fs.writeFileSync(outputPath, resolvedHtml, 'utf8')
    }
  })
}

function extraItemToUrl(category, name) {
  // If the category is a full path, use only the filename
  if (category.includes('/')) return `${path.basename(name, '.md').toLowerCase()}.html`

  // For directories, use the category-name format
  return `${category.toLowerCase()}-${name.replace(/\s+/g, '_').toLowerCase()}.html`
}

function copyImageAndUpdateLink(imagePath, mdFilePath, outdir) {
  // Ensure outdir is an absolute path
  outdir = path.resolve(outdir)
  const imageOutDir = path.join(outdir, 'images')

  let fullImagePath
  if (path.isAbsolute(imagePath)) fullImagePath = imagePath
  else if (imagePath.startsWith('images/')) {
    // If the image path starts with 'images/', assume it's relative to the docs directory
    fullImagePath = path.resolve(path.dirname(mdFilePath), '..', imagePath)
  } else {
    // First, try to resolve the image path relative to the Markdown file
    fullImagePath = path.resolve(path.dirname(mdFilePath), imagePath)

    // If that doesn't exist, try to resolve it relative to the docs/images directory
    if (!fs.pathExistsSync(fullImagePath)) {
      const docsImagePath = path.resolve(path.dirname(mdFilePath), '..', 'images', path.basename(imagePath))
      if (fs.pathExistsSync(docsImagePath)) fullImagePath = docsImagePath
    }
  }

  const imageName = path.basename(imagePath)
  const newImagePath = path.join(imageOutDir, imageName)

  if (fs.pathExistsSync(fullImagePath)) {
    try {
      // console.log(`Copying image \n  From: ${fullImagePath}\n    To: ${newImagePath}`);
      fs.copySync(fullImagePath, newImagePath)
      return path.join('images', imageName)
    } catch (error) {
      return imagePath // Return original path if copy fails
    }
  } else {
    console.log(`Image not found: ${fullImagePath}`)
    console.log('Directories in path:')
    let currentPath = path.dirname(fullImagePath)
    while (currentPath !== '/') {
      console.log(`  ${currentPath}: ${fs.pathExistsSync(currentPath)}`)
      currentPath = path.dirname(currentPath)
    }
    return imagePath // Return original path if image not found
  }
}

function processMarkdownContent(content, mdFilePath, outdir) {
  // Regular expression to find image references in Markdown
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g

  return content.replace(imageRegex, (match, altText, imagePath) => {
    const newImagePath = copyImageAndUpdateLink(imagePath, mdFilePath, outdir)
    return `![${altText}](${newImagePath})`
  })
}

function processExtraMdForSearch(mdFiles) {
  return mdFiles.map((md) => {
    const { title, path: inputPath } = md
    const content = fs.readFileSync(inputPath, 'utf8')
    const processedContent = processMarkdownContent(content, inputPath, outdir)

    const { titles, subtitles, links, keywords } = analyzeContent(content)

    return {
      title: title,
      link: path.basename(inputPath).replace(/\.md$/, '.html'),
      description: processedContent.slice(0, 150),
      titles: titles.map((t) => t.replace(/^#\s+/, '')),
      subtitles: subtitles.map((t) => t.replace(/^##\s+/, '')),
      links: links.map((l) => {
        const [, text, url] = l.match(/\[([^\]]+)\]\(([^\)]+)\)/)
        return { text, url }
      }),
      keywords,
    }
  })
}

function processExtraSidebarItemsForSearch(sidebarItems) {
  let searchItems = []

  sidebarItems.forEach((item) => {
    const isDir = fs.lstatSync(item.path).isDirectory()
    const structure = isDir ? readStructureJson(item.path) : null

    if (isDir) {
      const files = fs.readdirSync(item.path).filter((file) => file.endsWith('.md'))
      files.forEach((file) => {
        const filePath = path.join(item.path, file)
        const content = fs.readFileSync(filePath, 'utf8')
        const fileName = path.basename(file, '.md')

        const structureItem = structure ? structure.find((s) => s.filename === fileName) : null
        const title = structureItem ? structureItem.title : fileName

        const { titles, subtitles, links, keywords } = analyzeContent(content)

        searchItems.push({
          title: title,
          link: extraItemToUrl(path.basename(item.path), fileName),
          description: cleanupSearchDescription(content),
          titles: Array.isArray(titles)
            ? titles.map((t) => {
                return typeof t === 'object' && t !== null ? t : { name: '', href: '' }
              })
            : [],
          subtitles: Array.isArray(subtitles)
            ? subtitles.map((t) => {
                return typeof t === 'object' && t !== null ? t : { name: '', href: '' }
              })
            : [],
          links: Array.isArray(links)
            ? links.map((l) => {
                if (typeof l !== 'string') return { text: '', url: '' }
                const match = l.match(/\[([^\]]+)\]\(([^\)]+)\)/)
                return match ? { text: match[1], url: match[2] } : { text: '', url: '' }
              })
            : [],
          keywords,
        })
      })
    } else {
      const content = fs.readFileSync(item.path, 'utf8')

      const { titles, subtitles, links, keywords } = analyzeContent(content)

      searchItems.push({
        title: item.title,
        link: extraItemToUrl(item.path, path.basename(item.path, '.md')),
        description: cleanupSearchDescription(content),
        titles: titles.map((t) => t.replace(/^#\s+/, '')),
        subtitles: subtitles.map((t) => t.replace(/^##\s+/, '')),
        links: links.map((l) => {
          const [, text, url] = l.match(/\[([^\]]+)\]\(([^\)]+)\)/)
          return { text, url }
        }),
        keywords,
      })
    }
  })

  return searchItems
}

function analyzeContent(content) {
  const slugify = (str) =>
    str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

  const titles = (content.match(/^#\s+(.*)$/gm) || []).map((title) => {
    const name = title.replace(/^#\s+/, '')
    return { name, href: `#${slugify(name)}` }
  })

  const subtitles = (content.match(/^##\s+(.*)$/gm) || []).map((subtitle) => {
    const name = subtitle.replace(/^##\s+/, '')
    return { name, href: `#${slugify(name)}` }
  })

  const links = content.match(/\[([^\]]+)\]\(([^\)]+)\)/g) || []
  const keywords = generateKeywords(content, 50)

  return { titles, subtitles, links, keywords }
}

function generateKeywords(content, count) {
  // Remove code blocks, links, and special characters
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[^a-zA-Z\s]/g, ' ')

  // Split into words and remove common words
  const words = cleanContent.toLowerCase().split(/\s+/)
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'])
  const filteredWords = words.filter((word) => word.length > 2 && !commonWords.has(word))

  // Count word frequency
  const wordFreq = {}
  filteredWords.forEach((word) => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })

  // Sort by frequency and return top 'count' words
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word)
}

function cleanupSearchDescription(content, maxLength = 150) {
  content = content.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '') // Remove image references
  content = content.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, '') // Remove horizontal rules
  content = content.replace(/^#+\s+.*$/gm, '') // Remove Markdown headers
  content = content.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove Markdown links, keeping the link text
  content = content.replace(/[*_`#]/g, '') // Remove special Markdown characters
  content = content.replace(/\s+/g, ' ') // Replace newlines and multiple spaces with a single space
  content = content.trim()

  if (content.length <= maxLength) return content

  // Find the last occurrence of a sentence-ending punctuation within the maxLength
  const lastPeriod = content.lastIndexOf('.', maxLength)
  const lastQuestion = content.lastIndexOf('?', maxLength)
  const lastExclamation = content.lastIndexOf('!', maxLength)

  let cutoff = Math.max(lastPeriod, lastQuestion, lastExclamation)

  // If no sentence-ending punctuation found, look for the last comma or space
  if (cutoff === -1) {
    const lastComma = content.lastIndexOf(',', maxLength)
    cutoff = Math.max(lastComma, content.lastIndexOf(' ', maxLength))
  }

  // If still no suitable cutoff point, cut at maxLength and then at the last space
  if (cutoff === -1) {
    content = content.slice(0, maxLength)
    cutoff = content.lastIndexOf(' ')
  }

  // Ensure we don't cut off mid-word or leave hanging punctuation
  if (cutoff > 0) content = content.slice(0, cutoff + 1).trim()

  // Remove any trailing punctuation except for periods, question marks, and exclamation points
  content = content.replace(/[,;:\-]+$/, '')

  if (content.length < maxLength) content += '...' // Add ellipsis if we've truncated the content

  return content
}

function readStructureJson(dirPath) {
  const structurePath = path.join(dirPath, 'structure.json')
  if (fs.existsSync(structurePath)) {
    const structure = JSON.parse(fs.readFileSync(structurePath, 'utf8'))
    return Object.entries(structure).map(([filename, data]) => ({ filename, ...data }))
  }
  return null
}
