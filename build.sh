#!/bin/sh
cd `dirname "$0"`

PACKAGES="$@"
[ -z "$PACKAGES" ] && PACKAGES="croquet croquet-react virtual-dom worldcore microverse showcase"

[ -x node_modules/.bin/jsdoc ] || npm ci

rm -rf ./build; mkdir ./build

# right now images and styles go one directory above... but it is probably saner if it is kept
# in docs
cp -rp ./clean-jsdoc-theme/static/ ./build/

for i in $PACKAGES
do
    VERSION=$(node -p -e "require('./"${i}/package.json"').version")
    MINOR_VERSION=`echo $VERSION | sed 's/\.[^.]*$//'`
    echo $i $VERSION
    (cd $i; npm run build)
    sed -i '' "s/@CROQUET_VERSION@/$VERSION/;s/@CROQUET_VERSION_MINOR@/$MINOR_VERSION/;" build/${i}/*.html || true
done
