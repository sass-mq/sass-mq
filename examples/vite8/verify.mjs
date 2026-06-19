// Verifies that sass-mq resolves and compiles under Vite 8.
//
// Build the project. With sass-mq's `exports` field present, Vite 8 resolves
// `@use 'sass-mq'`; without it, this step fails with the issue #179 error:
// "Can't find stylesheet to import".
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve paths from this file's location so the script behaves the same wherever
// it is launched (CI runs it via `working-directory`; a developer may run it from
// the repo root).
const here = fileURLToPath(new URL('.', import.meta.url));
const assetsDir = join(here, 'dist', 'assets');

execSync('npm run build', { cwd: here, stdio: 'inherit' });

let css;
try {
  css = readdirSync(assetsDir)
    .filter((file) => file.endsWith('.css'))
    .map((file) => readFileSync(join(assetsDir, file), 'utf8'))
    .join('\n');
} catch {
  console.error(
    '\n✗ No dist/assets directory — the Vite build emitted no CSS.',
  );
  process.exit(1);
}

// Assert on the breakpoint value (tablet: 740px -> 740/16 = 46.25em), not the
// exact media-query syntax: Vite 8 minifies `(min-width: 46.25em)` into the
// modern range form `(width>=46.25em)`, so matching the value survives that.
const expected = ['@media', '46.25em'];
const missing = expected.filter((token) => !css.includes(token));

if (missing.length > 0) {
  console.error(
    `\n✗ sass-mq did not produce the expected media query. Missing: ${missing.join(', ')}`,
  );
  console.error(`Compiled CSS:\n${css || '(no CSS emitted)'}`);
  process.exit(1);
}

console.log(
  '\n✓ sass-mq resolved under Vite 8 and produced the tablet media query (46.25em).',
);
