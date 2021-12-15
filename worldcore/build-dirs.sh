#!/bin/sh

for i in audio behavior input rapier three vector webgl widget
do
    (cd $i; npx jsdoc -c jsdoc.json)
done
