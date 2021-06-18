# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased] - 2021-06-01

This is a major version bump

### Added
* Support  for dart-sass 1.35.1
* Jest test with "sass-true"

### Removed
* drop test for sass engines other than dart-sass
* Deprecate `$mq-base-font-size` (https://github.com/sass-mq/sass-mq/pull/123)
* Removed compatibility with browsers that do not support media-queries.
  - remove `$mq-responsive`
  - remove `$mq-static-breakpoint`

### Changed

* Division , now we use sass:math.div(...) instead of ` / `
* `mq-get-breakpoint-width` added `return null` when no key found ( a function must always return something or we will get an error)
* change all `map-*` global function in favor of  built-in module `map.*` (ie map-keys() Vs map.keys())
*  `mq-px2em` remove param `$base-font-size` (deprecated from previous version) and set value to 16px.
*  change `unit` in favor of  `math.compatible()`, (https://sass-lang.com/documentation/modules/math). It looks that this function is intended for debugging; its output format is not guaranteed to be consistent across Sass versions or implementations.
*  Change all other global sass functions for its new build in module name (ie: `map-merge` Vs  `map.merge`, `append` Vs `list.append` )



### Fixed


## [v5.0.1] - 2019-07-12
