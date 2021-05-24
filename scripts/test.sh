#!/bin/sh
# `sass` is an ambiguous binary (could be the gem or the npm package),
# so we use npx to run it and ensure it's the Dart version of Sass
npx --ignore-existing --quiet sass ./test/test.scss ./test/output/test-dart.css --no-source-map --no-color --style=expanded 2>test/output/dart-sass.log
node test/eyeglass-test.js 2>test/output/eyeglass.log

DIFF=`git diff --name-only test/output`

if [ "$DIFF" ]
then
    printf "\n\e[31m! WARNING: One or more changes were found in the tests output:\e[0m\n"
    echo "$DIFF"
    echo "\nRun 'git diff test/output' to see what parts of the code are different"
    echo "and make sure these changes are intentional before committing.\n"
    exit 1
else
    printf "\n\e[32m✔ SUCCESS: files were successfully compiled in the test/ directory.\e[0m\n"
fi
