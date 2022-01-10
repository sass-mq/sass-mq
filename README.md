<div align="center">
	<img width="500" height="500" src="https://avatars3.githubusercontent.com/u/9341289?v=3&s=500" alt="Awesome">
</div>

# Media Queries with superpowers [![Build Status](https://api.travis-ci.org/sass-mq/sass-mq.svg?branch=main)](https://travis-ci.org/sass-mq/sass-mq)

`mq()` is a [Sass](http://sass-lang.com/ 'Sass - Syntactically Awesome
Stylesheets') mixin that helps you compose media queries in an elegant way.

- compiles keywords and `px`/`em` values to `em`-based queries ([a good thing](http://css-tricks.com/zooming-squishes))
- For version 6 and up we removed fallbacks for older browsers (see [Mobile-first Responsive Web Design and IE8](http://www.theguardian.com/info/developer-blog/2013/oct/14/mobile-first-responsive-ie8) on the Guardian's developer blog).

Here is a very basic example:

```scss
@use 'mq' as * with (
  $breakpoints: (
    mobile: 320px,
    tablet: 740px,
    desktop: 980px,
    wide: 1300px,
  )
);

.foo {
  @include mq($from: mobile, $until: tablet) {
    background: red;
  }
  @include mq($from: tablet) {
    background: green;
  }
}
```

Compiles to:

```css
@media (min-width: 20em) and (max-width: 46.24em) {
  .foo {
    background: red;
  }
}
@media (min-width: 46.25em) {
  .foo {
    background: green;
  }
}
```

_Sass MQ was crafted in-house at the Guardian. Today, many more companies and developers are using it in their projects: [see who uses Sass MQ](#who-uses-sass-mq)._

## How to use it

Immediately play with it on [SassMeister](http://sassmeister.com/): `@use 'mq';`.

OR:

1. Install:

   - with [Bower](http://bower.io/ 'Bower: A package manager for the web'): `bower install sass-mq --save`
   - with [npm](https://www.npmjs.com/): `npm install sass-mq --save`
   - with [yarn](https://www.yarnpkg.com/): `yarn add sass-mq`

   OR [Download \_mq.scss](https://raw.github.com/sass-mq/sass-mq/main/_mq.scss) into your Sass project.

2. Import the partial in your Sass files and override default settings
   with your own preferences:

```scss
// Name your breakpoints in a way that creates a ubiquitous language
// across team members. It will improve communication between
// stakeholders, designers, developers, and testers.
$breakpoints: (
  mobile: 320px,
  tablet: 740px,
  desktop: 980px,
  wide: 1300px,
  // Tweakpoints
  desktopAd: 810px,
  mobileLandscape: 480px,
);

// If you want to display the currently active breakpoint in the top
// right corner of your site during development, add the breakpoints
// to this list, ordered by width. For examples: (mobile, tablet, desktop).
$show-breakpoints: (mobile, mobileLandscape, tablet, desktop, wide);

@use 'path/to/mq' with (
  $breakpoints: $breakpoints,
  $show-breakpoints: $show-breakpoints
);
```

### Notes about `@use` Vs `@import`

When using the `@use` directive, you have to change your mindset when working with vars,
functions or mixins and how they are now seen by Sass.

Previously, with the `@import` statement any var, function, or mixin were exposed in the global scope.
That means that you could define a var like `$mq-media-type: all` in your main sass file and use
it anywhere as long as the main file had been loaded previously.

This was possible because vars, functions, and mixins were set in the global scope.

One drawback of this behaviour was that we needed to ensure not to pollute the global scope
with common names or names that may be already taken by any other library.

To solve this matter, we mostly used a prefix in vars, functions, or mixins in order to avoid
collapsing names.

Now with the new `@use` directive, no var, function, or mixin is placed in global scope, and they are
all scoped within the file.

That means that we explicitly need to include the partial file in each file that may use its vars,
functions or mixins (similar to ES6 import modules).

So, previously we could have a typical setup like this:

```scss
// main.scss
@import 'mq';
@import 'typography';
@import 'layout';
@include mq($from:tablet) {
  ...
}

...

// typography.scss
@include mq($from:tablet) {
  ...
}

```

Now, you will need to explicitly import the `_mq.scss` file in each file that needs to use any var, function
or mixin from it:

```scss
// main.scss
@use 'mq';
@use 'typography';
@use 'layout';
@include mq.mq($from:tablet) {
  ...
}
...

// typography.scss
@use 'mq';
@include mq.mq($from:tablet) {
  ...
}
```

Other important things about `@use`:

- The file is only imported once, no matter how many times you @use it in a project.

- Variables, mixins, and functions (what Sass calls “members”) that start with an underscore (\_)
  or hyphen (-) are considered private, and not imported.

- Members from the used file are only made available locally, but not passed along to future
  imports.

- Similarly, `@extends` will only apply up the chain; extending selectors in imported files,
  but not extending files that import this one.

- All imported members are namespaced by default.

Please see [introducing-sass-modules](https://css-tricks.com/introducing-sass-modules/) for more
info about sass modules.

3. Play around with `mq()` (see below)

### Responsive mode

`mq()` takes up to three optional parameters:

- `$from`: _inclusive_ `min-width` boundary
- `$until`: _exclusive_ `max-width` boundary
- `$and`: additional custom directives

Note that `$until` as a keyword is a hard limit i.e. it's breakpoint - 1.

```scss
@use 'mq';

.responsive {
  // Apply styling to mobile and upwards
  @include mq.mq($from: mobile) {
    color: red;
  }
  // Apply styling up to devices smaller than tablets (exclude tablets)
  @include mq.mq($until: tablet) {
    color: blue;
  }
  // Same thing, in landscape orientation
  @include mq.mq($until: tablet, $and: '(orientation: landscape)') {
    color: hotpink;
  }
  // Apply styling to tablets up to desktop (exclude desktop)
  @include mq.mq(tablet, desktop) {
    color: green;
  }
}
```

### Verbose and shorthand notations

Sometimes you’ll want to be extra verbose (for example, if you’re developing a
library based on top of sass-mq), however for readability in a codebase,
the shorthand notation is recommended.

All of these examples output the exact same thing and are here for
reference, so you can use the notation that best matches your needs:

```scss
@use 'mq';
// Verbose
@include mq.mq(
  $from: false,
  $until: desktop,
  $and: false,
  $media-type: $media-type // defaults to 'all'
) {
  .foo {
  }
}

// Omitting argument names
@include mq.mq(false, desktop, false, $media-type) {
  .foo {
  }
}

// Omitting tailing arguments
@include mq(false, desktop) {
  .foo {
  }
}

// Recommended
@include mq($until: desktop) {
  .foo {
  }
}
```

[See the detailed API documentation](http://sass-mq.github.io/sass-mq/#undefined-mixin-mq)

### Adding custom breakpoints

```scss
@include add-breakpoint(tvscreen, 1920px);

.hide-on-tv {
  @include mq(tvscreen) {
    display: none;
  }
}
```

### Seeing the currently active breakpoint

While developing, it can be nice to always know which breakpoint is
active. To achieve this, set the `$show-breakpoints` variable to
be a list of the breakpoints you want to debug, ordered by width.
The name of the active breakpoint and its pixel and em values will
then be shown in the top right corner of the viewport.

```scss
// Adapt the list to include breakpoint names from your project
$show-breakpoints: (phone, phablet, tablet);

@use 'path/to/mq' with (
  $show-breakpoints: $show-breakpoints
);
```

![$show-breakpoints](https://raw.githubusercontent.com/sass-mq/sass-mq/main/show-breakpoints.gif)

### Changing media type

If you want to specify a media type, for example to output styles
for screens only, set `$media-type`:

#### SCSS

```scss
@use 'mq' with (
  $media-type: screen
);

.screen-only-element {
  @include mq.mq(mobile) {
    width: 300px;
  }
}
```

#### CSS output

```css
@media screen and (max-width: 19.99em) {
  .screen-only-element {
    width: 300px;
  }
}
```

### Implementing sass-mq in your project

Please see the `examples` folder which contains a variety of examples on how to implement "sass-mq"

### Backward compatibility with `@import`

Just in case you need to have backward compatibility and want to use`@import` instead of `@use`,
you can do so by importing `_mq.import.scss` instead of `_mq.scss`.

Please see `legacy.scss` on `examples` folder.

## Running tests

```sh
npm test
```

## Generating the documentation

Sass MQ is documented using [SassDoc](http://sassdoc.com/).

Generate the documentation locally:

```sh
sassdoc .
```

Generate & deploy the documentation to <http://sass-mq.github.io/sass-mq/>:

```sh
npm run sassdoc
```

## Inspired By…

- <https://github.com/alphagov/govuk_frontend_toolkit/blob/master/stylesheets/_conditionals.scss>
- <https://github.com/bits-sass/helpers-responsive/blob/master/_responsive.scss>
- <https://gist.github.com/magsout/5978325>

## On Mobile-first CSS With Legacy Browser Support

- <http://jakearchibald.github.io/sass-ie/>
- <http://nicolasgallagher.com/mobile-first-css-sass-and-ie/>
- <http://cognition.happycog.com/article/fall-back-to-the-cascade>
- <http://www.theguardian.com/info/developer-blog/2013/oct/14/mobile-first-responsive-ie8>

## Who uses Sass MQ?

Sass MQ was developed in-house at [the Guardian](http://www.theguardian.com/).

These companies and projects use Sass MQ:

- The Guardian
- BBC (Homepage, Sport, News, Programmes)
- The Financial Times
- [Rightmove](http://www.rightmove.co.uk/)
- [Stockholm International Fairs and Congress Centre](http://stockholmsmassan.se/?sc_lang=en)
- [Beyond](https://bynd.com/)
- [EQ Design](http://eqdesign.co.uk/)
- [Baseguide](http://basegui.de/)
- [Base Creative](http://www.basecreative.co.uk/)
- [Locomotive](http://locomotive.ca/)
- [Le Figaro](http://tvmag.lefigaro.fr/) (TV Mag)
- [LunaWeb](http://www.lunaweb.fr)
- [inuitcss](https://github.com/inuitcss/inuitcss)
- [Hotelbeds Group](http://group.hotelbeds.com/)
- [Beneš & Michl](http://www.benes-michl.cz)
- [Manchester International Festival](http://mif.co.uk/)
- [Shopify Polaris](https://polaris.shopify.com)
- [Taylor / Thomas](https://www.taylorthomas.co.uk/)
- [GOV.UK Design System](https://design-system.service.gov.uk/)
- You? [Open an issue](https://github.com/sass-mq/sass-mq/issues/new?title=My%20company%20uses%20Sass%20MQ&body=Hi,%20we%27re%20using%20Sass%20MQ%20at%20[name%20of%20your%20company]%20and%20we%27d%20like%20to%20be%20mentionned%20in%20the%20README%20of%20the%20project.%20Cheers!)

---

Looking for a more advanced sass-mq, with support for height and other niceties?  
Give [@mcaskill's fork of sass-mq](https://github.com/mcaskill/sass-mq) a try.
