#!/bin/sh
sass test/test.scss test/test.css --load-path 'bower_components/sass-mq' --load-path './'  --sourcemap=none --trace
node-sass test/test.scss test/test.css --include-path 'bower_components/sass-mq' --include-path './' --sourcemap=none
node test/eyeglass-test.js
