# Media Queries with superpowers [![Build Status](https://api.travis-ci.org/sass-mq/sass-mq.svg?branch=master)](https://travis-ci.org/sass-mq/sass-mq)

![ ](https://avatars3.githubusercontent.com/u/9341289?v=3&s=300)

----

`mq()` is a [Sass](http://sass-lang.com/ "Sass - Syntactically Awesome
Stylesheets") mixin that helps you compose media queries in an elegant
way.

- compiles keywords and `px`/`em` values to `em`-based queries ([a good thing](http://css-tricks.com/zooming-squishes))
- provides fallbacks for older browsers (see [Mobile-first Responsive Web Design and IE8](http://www.theguardian.com/info/developer-blog/2013/oct/14/mobile-first-responsive-ie8) on the Guardian's developer blog).

Here is a very basic example:

```scss
$mq-breakpoints: (
    mobile:  320px,
    tablet:  740px,
    desktop: 980px,
    wide:    1300px
);

@import 'mq';

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

----


## How to use it

Immediately play with it on [SassMeister](http://sassmeister.com/): `@import 'mq';`.

OR:

1. Install with [Bower](http://bower.io/ "Bower: A package manager for the web"): `bower install sass-mq --save`

    OR Install with [npm](https://www.npmjs.com/): `npm install sass-mq --save` _it supports [eyeglass](https://github.com/sass-eyeglass/eyeglass)_

    OR [Download _mq.scss](https://raw.github.com/sass-mq/sass-mq/master/_mq.scss) to your Sass project.

2. Import the partial in your Sass files and override default settings
   with your own preferences before the file is imported:
    ```scss
    // To enable support for browsers that do not support @media queries,
    // (IE <= 8, Firefox <= 3, Opera <= 9) set $mq-responsive to false
    // Create a separate stylesheet served exclusively to these browsers,
    // meaning @media queries will be rasterized, relying on the cascade itself
    $mq-responsive: true;

    // Name your breakpoints in a way that creates a ubiquitous language
    // across team members. It will improve communication between
    // stakeholders, designers, developers, and testers.
    $mq-breakpoints: (
        mobile:  320px,
        tablet:  740px,
        desktop: 980px,
        wide:    1300px,

        // Tweakpoints
        desktopAd: 810px,
        mobileLandscape: 480px
    );

    // Define the breakpoint from the $mq-breakpoints list that should
    // be used as the target width when outputting a static stylesheet
    // (i.e. when $mq-responsive is set to 'false').
    $mq-static-breakpoint: desktop;

    // If you want to display the currently active breakpoint in the top
    // right corner of your site during development, add the breakpoints
    // to this list, ordered by width, e.g. (mobile, tablet, desktop).
    $mq-show-breakpoints: (mobile, mobileLandscape, tablet, desktop, wide);

    @import 'path/to/mq';
    // With eyeglass:
    // @import 'sass-mq';
    ```
3. Play around with `mq()` (see below)

### Responsive mode ON (default)

`mq()` takes up to three optional parameters:

- `$from`: _inclusive_ `min-width` boundary
- `$until`: _exclusive_ `max-width` boundary
- `$and`: additional custom directives

Note that `$until` as a keyword is a hard limit i.e. it's breakpoint - 1.

```scss
.responsive {
    // Apply styling to mobile and upwards
    @include mq($from: mobile) {
        color: red;
    }
    // Apply styling up to devices smaller than tablets (exclude tablets)
    @include mq($until: tablet) {
        color: blue;
    }
    // Same thing, in landscape orientation
    @include mq($until: tablet, $and: '(orientation: landscape)') {
        color: hotpink;
    }
    // Apply styling to tablets up to desktop (exclude desktop)
    @include mq(tablet, desktop) {
        color: green;
    }
}
```

### Responsive mode OFF

To enable support for browsers that do not support `@media` queries,
(IE <= 8, Firefox <= 3, Opera <= 9) set `$mq-responsive: false`.

Tip: create a separate stylesheet served exclusively to these browsers,
for example with conditional comments.

When `@media` queries are rasterized, browsers rely on the cascade
itself. Learn more about this technique on [Jake’s blog](http://jakearchibald.github.io/sass-ie/ "IE-friendly mobile-first CSS with Sass 3.2").

To avoid rasterizing styles intended for displays larger than what those
older browsers typically run on, set `$mq-static-breakpoint` to match
a breakpoint from the `$mq-breakpoints` list. The default is
`desktop`.

The static output will only include `@media` queries that start at or
span this breakpoint and which have no custom `$and` directives:

```scss
$mq-responsive:        false;
$mq-static-breakpoint: desktop;

.static {
    // Queries that span or start at desktop are compiled:
    @include mq($from: mobile) {
        color: lawngreen;
    }
    @include mq(tablet, wide) {
        color: seagreen;
    }
    @include mq($from: desktop) {
        color: forestgreen;
    }

    // But these queries won’t be compiled:
    @include mq($until: tablet) {
        color: indianred;
    }
    @include mq($until: tablet, $and: '(orientation: landscape)') {
        color: crimson;
    }
    @include mq(mobile, desktop) {
        color: firebrick;
    }
}
```

### Verbose and shortand notations

Sometimes you’ll want to be extra verbose (e.g. if you’re developing a
library based on top of sass-mq), however for readability in a codebase,
the shorthand notation is recommended.

All of these examples output the exact same thing, and are here for
reference so you can use the notation that best matches your needs:

```scss
// Verbose
@include mq(
    $from: false,
    $until: desktop,
    $and: false,
    $media-type: $mq-media-type // defaults to 'all'
) {
    .foo {}
}

// Omitting argument names
@include mq(
    false,
    desktop,
    false,
    $mq-media-type
) {
    .foo {}
}

// Omitting tailing arguments
@include mq(false, desktop) {
    .foo {}
}

// Recommended
@include mq($until: desktop) {
    .foo {}
}
```

[See the detailed API documentation](http://sass-mq.github.io/sass-mq/#undefined-mixin-mq)

### Adding custom breakpoints

```scss
@include mq-add-breakpoint(tvscreen, 1920px);

.hide-on-tv {
    @include mq(tvscreen) {
        display: none;
    }
}
```

### Seeing the currently active breakpoint

While developing, it can be nice to always know which breakpoint is
active. To achieve this, set the `$mq-show-breakpoints` variable to
be a list of the breakpoints you want to debug, ordered by width.
The name of the active breakpoint and its pixel and em values will
then be shown in the top right corner of the viewport.

![$mq-show-breakpoints](https://raw.githubusercontent.com/sass-mq/sass-mq/master/show-breakpoints.gif)

### Changing media type

If you want to specify a media type, for example to output styles
for screens only, set `$mq-media-type`:

#### SCSS

```scss
$mq-media-type: screen;

.screen-only-element {
    @include mq(mobile) {
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
- You? [Open an issue](https://github.com/sass-mq/sass-mq/issues/new?title=My%20company%20uses%20Sass%20MQ&body=Hi,%20we%27re%20using%20Sass%20MQ%20at%20[name%20of%20your%20company]%20and%20we%27d%20like%20to%20be%20mentionned%20in%20the%20README%20of%20the%20project.%20Cheers!)

----

Looking for a more advanced sass-mq, with support for height and other niceties?  
Give [@mcaskill's fork of sass-mq](https://github.com/mcaskill/sass-mq) a try.
