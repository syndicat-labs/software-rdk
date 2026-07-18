#!/usr/bin/env node
// Enforces the protocol's accessibility floor (machine root §3.5) as a Tier A
// gate.
//
// The floor was declared non-negotiable law and checked by nothing. A language
// could pass every other gate while shipping 2.32:1 body text — and one did,
// in the machine default, for long enough that a second language copied the
// pattern. A rule with no executable check is a suggestion.
//
// Contrast is computable from token values alone: no component metadata, no
// rendering, no DOM. There is no reason it sat outside the enforced tier.
//
// Per protocol §6, a Tier A failure means the language is rebuilt, not
// exempted — so this script has no ratchet and no allowlist by design.
//
// Usage: node scripts/check-contrast.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STYLES_DIR = join(ROOT, 'src/styles');
const THEMES_DIR = join(ROOT, 'src/styles/themes');
const CONTRACT_TS = join(ROOT, 'src/app/core/theme/token-contract.ts');

// Deliberately NOT anchored to line start: SCSS permits several declarations on
// one line, and an anchored pattern silently captures only the first. That hid
// two thirds of _evolute.scss's status ramps and made 16 pairs look
// "non-computable" when they were merely unparsed. A usage — `var(--x)` — is
// never matched because the token must be followed by a colon.
const DECLARATION = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;

// WCAG 2.2 AA. Large text (>=18.66px bold / >=24px) may use 3:1, but these are
// role tokens with no fixed size, so the stricter threshold is the safe reading.
const AA_NORMAL_TEXT = 4.5;
/** Non-text UI boundaries and graphical objects (1.4.11). */
const AA_NON_TEXT = 3.0;

let failed = false;
const failures = [];
const skipped = [];

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const read = (f) => readFileSync(f, 'utf8');

function declarationsIn(source) {
  const out = new Map();
  for (const m of source.matchAll(DECLARATION)) out.set(m[1], m[2].trim());
  return out;
}

// ─── Build a resolution map per language ────────────────────────────────────
// Globals first, then the language's own block overrides them — the same order
// the cascade applies at runtime.
const globals = new Map();
for (const file of walk(STYLES_DIR)) {
  if (file.startsWith(THEMES_DIR) || !/\.scss$/.test(file)) continue;
  for (const [k, v] of declarationsIn(read(file))) globals.set(k, v);
}

const registry = read(CONTRACT_TS);
const registryBlock = registry.match(/THEME_REGISTRY[^=]*=\s*\[([\s\S]*?)\n\]/);
if (!registryBlock) {
  console.error('✗ Could not parse THEME_REGISTRY.');
  process.exit(1);
}
const themeIds = Array.from(registryBlock[1].matchAll(/id:\s*'([^']+)'/g), (m) => m[1]);

/** Resolve a token through var() chains to a concrete value. */
function resolve(map, token, seen = new Set()) {
  if (seen.has(token)) return null; // cycle guard
  seen.add(token);
  const raw = map.get(token);
  if (!raw) return null;
  const varMatch = raw.match(/^var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([^)]+))?\)$/);
  if (varMatch) {
    const resolved = resolve(map, varMatch[1], seen);
    return resolved ?? (varMatch[2]?.trim() || null);
  }
  return raw;
}

// ─── Colour parsing ─────────────────────────────────────────────────────────
function parseColor(value) {
  if (!value) return null;
  const v = value.trim();
  // Gradients and images carry no single colour; alpha compositing over an
  // unknown backdrop is not decidable here. Reported as skipped, not passed.
  if (/gradient|url\(|none|transparent/i.test(v)) return null;

  let m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  m = v.match(/^#([0-9a-f]{3})$/i);
  if (m) {
    const [r, g, b] = m[1].split('');
    return [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)];
  }
  m = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (m) {
    // Alpha is ignored: a translucent colour's effective contrast depends on
    // its backdrop, so treating it as opaque is the optimistic reading. If it
    // fails even optimistically, it certainly fails composited.
    return [Number(m[1]), Number(m[2]), Number(m[3])];
  }
  return null;
}

const channel = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const luminance = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const contrast = (a, b) => {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

// ─── What gets checked ──────────────────────────────────────────────────────
// --color-text-disabled is deliberately absent: WCAG 1.4.3 exempts inactive
// components, and requiring 4.5:1 would make "disabled" indistinguishable from
// enabled, which is a usability regression dressed as compliance.
const TEXT_TOKENS = [
  '--color-text-primary',
  '--color-text-secondary',
  '--color-text-muted',
  '--color-text-brand',
  '--color-text-danger',
  '--color-text-success',
  '--color-text-warning',
  '--color-text-info',
];
const SURFACES = ['--color-bg-surface', '--color-bg-base', '--color-bg-elevated'];

const STATUS_PAIRS = [
  ['--color-status-success-text', '--color-status-success-bg'],
  ['--color-status-warning-text', '--color-status-warning-bg'],
  ['--color-status-danger-text', '--color-status-danger-bg'],
  ['--color-status-info-text', '--color-status-info-bg'],
];

const INVERSE_PAIRS = [['--color-text-inverse', '--color-bg-brand']];

/** Non-text: focus ring must be distinguishable from what it sits against. */
const NON_TEXT_PAIRS = [['--color-focus-ring', '--color-bg-surface']];

function check(language, fgToken, bgToken, threshold, kind) {
  const map = language.map;
  const fg = parseColor(resolve(map, fgToken));
  const bg = parseColor(resolve(map, bgToken));
  if (!fg || !bg) {
    skipped.push(`${language.id}  ${fgToken} on ${bgToken} (non-computable value)`);
    return;
  }
  const ratio = contrast(fg, bg);
  if (ratio < threshold) {
    failed = true;
    failures.push({
      id: language.id,
      fgToken,
      bgToken,
      ratio: ratio.toFixed(2),
      threshold,
      kind,
    });
  }
}

for (const id of themeIds) {
  const file = join(THEMES_DIR, `_${id}.scss`);
  let source;
  try {
    source = read(file);
  } catch {
    continue; // registry coherence is check-theme-contract.mjs's job
  }
  const map = new Map(globals);
  for (const [k, v] of declarationsIn(source)) map.set(k, v);
  const language = { id, map };

  for (const text of TEXT_TOKENS) {
    for (const surface of SURFACES) {
      check(language, text, surface, AA_NORMAL_TEXT, 'text');
    }
  }
  for (const [fg, bg] of STATUS_PAIRS) check(language, fg, bg, AA_NORMAL_TEXT, 'text');
  for (const [fg, bg] of INVERSE_PAIRS) check(language, fg, bg, AA_NORMAL_TEXT, 'text');
  for (const [fg, bg] of NON_TEXT_PAIRS) check(language, fg, bg, AA_NON_TEXT, 'non-text');
}

// ─── Report ─────────────────────────────────────────────────────────────────
if (skipped.length) {
  console.warn(`⚠ ${skipped.length} pair(s) not computable (gradients / images):`);
  for (const s of skipped) console.warn(`    ${s}`);
  console.warn('  These require visual review — the gate cannot decide them.\n');
}

if (failed) {
  console.error(`✗ ${failures.length} contrast failure(s) against WCAG 2.2 AA:\n`);
  for (const f of failures) {
    console.error(
      `    ${f.id.padEnd(12)} ${f.fgToken} on ${f.bgToken}\n` +
        `    ${''.padEnd(12)}   ${f.ratio}:1  (needs ${f.threshold}:1, ${f.kind})`,
    );
  }
  console.error(
    '\n  The accessibility floor is law, not a language position (protocol §3.5).\n' +
      '  A Tier A failure means the language is rebuilt — there is no ratchet here.',
  );
  process.exit(1);
}

console.log(
  `✓ Contrast floor holds across ${themeIds.length} language(s): ` +
    `${themeIds.join(', ')} — all checked pairs meet WCAG 2.2 AA.`,
);
