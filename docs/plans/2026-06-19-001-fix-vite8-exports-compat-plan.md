---
title: "fix: Vite 8 compatibility via package.json exports + Vite 8 proof harness"
type: fix
date: 2026-06-19
status: in-progress
origin: GitHub issue #179 (https://github.com/sass-mq/sass-mq/issues/179)
plan_depth: standard
---

# fix: Vite 8 compatibility via `package.json` `exports`

## Summary

Vite 8 removed the long-standing heuristic of falling back to a package's `main`
field when resolving a Sass `@use`/`@import` of a bare specifier. `sass-mq` v7
ships only `"main": "_mq.scss"` and no `exports` field, so under Vite 8
`@use 'sass-mq'` fails with `Can't find stylesheet to import`. The fix is to add
an `exports` field exposing `_mq.scss` under the canonical `sass` condition. A
new `examples/vite8/` subdirectory proves the fix by building a real Vite 8
project that resolves `@use 'sass-mq'` — failing before the fix, passing after.

This plan documents an approach that has already been **reproduced and validated**
end-to-end (see Verification): the build fails on the unfixed package and succeeds
once `exports` is present.

---

## Problem Frame

- **Symptom:** Consumers on Vite 8 can no longer import `sass-mq`; `@use 'sass-mq'`
  errors at build time with `[sass] Can't find stylesheet to import`.
- **Root cause:** Vite 8 (Rolldown/Oxc-based) dropped the `main`-field fallback in
  its resolver. Sass entry points are now expected to be declared via the
  `exports` field's `sass` condition. `sass-mq`'s `package.json` has no `exports`,
  so resolution of the bare specifier fails.
- **Upstream context:** vitejs/vite#22433 reports this exact failure for `sass-mq`.
  Vite's v7→v8 migration guide documents the `main`-field fallback removal.
- **Scope reality vs. issue text:** The issue suggests exporting both
  `dist/_mq.scss` and `dist/_mq.import.scss`. Neither path applies to this repo:
  `_mq.scss` lives at the package root (there is no `dist/`), and v7.0.0 dropped
  `@import` support, so there is no `_mq.import.scss`. Only the root `.` export is
  needed.

---

## Requirements

- **R1.** `@use 'sass-mq'` resolves under Vite 8 (8.0.16) with a stock config.
- **R2.** The fix does not break the documented usage `@use 'sass-mq'`. (Adding
  `exports` makes a package encapsulated; undocumented deep imports such as
  `@use 'sass-mq/_mq.scss'` are intentionally not carried forward — see KTD1.)
- **R3.** A committed, runnable subdirectory proves the fix works with Vite 8, and
  can be re-run to demonstrate both the failure (pre-fix) and the pass (post-fix).
- **R4.** The proof is automated (asserts the compiled CSS, not just a non-crash)
  and runs in CI on a Vite 8-compatible Node version.
- **R5.** No regression to the existing Sass unit-test suite (`npm test`) or the
  `build:examples` script.

---

## Key Technical Decisions

### KTD1 — Use the `sass` condition in `exports`

Both Vite 8's CSS resolver and the dart-sass `pkg:` importer check conditions in
the order `sass` → `style` → `default`. `sass` is the canonical, recommended
condition for Sass entry points (Sass "Announcing pkg: importers"). The condition
value is a literal file path loaded as-is, so `"./_mq.scss"` (leading underscore
and `.scss` extension) is correct — no file rename needed.

Final `exports` shape (minimal by intent):

```json
"exports": {
  ".": {
    "sass": "./_mq.scss",
    "default": "./_mq.scss"
  }
}
```

- `"."` → fixes `@use 'sass-mq'` (R1). `default` keeps the standalone dart-sass
  `pkg:` importer working outside Vite.

**Subpath exports deliberately omitted.** An earlier draft added `"./*": "./*"`
and `"./package.json": "./package.json"`. Neither is needed:
- Tools (Vite, webpack) read a dependency's `package.json` off disk, not through
  the exports resolver, so `"./package.json"` exposes nothing anyone uses.
- `"./*"` only preserves the *undocumented* deep import `@use 'sass-mq/_mq.scss'`.
  Every documented usage imports the package root (`@use 'sass-mq'`), which the
  `.` entry covers. We keep the surface minimal (R2 is satisfied for documented
  usage); if a deep-import need ever surfaces, a narrow `"./_mq.scss"` entry is
  preferable to a broad wildcard.

A top-level `"sass": "_mq.scss"` fallback is added alongside the kept `"main"`
field for older tooling that reads those directly.

### KTD2 — Proof goes through real node_modules resolution, not a Vite alias

The bug lives entirely in how Vite resolves the bare specifier via `package.json`.
The proof installs `sass-mq` as a `file:../..` dependency so Vite's resolver reads
the real manifest exactly as a published consumer would. A relative `@use` or a
Vite `alias` would bypass the manifest and prove nothing.

### KTD3 — Assert on the breakpoint value, not the exact media-query syntax

Vite 8 minifies `(min-width: 46.25em)` into the modern range syntax
`(width>=46.25em)`. The proof asserts the compiled CSS contains the breakpoint
value `46.25em` (sass-mq converting `tablet: 740px` → `740/16 = 46.25em`), which
survives minifier changes and still proves the module loaded and computed output.

### KTD4 — Keep the proof out of the Node 18 CI matrix

Vite 8 requires Node `^20.19.0 || >=22.12.0`. The existing test matrix includes
Node 18.x. The proof therefore runs in a separate CI job pinned to the current
LTS (Node 24, which also matches the maintainer's local Node) rather than being
folded into the Node 18 matrix.

### KTD5 — Exclude the Vite-only proof from `build:examples`

`build:examples` compiles `examples/**` with the plain `sass` CLI, which cannot
resolve the bare `@use 'sass-mq'` used by the proof. Scope the script to the three
existing demo dirs (`basic`, `advanced`, `custom`) so the proof does not break it
(R5).

---

## Implementation Units

### U1. Add `exports` field to `package.json`

- **Goal:** Make Vite 8 resolve `@use 'sass-mq'` (R1, R2).
- **Files:** `package.json`
- **Approach:** Insert the `exports` map from KTD1 plus a top-level `"sass": "_mq.scss"`
  fallback. Keep `"main"`. Do not remove the pre-existing (unrelated) phantom
  `files: ["sass/index.scss"]` entry in this PR — see Scope Boundaries.
- **Test scenarios:** Covered by U3's automated proof (build succeeds, CSS asserts).
  `Test expectation: config change verified via U3 integration proof.`
- **Verification:** `node -e` prints the parsed `exports`; U3 build passes.
- **Status:** Applied and validated.

### U2. Create the Vite 8 proof harness

- **Goal:** A real, minimal Vite 8 app that imports sass-mq by bare name (R3).
- **Files:** `examples/vite8/package.json`, `examples/vite8/index.html`,
  `examples/vite8/vite.config.js`, `examples/vite8/src/main.js`,
  `examples/vite8/src/styles.scss`
- **Approach:** `styles.scss` does `@use 'sass-mq' as mq;` and emits a
  `mq.mq($from: tablet)` rule; `main.js` imports the stylesheet; `package.json`
  depends on `sass-mq` via `file:../..` and devDepends on `vite@^8` + `sass`.
- **Patterns to follow:** Mirrors `examples/basic/basic.scss` usage, but imports by
  package name instead of relative path.
- **Test scenarios:** `Test expectation: none — scaffolding exercised by U3.`
- **Status:** Created and validated.

### U3. Add automated verification + ignore build artifacts

- **Goal:** Turn the harness into a pass/fail proof (R4).
- **Files:** `examples/vite8/verify.mjs`, `examples/vite8/.gitignore`,
  `examples/vite8/package.json` (add `verify` script)
- **Approach:** `verify.mjs` runs the Vite build, reads the emitted CSS from
  `dist/assets/*.css`, and exits non-zero unless it contains `@media` and
  `46.25em` (KTD3), printing the compiled CSS on failure. `.gitignore` excludes
  `node_modules/` and `dist/`.
- **Test scenarios:**
  - Happy path: with the U1 fix, `npm run verify` builds and the assertion passes.
  - Failure path (manual/documented): reverting U1 makes the build fail with
    `Can't find stylesheet to import`, which `verify.mjs` surfaces as a non-zero exit.
- **Verification:** `cd examples/vite8 && npm install && npm run verify` exits 0.

### U4. Scope `build:examples` to the three demo directories

- **Goal:** Prevent the plain-`sass` example build from choking on the proof (R5, KTD5).
- **Files:** `package.json`
- **Approach:** Replace `sass ./examples:./examples` with explicit
  `basic`/`advanced`/`custom` input:output pairs.
- **Test scenarios:** `npm run build:examples` compiles the three demos and exits 0.
- **Status:** Applied.

### U5. Documentation

- **Goal:** Tell users sass-mq works with Vite 8 and how to run the proof.
- **Files:** `examples/vite8/README.md`, `README.md` (root, add a short
  "Using with Vite" note), `CHANGELOG.md` (Unreleased entry)
- **Approach:** The example README explains what the proof demonstrates and how to
  run it. The CHANGELOG records the Vite 8 fix under an Unreleased heading.
- **Test scenarios:** `Test expectation: none — docs only.`

### U6. CI job for the Vite 8 proof

- **Goal:** Durable, automated proof on every PR (R4, KTD4).
- **Files:** `.github/workflows/node.js.yml`
- **Approach:** Add a separate `vite8` job pinned to Node 24 (current LTS) that
  installs the proof's deps and runs `npm run verify`. Leave the existing Node
  18/20/22 unit-test matrix untouched.
- **Test scenarios:** `Test expectation: validated by CI run on the PR.`
- **Dependencies:** U1, U2, U3.

---

## Scope Boundaries

### In scope
- `exports` field for Vite 8 resolution; backward-compatible subpaths.
- Vite 8 proof subdirectory with automated verification and CI.
- Minimal docs (example README, root note, CHANGELOG).

### Deferred to Follow-Up Work
- **Fix the phantom `files: ["sass/index.scss"]` entry.** `package.json` lists a
  non-existent `sass/index.scss` in `files`. It is unrelated to Vite 8 resolution
  and harmless (npm warns but still publishes the real files). Tracking separately
  keeps this PR focused on the compatibility fix.
- **Version bump / release.** Adding `exports` warrants a release (a minor or
  patch); cutting the release is a separate maintainer action.

### Out of scope
- Re-introducing `@import` / `_mq.import.scss` support (intentionally dropped in v7).

---

## Risks & Mitigation

- **Encapsulation breakage (R2):** Adding `exports` blocks unlisted subpaths.
  Accepted: the `"./*"` wildcard was deliberately omitted (KTD1). The documented
  `@use 'sass-mq'` import is unaffected; undocumented deep imports such as
  `@use 'sass-mq/_mq.scss'` are intentionally not preserved.
- **Node 18 CI failure:** Vite 8 needs Node ≥20.19. Mitigated by KTD4 (separate job).
- **Assertion brittleness:** Minifier rewrote the media query. Mitigated by KTD3
  (assert the breakpoint value).

---

## Verification (already performed)

Environment: Vite 8.0.16, sass 1.101.0, Node 24, `node_modules/sass-mq` symlinked
to the repo root.

- **Reproduction (pre-fix):** `npm run build` in `examples/vite8/` failed with
  `[sass] Can't find stylesheet to import` on `@use 'sass-mq'`.
- **Post-fix:** `npm run build` succeeded and emitted
  `.box{background:red}@media (width>=46.25em){.box{background:green}}`; the
  assertion for `46.25em` passed.

---

## Sources & Research

- GitHub issue #179 (this repo) and vitejs/vite#22433 (upstream report).
- Vite docs — Shared Options (`resolve.conditions`: `sass`/`style`), v7→v8 Migration
  (`main`-field fallback removal), Vite 8 announcement (Node 20.19+/22.12+, Rolldown/Oxc).
- Sass docs — `@use` Node package importer (`sass`/`style`/`default` order),
  "Announcing pkg: Importers", `NodePackageImporter` JS API.
