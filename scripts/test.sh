#!/bin/sh
sass test/test.scss test/test.css --load-path 'bower_components/sass-mq' --load-path './' --sourcemap=none --trace
sass test/test-width-override.scss test/test-width-override.css --load-path 'bower_components/sass-mq' --load-path './' --sourcemap=none --trace
node-sass test/test.scss test/test.css --include-path 'bower_components/sass-mq' --include-path './' --sourcemap=none
node-sass test/test-width-override.scss test/test-width-override.css --include-path 'bower_components/sass-mq' --include-path './' --sourcemap=none
node test/eyeglass-test.js

DIFF=`git diff --name-only test/*.css`

if [ "$DIFF" ]
then
    printf "\n\e[31m! WARNING: One or more changes were found in the tests output:\e[0m\n"
    echo "$DIFF"
    echo "\nRun 'git diff test/*.css' to see what parts of the code are different"
    echo "and make sure these changes are intentional before committing.\n"
else
    printf "\n\e[32m✔ SUCCESS: files were successfuly compiled in the test/ directory.\e[0m\n"
fi
