# Design Language Protocol — implementation notes

> **The protocol is not defined here.** Machine root is authoritative:
> **`/home/cain/Claude files/design-language-protocol.md`**
>
> This file records only how *this repository* implements it. Where the two disagree, machine root
> wins and this file is wrong.

**Protocol version implemented:** 1.0.0 (18 slots) · **Contract version:** 1.0.0 (84 tokens)

---

## 1. Why the protocol exists (short form)

The token contract governs **values**. It does not govern **rules**. Obsidian's defining decisions —
hierarchy without colour, one dark card per layout, monospace as a semantic signal — cannot be
expressed as custom properties, so they lived as prose that read as universal law while stating one
language's position. A second language could not be described without contradicting it.

Machine law is now one sentence: *all design languages obey the established contracts to be accepted
as valid theming contracts.* It defines agnostic **slots**; languages answer them in their own
philosophies; gates enforce adherence.

---

## 2. Where things live in this repo

| Concern | Location |
|---|---|
| Slot + philosophy types, language registry | `src/app/core/theme/design-language.ts` |
| Semantic token contract (L1, 84 tokens) | `src/styles/tokens/_contract.scss` |
| Component token layer | `src/styles/tokens/_component.scss` |
| Theme registry / `ThemeId` | `src/app/core/theme/token-contract.ts` |
| Language implementations | `src/styles/themes/_<id>.scss` |
| Gate (Tier A) | `scripts/check-theme-contract.mjs` → `npm run lint:rules` |
| CI job | `Architecture rules (tokens · storage)` |

**Registered here:** `obsidian` (`--obs-*`, machine default) · `evolute` (`--evo-*`) ·
`rdk-default` (contract reference implementation, **no declaration yet**).

Full declarations: [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) (Obsidian) ·
[`LANGUAGE-EVOLUTE.md`](./LANGUAGE-EVOLUTE.md) (theEvolute).

---

## 3. What this repo's gate enforces

Tier A, per machine root §6:

- all 18 slots answered — an unanswered slot is a build failure, not a default
- philosophy complete: `thesis · optimizesFor · refuses · namedPatterns · slotRationale`
- each language names a registered theme and declares a private prefix + contract/protocol version
- a language declares **only** its own private tokens or tokens declared in a global layer
  (contract, component, primitives, legacy) — nothing else
- every semantic token a component reads resolves under every registered language
- components read no language's private layer (showcase exempt: it pins `data-theme="obsidian"`)

**Verified red** for: unanswered slot · incomplete philosophy · missing `namedPatterns` · foreign
private namespace · typo'd contract token · unregistered language · undeclared token read by a
component.

### Deliberately not enforced

- *"Every language restates every contract token."* `_contract.scss` declares the full contract on
  `:root`, so a language that omits a token inherits the fallback and still resolves. Requiring
  restatement flags correct by-design cascade — obsidian legitimately overrides 42 fewer tokens
  than it inherits.
- Tier B (`monospaceScope`, `functionalColorContainment`, `emphasisSurfaceBudget`) — needs component
  semantic-role metadata, which does not exist yet.
- Tier C (`density`, `spaceAllocation`, `slotRationale` coherence) — review-only.

---

## 4. Composition study (project research that fed machine root)

Public rendered sites from `tailwindcss.com/showcase` (PostHog, Polar) converge on one archetype
sequence — nav → hero → social-proof → feature-grid → deep-dive → demo → pricing → footer — and,
more usefully, on **surface inversion as the section rhythm device**.

That finding is why `sectionRhythm` is a slot rather than an Obsidian-specific rule: Obsidian's
"dark card anchor" is a constrained case of a general pattern, not a property unique to it.

**L3 composition vocabulary is specified in machine root but not yet built here.** No archetype
components exist.

---

## 5. Revision history

**2026-07-18 — superseded by machine root.** This document originally defined the protocol itself
with a **10-dimension** policy schema derived largely by inverting Obsidian's rules — which left the
agnostic layer secretly shaped by Obsidian, the exact failure the protocol exists to correct.

Machine root replaced it with **18 slots derived from observed variance** across Material 3, Carbon,
Polaris, Fluent, Atlassian and Radix: a dimension is a slot only where real systems demonstrably
differ; where they converge or an external standard is normative, it is law. The decisive case is
Material 3 shipping cards as `elevated | filled | outlined` — a question a system answers plurally
within itself cannot be machine law.

Also added at machine root and absent from the original: the **philosophy schema** (making a
language a paradigm rather than a palette), and the finding that the **accessibility floor bounds
the slot space** — `polarityEncoding: color-led` is permissible only where a non-colour cue
co-exists (WCAG 1.4.1).
