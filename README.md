# Media Queries, with Style

`mq()` is a [Sass](http://sass-lang.com/ "Sass - Syntactically Awesome 
Stylesheets") mixin that helps manipulating media queries in an elegant
way.

Media queries are compiled in `em` units but as developers and designers we 
often think in pixels, so the `mq()` mixins accepts both.

## How to Use It

1. Install with [Bower](http://bower.io/ "BOWER: A package manager for the 
web"): `bower install sass-mq`  
   OR [Download _mq.scss](https://raw.github.com/guardian/sass-mq/master/_mq.scss)
   to your Sass project.
2. Import the partial in your Sass files: `@import 'path/to/mq';`
3. Override default settings with your own before the file is imported:

```scss
// To enable support for browsers that do not support @media queries,
// (IE <= 8, Firefox <= 3, Opera <= 9) set $responsive to false
// Create a separate stylesheet served exclusively to these browsers,
// meaning @media queries will be rasterized, relying on the cascade itself
$responsive: true;

// Name your breakpoints in a way that creates a ubiquitous language
// across team members. It will improve communication between
// stakeholders, designers, developers, and testers.
$breakpoints: (
    (mobile  300px)
    (tablet  600px)
    (desktop 900px)
    (wide    1260px)

    // Tweakpoints
    (desktopAd 810px)
    (mobileLandscape 480px)
) !default;

```


### Responsive mode ON (default)

```scss
$responsive: true;
.test {
    @include mq($from: mobile) {
        color: red;
    }
    @include mq($to: tablet) {
        color: blue;
    }
    @include mq($to: tablet, $and: '(orientation: landscape)') {
        color: hotpink;
    }
    @include mq(mobile, tablet) {
        color: green;
    }
}
```

### Responsive mode OFF

```scss
$responsive: false; // Responsive mode is active by default
.test {
    @include mq($from: mobile) {
        color: red;
    }

    // Won't be compiled
    @include mq($to: tablet) {
        color: blue;
    }

    @include mq($to: tablet, $and: '(orientation: landscape)') {
        color: hotpink;
    }

    @include mq(mobile, tablet) {
        color: green;
    }
}
```

## Test

1. cd into the `test` folder
2. run `sass test.scss test.css --force`
3. there should be a couple of warnings like this one, this is normal:

        WARNING: Assuming 10 to be in pixels, attempting to convert it into pixels for you
                 on line 24 of ../_mq.scss

4. if `test.css` hasn't changed (run a `git diff` on it), tests pass

## Inspired by…

- https://github.com/alphagov/govuk_frontend_toolkit/blob/master/stylesheets/_conditionals.scss
- https://github.com/bits-sass/helpers-responsive/blob/master/_responsive.scss
- https://gist.github.com/magsout/5978325
