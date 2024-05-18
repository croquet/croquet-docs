#!/bin/sh

# Partially using bash strict mode
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail

TEMPLATES="croquet multisynq"

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
            # Here we should make sure if we are downloading for wanted targets
            wget -q --show-progress -r -np -nH --cut-dirs 2 -P dist/croquet https://croquet.io/dev/docs/croquet/ || true
            # wget -q --show-progress -r -np -nH --cut-dirs 2 -P dist/multisynq https://multisynq.io/dev/docs/multisynq/
        else
            echo "    ...not downloading teatime docs either because wget is not available"
        fi
    fi

    if [ -d "../croquet-react/docs" ] ; then
        PACKAGES="$PACKAGES croquet-react"
    else
        echo "Not building react docs because source not present in ../croquet-react/docs"
    fi

    if [ -d "../croquet-for-unity-tutorials/docs" ] ; then
        PACKAGES="$PACKAGES unity"
    else
        echo "Not building unity docs because source not present in ../croquet-for-unity-tutorials/docs"
    fi
fi

# right now images and styles go one directory above... but it is probably saner if it is kept
# in docs

# Setup 
for t in ${TEMPLATES}
do
    TEMPLATE_DIR=templates/${t}

    mkdir -p dist/${t}
    # TODO: use ln instead of cp
    cp -rp ./${TEMPLATE_DIR}/static/* ./dist/${t}
done

# Build docs
for p in $PACKAGES
do
    for t in ${TEMPLATES}
    do
        TEMPLATE_DIR=templates/${t}

        OUTPUT_DIR="dist/${t}/${p}"
        VERSION=$(node -p -e "require('./"${p}/package.json"').version")
        MINOR_VERSION=`echo $VERSION | sed 's/\.[^.]*$//'`
        echo Building $p $VERSION with theme ${t}
        (cd $p; npm run doBuild -- --template ../${TEMPLATE_DIR} --destination ../${OUTPUT_DIR}) || exit 1
        [ -f "${OUTPUT_DIR}/index.html" ] || exit 1
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/@CROQUET_VERSION@/$VERSION/;s/@CROQUET_VERSION_MINOR@/$MINOR_VERSION/;" ${OUTPUT_DIR}/*.html
        else
            sed -i "s/@CROQUET_VERSION@/$VERSION/;s/@CROQUET_VERSION_MINOR@/$MINOR_VERSION/;" ${OUTPUT_DIR}/*.html
        fi

        if [[ ${t} == "multisynq" ]]; then
            echo "===========> Updating Multisynq links to point to croquet.io"
            BAD_LINKS="../../webshowcase ../../privacy.html ../../keys/"

            for l in ${BAD_LINKS}
            do
                NEW_LINK=$(echo "$l" | awk '{sub(/\.\.\/../, "https://croquet.io"); print}')
                echo Changing \"${l}\" to: \"${NEW_LINK}\"

                # sed "s|$path|$new_path|g;/\$new_path/p" your_script.sh
                grep -o -E "<[^<]*${l}[^>]*>" ${OUTPUT_DIR}/*.html | grep --color ${l} || true
                # using | as the delimiter (instead of /)
                # to avoid conflicts with the slashes in the paths
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    sed -i '' "s|${l}|${NEW_LINK}|g" ${OUTPUT_DIR}/*.html
                else
                    sed -i "s|${l}|${NEW_LINK}|g" ${OUTPUT_DIR}/*.html
                fi
            done
        fi
    done
done