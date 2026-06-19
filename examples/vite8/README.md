# Sass MQ + Vite 8

A runnable proof that `sass-mq` resolves under [Vite 8](https://vite.dev), fixing
[issue #179](https://github.com/sass-mq/sass-mq/issues/179).

## What it proves

Vite 7 and earlier fell back to a package's `main` field when resolving a Sass
`@use` of a bare specifier. Vite 8 removed that fallback, so a package must expose
a `package.json` `exports` field with a `sass` condition. `sass-mq` now ships one,
so `@use 'sass-mq'` resolves again.

[`src/styles.scss`](src/styles.scss) imports sass-mq by its package name and emits
a media query:

```scss
@use 'sass-mq' as mq;

.box {
  background: red;

  @include mq.mq($from: tablet) {
    background: green;
  }
}
```

## Run it

```bash
npm install   # installs Vite 8, Sass, and the local sass-mq (via file:../..)
npm run verify
```

`npm run verify` builds the project with Vite 8 and asserts that the compiled CSS
contains the tablet breakpoint media query (`46.25em`). It exits non-zero if
sass-mq fails to resolve or compile, so it doubles as a regression test (it runs
in CI).

> **Note:** this example deliberately floats its `vite` and `sass` versions (`^8`
> and `^1`) and does not commit a lockfile, so CI always exercises sass-mq against
> the latest Vite 8 patch. That is intentional — the goal is to catch a future
> Vite regression early, not to pin a reproducible build.

You can also explore it interactively:

```bash
npm run dev      # start the Vite dev server
npm run build    # production build into dist/
```

## How it resolves the local package

`package.json` depends on sass-mq via `file:../..`, linking the package at the
repository root. Vite resolves `@use 'sass-mq'` through that package's
`package.json` `exports`, exactly as a published consumer would. A relative path
or a Vite alias would bypass the manifest and prove nothing.
