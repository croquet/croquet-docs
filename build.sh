#!/bin/sh
cd `dirname "$0"`

JSDOC=node_modules/.bin/jsdoc
[ -x $JSDOC ] || npm ci

rm -rf ./build/*

for i in `ls -d */| egrep -v '(build/|node_modules/|template/)'`
do
    (cd $i; ../$JSDOC -c jsdoc.json -d ../build/$i)
done

VERSION="${VERSION:-1.0.0}"
MINOR_VERSION="${MINOR_VERSION:-""}"

echo $VERSION $MINOR_VERSION

sed -i '' "s/@CROQUET_VERSION@/$VERSION/;s/@CROQUET_VERSION_MINOR@/$MINOR_VERSION/;" build/*/*.html || exit
