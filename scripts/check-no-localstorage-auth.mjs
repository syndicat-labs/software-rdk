#!/usr/bin/env node
// Enforces the machine-level [ABSOLUTE] storage rule:
//
//   "Never store sensitive data in localStorage or sessionStorage. This
//    includes authentication tokens (access, refresh, MFA), session
//    identifiers, API keys, PII... The production-grade alternative for auth
//    tokens is HttpOnly; Secure; SameSite=Strict cookies."
//
// Non-sensitive UI state (theme preference, layout toggles) is explicitly
// permitted by that rule, so the match is keyed on credential-ish words rather
// than on the storage call alone — `localStorage.setItem('rdk_theme', …)` is
// fine and must stay fine.
//
// Usage: node scripts/check-no-localstorage-auth.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ROOT = new URL('../src', import.meta.url).pathname;

// NOT \b...\b: `_` is a word character, so \bauth\b never matches inside
// `rdk_auth_token` — the single most common key shape. The boundaries below
// treat `_`, `-`, quotes and dots as separators, and an uppercase letter as a
// right boundary so camelCase (`accessToken`) is caught too. Case variants are
// spelled out rather than using the /i flag, because /i would make the
// right-hand lookahead match uppercase and defeat the camelCase case.
const FORBIDDEN_KEYS =
  /(?<![A-Za-z0-9])(?:[Tt]oken|TOKEN|[Aa]uth|AUTH|[Ss]ession|SESSION|[Jj]wt|JWT|[Aa]ccess|ACCESS|[Rr]efresh|REFRESH|[Cc]redential|[Pp]assword|PASSWORD|[Ss]ecret|SECRET)(?![a-z0-9])/;

// `sessionStorage` itself contains "session", which would match every call
// regardless of key. Strip the storage identifiers before testing the context.
const stripStorageIdentifiers = (line) => line.replace(/(?:local|session)Storage/g, '');
const PATTERNS = [
  { name: 'localStorage.setItem', re: /localStorage\.setItem\s*\(/g },
  { name: 'localStorage.getItem', re: /localStorage\.getItem\s*\(/g },
  { name: 'localStorage.removeItem', re: /localStorage\.removeItem\s*\(/g },
  { name: 'sessionStorage.setItem', re: /sessionStorage\.setItem\s*\(/g },
  { name: 'sessionStorage.getItem', re: /sessionStorage\.getItem\s*\(/g },
  { name: 'sessionStorage.removeItem', re: /sessionStorage\.removeItem\s*\(/g },
];

const ALLOWED_EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.html']);
const SKIP_DIRS = new Set(['node_modules', '.angular', 'dist']);

// Specs legitimately arrange localStorage state to drive auth tests; they are
// not production code paths and are excluded from the source scan.
const isSpec = (file) => /\.spec\.ts$/.test(file);

// Known, ratcheted violations. This list may only ever shrink — a new entry is
// a rule breach, not a configuration change. See progress.md FLAG-11 and ADR
// risk R-003 for the migration path off localStorage.
const RATCHET = new Set(['app/core/auth/token.service.ts']);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) {
      if (SKIP_DIRS.has(name)) continue;
      yield* walk(p);
    } else if (ALLOWED_EXT.has(extname(name)) && !isSpec(p)) {
      yield p;
    }
  }
}

const hits = [];

for (const file of walk(ROOT)) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  for (const { name, re } of PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      const line = text.slice(0, m.index).split('\n').length;
      const context = lines[line - 1] ?? '';
      if (!FORBIDDEN_KEYS.test(stripStorageIdentifiers(context))) continue;
      hits.push({
        file: relative(ROOT, file),
        line,
        pattern: name,
        text: context.trim().slice(0, 160),
      });
    }
  }
}

const fresh = hits.filter((h) => !RATCHET.has(h.file));
const ratcheted = hits.filter((h) => RATCHET.has(h.file));

// A ratchet entry that no longer has violations means the file was migrated —
// the entry must then be deleted so the rule cannot silently loosen again.
const stale = [...RATCHET].filter((f) => !ratcheted.some((h) => h.file === f));

if (ratcheted.length) {
  console.warn(
    `⚠ ${ratcheted.length} known [ABSOLUTE] storage violation(s) in ${RATCHET.size} ratcheted file(s):`,
  );
  for (const h of ratcheted) console.warn(`    ${h.file}:${h.line}  [${h.pattern}]  ${h.text}`);
  console.warn('  Tracked as FLAG-11 / ADR R-003. Migration target: HttpOnly cookies.\n');
}

if (stale.length) {
  console.error('✗ Ratchet list is stale — these files no longer violate the rule:');
  for (const f of stale) console.error(`    ${f}`);
  console.error('  Remove them from RATCHET so the gate cannot loosen silently.');
  process.exit(1);
}

if (fresh.length) {
  console.error(`✗ ${fresh.length} new [ABSOLUTE] storage violation(s):`);
  for (const h of fresh) console.error(`    ${h.file}:${h.line}  [${h.pattern}]  ${h.text}`);
  console.error('\n  Auth tokens must use HttpOnly; Secure; SameSite=Strict cookies.');
  process.exit(1);
}

console.log(
  `✓ No new localStorage/sessionStorage credential access` +
    (ratcheted.length ? ` (${ratcheted.length} ratcheted violation(s) outstanding).` : '.'),
);
