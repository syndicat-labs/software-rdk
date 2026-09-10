# Toolkit Presentation — Hybrid Bento + Deck Plan

Branch: `feat/toolkit-presentation` (from `main@4f3adcf`)
Status: approved 2026-09-10

## Objective

Make the post-login toolkit feel like a product, not a component gallery:
**Deck skeleton (Linear/Vercel keyboard-first lists) + Bento hero (Apple/Notion
editorial composition) + Craft gallery truth (shadcn Blocks install/fork
lifecycle)**. Language-aware across all 7 registered design languages, token-pure
(90-token contract), keyboard-first.

## Decisions (locked)

1. Hybrid Deck + Bento + Craft approach.
2. Toolkit content: **Components/Blocks primary**; templates/starters flows secondary.
3. Bento hero above the fold on Home.
4. `Cmd+K` palette mixes navigation + actions + recents + Create recipes.
5. Both empty (first-run) and populated (returning) Home states matter.
6. Polish `/showcase` presentation in the same pass.

## Phases

- **A — Shell correction (prereq):** single h1, token-pure shell/header, palette trigger.
- **B — Deck IA + palette:** Home → Library (Blocks) → Starters → Tokens/Settings;
  Cmd+K index (navigation, actions, recents, Create). Recents persisted via
  non-sensitive localStorage (same pattern as `rdk_dashboard_layout_v1`).
- **C — Bento editorial hero:** 2x2 hero + 1x1 satellites, language-aware
  composition; empty state = Ferrous abstract + one primary action + palette hint;
  populated = live thumbnails with seeded real metrics.
- **D — Showcase polish:** Library/Blocks taxonomy by outcome, preview → code →
  install/fork lifecycle, kill kpi-card nth-child coupling and dead rules.
- **E — Density & polish:** grid gap, label tracking, status strip dedupe,
  skeletons, prefers-reduced-motion.

## Gates per phase

`typecheck` · `lint` · `lint:rules` (theme contract + contrast + no-localstorage-auth)
`jest --runInBand` · `build:prod` · `check-no-secrets.sh` · screenshots per language.

## File map

- `src/app/layout/app-shell/app-shell.component.ts` — single h1 / breadcrumb
- `src/app/layout/header/header.component.ts` — token paint, Cmd+K trigger, user meta
- `src/app/layout/sidebar/sidebar.component.ts` — Home entry + palette hint
- `src/app/features/dashboard/dashboard.component.ts` — Bento hero, empty/populated
- `src/app/shared/components/organisms/dashboard-grid/*` — spacing, colSpan 4
- `src/app/shared/components/atoms/kpi-card/*` — data-chromatic-key, label demote
- `src/app/core/command-palette/*` — new service + component (Cmd+K)
- `src/app/features/showcase/*` — Library/Blocks reframe, install/fork lifecycle

## Risk register

- Gap fatigue (4/7 languages default-dashed): Bento Home is the post-login default;
  KPI grid becomes a section, not first impression.
- Bento responsive cost: cap to Home hero.
- Shell raw-value misses: grep `#[0-9a-f]{3,6}|rgba\(|1\.5rem` + contract check.
- Palette scale: recents-first ranking, fuzzy on title+tags.