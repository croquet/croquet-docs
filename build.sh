#!/bin/sh
cd `dirname "$0"`

[ -x node_modules/.bin/jsdoc ] || npm ci

rm -rf ./build/*

for i in `ls -d */| egrep -v '(build/|node_modules/|template/)'`
do
    VERSION=$(node -p -e "require('./"${i}package.json"').version")
    echo $i $VERSION
    (cd $i; npm run build)
    sed -i '' "s/@CROQUET_VERSION@/$VERSION/;s/@CROQUET_VERSION_MINOR@/$MINOR_VERSION/;" build/${i}*.html || true
done
