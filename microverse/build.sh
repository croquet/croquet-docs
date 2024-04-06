#!/bin/sh

# Pass all the received arguments to jsdoc
jsdoc -c jsdoc.json $@

# Extract destination argument
while [[ $# -gt 0 ]]; do
    case "$1" in
        --destination)
            destination="$2"
            shift 2
            break
            ;;
        *)
            shift 1
            ;;
    esac
done

if [ -z "$destination" ]; then
    echo "No destination provided"
    exit 1
fi

cp ${destination}/index.html ${destination}/index.html.tmp

cat ${destination}/index.html.tmp | \
    sed 's/href="index.md"/href="index.html"/g' > ${destination}/index.html

rm ${destination}/index.html.tmp
