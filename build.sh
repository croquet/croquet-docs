#!/bin/sh
cd `dirname "$0"`

[ -x node_modules/.bin/jsdoc ] || npm ci

rm -rf ./dist; mkdir ./dist

PACKAGES="$@"
if [ -z "$PACKAGES" ] ; then
    PACKAGES="virtual-dom worldcore microverse webshowcase"
    if [ -d "../wonderland/croquet/teatime" ] ; then
        PACKAGES="croquet $PACKAGES"
    else
        echo "Not building teatime docs because source not present in ../wonderland/croquet/teatime"
        if wget --version > /dev/null 2>&1 ; then
            echo "    ...downloading teatime docs from croquet.io instead"
            wget -q --show-progress -r -np -nH --cut-dirs 2 -P dist https://croquet.io/dev/docs/croquet/
        else
            echo "    ...not downloading teatime docs either because wget is not available"
        fi
    fi
    if [ -d "../croquet-react/docs" ] ; then
        PACKAGES="$PACKAGES croquet-react"
    else
        echo "Not building react docs because source not present in ../croquet-react/docs"
    fi
fi

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
