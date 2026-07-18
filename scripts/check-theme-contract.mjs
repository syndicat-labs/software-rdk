#!/usr/bin/env node
// Static enforcement of the two-layer token contract.
//
// ThemeService.validateTheme() cannot do this job. It reads getComputedStyle,
// which resolves a theme's missing token straight through to the :root fallback
// in _contract.scss — so a theme implementing nothing would still validate
// clean. It also only inspects the *active* theme, so a theme nobody switches
// to in development ships broken.
//
// Four rules, checked statically across every theme at once:
//
//   A. _contract.scss and CONTRACT_TOKENS declare the same set. A token in one
//      but not the other is a silent hole in the runtime validation.
//   B. Every token a component reads is declared in a global layer
//      (styles/tokens/**), so it resolves under *every* theme. A token declared
//      only inside one [data-theme] block is undefined under all the others.
//   C. Layout/shared components must not read theme-private --obs-* tokens.
//      The showcase is exempt: it pins [data-theme="obsidian"] on its own host,
//      which is the documented home for prototype/Obsidian-only work.
//   D. Every registered theme has a file with a matching [data-theme] block.
//
// Usage: node scripts/check-theme-contract.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTRACT_SCSS = join(ROOT, 'src/styles/tokens/_contract.scss');
const CONTRACT_TS = join(ROOT, 'src/app/core/theme/token-contract.ts');
const STYLES_DIR = join(ROOT, 'src/styles');
const THEMES_DIR = join(ROOT, 'src/styles/themes');
const APP_DIR = join(ROOT, 'src/app');

/** A custom-property *declaration* (`--name:`), not a usage (`var(--name)`). */
const DECLARATION = /^\s*(--[a-z0-9-]+)\s*:/gim;
const USAGE = /var\(\s*(--[a-z0-9-]+)/g;
const THEME_PRIVATE_PREFIX = '--obs-';
const COMPONENT_EXTENSIONS = /\.(ts|scss|html)$/;

// Rule C exemption. The showcase host sets [data-theme="obsidian"], so --obs-*
// always resolves there. Everything else must go through the contract.
const PRIVATE_TOKEN_ALLOWED = /^src[/\\]app[/\\]features[/\\]showcase[/\\]/;

// Ratcheted rule-C deviations. This list may only ever shrink.
//
// theme-toggle gates its --obs-* reads behind
// `[class.theme-toggle--active]="themeService.current() === 'obsidian'"`, so
// they do resolve today. The deviation is architectural rather than visual: a
// shared atom carries a hardcoded theme id, so registering a third theme means
// editing this component — which breaks "swapping a theme is a single
// data-theme change, no component code changes".
//
// Clearing it requires new --color-surface-inverse* contract tokens, which is a
// versioned contract change every registered theme must satisfy first. Tracked
// as FLAG-12; do not resolve by widening this list.
const RULE_C_RATCHET = new Set([
  'src/app/shared/components/atoms/theme-toggle/theme-toggle.component.ts',
]);

let failed = false;

function fail(message, items = []) {
  failed = true;
  console.error(`✗ ${message}`);
  for (const item of items) console.error(`    ${item}`);
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const read = (file) => readFileSync(file, 'utf8');
const declarationsIn = (source) => new Set(Array.from(source.matchAll(DECLARATION), (m) => m[1]));

// ─── Load the SCSS contract ─────────────────────────────────────────────────
const contractTokens = declarationsIn(read(CONTRACT_SCSS));
if (contractTokens.size === 0) {
  fail(`No tokens found in ${relative(ROOT, CONTRACT_SCSS)}. Has the format changed?`);
  process.exit(1);
}

// ─── Load the TypeScript registry ───────────────────────────────────────────
const contractTs = read(CONTRACT_TS);

// Terminator is just `\n]` — both arrays close with `as const`, one of them
// with a further `satisfies` clause, and no element line starts with `]`.
const tokensBlock = contractTs.match(/CONTRACT_TOKENS[^=]*=\s*\[([\s\S]*?)\n\]/);
const registryBlock = contractTs.match(/THEME_REGISTRY[^=]*=\s*\[([\s\S]*?)\n\]/);
if (!tokensBlock || !registryBlock) {
  fail(`Could not parse CONTRACT_TOKENS / THEME_REGISTRY from ${relative(ROOT, CONTRACT_TS)}.`);
  process.exit(1);
}

const registeredTokens = new Set(
  Array.from(tokensBlock[1].matchAll(/'(--[a-z0-9-]+)'/g), (m) => m[1]),
);
const themeIds = Array.from(registryBlock[1].matchAll(/id:\s*'([^']+)'/g), (m) => m[1]);

if (themeIds.length === 0) {
  fail('THEME_REGISTRY is empty. At least one theme must implement the contract.');
  process.exit(1);
}

// ─── Rule A: contract SCSS ↔ TypeScript registry ────────────────────────────
const unregistered = [...contractTokens].filter((t) => !registeredTokens.has(t)).sort();
if (unregistered.length) {
  fail(
    `${unregistered.length} token(s) in _contract.scss are absent from CONTRACT_TOKENS, ` +
      `so dev-mode validation never checks them:`,
    unregistered,
  );
}

const orphaned = [...registeredTokens].filter((t) => !contractTokens.has(t)).sort();
if (orphaned.length) {
  fail(
    `${orphaned.length} token(s) in CONTRACT_TOKENS are not declared in _contract.scss:`,
    orphaned,
  );
}

// ─── Rule D: every registered theme exists and declares its block ───────────
const themeDeclarations = new Map();
for (const id of themeIds) {
  const file = join(THEMES_DIR, `_${id}.scss`);
  let source;
  try {
    source = read(file);
  } catch {
    fail(`Theme "${id}" is registered but ${relative(ROOT, file)} does not exist.`);
    continue;
  }
  if (!source.includes(`[data-theme="${id}"]`)) {
    fail(`Theme "${id}" does not declare a [data-theme="${id}"] block.`);
    continue;
  }
  themeDeclarations.set(id, declarationsIn(source));
}

// Deliberately NOT checked: "every theme restates every contract token".
// _contract.scss declares the full contract on :root, so a theme that omits a
// token inherits the fallback and still resolves. Requiring each theme to
// restate all of them flags correct, by-design cascade — obsidian legitimately
// overrides 42 fewer tokens than it inherits.

// ─── Rules B & C: what components actually read ─────────────────────────────
// "Global" means any declaration outside a [data-theme] block: the token layers
// and styles.scss both qualify (styles.scss holds the legacy --font-family /
// --display-font defaults). Theme files are excluded — their declarations are
// conditional on the active theme, which is the whole point of rule B.
const globalTokens = new Set();
for (const file of walk(STYLES_DIR)) {
  if (file.startsWith(THEMES_DIR)) continue;
  if (!/\.scss$/.test(file)) continue;
  for (const token of declarationsIn(read(file))) globalTokens.add(token);
}

const usages = new Map(); // token -> Set<file>
for (const file of walk(APP_DIR)) {
  if (!COMPONENT_EXTENSIONS.test(file)) continue;
  for (const match of read(file).matchAll(USAGE)) {
    const token = match[1];
    if (!usages.has(token)) usages.set(token, new Set());
    usages.get(token).add(relative(ROOT, file));
  }
}

const privateLeaks = [];
const ratchetedLeaks = [];
const themeOnly = [];
const seenRatchetFiles = new Set();
for (const [token, files] of usages) {
  if (token.startsWith(THEME_PRIVATE_PREFIX)) {
    const candidates = [...files].filter((f) => !PRIVATE_TOKEN_ALLOWED.test(f));
    const offenders = candidates.filter((f) => !RULE_C_RATCHET.has(f));
    for (const f of candidates.filter((f) => RULE_C_RATCHET.has(f))) {
      seenRatchetFiles.add(f);
      ratchetedLeaks.push(`${token}  ←  ${f}`);
    }
    if (offenders.length) privateLeaks.push(`${token}  ←  ${offenders.join(', ')}`);
    continue;
  }
  if (globalTokens.has(token)) continue;

  const declaringThemes = [...themeDeclarations]
    .filter(([, declared]) => declared.has(token))
    .map(([id]) => id);
  const where =
    declaringThemes.length > 0
      ? `declared only under [data-theme="${declaringThemes.join('", "')}"]`
      : 'declared nowhere';
  themeOnly.push(`${token}  (${where}; read by ${files.size} file(s))`);
}

if (ratchetedLeaks.length) {
  console.warn(
    `⚠ ${ratchetedLeaks.length} ratcheted rule-C deviation(s) in ${seenRatchetFiles.size} file(s) ` +
      `(FLAG-12, resolves with the --color-surface-inverse* contract change):`,
  );
  for (const leak of ratchetedLeaks.sort()) console.warn(`    ${leak}`);
  console.warn('');
}

// A ratchet entry with nothing left to excuse means the file was migrated; the
// entry must go, or the gate quietly permits a future regression in that file.
const staleRatchet = [...RULE_C_RATCHET].filter((f) => !seenRatchetFiles.has(f));
if (staleRatchet.length) {
  fail('Rule-C ratchet is stale — these files no longer read theme-private tokens:', staleRatchet);
  console.error('    Remove them from RULE_C_RATCHET so the gate cannot loosen silently.');
}

if (privateLeaks.length) {
  fail(
    `${privateLeaks.length} non-showcase component(s) read a theme-private ` +
      `${THEME_PRIVATE_PREFIX}* token. These are undefined under any other theme:`,
    privateLeaks.sort(),
  );
}

if (themeOnly.length) {
  fail(
    `${themeOnly.length} token(s) are read by components but not declared in a global layer. ` +
      `They resolve to nothing under any theme that omits them:`,
    themeOnly.sort(),
  );
}

if (failed) {
  console.error('\nToken contract check failed.');
  process.exit(1);
}

console.log(
  `✓ Token contract holds: ${contractTokens.size} contract tokens, ` +
    `${themeIds.length} theme(s) (${themeIds.join(', ')}), ` +
    `${usages.size} tokens read by components — all resolvable.`,
);
