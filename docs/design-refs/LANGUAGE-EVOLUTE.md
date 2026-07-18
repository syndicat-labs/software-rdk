# theEvolute — Design Language Declaration

**Language ID:** `evolute` · **Private namespace:** `--evo-*`
**Protocol:** Design Language Protocol v1.0.0 (`/home/cain/Claude files/design-language-protocol.md`)
**Status:** registered · Tier A passing · **not yet visually reviewed**

---

## 1. Philosophy

### Thesis

> **Light and colour are how meaning arrives. Structure should feel grown, not carved.**

Obsidian treats colour as a liability to be contained and hierarchy as something solved by removal.
theEvolute takes the opposite position: colour and luminance are the fastest-read channels the human
visual system has, and refusing to use them does not produce clarity — it produces uniformity, which
the eye must then parse linearly. A well-chosen hue reaches the reader before a type weight does.

The name is the argument. Evolution is additive and adaptive: forms accumulate, differentiate, and
specialise. Nothing in this language is anchored to a single immovable focal point.

### Optimises for

**Time-to-comprehension on unfamiliar screens.** When a user meets a view for the first time, colour
and elevation should partition it before any reading begins. theEvolute accepts more visual variety
than Obsidian in exchange for faster first-pass parsing.

### Refuses

The negative space is the identity. theEvolute will not:

1. **Use colour without a redundant cue.** Every colour-carried meaning also carries a shape, icon,
   label or weight. Colour leads; it never travels alone. *(Bounded by protocol §3.5 — but this
   language would hold it regardless: colour that cannot survive a greyscale print is decoration.)*
2. **Manufacture importance with a single anchor.** No "one dark card" device. If a view has three
   things that matter, it shows three.
3. **Use gradient as filler.** Gradient encodes depth or progression. A gradient that means nothing
   is banned as firmly as Obsidian bans decorative colour.
4. **Invert surfaces to create rhythm.** Inversion is reserved for genuine mode changes. Section
   separation is done with elevation.
5. **Compress space to fit more in.** Density is never bought with legibility.

### Named patterns

| Pattern | Job | Rule |
|---|---|---|
| **Lift Ladder** | Convey grouping and priority through stacked elevation, not borders or inversion | Max three elevation steps in one view; a step must mean a rank change, never decoration |
| **Chromatic Key** | Assign a hue to a recurring domain entity (account, environment, status family) so it is recognised pre-attentively | A hue, once assigned, is never reused for another entity in the same product |
| **Gradient as Vector** | Use direction of a gradient to encode progression — time, completion, flow | Static gradients are permitted only on featured surfaces; elsewhere direction must mean something |
| **Redundant Signal** | Every colour-carried meaning is paired with a non-colour cue | Test by greyscale: if meaning is lost, the pattern is broken |
| **Warm Ground** | Neutrals are warm, so chromatic accents read as intentional rather than accidental | Never a cool grey ground under a warm accent |

---

## 2. Slot answers (all 18) with rationale

Per protocol §5, `slotRationale` must show each answer following from the thesis. Answers that do
not follow make this a palette, not a paradigm.

### A · Surface & depth

| Slot | Answer | Follows from thesis because |
|---|---|---|
| `surfaceBoundary` | `elevation` | Structure "grown, not carved" — a lifted plane reads as an object; a stroke reads as a cut |
| `depthModel` | `shadow` | Shadow is the physical correlate of lift; the Lift Ladder needs a continuous, not stepped, signal |
| `darkStrategy` | `separate-palette` | Warm Ground must stay warm in dark; tint-inversion cools neutrals and breaks the accent relationship |

### B · Shape

| Slot | Answer | Rationale |
|---|---|---|
| `cornerPhilosophy` | `scaled-by-role` | Radius grows with surface rank, reinforcing the Lift Ladder. Not `expressive-mixed` — mixed radii would compete with elevation as a rank signal |
| `shapeCarriesBrand` | `no` | Colour and light carry identity here. Shape doing so too would double-encode and dilute both |

### C · Colour

| Slot | Answer | Rationale |
|---|---|---|
| `colorRole` | `expressive` | Direct restatement of the thesis |
| `functionalColorContainment` | `surface-permitted` | Chromatic Key needs domain hue on the surface itself; badge-only confinement would defeat pre-attentive recognition |
| `colorInHierarchy` | `primary` | Colour is a first-class hierarchy channel, not a garnish |
| `polarityEncoding` | `color-led` | Fastest read for +/-. **Valid only with Redundant Signal** — sign and weight always accompany hue |

### D · Typography

| Slot | Answer | Rationale |
|---|---|---|
| `typeRoleAssignment` | display: Inter · heading: Inter · body: Inter · data: JetBrains Mono | One humanist family across prose roles: type is *not* a differentiating channel here, so it stays quiet and lets colour and lift carry rank |
| `monospaceScope` | `data-and-code` | Mono marks machine-authored content generally, not only identifiers |

### E · Space

| Slot | Answer | Rationale |
|---|---|---|
| `density` | `comfortable` | Elevation needs shadow room to read; high density collapses the Lift Ladder into flatness |
| `spaceAllocation` | `even-rhythm` | Predictable rhythm lets colour and elevation carry the variance. Two competing variance channels produce noise |
| `sectionRhythm` | `elevation` | Refusal #4 — inversion reserved for mode changes |

### F · Motion

| Slot | Answer | Rationale |
|---|---|---|
| `motion` | 180–320 ms · `cubic-bezier(0.22, 1, 0.36, 1)` · expressive in onboarding, empty-state, transitions, hover | Decelerating curve reads as settling into place, matching "grown". Longer than Obsidian because elevation changes need travel to be legible. Hover included: the Lift Ladder must respond to pointer, or elevation looks painted on |

### G · Ornament & emphasis

| Slot | Answer | Rationale |
|---|---|---|
| `decoration` | `gradient-and-illustration` | Gradient as Vector is a named pattern, so gradient must be permitted — constrained by its rule, not by prohibition |
| `emphasisSurfaceBudget` | `unbounded` | Refusal #2 — a fixed budget forces false single-focus on views that genuinely have several priorities |
| `hierarchySignals` | colour · elevation · size · weight · position | Ordered by read speed under this thesis, inverting Obsidian's ordering |

---

## 3. Accessibility position (protocol §3.5)

theEvolute makes colour load-bearing, so the floor constrains it more than a monochrome language.
Non-negotiable obligations that follow:

- **Redundant Signal is mandatory, not stylistic.** `colorInHierarchy: primary` and
  `polarityEncoding: color-led` are permitted *only* because every colour-carried meaning is paired
  with a non-colour cue. Remove the pairing and the language becomes non-conformant, not merely
  different. **Greyscale test is a review gate.**
- **Chromatic Key hues must clear 3:1** against their surface as graphical objects, not merely look
  distinct.
- `density: comfortable` does not relax **target size ≥24×24** — it makes it easier to satisfy.
- Elevation must never be the *sole* signal: a Lift Ladder step always coincides with a spacing or
  type change, since shadow is invisible to some low-vision users and in high-contrast modes.

---

## 4. Implementation

- Tokens: `src/styles/themes/_evolute.scss` — `--evo-*` private layer bridged onto all 84 semantic tokens
- Registry: `src/app/core/theme/design-language.ts`
- Gate: `npm run lint:rules` → `Architecture rules` CI job

## 5. Known gaps

- **Not visually reviewed.** Token- and type-correct only. No rendered surface has been examined.
- `Chromatic Key` and `Gradient as Vector` are declared but have no component implementation yet.
- Greyscale review gate is defined here but not automated (protocol Tier C).
