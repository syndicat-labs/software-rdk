# Obsidian Design Language

RDK's design language. Named for its core character: dark/light duality, typographic authority, architectural precision, mineral confidence. Obsidian is not a style — it is a set of constraints that produce a style.

Token namespace: `--obs-*`

---

## Philosophy

### Restraint is a law, not a taste

Restraint is not minimalism for aesthetic reasons. It is the recognition that every visual element added without purpose is noise that competes with the user's goal. Obsidian enforces restraint architecturally — through a deliberately narrow token set that makes complexity hard to add by accident, not through designer willpower alone.

The test for any element: **does this serve the user's next action, or does it serve the design?** If the latter, remove it.

### Tokens constrain — they do not enable

Average design systems use tokens to enable flexibility. Obsidian uses tokens to enforce decisions. The token set is narrow by intent. A designer who cannot find a token for what they want to express should question whether the expression belongs in Obsidian — not reach for a raw value.

Every differentiating decision in a great design system lives at the token level: a font-weight, a letter-spacing, a border-radius, a shadow depth. These propagate everywhere. No amount of component polish compensates for a token layer that tolerates noise.

### Hierarchy is solved at the structure level

Color is not used to create hierarchy. Contrast is. The dark/light card duality, the weight scale in typography, the density of space — these are structural hierarchy tools. Color appears in Obsidian only for functional signals (success, warning, danger) and as deliberate, contained illustration. Never as decoration.

If hierarchy is unclear, the answer is structural — not adding color.

### Quality is defined by outcomes, not appearances

A component is complete when it reduces friction to zero on the path to a user's goal — not when it looks polished. Beauty is instrumental: it builds trust that makes users move faster. The three-tier test, in priority order:

1. **Utility** — does it do the job?
2. **Usability** — can anyone do the job without thinking?
3. **Beauty** — does it communicate competence and confidence?

Passing tiers 2 and 3 while failing tier 1 is a failure. Tier 1 alone is not enough to ship under Obsidian.

### Behavior and style are separated at the architecture level

The component system owns the hard invisible problems: accessibility, keyboard navigation, focus management, ARIA semantics, interaction states. Style — color, spacing, typography, shadow — is owned by the Obsidian token layer. Components that hard-code style values violate this principle. Theming is a token concern, never a component concern.

---

## Named Structural Patterns

These are recurring layout decisions that have emerged from building. Using a pattern correctly requires knowing its intent — not just its appearance.

### The Dark Card Anchor

The `--obs-surface-card-dark` card is never decorative contrast. It always holds the single most decision-critical piece of information in the layout: the financial total, the featured pricing tier, the primary KPI. Its meaning is: *this is the number that matters most right now.*

Consequence: a layout should never have two dark cards competing for attention. If two pieces of information feel equally important, the structure is wrong — one must be elevated, or they belong on separate surfaces.

### Monospace as a Semantic Signal

`--obs-font-data` (JetBrains Mono) signals *machine-generated or precisely formatted data*. It is not a stylistic choice — it is a semantic one. Use it for: transaction IDs, order references, SKUs, financial amounts, card numbers, timestamps, codes. Do not use it for prose, labels, or navigation.

The signal is meaningful only if it is consistent. Monospace appearing on non-data text destroys the semantic.

### Carbon Navigation Surface

The sidebar and primary navigation use `--color-nav-bg` as their surface. In Obsidian this resolves to `#111111` — the same value as `--obs-surface-card-dark`. The distinction matters: the dark card anchor is a *content surface* for decision-critical data; the navigation surface is a *structural surface* that frames the layout.

The navigation surface carries a fine-grain carbon texture (`--color-nav-texture`) — an SVG `feTurbulence` noise pattern tiled at 200×200px with 6% opacity. The texture is barely perceptible at normal viewing distance but gives the surface mineral depth rather than flat ink. It is set to `none` in other themes and activates only when Obsidian is applied.

Text hierarchy on the navigation surface uses three levels — all neutral, no brand color:
- **Active / prominent:** `--color-nav-text-active` = `#ffffff`
- **Default:** `--color-nav-text` = `rgba(255, 255, 255, 0.55)`
- **Subtle (labels, roles, muted controls):** `--color-nav-text-subtle` = `rgba(255, 255, 255, 0.28)`

The active item indicator is a 3px vertical bar using `--color-nav-active-indicator`. In Obsidian this is `rgba(255, 255, 255, 0.6)` — a neutral white bar. In the RDK default theme it is an indigo gradient that draws from the brand palette.

### Frosted Glass Surface

The glass surface (`--obs-surface-glass`, `--obs-surface-glass-light`) is a restrained third surface type — neither the flat `#FFFFFF` light card nor the flat `#111111` dark card. It requires `backdrop-filter: blur(var(--obs-blur-glass))` and always sits above a painted layer it must blur.

Glass is permitted in three contexts only:
- **Modal overlays** — glass panel over a dimmed dark background.
- **Contextual tooltips and popovers** — floating panels over illustration or map zones.
- **CTA buttons over illustration** — a neutral glass button anchored in a dark card's illustration zone (e.g., pricing section frosted CTA).

Glass is **not** a general surface alternative. It must not compete with or blur the distinction between `--obs-surface-card-light` and `--obs-surface-card-dark`. If there is no illustration or textured background behind the element, use the flat surface instead.

On dark surfaces: `background: var(--obs-surface-glass)` + `border: 1px solid var(--obs-border-glass)`.
On light/neutral surfaces: `background: var(--obs-surface-glass-light)` + `border: 1px solid var(--obs-border-glass-light)`.

### Functional Color Containment

Color used for functional signals (success, warning, danger, info) must be **contained inside a pill badge**. It does not bleed onto surrounding surfaces, body text, or row backgrounds. The pill is the container; color lives inside it and nowhere else.

A row highlighted in red because one cell has an error is a violation. A red pill badge inside an otherwise neutral row is correct.

### Financial Polarity Without Color

In financial data, positive and negative values are expressed through **weight and opacity first**. Credits: bold, `--obs-text-primary`. Debits: regular weight, `--obs-text-muted`. Color — red for losses, green for gains — is a reinforcement inside a contained badge, never the primary signal. A colorblind user must be able to read the sign from weight alone.

---

## The Four Grey-Area Rules

These are written rules, not taste calls. Grey areas left to judgment produce inconsistency.

### 1. Motion

Motion is productive or it is absent. Two categories — no others:

- **Productive motion**: communicates state change, guides attention, or confirms an action. Duration 150–250ms. Easing: `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Expressive motion**: reserved for onboarding, empty states, and deliberate brand moments. Never inside task flows.

Test: if removing the animation leaves the user equally informed, remove it.

### 2. Density

Default density is high. Space is earned by importance, not distributed evenly. A component that needs breathing room to communicate should be interrogated — the need usually signals a hierarchy problem, not a spacing problem.

The one exception: illustrative or decorative elements (card art, empty state imagery) may use generous space because their function is to reduce cognitive load, not increase information density.

### 3. Hierarchy without color

Hierarchy is expressed through: type weight, type size, contrast (light/dark surface), spatial position, and opacity. Not color. When a designer reaches for color to establish hierarchy, it is a signal to revisit the structure.

The standard Obsidian hierarchy palette, in order:
- Primary surface: `--obs-surface-page` `#EBEBEB`
- Card light: `--obs-surface-card-light` `#FFFFFF`
- Card dark (featured): `--obs-surface-card-dark` `#111111`
- Text primary: `--obs-text-primary` `#111111`
- Text secondary: `--obs-text-secondary` `#6B6B6B`
- Text muted: `--obs-text-muted` `#AAAAAA`

### 4. Illustration and decoration

Illustration is contained, purposeful, and positioned. It appears in defined zones (lower-right quadrant of a card, empty state center). It is always clipped by its container — never breaks outside card or component boundaries. Grayscale illustration on light surfaces; vivid illustrative art on dark surfaces for maximum contrast.

Decoration that is not illustration does not exist in Obsidian.

---

## Design Token Architecture

The RDK token system is a **two-layer contract**. Every theme is an implementation of that contract. Components are written against the contract — they are fully unaware of which theme is active.

### The two layers

```
Layer 1 — Primitives       src/styles/tokens/_primitives.scss
                           :root { --color-neutral-900: #0f172a; --space-4: 1rem; ... }
                           Raw scale values. Named by position, not meaning.
                           Never referenced by components directly.

Layer 2 — Contract         src/styles/tokens/_contract.scss
                           :root { --color-text-primary: var(--color-neutral-900); ... }
                           Semantic interface. Named by role, not value.
                           Fallback values on :root are insurance — active themes override them.
                           Versioned. Adding a token here is a breaking change.

           Component tokens src/styles/tokens/_component.scss
                           :root { --card-radius: var(--radius-surface); ... }
                           Component-scoped defaults. Reference contract tokens only.

Theme implementations:
  rdk-default              src/styles/themes/_rdk-default.scss
                           [data-theme="rdk-default"] { --color-text-primary: ...; }
                           Canonical reference implementation of the contract.

  obsidian                 src/styles/themes/_obsidian.scss
                           [data-theme="obsidian"] { --color-text-primary: ...; }
                           Maps --obs-* private primitives onto contract tokens.
```

When `data-theme="<id>"` is set on any ancestor, that theme's block activates and overrides the contract fallbacks for every descendant. Swapping a theme is a single attribute change — no component code changes.

### Adding a new theme

1. Create `src/styles/themes/_<name>.scss` with `[data-theme="<name>"] { ... }`.
2. Provide a value for every token listed in `_contract.scss`. Use `validateTheme()` in dev mode to confirm.
3. Register the theme in `src/app/core/theme/token-contract.ts` → `THEME_REGISTRY`.
4. `ThemeId` is derived from the registry — it becomes a valid compile-time option automatically.

### ThemeService

`ThemeService` always sets `data-theme` on `document.documentElement`. It never removes it — removing would fall back to the unthemed `:root` contract defaults, which is an error state, not a theme. In development mode it calls `validateTheme()` on startup to log any missing contract tokens.

```typescript
// Apply globally (standard usage)
themeService.set('obsidian');
themeService.set('rdk-default');

// Scope to a single section — apply data-theme to the host element instead of <html>
```

### Token namespace rules

| Namespace | Owned by | Valid in |
|---|---|---|
| `--color-neutral-*`, `--space-*`, `--radius-*`, etc. | Primitives layer | Theme files only — never in components |
| `--color-*` (semantic), `--radius-component`, `--font-data`, etc. | Contract layer | All components and theme files |
| `--btn-*`, `--card-*`, `--input-*`, etc. | Component token layer | Components only |
| `--obs-*` | Obsidian private primitives | Obsidian theme file + showcase/prototype components only |

**`--obs-*` tokens are only defined inside `[data-theme="obsidian"]`.** Using them in layout or template components produces undefined values under any other theme. Layout components use `--color-*` contract tokens exclusively; Obsidian overrides those via its theme block.

---

## Token Reference

```css
/* Surfaces */
--obs-surface-page:         #EBEBEB;
--obs-surface-card-light:   #FFFFFF;
--obs-surface-card-dark:    #111111;

/* Text */
--obs-text-primary:         #111111;
--obs-text-secondary:       #6B6B6B;
--obs-text-muted:           #AAAAAA;
--obs-text-on-dark:         #FFFFFF;
--obs-text-on-dark-muted:   #BBBBBB;

/* Functional */
--obs-badge-surface:        #2E2E2E;
--obs-btn-neutral:          rgba(235, 235, 235, 0.55);
--obs-btn-primary:          #FFFFFF;
--obs-btn-text:             #111111;
--obs-divider:              #CCCCCC;

/* Shape */
--obs-radius-card:          16px;
--obs-radius-pill:          9999px;

/* Elevation */
--obs-shadow-card-light:    0 4px 24px rgba(0, 0, 0, 0.08);
--obs-shadow-card-dark:     0 8px 32px rgba(0, 0, 0, 0.22);

/* Typography scale */
--obs-font-display:         'Inter', sans-serif;
--obs-font-heading:         'Montserrat', sans-serif;  /* compressed headings only */
--obs-font-data:            'JetBrains Mono', monospace; /* IDs, amounts, codes, references */
--obs-size-display:         2.875rem;   /* price, hero numerals */
--obs-size-heading-lg:      3rem;       /* page section heading */
--obs-size-heading-sm:      1.125rem;   /* card plan name */
--obs-size-body:            0.875rem;
--obs-size-caption:         0.6875rem;  /* badges, annotations */
--obs-size-btn:             0.9375rem;
--obs-size-data:            0.8125rem;  /* monospace data cells */

/* Glass surfaces — backdrop-filter must have painted content behind the element */
--obs-surface-glass:        rgba(255, 255, 255, 0.10); /* glass panel on dark card surfaces */
--obs-surface-glass-light:  rgba(235, 235, 235, 0.55); /* glass panel on neutral/page surfaces */
--obs-blur-glass:           8px;                       /* standard glass blur */
--obs-blur-glass-heavy:     16px;                      /* heavy glass — modals, full overlays */
--obs-border-glass:         rgba(255, 255, 255, 0.15); /* glass border on dark surfaces */
--obs-border-glass-light:   rgba(0, 0, 0, 0.08);       /* glass border on light surfaces */

/* Motion */
--obs-duration-productive:  200ms;
--obs-duration-expressive:  350ms;
--obs-ease-standard:        cubic-bezier(0.4, 0, 0.2, 1);
```

The following are **semantic bridge tokens** — defined in `_semantic.scss` with RDK defaults and overridden by Obsidian in `_obsidian.scss`. Layout and template components reference these.

```css
/* Navigation / sidebar surface */
--color-nav-bg:                 #111111;           /* Obsidian: obs-surface-card-dark */
--color-nav-texture:            url("…svg grain…"); /* Obsidian: carbon grain; Default: none */
--color-nav-text:               rgba(255,255,255,0.55);
--color-nav-text-active:        #ffffff;
--color-nav-text-subtle:        rgba(255,255,255,0.28);
--color-nav-brand-gradient:     <solid white>;     /* Default: indigo–violet gradient */
--color-nav-active-bg:          rgba(255,255,255,0.08);
--color-nav-active-indicator:   rgba(255,255,255,0.6); /* Default: indigo gradient */
--color-nav-icon-active:        #ffffff;
--color-nav-icon-active-bg:     rgba(255,255,255,0.10);
--color-nav-icon-hover-bg:      rgba(255,255,255,0.06);
--color-nav-avatar-bg:          #2E2E2E;           /* Obsidian: obs-badge-surface */

/* Featured / hero surface (welcome banners, hero cards) */
--color-surface-featured:       #111111;           /* Obsidian: dark card; Default: indigo gradient */
--color-surface-featured-border: transparent;
--color-surface-featured-text:  #ffffff;
--color-surface-featured-muted: rgba(255,255,255,0.60);

/* Monospace data font */
--font-data:  'JetBrains Mono', monospace;
```

---

## Showcase Philosophy

The `/showcase` route is the living record of the RDK component library. It has two distinct sections with a strict quality gate between them.

### Components
Accepted, canonical RDK components. Production-ready. Sub-grouped by atomic level:
- **Atoms** — the irreducible primitives
- **Molecules** — composed from atoms, single responsibility
- **Organisms** — composed from molecules, own their layout

### New Design Ideas
Proposed additions. Built from a visual reference before consideration for acceptance. Sub-grouped by stage:
- **Prototype** — built from reference, not reviewed
- **In Review** — team evaluating
- **Accepted** — approved, pending move into Components

Every entry here links to its source reference in `docs/design-refs/`. The intent must be visible — not just the output.

---

## Workflow: Reference → Accepted Component

1. Drop reference image into `docs/design-refs/`
2. Two analyst agents run in parallel: one on structure/layout, one on visual style
3. Findings synthesized; ambiguities raised as clarifying questions before code is written
4. Component built to match reference exactly — added as **Prototype**
5. Visual tester screenshots the running app and compares against reference; discrepancies reported
6. After review and any fixes: **In Review**, then **Accepted**
7. On acceptance: component moves to the Components section; its tokens are absorbed into the Obsidian token set if they expand it cleanly

---

## Hard Rules

- **Prototype before accepting.** No component enters the accepted library without being built and visually tested against its reference.
- **No raw values in components.** Every color, spacing, radius, shadow, and duration comes from an `--obs-*` token. No exceptions.
- **No decorative color.** Color serves function or illustration. Never hierarchy, never decoration. Functional color lives inside pill badges — never on surfaces, rows, or body text.
- **Financial polarity is weight before color.** Credits bold and primary, debits muted. A colorblind user reads the sign from weight alone.
- **One dark card per layout.** Two dark cards competing is a structural error, not a style choice.
- **Monospace is semantic.** `--obs-font-data` on non-data text destroys the signal. Use it only for IDs, amounts, codes, and references.
- **No silent deprecations.** When an accepted component needs redesign, the current version stays live while the redesign lives in New Design Ideas. No regressions during review.
- **Reference traceability.** Every New Design Idea entry references its source image.
- **`--obs-*` tokens are showcase-only.** Layout and template components consume `--color-*` semantic tokens exclusively. `--obs-*` tokens are only defined inside `[data-theme="obsidian"]` — using them outside prototype/showcase components produces undefined values under any other theme.
- **Glass is not a general surface.** `backdrop-filter` glass is permitted only for modal overlays, contextual popovers, and CTA buttons over illustration zones. Always requires painted content behind it. Never used as a substitute for a flat card surface.
- **Restraint is the default.** Add nothing without a reason. Remove before you add.

---

## Reference Log

| File | Informs | Status |
|---|---|---|
| `pricing1.jpg` | Card design language, pricing layout, Obsidian token set | Prototype — built |
| `invoice-payment-cards` (research cluster) | Invoice card anatomy, payment progress, document split, status tracker patterns | Research documented — 6 variants built |
| `layout-identity-patterns` (research cluster) | 18 named design languages, auth patterns, layout systems | Research documented — DESIGN-SYSTEM-STUDIES.md |
| `sidebar1.jpg`, `sidebar2.jpg` | Navigation surface patterns, dark sidebar hierarchy | Implemented — carbon nav surface with grain texture |
| Theme bridge (architecture work) | `ThemeService`, `[data-theme]` mechanism, `--color-nav-*` / `--color-surface-featured` semantic tokens | Implemented — full RDK token gap audit completed |
