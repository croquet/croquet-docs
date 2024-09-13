/* global env: true */

var doop = require('jsdoc/util/doop');
var fs = require('jsdoc/fs');
var helper = require('jsdoc/util/templateHelper');
var logger = require('jsdoc/util/logger');
var path = require('jsdoc/path');
var taffy = require('taffydb').taffy;
var template = require('jsdoc/template');
var util = require('util');
var fse = require('fs-extra');

// Used to parse markdown from markdown files
const markdown = require('jsdoc/util/markdown');

var htmlsafe = helper.htmlsafe;
var linkto = helper.linkto;
var resolveAuthorLinks = helper.resolveAuthorLinks;
var hasOwnProp = Object.prototype.hasOwnProperty;

/* prettier-ignore-start */
// eslint-disable-next-line
var themeOpts = env && env.opts && env.opts['theme_opts'] || {};
/* prettier-ignore-end */

var data;
var view;
var searchListArray = [];
var haveSearch = (themeOpts.search === undefined) ? true : Boolean(themeOpts.search);

// eslint-disable-next-line no-restricted-globals
var outdir = path.normalize(env.opts.destination);


function copyStaticFolder() {
    var staticDir = themeOpts.static_dir || undefined;

    if (staticDir) {
        for (var i = 0; i < staticDir.length; i++) {
            var output = path.join(outdir, staticDir[i]);
            fse.copySync(staticDir[i], output);
        }
    }
}

copyStaticFolder();

function copyToOutputFolder(filePath) {
    const filePathNormalized = path.normalize(filePath);

    if (fs.existsSync(filePathNormalized)) fs.copyFileSync(filePathNormalized, outdir);
    else console.log(`=============== File not found: ${filePathNormalized}`);
}

function copyToOutputFolderFromArray(filePathArray) {
    let outputList = [];

    console.log('---------', __dirname);

    if (Array.isArray(filePathArray)) {
        for (const filePath of filePathArray) {
            const filePathNormalized = path.normalize(filePath);

            if (fs.existsSync(filePathNormalized)) {
                copyToOutputFolder(filePathNormalized);
                outputList.push(path.basename(filePathNormalized));
            } else console.log(`=============== File not found: ${filePathNormalized}`);
        }
    }

    return outputList;
}

function find(spec) {
    return helper.find(data, spec);
}

function tutoriallink(tutorial) {
    return helper.toTutorial(tutorial, null, {
        tag: 'em',
        classname: 'disabled',
        prefix: 'Tutorial: '
    });
}

function getAncestorLinks(doclet) {
    return helper.getAncestorLinks(data, doclet);
}

function hashToLink(doclet, hash) {
    if (!/^(#.+)/.test(hash)) return hash;

    var url = helper.createLink(doclet);
    url = url.replace(/(#.+|$)/, hash);

    return '<a href="' + url + '">' + hash + '</a>';
}

function needsSignature(doclet) {
    var needsSig = false;

    // function and class definitions always get a signature
    if (doclet.kind === 'function' || doclet.kind === 'class') needsSig = true;
    // typedefs that contain functions get a signature, too
    else if (doclet.kind === 'typedef' && doclet.type && doclet.type.names &&
        doclet.type.names.length) {
        for (var i = 0, l = doclet.type.names.length; i < l; i++) {
            if (doclet.type.names[i].toLowerCase() === 'function') {
                needsSig = true;
                break;
            }
        }
    }

    return needsSig;
}

function getSignatureAttributes(item) {
    var attributes = [];

    if (item.optional) attributes.push('opt');
    if (item.nullable === true) attributes.push('nullable');
    else if (item.nullable === false) attributes.push('non-null');

    return attributes;
}

function updateItemName(item) {
    var attributes = getSignatureAttributes(item);
    var itemName = item.name || '';

    if (item.variable) itemName = '&hellip;' + itemName;

    if (attributes && attributes.length) {
        itemName = util.format('%s<span class="signature-attributes">%s</span>', itemName, attributes.join(', '));
    }

    return itemName;
}

function addParamAttributes(params) {
    return params.filter(function (param) {
        return param.name && param.name.indexOf('.') === -1;
    }).map(updateItemName);
}

function buildItemTypeStrings(item) {
    var types = [];

    if (item && item.type && item.type.names) {
        item.type.names.forEach(function (name) {
            types.push(linkto(name, htmlsafe(name)));
        });
    }

    return types;
}

function buildAttribsString(attribs) {
    var attribsString = '';
    if (attribs && attribs.length) attribsString = htmlsafe(util.format('(%s) ', attribs.join(', ')));
    return attribsString;
}

function addNonParamAttributes(items) {
    var types = [];

    items.forEach(function (item) {
        types = types.concat(buildItemTypeStrings(item));
    });

    return types;
}

function addSignatureParams(f) {
    var params = f.params ? addParamAttributes(f.params) : [];

    f.signature = util.format('%s(%s)', (f.signature || ''), params.join(', '));
}

function addSignatureReturns(f) {
    var attribs = [];
    var attribsString = '';
    var returnTypes = [];
    var returnTypesString = '';

    // jam all the return-type attributes into an array. this could create odd results (for example,
    // if there are both nullable and non-nullable return types), but let's assume that most people
    // who use multiple @return tags aren't using Closure Compiler type annotations, and vice-versa.
    if (f.returns) {
        f.returns.forEach(function (item) {
            helper.getAttribs(item).forEach(function (attrib) {
                if (attribs.indexOf(attrib) === -1) {
                    attribs.push(attrib);
                }
            });
        });

        attribsString = buildAttribsString(attribs);
    }

    if (f.returns) returnTypes = addNonParamAttributes(f.returns);
    if (returnTypes.length) returnTypesString = util.format(' &rarr; %s{%s}', attribsString, returnTypes.join('|'));

    f.signature = '<span class="signature">' + (f.signature || '') + '</span>' +
        '<span class="type-signature">' + returnTypesString + '</span>';
}

function addSignatureTypes(f) {
    var types = f.type ? buildItemTypeStrings(f) : [];

    f.signature = (f.signature || '') + '<span class="type-signature">' +
        (types.length ? ' :' + types.join('|') : '') + '</span>';
}

function addAttribs(f) {
    var attribs = helper.getAttribs(f);
    var attribsString = buildAttribsString(attribs);

    f.attribs = util.format('<span class="type-signature">%s</span>', attribsString);
}

function shortenPaths(files, commonPrefix) {
    Object.keys(files).forEach(function (file) {
        files[file].shortened = files[file].resolved.replace(commonPrefix, '')
            // always use forward slashes
            .replace(/\\/g, '/');
    });

    return files;
}

function getPathFromDoclet(doclet) {
    if (!doclet.meta) return null;

    return doclet.meta.path && doclet.meta.path !== 'null' ?
        path.join(doclet.meta.path, doclet.meta.filename) :
        doclet.meta.filename;
}

function generate(type, title, docs, filename, resolveLinks) {
    resolveLinks = resolveLinks !== false;

    var docData = {
        type: type,
        title: title,
        docs: docs
    };

    var outpath = path.join(outdir, filename), html = view.render('container.tmpl', docData);

    if (resolveLinks) html = helper.resolveLinks(html); // turn {@link foo} into <a href="foodoc.html">foo</a>

    fs.writeFileSync(outpath, html, 'utf8');
}

function generateSourceFiles(sourceFiles, encoding) {
    encoding = encoding || 'utf8';
    Object.keys(sourceFiles).forEach(function (file) {
        var source;
        // links are keyed to the shortened path in each doclet's `meta.shortpath` property
        var sourceOutfile = helper.getUniqueFilename(sourceFiles[file].shortened);

        helper.registerLink(sourceFiles[file].shortened, sourceOutfile);

        try {
            source = {
                kind: 'source',
                code: helper.htmlsafe(fs.readFileSync(sourceFiles[file].resolved, encoding))
            };
        } catch (e) {
            logger.error('Error while generating source file %s: %s', file, e.message);
        }

        generate('Source', sourceFiles[file].shortened, [source], sourceOutfile, false);
    });
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
    var symbols = {};

    // build a lookup table
    doclets.forEach(function (symbol) {
        symbols[symbol.longname] = symbols[symbol.longname] || [];
        symbols[symbol.longname].push(symbol);
    });

    // eslint-disable-next-line array-callback-return
    return modules.map(function (module) {
        if (symbols[module.longname]) {
            module.modules = symbols[module.longname]
                // Only show symbols that have a description. Make an exception for classes, because
                // we want to show the constructor-signature heading no matter what.
                .filter(function (symbol) {
                    return symbol.description || symbol.kind === 'class';
                })
                .map(function (symbol) {
                    symbol = doop(symbol);

                    if (symbol.kind === 'class' || symbol.kind === 'function') {
                        symbol.name = symbol.name.replace('module:', '(require("') + '"))';
                    }

                    return symbol;
                });
        }
    });
}

function buildMenuNav(menu) {
    var m = '<ul>';

    menu.forEach(function (item) {
        // Setting default value for optional parameter
        var c = item.class || '';
        var id = item.id || '';
        var target = item.target || '';

        c += ' menu-link';

        m += '<li class="menu-li">' +
            "<a href='" + item.link + "' class='" + c + "' id='" + id + "' target='" + target + "'>" + item
            .title + '</a></li>';
    });

    m += '</ul>';

    return m;
}

function buildSearch() {
    var searchHTML = '<div class="search-box" id="search-box">' +
        '<div class="search-box-input-container">' +
        '<input class="search-box-input" type="text" placeholder="Search..." id="search-box-input" />' +
        '<svg class="search-icon" alt="search-icon"><use xlink:href="#search-icon"></use></svg>' +
        '</div>';

    var searchItemContainer =
        '<div class="search-item-container" id="search-item-container"><ul class="search-item-ul" id="search-item-ul"></ul></div></div>';

    searchHTML += searchItemContainer;

    return searchHTML;
}

function buildFooter() {
    var footer = themeOpts.footer || '';
    return footer;
}

function getFavicon() {
    var favicon = themeOpts.favicon || undefined
    return favicon
}

// function copy
function createDynamicStyleSheet() {
    var styleClass = themeOpts.create_style || undefined;
    /* prettier-ignore-start */
    return styleClass;
}

function createDynamicsScripts() {
    var scripts = themeOpts.add_scripts || undefined;
    return scripts;
}

function returnPathOfScriptScr() {
    var scriptPath = themeOpts.add_script_path || undefined;
    return scriptPath;
}

function returnPathOfStyleSrc() {
    var stylePath = themeOpts.add_style_path || undefined;
    return stylePath;
}

function includeCss(templatePath) {
    const cssDir = path.join(templatePath, 'static', 'styles')
    const alwaysInclude = [ path.join(cssDir, 'index.css') ]

    var stylePath = [...alwaysInclude, ...themeOpts.include_css || []];

    if (stylePath) stylePath = copyToOutputFolderFromArray(stylePath);
    return stylePath;
}

function resizeable() {
    var resizeOpts = themeOpts.resizeable || {};
    return resizeOpts;
}

function codepen() {
    var codepenOpts = themeOpts.codepen || {};
    return codepenOpts;
}

function overlayScrollbarOptions() {
    var overlayOptions = themeOpts.overlay_scrollbar || undefined;
    if (overlayOptions) return JSON.stringify(overlayOptions);
    return undefined;
}

function includeScript() {
    var scriptPath = themeOpts.include_js || undefined;
    if (scriptPath) scriptPath = copyToOutputFolderFromArray(scriptPath);
    return scriptPath;
}

function getMetaTagData() {
    var meta = themeOpts.meta || undefined;
    return meta;
}

function getTheme() {
    var theme = themeOpts.theme || 'light';
    var baseThemeName = 'clean-jsdoc-theme';
    var themeSrc = `${baseThemeName}-${theme}.css`.trim();

    return themeSrc;
}


function search() {
    var searchOption = themeOpts.search;

    var obj = {
        list: searchListArray,
        options: JSON.stringify(searchOption)
    };

    return obj;
}


function buildMemberNav(items, itemHeading, itemsSeen, linktoFn) {
    var nav = '';

    if (items.length) {
        var itemsNav = '';

        items.forEach(function (item) {
            var methods = find({
                kind: 'function',
                memberof: item.longname
            });

            if (!hasOwnProp.call(item, 'longname')) {
                itemsNav += '<li>' + linktoFn('', item.name);
                itemsNav += '</li>';
            } else if (!hasOwnProp.call(itemsSeen, item.longname)) {
                /**
                 * Only have accordion class name if it have any child.
                 * Otherwise it didn't makes any sense.
                 */
                var accordionClassName = (methods.length) ? '"accordion collapsed child"' : '"accordion-list"';

                itemsNav += '<li class=' +
                    accordionClassName +
                    '>';

                var linkTitle = linktoFn(item.longname, item.name.replace(/^module:/, ''));

                if (methods.length) {
                    itemsNav += '<div class="accordion-heading child">' +
                        linkTitle +
                        '<svg><use xlink:href="#down-icon"></use></svg>' +
                        '</div>';
                } else itemsNav += linkTitle;

                if (haveSearch) {
                    searchListArray.push(JSON.stringify({
                        title: item.name,
                        link: linkto(item.longname, item.name)
                    }));
                }

                if (methods.length) {
                    itemsNav += "<ul class='methods accordion-content'>";

                    methods.forEach(function (method) {
                        var name = method.longname.split('#');
                        var first = name[0];
                        var last = name[1];

                        name = first + ' &rtrif; ' + last;

                        if (haveSearch) {
                            searchListArray.push(JSON.stringify({
                                title: method.longname,
                                link: linkto(method.longname, name)
                            }));
                        }
                        itemsNav += "<li data-type='method'>";
                        itemsNav += linkto(method.longname, method.name);
                        itemsNav += '</li>';
                    });

                    itemsNav += '</ul>';
                }
                itemsNav += '</li>';
                itemsSeen[item.longname] = true;
            }
        });

        if (itemsNav !== '') {
            nav += '<div class="accordion collapsed"> <h3 class="accordion-heading">' +
                itemHeading + '<svg><use xlink:href="#down-icon"></use></svg>' +
                '</h3><ul class="accordion-content">' +
                itemsNav +
                '</ul> </div>';
        }
    }

    return nav;
}

function linktoTutorial(longName, name) {
    return tutoriallink(name);
}

function linktoExternal(longName, name) {
    return linkto(longName, name.replace(/(^"|"$)/g, ''));
}

/**
 * Create the navigation sidebar.
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
function buildNav(members) {
    var title = (themeOpts.title) || 'Croquet';

    let home = ".."; // themeOpts.subdirectory ? "../.." : "..";

    let nav = `<div class="navbar-heading" id="navbar-heading"><a href="./"><img src="${home}/images/logotype.png"/></a></div>`;

    if (haveSearch) nav += buildSearch();

    nav += '<div class="sidebar-main-content" id="sidebar-main-content">';
    var seen = {};
    var seenTutorials = {};

    var menu = (themeOpts.menu) || undefined;
    var menuLocation = themeOpts.menuLocation || 'up';


    if (menu !== undefined && menuLocation === 'up') nav += buildMenuNav(menu);

    nav += buildMemberNav(members.tutorials, 'Tutorials', seenTutorials, linktoTutorial, true);
    nav += buildMemberNav(members.classes, 'Classes', seen, linkto);
    nav += buildMemberNav(members.modules, 'Modules', {}, linkto);
    nav += buildMemberNav(members.externals, 'Externals', seen, linktoExternal);
    nav += buildMemberNav(members.events, 'Events', seen, linkto);
    nav += buildMemberNav(members.namespaces, 'Namespaces', seen, linkto);
    nav += buildMemberNav(members.mixins, 'Mixins', seen, linkto);
    nav += buildMemberNav(members.interfaces, 'Interfaces', seen, linkto);
    nav += buildMemberNav(members.globals, 'Global', seen, linkto);

    let subpackages = themeOpts.subpackages;
    if (subpackages) {
        let items = subpackages.map((n) => ({name: n, longname: n}));

        let link = (longname, name) => {
            return linkto(`${name}`, `<a href="./${longname}/">${name}</a>`);
        }

        nav += `<hr class="nav-hr"/>`;
        nav += buildMemberNav(items, "Packages", seen, link);
    }

    let allpackages = themeOpts.allpackages;
    if (allpackages) {
        let items = allpackages.map((n) => ({name: n, longname: n}));

        let link = (longname, name) => {
            let path = name === "worldcore" ? "../.." : "..";
            return linkto(`${name}`, `<a href="${path}/${longname}/">${name}</a>`);
        }

        nav += `<hr class="nav-hr"/>`;
        nav += buildMemberNav(items, "Packages", seen, link);
    }

    let extra_sidebar_items = themeOpts.extra_sidebar_items;
    let otherItems = [];

    if (extra_sidebar_items) {
        extra_sidebar_items.forEach((item) => {
            if (fs.lstatSync(item.path).isDirectory()) {
                nav += `<hr class="nav-hr"/>`;
                nav += `<div class="accordion collapsed"> <h3 class="accordion-heading">${item.title}<svg><use xlink:href="#down-icon"></use></svg></h3>`;
                nav += `<ul class="accordion-content">`;

                const structure = readStructureJson(item.path);
                if (structure) {
                    Object.entries(structure).forEach(([fileName, data]) => {
                        const url = extraItemToUrl(item.title.toLowerCase(), fileName);
                        nav += `<li><a href="${url}">${data.title}</a></li>`;
                    });
                }

                nav += `</ul></div>`;
            } else {
                const category = `other-${item.title.toLowerCase().replace(/\s+/g, '_')}`;
                otherItems.push({ title: item.title, category });
            }
        });
    }

    // Add "Other" category
    if (otherItems.length > 0) {
        nav += `<hr class="nav-hr"/>`;
        nav += `<div class="accordion collapsed"> <h3 class="accordion-heading">Other<svg><use xlink:href="#down-icon"></use></svg></h3>`;
        nav += `<ul class="accordion-content">`;
        otherItems.forEach(item => {
            const url = extraItemToUrl(item.category, item.title);
            nav += `<li><a href="${url}">${item.title}</a></li>`;
        });
        nav += `</ul></div>`;
    }

    if (menu !== undefined && menuLocation === 'down') nav += buildMenuNav(menu);
    nav += '</div>';

    return nav;
}

/**
    @param {TAFFY} taffyData See <http://taffydb.com/>.
    @param {object} opts
    @param {Tutorial} tutorials
 */
exports.publish = function (taffyData, opts, tutorials) {
    data = taffyData;

    // eslint-disable-next-line no-restricted-globals
    var conf = env.conf.templates || {};

    conf.default = conf.default || {};

    var templatePath = path.normalize(opts.template);

    view = new template.Template(path.join(templatePath, 'tmpl'));

    // claim some special filenames in advance, so the All-Powerful Overseer of Filename Uniqueness
    // doesn't try to hand them out later
    var indexUrl = helper.getUniqueFilename('index');
    // don't call registerLink() on this one! 'index' is also a valid longname

    var globalUrl = helper.getUniqueFilename('global');

    helper.registerLink('global', globalUrl);

    // set up templating
    view.layout = conf.default.layoutFile ?
        path.getResourcePath(path.dirname(conf.default.layoutFile),
            path.basename(conf.default.layoutFile)) :
        'layout.tmpl';

    // set up tutorials for helper
    helper.setTutorials(tutorials);

    data = helper.prune(data);
//    data.sort('longname, version, since');
    helper.addEventListeners(data);

    var sourceFiles = {};
    var sourceFilePaths = [];

    data().each(function (doclet) {
        doclet.attribs = '';

        if (doclet.examples) {
            doclet.examples = doclet.examples.map(function (example) {
                var caption, code;

                if (example.match(/^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i)) {
                    caption = RegExp.$1;
                    code = RegExp.$3;
                }

                return {
                    caption: caption || '',
                    code: code || example
                };
            });
        }
        if (doclet.see) {
            doclet.see.forEach(function (seeItem, i) {
                doclet.see[i] = hashToLink(doclet, seeItem);
            });
        }

        // build a list of source files
        var sourcePath;

        if (doclet.meta) {
            sourcePath = getPathFromDoclet(doclet);
            sourceFiles[sourcePath] = { resolved: sourcePath, shortened: null };
            if (sourceFilePaths.indexOf(sourcePath) === -1) sourceFilePaths.push(sourcePath);
        }
    });

    // update outdir if necessary, then create outdir
    var packageInfo = (find({ kind: 'package' }) || [])[0];

    if (packageInfo && packageInfo.name) outdir = path.join(outdir, packageInfo.name, (packageInfo.version || ''));
    fs.mkPath(outdir);

    // copy the template's static files to outdir
    var fromDir = path.join(templatePath, 'static');
    var staticFiles = fs.ls(fromDir, 3);

    staticFiles.forEach(function (fileName) {
        var toDir = fs.toDir(fileName.replace(fromDir, outdir));

        fs.mkPath(toDir);
        fs.copyFileSync(fileName, toDir);
    });

    // copy user-specified static files to outdir
    var staticFilePaths;
    var staticFileFilter;
    var staticFileScanner;

    if (conf.default.staticFiles) {
        // The canonical property name is `include`. We accept `paths` for backwards compatibility
        // with a bug in JSDoc 3.2.x.
        staticFilePaths = conf.default.staticFiles.include || conf.default.staticFiles.paths || [];
        staticFileFilter = new(require('jsdoc/src/filter')).Filter(conf.default.staticFiles);
        staticFileScanner = new(require('jsdoc/src/scanner')).Scanner();

        staticFilePaths.forEach(function (filePath) {
            var extraStaticFiles = staticFileScanner.scan([filePath], 10, staticFileFilter);

            extraStaticFiles.forEach(function (fileName) {
                var sourcePath = path.resolve(fs.toDir(filePath));
                var toDir = fs.toDir(fileName.replace(sourcePath, outdir));

                fs.mkPath(toDir);
                fs.copyFileSync(fileName, toDir);
            });
        });
    }

    if (sourceFilePaths.length) {
        sourceFiles = shortenPaths(sourceFiles, path.commonPrefix(sourceFilePaths));
    }
    data().each(function (doclet) {
        var url = helper.createLink(doclet);
        helper.registerLink(doclet.longname, url);

        // add a shortened version of the full path
        var docletPath;

        if (doclet.meta) {
            docletPath = getPathFromDoclet(doclet);
            docletPath = sourceFiles[docletPath].shortened;
            if (docletPath) doclet.meta.shortpath = docletPath;
        }
    });

    data().each(function (doclet) {
        var url = helper.longnameToUrl[doclet.longname];

        if (url.indexOf('#') > -1) doclet.id = helper.longnameToUrl[doclet.longname].split(/#/).pop();
        else doclet.id = doclet.name;

        if (needsSignature(doclet)) {
            addSignatureParams(doclet);
            addSignatureReturns(doclet);
            addAttribs(doclet);
        }
    });

    // do this after the urls have all been generated
    data().each(function (doclet) {
        doclet.ancestors = getAncestorLinks(doclet);

        if (doclet.kind === 'member') {
            addSignatureTypes(doclet);
            addAttribs(doclet);
        }

        if (doclet.kind === 'constant') {
            addSignatureTypes(doclet);
            addAttribs(doclet);
            doclet.kind = 'member';
        }
    });

    var members = helper.getMembers(data);

    members.tutorials = tutorials.children;

    const newClasses = [], newMixins = [];
    members.classes.forEach(cl => {
        const tags = cl.tags;
        if (tags && tags.some(t => t.title === "worldcoremixin")) {
            cl.hideconstructor = true;
            newMixins.push(cl);
        } else newClasses.push(cl);
    });
    members.classes = newClasses;
    members.mixins = newMixins;

    // output pretty-printed source files by default
    var outputSourceFiles = Boolean(conf.default && conf.default.outputSourceFiles !== false);

    // add template helpers
    view.find = find;
    view.linkto = linkto;
    view.resolveAuthorLinks = resolveAuthorLinks;
    view.tutoriallink = tutoriallink;
    view.htmlsafe = htmlsafe;
    view.outputSourceFiles = outputSourceFiles;
    view.footer = buildFooter();
    view.favicon = getFavicon();
    view.dynamicStyle = createDynamicStyleSheet();
    view.dynamicStyleSrc = returnPathOfStyleSrc();
    view.dynamicScript = createDynamicsScripts();
    view.dynamicScriptSrc = returnPathOfScriptScr();
    view.includeScript = includeScript();
    view.includeCss = includeCss(templatePath);
    view.meta = getMetaTagData();
    view.overlayScrollbar = overlayScrollbarOptions();
    view.theme = getTheme();
    view.navigationScript = createNavigationScript();
    view.navigationStyles = createNavigationStyles();
    // once for all
    view.nav = buildNav(members);
    view.search = search();
    view.resizeable = resizeable();
    view.codepen = codepen();

    attachModuleSymbols(find({ longname: { left: 'module:' } }), members.modules);

    // generate the pretty-printed source files first so other pages can link to them
    if (outputSourceFiles) generateSourceFiles(sourceFiles, opts.encoding);

    if (members.globals.length) generate('', 'Global', [{ kind: 'globalobj' }], globalUrl);

    // index page displays information from package.json and lists files
    var files = find({ kind: 'file' });
    var packages = find({ kind: 'package' });

    generate('', 'Home',
        packages.concat(
            [{
                kind: 'mainpage',
                readme: opts.readme,
                longname: (opts.mainpagetitle) ? opts.mainpagetitle : 'Main Page'
            }]
        ).concat(files),
    indexUrl);

    // set up the lists that we'll use to generate pages
    var classes = taffy(members.classes);
    var modules = taffy(members.modules);
    var namespaces = taffy(members.namespaces);
    var mixins = taffy(members.mixins);
    var externals = taffy(members.externals);
    var interfaces = taffy(members.interfaces);

    Object.keys(helper.longnameToUrl).forEach(function (longname) {
        var myModules = helper.find(modules, { longname: longname });
        if (myModules.length) generate('Module', myModules[0].name, myModules, helper.longnameToUrl[longname]);

        var myClasses = helper.find(classes, { longname: longname });
        if (myClasses.length) generate('Class', myClasses[0].name, myClasses, helper.longnameToUrl[longname]);

        var myNamespaces = helper.find(namespaces, { longname: longname });
        if (myNamespaces.length) generate('Namespace', myNamespaces[0].name, myNamespaces, helper.longnameToUrl[longname]);

        var myMixins = helper.find(mixins, { longname: longname });
        if (myMixins.length) generate('Mixin', myMixins[0].name, myMixins, helper.longnameToUrl[longname]);

        var myExternals = helper.find(externals, { longname: longname });
        if (myExternals.length) generate('External', myExternals[0].name, myExternals, helper.longnameToUrl[longname]);

        var myInterfaces = helper.find(interfaces, { longname: longname });
        if (myInterfaces.length) generate('Interface', myInterfaces[0].name, myInterfaces, helper.longnameToUrl[longname]);
    });

    // TODO: move the tutorial functions to templateHelper.js
    function generateTutorial(title, tutorial, filename) {
        var tutorialData = {
            title: title,
            header: tutorial.title,
            content: tutorial.parse(),
            children: tutorial.children
        };

        var tutorialPath = path.join(outdir, filename);
        var html = view.render('tutorial.tmpl', tutorialData);

        // yes, you can use {@link} in tutorials too!
        html = helper.resolveLinks(html); // turn {@link foo} into <a href="foodoc.html">foo</a>
        fs.writeFileSync(tutorialPath, html, 'utf8');
    }

    // tutorials can have only one parent so there is no risk for loops
    function saveChildren(node) {
        node.children.forEach(function (child) {
            generateTutorial('Tutorial: ' + child.title, child, helper.tutorialToUrl(child.name));
            saveChildren(child);
        });
    }

    saveChildren(tutorials);

    // Render extra_md files
    const extra_md = themeOpts['extra_md'] || []
    extra_md.forEach(renderExtraMd)

    const extra_directories = themeOpts['extra_directories'] || []
    extra_directories.forEach((dir) => {
        const source = path.resolve(dir.path)
        const destination = path.resolve(outdir, dir.destination)
        fse.copySync(source, destination)
    })

    const extra_sidebar_items = themeOpts['extra_sidebar_items'] || []
    let otherItems = [];

    extra_sidebar_items.forEach((item) => {
        const isDir = fs.lstatSync(item.path).isDirectory()
        if (isDir) {
            const defaultTemplate = item.defaultTemplate || 'extra_md.tmpl'
            saveExtraItems(item.title.toLowerCase(), item.path, defaultTemplate)
        } else {
            const fileName = path.basename(item.path, '.md');
            const category = `other-${item.title.toLowerCase().replace(/\s+/g, '_')}`;
            saveExtraItems(category, path.dirname(item.path), 'extra_md.tmpl', {[fileName]: item});
            otherItems.push({ title: item.title, category});
        }
    })

    if (otherItems.length > 0) addOtherCategoryToNav(otherItems);

    function renderExtraMd(md) {
        const { title, path: inputPath } = md;
        const fileName = path.basename(inputPath);
        const outName = fileName.replace(/\.md$/, '.html');
    
        const content = fs.readFileSync(inputPath, 'utf8');
        const processedContent = processMarkdownContent(content, inputPath, outdir);
    
        const templateData = {
            title: title,
            header: '',
            content: markdown.getParser()(processedContent),
            children: []
        };
    
        const outputPath = path.join(outdir, outName);
        const html = view.render('extra_md.tmpl', templateData);
        fs.writeFileSync(outputPath, html, 'utf8');
    }
};

function readStructureJson(dirPath) {
    const structurePath = path.join(dirPath, 'structure.json')
    if (fs.existsSync(structurePath)) return JSON.parse(fs.readFileSync(structurePath, 'utf8'))
    return null
}

function saveExtraItems(category, dirPath, defaultTemplate = 'extra_md.tmpl', singleItem = null) {
    const structure = singleItem || readStructureJson(dirPath);
    if (!structure) return;

    Object.entries(structure).forEach(([fileName, data]) => {
        const filePath = singleItem ? data.path : path.join(dirPath, `${fileName}.md`);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const processedContent = processMarkdownContent(content, filePath, outdir);
            const parsedContent = markdown.getParser()(processedContent);

            const templateData = {
                title: `${category}: ${data.title || fileName}`,
                header: data.title || fileName,
                content: parsedContent,
                children: []
            };

            const outputFileName = extraItemToUrl(category, fileName);
            const outputPath = path.join(outdir, outputFileName);
            
            const templateToUse = data.template || defaultTemplate;
            const html = view.render(templateToUse, templateData);
            
            const resolvedHtml = helper.resolveLinks(html);
            fs.writeFileSync(outputPath, resolvedHtml, 'utf8');
        }
    });
}

function addOtherCategoryToNav(otherItems) {
    let otherNav = '<div class="accordion collapsed"> <h3 class="accordion-heading">Other<svg><use xlink:href="#down-icon"></use></svg></h3>'
    otherNav += '<ul class="accordion-content">'

    otherItems.forEach(item => {
        const url = extraItemToUrl(item.category, item.title)
        otherNav += `<li><a href="${url}">${item.title}</a></li>`
    })

    otherNav += '</ul></div>'
    view.nav = view.nav.replace('</div>', otherNav + '</div>')
}

function extraItemToUrl(category, name) {
    return category + '-' + name.replace(/\s+/g, '_').toLowerCase() + '.html'
}

function copyImageAndUpdateLink(imagePath, mdFilePath, outdir) {
    // Ensure outdir is an absolute path
    outdir = path.resolve(outdir);
    const imageOutDir = path.join(outdir, 'images');

    let fullImagePath;
    if (path.isAbsolute(imagePath)) fullImagePath = imagePath;
    else if (imagePath.startsWith('images/')) {
        // If the image path starts with 'images/', assume it's relative to the docs directory
        fullImagePath = path.resolve(path.dirname(mdFilePath), '..', imagePath);
    } else {
        // First, try to resolve the image path relative to the Markdown file
        fullImagePath = path.resolve(path.dirname(mdFilePath), imagePath);
        
        // If that doesn't exist, try to resolve it relative to the docs/images directory
        if (!fse.pathExistsSync(fullImagePath)) {
            const docsImagePath = path.resolve(path.dirname(mdFilePath), '..', 'images', path.basename(imagePath));
            if (fse.pathExistsSync(docsImagePath)) fullImagePath = docsImagePath;
        }
    }

    const imageName = path.basename(imagePath);
    const newImagePath = path.join(imageOutDir, imageName);

    if (fse.pathExistsSync(fullImagePath)) {
        try {
            // console.log(`Copying image \n  From: ${fullImagePath}\n    To: ${newImagePath}`);
            fse.copySync(fullImagePath, newImagePath);
            return path.join('images', imageName);
        } catch (error) {
            return imagePath; // Return original path if copy fails
        }
    } else {
        console.log(`Image not found: ${fullImagePath}`);
        console.log('Directories in path:');
        let currentPath = path.dirname(fullImagePath);
        while (currentPath !== '/') {
            console.log(`  ${currentPath}: ${fse.pathExistsSync(currentPath)}`);
            currentPath = path.dirname(currentPath);
        }
        return imagePath; // Return original path if image not found
    }
}

function processMarkdownContent(content, mdFilePath, outdir) {
    // Regular expression to find image references in Markdown
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

    return content.replace(imageRegex, (match, altText, imagePath) => {
        const newImagePath = copyImageAndUpdateLink(imagePath, mdFilePath, outdir);
        return `![${altText}](${newImagePath})`;
    });
}

function createNavigationScript() {
    return `
    document.addEventListener('DOMContentLoaded', function() {
        const nav = document.querySelector('.sidebar-main-content');
        
        nav.addEventListener('click', function(e) {
            const target = e.target;
            
            // Handle accordion toggles
            if (target.matches('.accordion-heading')) {
                const content = target.nextElementSibling;
                target.classList.toggle('active');
                content.style.display = content.style.display === 'block' ? 'none' : 'block';
                e.preventDefault();
            }
            
            // Handle link clicks
            if (target.matches('a')) {
                // Remove 'active' class from all links
                nav.querySelectorAll('a').forEach(link => link.classList.remove('active'));
                
                // Add 'active' class to clicked link
                target.classList.add('active');
                
                // Don't prevent default here, let the link navigate
            }
        });

        function saveNavState() {
            const activeLinks = Array.from(document.querySelectorAll('.sidebar-main-content a.active'))
                .map(link => link.getAttribute('href'));
            localStorage.setItem('activeNavLinks', JSON.stringify(activeLinks));
        }

        function loadNavState() {
            const activeLinks = JSON.parse(localStorage.getItem('activeNavLinks') || '[]');
            activeLinks.forEach(href => {
                const link = document.querySelector(\`.sidebar-main-content a[href="\${href}"]\`);
                if (link) {
                    link.classList.add('active');
                    // Expand parent accordions if necessary
                    let parent = link.closest('.accordion-content');
                    while (parent) {
                        parent.style.display = 'block';
                        parent.previousElementSibling.classList.add('active');
                        parent = parent.parentElement.closest('.accordion-content');
                    }
                }
            });
        }

        // Call loadNavState when the page loads
        loadNavState();

        // Call saveNavState when a link is clicked
        nav.addEventListener('click', function(e) {
            if (e.target.matches('a')) {
                saveNavState();
            }
        });
    });
    `;
}

function createNavigationStyles() {
    return `
    .sidebar-main-content a {
        color: #333;
        text-decoration: none;
    }

    .sidebar-main-content a:visited {
        color: #666;
    }

    .sidebar-main-content a.active {
        font-weight: bold;
        color: #000;
    }

    .accordion-heading {
        cursor: pointer;
    }

    .accordion-content {
        display: none;
    }

    .accordion-heading.active + .accordion-content {
        display: block;
    }
    `;
}