# L2 — Product Surface · Implementation To-Do

> Derived from `IMPLEMENTATION-PLAN.md` Layer 2 (Product Surface), with decisions locked on
> 2026-08-31. Every task below is bound by the Definition of Done in `IMPLEMENTATION-PLAN.md` §2.

## Locked decisions

| # | Decision | Status |
|---|---|---|
| D1 | Include L2 in coverage — remove `!src/app/features/**`; ratify FLAG-08/P5 in ADR | pending |
| D2 | Ship `register` + `password-reset` as real surfaces (not deferred) | pending |
| D3 | Strict compliance everywhere: all pages/components/elements obey the protocol, token contract, contrast floor, namespace isolation, storage rule, WCAG floor | pending |
| D4 | Retrofit the 8 non-compliant showcase specimen pages to compliance (not retire) | pending |

## Retrofit scope (verified by grep — exact)

Exactly **8 files** in the showcase carry hardcoded values and are Obsidian-only:

- `showcase/pages/new-design-ideas/erp-dashboard/erp-dashboard.component.ts`
- `showcase/pages/new-design-ideas/erp-invoice/erp-invoice.component.ts`
- `showcase/pages/new-design-ideas/erp-orders/erp-orders.component.ts`
- `showcase/pages/new-design-ideas/frosted-glass/frosted-glass.component.ts`
- `showcase/pages/new-design-ideas/invoice-variants/invoice-variants.component.ts`
- `showcase/pages/new-design-ideas/payment-checkout/payment-checkout.component.ts`
- `showcase/pages/new-design-ideas/payment-transactions/payment-transactions.component.ts`
- `showcase/pages/new-design-ideas/pricing-section/pricing-section.component.ts`

All other 34 showcase files are already compliant (consume the library or declare protocol-safe values).

---

## T0 — Coverage groundwork

- [ ] `jest.config.ts`: remove `!src/app/features/**` from `collectCoverageFrom`
- [ ] `jest.config.ts`: add per-directory thresholds 80%:
  - `src/app/features/dashboard/`, `src/app/features/auth/`, `src/app/features/landing/`, `src/app/features/showcase/`
- [ ] ADR: ratify coverage-scope (FLAG-08/P5) — record D1 and the new feature thresholds

## T1 — L2.1 Dashboard

- [ ] `features/dashboard/dashboard.store.ts` — `RdkListStore<T>` (loading/error/items/isEmpty)
- [ ] `features/dashboard/dashboard.component.ts` — host; resolves variant by `ThemeId`; loading/empty/error via `LoadingSpinner`/`EmptyState`/`ErrorDisplay`
- [ ] `features/dashboard/variants/dashboard-obsidian|modern|evolute.component.ts`
  - Obsidian: dense KPI grid, one dark card anchor, weight-before-colour
  - Modern: conventional grid, brand-led, Soft Card elevation ramp
  - theEvolute: Lift Ladder elevation, Chromatic Key, no privileged tier
- [ ] Consume `rdk-card`, `rdk-badge`, `rdk-data-table`, `rdk-tabs`; no new markup
- [ ] Values via semantic contract tokens incl. `--elevation-*`; zero hardcoded / zero foreign L0 reads
- [ ] Jest: error paths first; 80% floor
- [ ] Playwright: navigate `/app/dashboard`, assert content; reach empty + error states
- [ ] Screenshot reviewed under all three languages
- Refs: `kpi1-3`, `kpicta1-2`, `boardroom1-2`, `layout5DESIREDESIGNLAYOUT.jpg`

## T2 — L2.2 Auth surface (D2)

- [ ] `login.component.ts` rebuild — `FormField`/`Input`/`Button`/`Alert`; `requiredTrim`/`email`/`maxLength`; `applyServerErrors` maps `AppError.fieldErrors`
- [ ] `register.component.ts` — real form via existing `AuthService.register`; `strongPassword` + `matchFields`; auto-login
- [ ] `password-reset.component.ts` — new `AuthService.requestReset()`/`resetPassword()` + config paths; endpoint contract recorded in ADR; dev-mock backed
- [ ] Routes + nav for register / password-reset / profile (profile behind `authGuard`)
- [ ] Adversarial tests: invalid creds, expired token, tampered JWT, `returnUrl` open-redirect, password mismatch
- [ ] Zero new `localStorage` growth (ratchet ≤ 6)
- Refs: `authenticator1-2`, `landingauth1-2`, `onboarding1`

## T3 — L2.3 Landing

- [ ] `landing.component.ts` — L3 composition: hero → social-proof → feature-grid → deep-dive → pricing → CTA → footer
- [ ] Per-language `sectionRhythm` (Obsidian inversion / Modern gradient anchor / theEvolute elevation)
- [ ] Reuse protocol-proven pricing trio where sensible
- [ ] Bundle budget respected (627 kB initial today); lazy chunks
- [ ] Screenshot reviewed under all three languages
- Refs: `asciilanding1`, `landingauth1-2`, `patterns1`, `pricing1-3`

## T4 — L2.4 Routes & nav cleanup

- [ ] Re-add/augment `register`, `profile`, `password-reset` routes in `app.routes.ts`
- [ ] Nav/sidebar reflects the real product surface, not the showcase

## T5 — Showcase retrofit (D4)

For each of the 8 files:
- [ ] Replace all hardcoded Hex/rgba/literal fonts with semantic contract tokens
- [ ] `npm run lint:rules` green (token contract + contrast gate)
- [ ] Design-idea → per-language variant or explicit gap (`design-idea.ts`)
- [ ] Tests + rendered review per language; `showcase/` coverage 80%

## T6 — Close-out

- [ ] Screenshots per page per language; reviewed (render-and-look rule)
- [ ] `progress.md` appended under a new dated heading with actual command output
- [ ] All eight CI gates green locally:
  lint · typecheck · lint:rules · test:ci · build:prod · audit · gitleaks · preflight toolchain

---

## Definition of Done (each layer — from `IMPLEMENTATION-PLAN.md` §2)

- Jest green; per-directory floors (incl. new `features/*`) + global floor met
- Error paths tested before happy paths
- Playwright drives the real app; adversarial cases for auth/authz/input validation
- `lint` + `typecheck` clean; `gitleaks` clean
- `lint:rules` green — token contract, contrast floor, storage rule, slot expressibility
- No raw style values; contract tokens only; never another language's private namespace
- No credential in `localStorage` grows (ratchet ≤ 6)
- Accessibility floor: contrast gate green, visible focus, target ≥24×24, reduced motion
- **Surface was rendered and looked at** — screenshot per page per language
- Every surface resolves under all three languages or declares an explicit gap
- `progress.md` appended with actual command output; new gates shown failing first
- Structural decisions recorded in ADR
