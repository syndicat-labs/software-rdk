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
const LANGUAGE_TS = join(ROOT, 'src/app/core/theme/design-language.ts');
const STYLES_DIR = join(ROOT, 'src/styles');
const THEMES_DIR = join(ROOT, 'src/styles/themes');
const APP_DIR = join(ROOT, 'src/app');

/** A custom-property *declaration* (`--name:`), not a usage (`var(--name)`). */
// Not anchored to line start: SCSS permits several declarations on one line and
// an anchored pattern captures only the first, which silently under-reported
// namespace isolation. A usage — `var(--x)` — is never matched because the
// token must be followed by a colon.
const DECLARATION = /(--[a-z0-9-]+)\s*:/gi;
const USAGE = /var\(\s*(--[a-z0-9-]+)/g;
const THEME_PRIVATE_PREFIX = '--obs-';
const COMPONENT_EXTENSIONS = /\.(ts|scss|html)$/;

// Rule C exemption. The showcase host sets [data-theme="obsidian"], so --obs-*
// always resolves there. Everything else must go through the contract.
const PRIVATE_TOKEN_ALLOWED = /^src[/\\]app[/\\]features[/\\]showcase[/\\]/;

// Ratcheted rule-C deviations. This list may only ever shrink, and a stale
// entry is itself a failure so the gate cannot quietly loosen.
//
// Empty as of FLAG-12's resolution: theme-toggle was the only entry. It read
// --obs-* tokens behind a hardcoded `current() === 'obsidian'` check, which
// meant a shared atom carried one language's private namespace and could not
// survive a third language. Rewriting it as a registry-driven select removed
// both the private tokens and the hardcoded id.
const RULE_C_RATCHET = new Set([]);

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
  // Both quote styles are valid CSS; accept either rather than enforcing a
  // convention this check was never meant to police.
  if (!new RegExp(`\\[data-theme=["']${id}["']\\]`).test(source)) {
    fail(`Theme "${id}" does not declare a [data-theme] block.`);
    continue;
  }
  themeDeclarations.set(id, declarationsIn(source));
}

// "Global" means any declaration outside a [data-theme] block — the primitive,
// contract and component token layers plus styles.scss (which holds the legacy
// --font-family / --display-font defaults). Theme files are excluded: their
// declarations are conditional on the active language, which is the point of
// rule B. Overriding a global token is exactly what theming is, so this set is
// also what a language is permitted to declare (rule E).
const globalTokens = new Set();
for (const file of walk(STYLES_DIR)) {
  if (file.startsWith(THEMES_DIR)) continue;
  if (!/\.scss$/.test(file)) continue;
  for (const token of declarationsIn(read(file))) globalTokens.add(token);
}

// ─── Rule E: design-language declaration (protocol §6, tier A) ──────────────
// A policy layer that is not validated is prose with extra syntax. Every
// declared language must name a registered theme, declare its private token
// prefix, and answer every policy dimension — a missing dimension would let one
// language's assumptions become an implicit default, which is precisely what
// the protocol exists to prevent.
// The 18 agnostic slots. Closed set — adding one is a protocol MAJOR bump and
// every registered language must re-answer before it ships.
const REQUIRED_SLOTS = [
  'surfaceBoundary',
  'depthModel',
  'darkStrategy',
  'cornerPhilosophy',
  'shapeCarriesBrand',
  'colorRole',
  'functionalColorContainment',
  'colorInHierarchy',
  'polarityEncoding',
  'typeRoleAssignment',
  'monospaceScope',
  'density',
  'spaceAllocation',
  'sectionRhythm',
  'motion',
  'decoration',
  'emphasisSurfaceBudget',
  'hierarchySignals',
];

// Machine root defines the shape of a philosophy, never its content. `refuses`
// and `slotRationale` are what make a language a paradigm rather than a palette.
const REQUIRED_PHILOSOPHY_FIELDS = [
  'thesis',
  'optimizesFor',
  'refuses',
  'namedPatterns',
  'slotRationale',
];

const EXPECTED_SLOT_COUNT = 18;

const languageTs = read(LANGUAGE_TS);
const languagesBlock = languageTs.match(/DESIGN_LANGUAGES[^=]*=\s*\[([\s\S]*?)\n\]/);
if (!languagesBlock) {
  fail(`Could not parse DESIGN_LANGUAGES from ${relative(ROOT, LANGUAGE_TS)}.`);
  process.exit(1);
}

// Split on top-level entry boundaries (`  {` at two-space indent).
const languageEntries = languagesBlock[1]
  .split(/\n(?=\s{2}\{)/)
  .map((chunk) => chunk.trim())
  .filter(Boolean);

const declaredLanguages = new Map(); // id -> { prefix }
for (const entry of languageEntries) {
  const id = entry.match(/id:\s*'([^']+)'/)?.[1];
  if (!id) {
    fail('A DESIGN_LANGUAGES entry has no id.');
    continue;
  }
  const prefix = entry.match(/privateTokenPrefix:\s*'([^']+)'/)?.[1];
  if (!prefix) {
    fail(`Language "${id}" does not declare a privateTokenPrefix.`);
    continue;
  }
  if (!/contractVersion:\s*'[^']+'/.test(entry)) {
    fail(`Language "${id}" does not declare a contractVersion.`);
  }
  if (!/protocolVersion:\s*/.test(entry)) {
    fail(`Language "${id}" does not declare a protocolVersion.`);
  }

  const missingSlots = REQUIRED_SLOTS.filter((k) => !new RegExp(`\\b${k}\\s*:`).test(entry));
  if (missingSlots.length) {
    fail(
      `Language "${id}" leaves ${missingSlots.length} of ${EXPECTED_SLOT_COUNT} slot(s) unanswered. ` +
        `Silence is not an answer — an unanswered slot becomes an implicit default:`,
      missingSlots,
    );
  }

  const missingPhilosophy = REQUIRED_PHILOSOPHY_FIELDS.filter(
    (k) => !new RegExp(`\\b${k}\\s*:`).test(entry),
  );
  if (missingPhilosophy.length) {
    fail(
      `Language "${id}" has an incomplete philosophy. Without these it is a palette, ` +
        `not a paradigm:`,
      missingPhilosophy,
    );
  }
  if (!themeIds.includes(id)) {
    fail(`Language "${id}" declares a policy but is not registered in THEME_REGISTRY.`);
  }
  declaredLanguages.set(id, { prefix });
}

// The language's own theme block must actually use the prefix it claims, and
// must not declare another language's private namespace.
for (const [id, { prefix }] of declaredLanguages) {
  const declared = themeDeclarations.get(id);
  if (!declared) continue;
  const own = [...declared].filter((t) => t.startsWith(prefix));
  if (own.length === 0) {
    fail(`Language "${id}" declares privateTokenPrefix "${prefix}" but its theme declares none.`);
  }
  // Closed rule rather than a cross-language comparison: a language may declare
  // its OWN L0 private tokens, or override any token declared in a global layer
  // (contract, component or legacy). It may not declare anything else — notably
  // another language's private namespace.
  //
  // Comparing only against other *declared* languages would be inert while just
  // one language has a declaration, silently passing a foreign namespace until a
  // second was retrofitted. The three-tier architecture is law, so component
  // tokens must be permitted here: restricting to contract tokens alone wrongly
  // rejected 9 legitimate --card-*/--toggle-*/--check-* overrides.
  const foreign = [...declared].filter((t) => !t.startsWith(prefix) && !globalTokens.has(t));
  if (foreign.length) {
    fail(
      `Language "${id}" declares ${foreign.length} token(s) that are neither globally declared ` +
        `nor its own "${prefix}" namespace:`,
      foreign.sort(),
    );
  }
}

// ─── Rule F: slot answers must be expressible (protocol §6, tier A) ─────────
// Rule E proves a language ANSWERED every slot. It does not prove the answer
// can be delivered. theEvolute declared `surfaceBoundary: elevation` and
// `depthModel: shadow` against a contract carrying no elevation token: it
// passed every gate and rendered flat, its private --evo-elevation-* tokens
// bridging onto nothing. Answering a slot the contract cannot express is a
// declaration the language cannot honour.
//
// Each entry maps a slot answer to the tokens that must carry it, and requires
// the language to give them a meaningful (non-`none`) value.
const SLOT_REQUIREMENTS = [
  {
    slot: 'surfaceBoundary',
    answer: 'elevation',
    tokens: ['--elevation-raised'],
    because: 'surfaces separated by lift need a shadow to lift with',
  },
  {
    slot: 'surfaceBoundary',
    answer: 'border',
    tokens: ['--color-border-default'],
    because: 'surfaces separated by stroke need a border colour',
  },
  {
    slot: 'depthModel',
    answer: 'shadow',
    tokens: ['--elevation-raised', '--elevation-float'],
    because: 'a shadow depth model needs more than one step to be a model',
  },
  {
    slot: 'depthModel',
    answer: 'surface-tint',
    tokens: ['--color-bg-elevated'],
    because: 'tint-based depth is carried by the elevated surface colour',
  },
  {
    slot: 'sectionRhythm',
    answer: 'elevation',
    tokens: ['--elevation-raised'],
    because: 'sections separated by lift need a shadow to lift with',
  },
  {
    slot: 'sectionRhythm',
    answer: 'surface-inversion',
    tokens: ['--color-surface-featured', '--color-surface-featured-text'],
    because: 'inversion needs an inverted surface and legible text on it',
  },
  {
    slot: 'sectionRhythm',
    answer: 'border-rule',
    tokens: ['--color-border-strong'],
    because: 'a rule between sections needs a border strong enough to read',
  },
];

// typeRoleAssignment is a map rather than a single answer, so it is checked
// separately: declaring a face for a role obliges the language to deliver that
// role through a token. theEvolute declared Inter for display/heading/body and
// rendered in the legacy Barlow defaults, because only --font-data existed —
// the same failure as the elevation gap, one slot over.
const TYPE_ROLE_TOKENS = {
  display: '--font-display',
  heading: '--font-heading',
  body: '--font-body',
  data: '--font-data',
};

/** A token that resolves to `none`/empty cannot carry the answer that needs it. */
function declaresMeaningfully(declared, source, token) {
  if (!declared.has(token)) return false;
  const value = source.match(new RegExp(`${token}\\s*:\\s*([^;]+);`))?.[1]?.trim();
  return Boolean(value) && !/^none$/i.test(value);
}

for (const [id, { prefix: _prefix }] of declaredLanguages) {
  const entry = languageEntries.find((e) => new RegExp(`id:\\s*'${id}'`).test(e));
  const declared = themeDeclarations.get(id);
  if (!entry || !declared) continue;
  const source = read(join(THEMES_DIR, `_${id}.scss`));

  for (const req of SLOT_REQUIREMENTS) {
    const answered = new RegExp(`${req.slot}:\\s*'${req.answer}'`).test(entry);
    if (!answered) continue;
    const missing = req.tokens.filter((t) => !declaresMeaningfully(declared, source, t));
    if (missing.length) {
      fail(
        `Language "${id}" answers ${req.slot}: '${req.answer}' but cannot express it — ` +
          `${req.because}. Missing or empty:`,
        missing,
      );
    }
  }

  const typeBlock = entry.match(/typeRoleAssignment:\s*\{([\s\S]*?)\}/)?.[1];
  if (typeBlock) {
    const undeliverable = Object.entries(TYPE_ROLE_TOKENS)
      .filter(([role]) => new RegExp(`\\b${role}\\s*:`).test(typeBlock))
      .filter(([, token]) => !declaresMeaningfully(declared, source, token))
      .map(([role, token]) => `${role} → ${token}`);
    if (undeliverable.length) {
      fail(
        `Language "${id}" assigns type roles it cannot deliver — the role is declared ` +
          `but no token carries it, so the face falls back to the global default:`,
        undeliverable,
      );
    }
  }
}

// Themes registered but not yet migrated onto the protocol. Per protocol §7,
// obsidian and rdk-default are retrofitted only after theEvolute proves the
// protocol holds, so this is expected — but it must stay visible and shrink.
const awaitingProtocol = themeIds.filter((id) => !declaredLanguages.has(id));
if (awaitingProtocol.length) {
  console.warn(
    `⚠ ${awaitingProtocol.length} registered theme(s) have no L2 policy yet ` +
      `(protocol §7 retrofit, expected to shrink to zero):`,
  );
  for (const id of awaitingProtocol) console.warn(`    ${id}`);
  console.warn('');
}

// Deliberately NOT checked: "every theme restates every contract token".
// _contract.scss declares the full contract on :root, so a theme that omits a
// token inherits the fallback and still resolves. Requiring each theme to
// restate all of them flags correct, by-design cascade — obsidian legitimately
// overrides 42 fewer tokens than it inherits.

// ─── Rules B & C: what components actually read ─────────────────────────────

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
