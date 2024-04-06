#!/bin/sh

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

for i in audio behavior input rapier three vector webGL widget
do
    (cd $i; npx jsdoc -c jsdoc.json --template ${template} --destination ${destination}/${i})
done
