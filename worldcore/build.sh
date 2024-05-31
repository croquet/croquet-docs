#!/bin/sh

set -euo pipefail

jsdoc -c jsdoc.json $@

# Check if we're on macOS and update sed_cmd if needed
sed_cmd="sed -i"
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed_cmd="sed -i ''"
fi

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
        # Patch sidebar logo to navigate to to worldcore main page
        $sed_cmd '/id="navbar-heading"/ { :1 /id="navbar-heading"><a href=".\/"/s/\(id="navbar-heading"><a href="\).\/"/\1..\/"/; t1 }' ${destination}/${i}/*.html
    )
done
