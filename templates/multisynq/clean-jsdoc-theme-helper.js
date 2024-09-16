const has = require('lodash/has')
const klawSync = require('klaw-sync')
const path = require('path')
const fse = require('fs-extra')
const showdown = require('showdown')

const mdToHTMLConverter = new showdown.Converter()

function lsSync(dir, opts = {}) {
  const depth = has(opts, 'depth') ? opts.depth : -1

  const files = klawSync(dir, {
    depthLimit: depth,
    filter: (f) => !path.basename(f.path).startsWith('.'),
    nodir: true,
  })

  return files.map((f) => f.path)
}

function copyToOutputFolder(filePath, outdir) {
  const resolvedPath = path.resolve(filePath)
  const filename = path.basename(resolvedPath)
  const out = path.join(outdir, filename)
  fse.copyFileSync(resolvedPath, out)
}

function copyToOutputFolderFromArray(filePathArray, outdir) {
  const outputList = []

  if (Array.isArray(filePathArray)) {
    for (const filePath of filePathArray) {
      if (typeof filePath === 'string') {
        copyToOutputFolder(filePath, outdir)
        outputList.push(path.basename(filePath))
      } else if (typeof filePath === 'object') {
        const { filepath, targets } = filePath
        copyToOutputFolder(filepath, outdir)
        outputList.push({ filepath: path.basename(filepath), targets })
      }
    }
  }

  return outputList
}

function buildFooter(themeOpts)             { return themeOpts.footer                                  } //prettier-ignore
function moduleHeader(themeOpts)            { return themeOpts.displayModuleHeader || false            } //prettier-ignore
function getFavicon(themeOpts)              { return themeOpts.favicon             || undefined        } //prettier-ignore
function createDynamicStyleSheet(themeOpts) { return themeOpts.create_style        || undefined        } //prettier-ignore
function createDynamicsScripts(themeOpts)   { return themeOpts.add_scripts         || undefined        } //prettier-ignore
function returnPathOfScriptScr(themeOpts)   { return themeOpts.add_script_path     || undefined        } //prettier-ignore
function returnPathOfStyleSrc(themeOpts)    { return themeOpts.add_style_path      || undefined        } //prettier-ignore
function resizeable(themeOpts)              { return themeOpts.resizeable          || {}               } //prettier-ignore
function codepen(themeOpts)                 { return themeOpts.codepen             || {}               } //prettier-ignore
function getMetaTagData(themeOpts)          { return themeOpts.meta                || undefined        } //prettier-ignore
function getTheme(themeOpts)                { return themeOpts.default_theme       || 'fallback-light' } //prettier-ignore
function getBaseURL(themeOpts)              { return themeOpts.base_url                                } //prettier-ignore

function includeCss(themeOpts, outdir) {
  var stylePath = themeOpts.include_css || undefined
  if (stylePath) stylePath = copyToOutputFolderFromArray(stylePath, outdir)
  return stylePath
}

function includeScript(themeOpts, outdir) {
  var scriptPath = themeOpts.include_js || undefined
  if (scriptPath) scriptPath = copyToOutputFolderFromArray(scriptPath, outdir)
  return scriptPath
}

function copyStaticFolder(themeOpts, outdir) {
  const staticDir = themeOpts.static_dir || undefined
  if (staticDir) {
    for (const dir of staticDir) {
      const output = path.join(outdir, dir)
      fse.copySync(dir, output)
    }
  }
}

/**
 * Currently for some reason yields markdown is
 * not processed by jsdoc. So, we are processing it here
 *
 * @param {Array<{type: string, description: string}>} yields
 */
function getProcessedYield(yields) {
  if (!Array.isArray(yields)) return []
  return yields.map((y) => ({ ...y, description: mdToHTMLConverter.makeHtml(y.description) }))
}

module.exports = {
  buildFooter,
  moduleHeader,
  codepen,
  createDynamicStyleSheet,
  createDynamicsScripts,
  getBaseURL,
  getFavicon,
  getMetaTagData,
  getTheme,
  includeCss,
  includeScript,
  resizeable,
  returnPathOfScriptScr,
  returnPathOfStyleSrc,
  copyStaticFolder,
  getProcessedYield,
  lsSync,
}
