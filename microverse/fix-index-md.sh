#!/bin/sh

cp ../build/microverse/index.html ../build/microverse/index.html.tmp

cat ../build/microverse/index.html.tmp | \
    sed 's/href="index.md"/href="index.html"/g' > ../build/microverse/index.html

rm ../build/microverse/index.html.tmp
