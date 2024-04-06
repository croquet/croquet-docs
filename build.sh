#!/bin/sh
cd `dirname "$0"`

[ -x node_modules/.bin/jsdoc ] || npm ci

rm -rf ./dist; mkdir ./dist

# PACKAGES="$@"
# if [ -z "$PACKAGES" ] ; then
#     PACKAGES="virtual-dom worldcore microverse webshowcase"
#     if [ -d "../wonderland/croquet/teatime" ] ; then
#         PACKAGES="croquet $PACKAGES"
#     else
#         echo "Not building teatime docs because source not present in ../wonderland/croquet/teatime"
#         if wget --version > /dev/null 2>&1 ; then
#             echo "    ...downloading teatime docs from croquet.io instead"
#             wget -q --show-progress -r -np -nH --cut-dirs 2 -P dist https://croquet.io/dev/docs/croquet/
#         else
#             echo "    ...not downloading teatime docs either because wget is not available"
#         fi
#     fi
#     if [ -d "../croquet-react/docs" ] ; then
#         PACKAGES="$PACKAGES croquet-react"
#     else
#         echo "Not building react docs because source not present in ../croquet-react/docs"
#     fi
#     if [ -d "../croquet-for-unity-tutorials/docs" ] ; then
#         PACKAGES="$PACKAGES unity"
#     else
#         echo "Not building unity docs because source not present in ../croquet-for-unity-tutorials/docs"
#     fi
# fi

# right now images and styles go one directory above... but it is probably saner if it is kept
# in docs

PACKAGES="croquet-react"
TARGETS="croquet multisynq"

for t in ${TARGETS}
do
    TEMPLATE_DIR=templates/${t}

    mkdir dist/${t}
    # TODO: use ln instead of cp
    cp -rp ./${TEMPLATE_DIR}/static/* ./dist/${t}
    for p in $PACKAGES
    do
        OUTPUT_DIR="dist/${t}/${p}"
        VERSION=$(node -p -e "require('./"${p}/package.json"').version")
        MINOR_VERSION=`echo $VERSION | sed 's/\.[^.]*$//'`
        echo Building $p $VERSION with theme ${t}
        (cd $p; npm run build -- --template ../${TEMPLATE_DIR} --destination ../${OUTPUT_DIR}) || exit 1
        [ -f "${OUTPUT_DIR}/index.html" ] || exit 1
        sed -i "s/@CROQUET_VERSION@/$VERSION/;s/@CROQUET_VERSION_MINOR@/$MINOR_VERSION/;" ${OUTPUT_DIR}/*.html || true
    done
done