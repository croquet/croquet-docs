#!/bin/sh

# Using bash strict mode
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail

VALID_TEMPLATES=(
    "croquet"
    "multisynq"
)

VALID_TARGETS=(
    "virtual-dom"
    "worldcore"
    "microverse"
    "webshowcase"
    "croquet"
    "croquet-react"
    "unity"
)

print_help() {
  cat << EOF
Usage: $0 [-t template]... [target]...

Script for generating the croquet docs.

Options:
  -t template   Specify a template to build. This option can be repeated
                to provide multiple templates. If no -t options are provided,
                the script will build for all valid templates.

Arguments:
  target        Specify a target to build. Multiple targets can be provided.
                If no targets are provided, the script will build for all targets.

Valid templates:
$(printf "  %s\n" "${VALID_TEMPLATES[@]}")

Valid targets:
$(printf "  %s\n" "${VALID_TARGETS[@]}")

Examples:
  $0 -t croquet
    Build for the 'croquet' template.

  $0 -t croquet -t multisynq
    Build for the 'croquet' and 'multisynq' templates.

  $0
    Build for all valid templates.
EOF
}

is_valid_template() {
    local TEMPLATE="$1"
    for VALID_TEMPLATE in ${VALID_TEMPLATES[@]}; do
        if [[ "$VALID_TEMPLATE" == "$TEMPLATE" ]]; then
            return 0
        fi
    done
    return 1
}

# Parse opts. Get templates from command line
TEMPLATES=()
while getopts ":ht:" opt; do
    case $opt in
        t)
            if is_valid_template $OPTARG; then
                TEMPLATES+=("$OPTARG")
            else
                echo "Invalid template: $OPTARG. Ignoring..."
            fi
            ;;
        h)
            print_help
            exit 0
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            print_help
            exit 1
            ;;
    esac
done

shift $((OPTIND - 1))

# If no templates provided, use all valid templates
if [ "${#TEMPLATES[@]}" -eq 0 ]; then
    echo "No templates provided, building for all templates"
    TEMPLATES=${VALID_TEMPLATES[@]}
fi

cd `dirname "$0"`

[ -x node_modules/.bin/jsdoc ] || npm ci

rm -rf ./dist; mkdir ./dist

PACKAGES="$@"
if [ -z "$PACKAGES" ] ; then
    PACKAGES="virtual-dom worldcore microverse webshowcase"
    if [ -d "../croquet/docs" ] ; then
        PACKAGES="croquet $PACKAGES"
    else
        echo "Not building Croquet docs because source not present in ../croquet/docs"
    fi

    if [ -d "../multisynq-client/docs" ] ; then
        if [ -d "../croquet/packages/croquet" ] ; then
            echo "Building Multisynq docs"
            PACKAGES="multisynq $PACKAGES"
        else
            echo "Not building Multisynq docs because Croquet source not present in ../croquet/packages/croquet"
        fi
    else
        echo "Not building Multisynq docs because source not present in ../multisynq-client/docs"
    fi

    if [ -d "../croquet-react/docs" ] ; then
        PACKAGES="$PACKAGES croquet-react"
    else
        echo "Not building react docs because source not present in ../croquet-react/docs"
    fi

    if [ -d "../m4u-tutorials/docs" ] ; then
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
    cp -rp ./${TEMPLATE_DIR}/static/* ./dist/${t}
done

# Build docs
for p in $PACKAGES
do
    for t in ${TEMPLATES}
    do
        TEMPLATE_DIR=templates/${t}
        UNLINK=""
        for f in $(find . -name \*-$t.md) ; do
            LINK_NAME=$(echo $f | sed "s/-$t.md/.md/")
            UNLINK="$UNLINK $LINK_NAME"
            (cd $(dirname $f); ln -sf $(basename $f) $(basename $LINK_NAME))
        done

        OUTPUT_DIR="dist/${t}/${p}"
        VERSION=$(node -p -e "require('./"${p}/package.json"').version")
        MINOR_VERSION=`echo $VERSION | sed 's/\.[^.]*$//'`
        echo Building $p $VERSION with theme ${t}
        (cd $p; npm run doBuild -- --template ../${TEMPLATE_DIR} --destination ../${OUTPUT_DIR}) || exit 1
        [ -f "${OUTPUT_DIR}/index.html" ] || exit 1

        rm -f $UNLINK

        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/@CROQUET_VERSION@/$VERSION/g;s/@CROQUET_VERSION_MINOR@/$MINOR_VERSION/g;s/@CLIENT_VERSION@/$VERSION/g" ${OUTPUT_DIR}/*.html
        else
            sed -i "s/@CROQUET_VERSION@/$VERSION/g;s/@CROQUET_VERSION_MINOR@/$MINOR_VERSION/g;s/@CLIENT_VERSION@/$VERSION/g" ${OUTPUT_DIR}/*.html
        fi

        if [[ ${t} == "multisynq" ]]; then
            echo "===========> Updating Multisynq links to point to croquet.io"
            BAD_LINKS="../../webshowcase ../../privacy.html ../../keys ../../react-counter ../../react-musicbox"

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

            # Only in Multisynq client docs, and only in the files generated from Croquet source,
            # and only uppercase "Croquet", gets changed to "Multisynq":
            # because the source docs use lower-case "croquet" (like "croquet-in-a-box")
            # and the multisynq tutorials use "Croquet" (like "Croquet Labs")
            # and we don't want to change either of those
            if [[ "$p" == "multisynq" ]]; then
                echo "===========> Replacing Croquet with Multisynq"
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    sed -i '' "s|Croquet|Multisynq|g" ${OUTPUT_DIR}/{Model,View,Session,global}.html
                else
                    sed -i "s|Croquet|Multisynq|g" ${OUTPUT_DIR}/{Model,View,Session,global}.html
                fi
            fi
        fi
    done
done
