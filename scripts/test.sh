#!/bin/sh
sass --update --force test/test.scss:test/output/test-ruby.css --sourcemap=none 2>test/output/ruby-sass.log
dart-sass test/test.scss 1>test/output/test-dart.css 2>test/output/dart-sass.log
node-sass test/test.scss test/output/test-node.css --sourcemap=none --quiet 2>test/output/node-sass.log
node test/eyeglass-test.js 2>test/output/eyeglass.log

# Diamond is compatible with Node.js 4 and up
# so we exclude the test from running in Node.js 0.12
if [ "$TRAVIS_NODE_VERSION" != "0.12" ]; then
    diamond compile --output test/output/test-diamond.css test/test-diamond.scss 2> test/output/diamond.log
fi

DIFF=`git diff --name-only test/output/*.*`

if [ "$DIFF" ]
then
    printf "\n\e[31m! WARNING: One or more changes were found in the tests output:\e[0m\n"
    echo "$DIFF"
    echo "\nRun 'git diff test/*.css' to see what parts of the code are different"
    echo "and make sure these changes are intentional before committing.\n"
    exit 1
else
    printf "\n\e[32m✔ SUCCESS: files were successfully compiled in the test/ directory.\e[0m\n"
fi
