#!/bin/sh
SRC=${1-~/showcase}
if [ ! -d "$SRC" ] ; then
    echo "usage: $0 <source-repo>"
    exit 1
fi
rm -r tutorials/assets
cp -va ~/showcase/docs/*.md .
cp -va ~/showcase/docs/assets tutorials

