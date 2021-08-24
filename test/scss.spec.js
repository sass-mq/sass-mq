const path = require('path');
const sassTrue = require('sass-true');
const glob = require('glob');

describe('Sass', () => {
  // Find all of the Sass files that end in `*.spec.scss` in any directory of this project.
  // This uses `path.resolve` because True requires absolute paths to compile test files.
  const sassTestFiles = glob.sync(
    path.resolve(process.cwd(), 'test/**/*.spec.scss'),
  );

  // Run True on every file found with the describe and it methods provided
  sassTestFiles.forEach((file) => sassTrue.runSass({ file }, { describe, it }));
});
