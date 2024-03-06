#!/bin/sh
cd `dirname "$0"`

PACKAGES="$@"
if [ -z "$PACKAGES" ] ; then
    PACKAGES="croquet-react virtual-dom worldcore microverse webshowcase"
    if [ -d "../wonderland/croquet/teatime" ] ; then
        PACKAGES="croquet $PACKAGES"
    else
        echo "Not building teatime docs because source not present in ../wonderland/croquet/teatime"
    fi
fi

[ -x node_modules/.bin/jsdoc ] || npm ci

rm -rf ./dist; mkdir ./dist

# right now images and styles go one directory above... but it is probably saner if it is kept
# in docs
cp -rp ./clean-jsdoc-theme/static/ ./dist/

for i in $PACKAGES
do
    VERSION=$(node -p -e "require('./"${i}/package.json"').version")
    MINOR_VERSION=`echo $VERSION | sed 's/\.[^.]*$//'`
    echo $i $VERSION
    (cd $i; npm run build) || exit 1
    [ -f "dist/${i}/index.html" ] || exit 1
    sed -i '' "s/@CROQUET_VERSION@/$VERSION/;s/@CROQUET_VERSION_MINOR@/$MINOR_VERSION/;" dist/${i}/*.html || true
done
