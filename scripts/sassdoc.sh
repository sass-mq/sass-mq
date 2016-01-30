#!/bin/sh
# Generate documentation and deploy it to GitHub pages
# http://sass-mq.github.io/sass-mq/
sassdoc _mq.scss sassdoc --config=.sassdocrc
git add ./sassdoc
git commit -m "Compile SassDoc"
git subtree push --prefix sassdoc origin gh-pages
