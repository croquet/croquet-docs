#!/bin/sh

set -euo pipefail

jsdoc -c jsdoc.json $@

# Extract destination argument
while [[ $# -gt 0 ]]; do
    case "$1" in
        --template)
            template="../$2"
            shift 2
            ;;
        --destination)
            destination="../$2"
            shift 2
            break
            ;;
        *)
            shift 1
            ;;
    esac
done

for i in audio behavior input rapier three vector webgl widget
do
    (
        cd $i;
        npx jsdoc -c jsdoc.json --template ${template} --destination ${destination}/${i}

        # In the subpackages, the navbar-heading should point to the parent. Replacing href="./" -> href="../"
        perl -i -pe 'if (/id="navbar-heading"/) { s#(id="navbar-heading"><a href=")\./#$1../#g while /id="navbar-heading"><a href="\.\//; }' ${destination}/${i}/*.html
    )
done
