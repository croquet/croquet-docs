# Croquet Docs

This is a document generator that uses jsdoc to build the docs deployed at [croquet.io/docs](https://croquet.io/docs/)

It accommodates multiple projects. Each project is a subdirectory.

## How to build all docs

Run `./build.sh`. This may only work on a unixy system.

The generated docs will be in `dist/`. There is no top-level `index.html`, that one is part of the general Croquet website.

## How to work on a particular doc

    cd <project>
    npm start

This will start a watcher that continuously builds this project into `../dist` whenever a filer is edited.

## How to add a new project

Create a new subdirectory to add a new project. Then, copy `jsdoc.json` and `package.json` from an existing project. In jsdoc.json, replace the "include" array with the .js and .md files that has your documentation.  `opts.tutorials` should point to a directory that has a series of .md files.  destination should be `../dist/<your project>`.  If your tutorial has additional files, `templates.staticFiles.include` needs to have them.  Change `docdash.meta` to change the title.

You don't actually have to run `npm install` in the project subdirectory.  It is there to specify what to do with npm-watch. npm-watch helps you to view the results of your edit faster: Change the list in `watch.build.patterns`, and then run `npm run watch` in a shell. Then editing a file listed in patterns would trigger re-generation of the html file tree in to the `dist` directory in the project subdirectory . (You'd still have to reload.)

`build.sh` is called to make the directory that contains all projects. It copies `index.html` in this directory to `dist` as the entry point for those project documents.

Each sub project can have its own version number. The version string of `package.json` is used to substitute the `@CROQUET_VERSION` string in any generated html.

