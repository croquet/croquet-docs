# Multisynq Client Docs

The actual docs are in the `multisynq-client` repo: https://github.com/multisynq/multisynq-client/

We also need the `croquet` repo for the classes source code: https://github.com/croquet/croquet/

This repo has the doc generator and theme. It expects `multisynq-client` and `croquet` to be checked out next to `croquet-docs`.


    ├── multisynq-client
    │   └── docs
    │
    ├── croquet
    │   └── packages
    │       └── croquet
    │
    └── croquet-docs
        └── croquet     (this directory)

If that's all in place, you can build the Multisynq Client docs like any other using `npm run build` or `npm run watch` in this directory.