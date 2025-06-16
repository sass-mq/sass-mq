# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!-- ## Unreleased -->

## v7.0.0 - 2025-06-16

This is a major version bump that contains no breaking changes but may require a newer version of Sass. It ensures compatibility with the latest version of dart-sass and removes support for `@import`, as [`@import` is officially deprecated as of sass-dart 1.80.0](https://sass-lang.com/blog/import-is-deprecated/).

### Added

- Added support for dart-sass >= 1.80.0 (without deprecation warnings)

### Changed

- BREAKING CHANGE: Dropped support for `@import` (use [sass-mq v6.0.0](https://github.com/sass-mq/sass-mq/tree/v6.0.0) if you need backward compatibility with `@import`)
- Updated all global Sass functions to use their module equivalents (for example: `type-of` ➡️ `meta.type-of`, `slice` ➡️ `string.slice`), silencing deprecation warnings introduced in dart-sass 1.80.0

### Chores

- Upgraded Jest and Sass True dependencies to unlock testing with the latest versions of `sass-dart`
- Fixed a test where a space was missing between `and` and `(` in the generated CSS (caused by the latest version of Sass)
- Migrated from Travis CI to GitHub Actions for testing

## v6.0.0 - 2022-01-10

This is a major version bump that contains breaking changes. It adds support for the [new Sass module system](https://sass-lang.com/blog/the-module-system-is-launched), drops support for Eyeglass, and drops support for deprecated versions of Sass. No new features were added.

See the updated [README](https://github.com/sass-mq/sass-mq/blob/main/README.md) for instructions on how to use this new version of Sass MQ.

🙌 A huge thanks to [Rodrigo](https://github.com/area73) for his contribution on this major release.

### Added

- Support for dart-sass >= 1.35.1
- Test suite using [Jest](https://jestjs.io/) and [True](https://www.oddbird.net/true/), a unit-testing framework designed specifically for the Sass language

### Removed

- Dropped tests for Sass engines other than dart-sass
- Dropped support for [Eyeglass](https://github.com/linkedin/eyeglass)
- Dropped deprecated var `$mq-base-font-size` (https://github.com/sass-mq/sass-mq/pull/123)
- Dropped compatibility with browsers that don’t support media queries:
  - Removed `$mq-responsive`
  - Removed `$mq-static-breakpoint`

### Changed

- Divisions are now performed with `sass:math.div(...)` instead of `/`
- `get-breakpoint-width`: added `@return null` when no breakpoint could be found (a function must always return something, or Sass will throw an error).
- Updated all `map-*` global functions in favor of the built-in module `map.*` (for example: `map-keys()` ➡️ `map.keys()`).
- `px2em`: removed param `$base-font-size` (deprecated in v5.0.1), and use 16px instead.
- Removed usage of `unit()` in favor of [`math.compatible()`](https://sass-lang.com/documentation/modules/math#compatible), as the `unit()` function is intended for debugging, and its output format is not guaranteed to be consistent across Sass versions or implementations.
- Updated all other global Sass functions to use their module equivalents (for example: `map-merge` ➡️ `map.merge`, `append` ➡️ `list.append`)

## Changes prior to v6.0.0

Changes prior to v6.0.0 were logged in https://github.com/sass-mq/sass-mq/releases
