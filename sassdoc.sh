#!/bin/sh
sassdoc . sassdoc --config .sassdocrc --no-prompt
git add sassdoc
git commit -m "Compile SassDoc"
git subtree push --prefix sassdoc origin gh-pages