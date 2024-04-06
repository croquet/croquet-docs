#!/bin/bash

# Change to the script's directory
cd "$(dirname "$0")"

# Loop through each directory in templates/
for dir in templates/*/; do
    if [ -d "$dir" ]; then
        if [ -f "$dir/minify.js" ]; then
            echo "Minifying files in $dir"
            (cd "$dir" && node minify.js)
        else
            echo "Skipping minification for $dir (minify.js not found)"
        fi
    fi
done