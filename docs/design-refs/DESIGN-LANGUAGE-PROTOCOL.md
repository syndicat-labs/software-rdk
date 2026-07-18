# Design Language Protocol

**Protocol version:** 1.0.0
**Status:** Proposed — first implementation is `theEvolute`
**Supersedes:** the two-layer description in `DESIGN-SYSTEM.md` § *Design Token Architecture*
(that section describes the token half of this protocol and remains accurate; this document is the
general form it is a case of)

---

## 1. Why this exists

The RDK ships a **token contract**: 84 semantic CSS custom properties every theme must implement.
That contract governs *values*. It does not govern *rules*.

Obsidian's most characteristic decisions are not values:

- hierarchy is carried by weight, size, surface contrast, position and opacity — **never colour**
- exactly **one** dark card anchors a layout; two competing is a structural error
- monospace is **semantic** — IDs, amounts, codes, timestamps only; never prose
- functional colour is contained **inside pill badges**; never on surfaces or body text
- density is **high**; space is earned by importance
- motion is **productive or absent**; 150–250 ms; none inside task flows

None of these are expressible as a CSS custom property, so all of them live as prose — in
`DESIGN-SYSTEM.md` and in `CLAUDE.md` under *Core UI Principles (non-negotiable)*.

**That prose is written as if it were universal, but it is Obsidian's position.** A different design
language may legitimately hold that colour *does* carry hierarchy, that density should be generous,
or that expressive motion belongs in the product. Under the current architecture such a language
cannot be described, because its rules would contradict documentation that presents itself as
system law.

The protocol separates **the system** from **the opinions of one language implemented in it**.

### What this is not

This is not a second token layer, and it does not change what components read. Components continue
to reference contract tokens only. The protocol adds a *declaration* each language makes about how
its tokens are meant to be used, so that intent becomes reviewable and, where possible, enforceable.

---

## 2. Layers

```
L0  Primitives      per-language, private        --obs-*, --evo-*
                    Raw scale values. Named by position, not role.
                    Valid only inside that language's own block.

L1  Contract        shared, versioned            --color-*, --space-*, --radius-*, --font-*
                    Semantic token interface. Named by role, not value.
                    Every language must supply every token. Components read
                    ONLY this layer. Adding a required token is a breaking
                    change to the contract version.

L2  Policy          per-language, declarative    DesignLanguagePolicy (TypeScript)
                    Machine-readable rules the language commits to.
                    Governs how L1 tokens may be composed. NEW in this protocol.

L3  Composition     shared vocabulary            page + section archetypes
                    Named structural patterns languages may express differently
                    but all must be able to express.
```

A **design language** is a complete implementation of L0 + L1 + L2. A **theme** is its L1 output —
the `[data-theme="<id>"]` block. The terms are not synonyms: a theme is what a design language
compiles to.

---

## 3. L2 — the policy schema

Nine dimensions. Every registered language declares a value for each; there is no default, because
a default would smuggle one language's opinion back into the system.

| # | Dimension | Question it answers |
|---|---|---|
| 1 | `hierarchySignals` | Which channels may express hierarchy? |
| 2 | `colorRole` | What is colour permitted to do? |
| 3 | `functionalColorContainment` | Where may semantic colour appear? |
| 4 | `emphasisSurfaceBudget` | How many high-emphasis surfaces per view? |
| 5 | `monospaceScope` | What is monospace allowed to mark? |
| 6 | `density` | How is space allocated? |
| 7 | `motion` | When may things move, and for how long? |
| 8 | `decoration` | What non-informational visuals are permitted? |
| 9 | `polarityEncoding` | How is +/- (credit/debit, gain/loss) encoded? |

Each is a closed union, not free text — a policy that cannot be compared across languages is
documentation, not protocol.

### Worked contrast

The protocol is only meaningful if two languages can disagree on every axis. They do:

| Dimension | `obsidian` | `theEvolute` |
|---|---|---|
| `hierarchySignals` | weight · size · surface-contrast · position · opacity | weight · size · **colour** · elevation · position |
| `colorRole` | `functional-only` | `expressive` |
| `functionalColorContainment` | `badge-only` | `surface-permitted` |
| `emphasisSurfaceBudget` | `1` (the dark card anchor) | `unbounded` |
| `monospaceScope` | `data-only` | `data-and-code` |
| `density` | `high` | `comfortable` |
| `motion.expressiveAllowedIn` | onboarding · empty-state | onboarding · empty-state · **transitions** · **hover** |
| `decoration` | `illustration-contained` | `gradient-and-illustration` |
| `polarityEncoding` | `weight-before-colour` | `colour-led` |

Both are valid. Neither is the system's opinion. That is the point.

---

## 4. L3 — composition vocabulary

Page-level structure recurs across products regardless of design language. Studying live public
sites (PostHog, Polar, and the wider `tailwindcss.com/showcase` gallery) yields a consistent
archetype set, and — notably — a consistent *rhythm device*: **surface inversion** used to separate
sections. Obsidian's "dark card anchor" is a constrained case of that general device.

**Section archetypes** — `nav · hero · social-proof · feature-grid · feature-deep-dive ·
demo-surface · metrics-band · use-case · testimonial · pricing-table · faq · cta-band · footer`

**Page archetypes** — `marketing-landing · pricing · docs · dashboard · list-detail · form-flow ·
auth · empty-state · error`

A design language does not choose *whether* it can express these; it chooses *how*. The protocol
requires each language to declare its `sectionRhythm` — the device it uses to separate sections
(`surface-inversion`, `border-rule`, `spacing-only`, `elevation`) — so that page composition stays
coherent when a language is swapped.

---

## 5. Enforceability

A rule with no executable check is a suggestion. Policy dimensions fall into three tiers:

**Tier A — statically enforceable now.** `scripts/check-theme-contract.mjs` is extended to verify
every registered language declares a complete, well-typed policy and a full L1 contract. Missing
or malformed policy is a build failure, exactly as a missing token is.

**Tier B — enforceable with component metadata.** `monospaceScope` and
`functionalColorContainment` become checkable once components declare their semantic role. Deferred
until the component library is annotated; recorded here so the path is known.

**Tier C — review-only.** `emphasisSurfaceBudget` and `density` depend on rendered composition and
cannot be settled statically. They remain review criteria, but they are now *written down per
language* rather than assumed, which is the difference between a convention and a rule.

Honest statement of scope: this protocol makes design-language intent **explicit and typed**. It
makes one tier of it **enforced**. It does not make design correctness automatic, and claiming
otherwise would repeat the mistake catalogued in `progress.md` — a gate that was believed to be
doing work it was not.

---

## 6. Adding a design language

1. Create `src/styles/themes/_<id>.scss` with an L0 private namespace (`--<prefix>-*`) and a
   `[data-theme="<id>"]` block bridging L0 onto every L1 contract token. (The directory is named
   `themes/` for continuity — a theme is a design language's L1 output, per §2.)
2. Add a `DesignLanguage` entry to `src/app/core/theme/design-language.ts` declaring the full L2
   policy and `sectionRhythm`.
3. Run `npm run lint:rules`. Missing tokens or an incomplete policy fail the `architecture` CI gate.
4. `ThemeId` is derived from the registry, so the new id becomes a compile-time option
   automatically and unknown ids remain a compile error.

No component changes. Swapping a language stays a single `data-theme` attribute change.

---

## 7. Migration position

`theEvolute` is authored **protocol-native** and is the first proof that the protocol can express a
language whose opinions differ from Obsidian's on every axis.

`obsidian` and `rdk-default` are retrofitted **after** theEvolute demonstrates the protocol holds —
deliberately, so the protocol is validated against a language that did not shape it. Retrofitting
first would let Obsidian's assumptions leak back in unexamined, which is the failure this protocol
exists to correct.

Until retrofit completes, `DESIGN-SYSTEM.md` remains authoritative for Obsidian, and the prose rules
in `CLAUDE.md` continue to describe Obsidian specifically. On completion those rules should be
re-scoped from "Core UI Principles (non-negotiable)" to "Obsidian's declared policy", with the
non-negotiable set reduced to what is genuinely language-independent (token discipline, no raw CSS
values, behaviour/style separation, accessibility).

---

## 8. References

- `DESIGN-SYSTEM.md` — Obsidian design language (token half of this protocol)
- `src/styles/tokens/_contract.scss` — L1 contract, versioned
- `src/app/core/theme/design-language.ts` — L2 policy types and registry
- `scripts/check-theme-contract.mjs` — L1 + L2 enforcement
- Composition study source: <https://tailwindcss.com/showcase> (public rendered sites)
- Excluded sources and reasoning: `THIRD-PARTY-NOTICES.md`
