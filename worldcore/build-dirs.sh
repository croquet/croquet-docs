#!/bin/sh

for i in audio behavior input rapier three vector webGL widget
do
    (cd $i; npx jsdoc -c jsdoc.json)
done
