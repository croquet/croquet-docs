#!/bin/sh

cp ../dist/microverse/index.html ../dist/microverse/index.html.tmp

cat ../dist/microverse/index.html.tmp | \
    sed 's/href="index.md"/href="index.html"/g' > ../dist/microverse/index.html

rm ../dist/microverse/index.html.tmp
