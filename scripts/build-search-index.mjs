// Generate the Pagefind search index for the built site and mirror it into
// public/pagefind so that `astro dev` serves a working search too.
//
// Run via `npm run build` after `astro build`.
import { spawn } from 'node:child_process';
import { access, cp, readFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = `${ROOT}dist`;
const PUBLIC_INDEX = `${ROOT}public/pagefind`;
const PAGE_PACKAGE = `${ROOT}node_modules/pagefind/package.json`;

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

/** Absolute path of the Pagefind CLI (skip `npx` so no network/npm is involved). */
async function resolvePagefindBin() {
  const { bin } = JSON.parse(await readFile(PAGE_PACKAGE, 'utf8'));
  const rel = typeof bin === 'string' ? bin : bin?.pagefind;
  if (!rel) throw new Error('The installed `pagefind` package exposes no CLI binary.');
  const binPath = fileURLToPath(new URL(rel, `file://${PAGE_PACKAGE.replace(/\\/g, '/')}`));
  if (!(await exists(binPath))) throw new Error(`Pagefind CLI not found at ${binPath}`);
  return binPath;
}

async function buildIndex() {
  if (!(await exists(DIST))) throw new Error('dist/ is missing - run this after `astro build`.');

  const bin = await resolvePagefindBin();
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [bin, '--site', DIST], { stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', resolve);
  });
  if (exitCode !== 0) throw new Error(`pagefind exited with code ${exitCode}`);

  const built = `${DIST}/pagefind`;
  if (!(await exists(built))) throw new Error('pagefind produced no dist/pagefind output.');
  return built;
}

const built = await buildIndex();
await rm(PUBLIC_INDEX, { recursive: true, force: true });
await cp(built, PUBLIC_INDEX, { recursive: true });
console.log('\n[search] Pagefind index written to dist/pagefind and mirrored to public/pagefind.');