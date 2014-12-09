#!/bin/sh
sassdoc . sassdoc --config .sassdocrc --no-prompt
git subtree push --prefix sassdoc origin gh-pages