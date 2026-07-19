# Implementation Plan — software-rdk

> **Status:** active · **Created:** 2026-07-19 · **Supersedes:** the sequencing in
> `ArchitectureRecordDocument.md` §16 (Implementation Roadmap), which it inherits and extends.
>
> Closes audit proposal **P9** (`after-audit-proposals.md`): "no Definition of Done, no per-phase
> exit gates, no evidence trail".

---

## 0. Decisions locked

These are settled. Re-opening any of them is an ADR amendment, not a planning question.

| # | Decision | Where |
|---|---|---|
| D1 | Angular 21 + PrimeNG 21, standalone + signals, Jest + Playwright | ADR §12 |
| D2 | Design Language Protocol v1.0.0 — 18 closed slots, philosophy schema | `~/Claude files/design-language-protocol.md` |
| D3 | Token contract v1.1.0 — 90 semantic tokens, three tiers | `_contract.scss` |
| D4 | Three registered languages: Obsidian (default), theEvolute, Modern | `design-language.ts` |
| D5 | Eight independent CI gates, all required by name in branch protection | `.github/workflows/ci.yml` |
| D6 | MIT licence; Tailwind Plus permanently excluded as a source | `THIRD-PARTY-NOTICES.md` |
| D7 | A design idea carries a philosophy — never re-skinned across languages | `design-idea.ts` |

---

## 1. The goal, and why the plan changes shape now

**software-rdk is a cloneable Angular enterprise frontend template.** A team clones it and builds
features on top; auth, error taxonomy, HTTP, logging, CSP, the component library and the design
system are pre-wired so nobody re-solves them.

That goal has not changed. What has changed is where the risk sits.

Nine sessions produced a governance and design-system layer that is genuinely strong: eight
independent CI gates on a pipeline that had **never once passed**, an evidence-derived 18-slot
protocol, three protocol-native design languages, and enforcement for token contract, namespace
isolation, slot expressibility and WCAG contrast — each verified failing before being trusted.

Meanwhile **landing is 33 lines, dashboard is 23, login is 86.** Stubs. They were marked *High*
priority in the project's own notes on 2026-06-01 and are untouched 48 days later.

> **The asymmetry is the risk, not any individual open flag.** A team cloning this today gets
> excellent CI, an unusually rigorous design protocol, and no working pages. The governance layer is
> now considerably more mature than the thing it governs.

So this plan puts the **product surface** next and explicitly defers further protocol refinement.

---

## 2. Definition of Done — applies to *every* layer

A layer's gate is not green until all of these hold. These are the machine and workspace standards,
not per-layer extras.

- [ ] `npx jest --runInBand` green; per-directory coverage floors met; global floor met
- [ ] **Error paths tested before happy paths**
- [ ] Playwright E2E drives the **real app** — no mocks at integration boundaries
- [ ] **Adversarial cases** for anything touching auth, authz or input validation
- [ ] `npm run lint` + `npm run typecheck` clean; `gitleaks` clean
- [ ] `npm run lint:rules` green — token contract, contrast floor, storage rule, slot expressibility
- [ ] **No raw style values.** Contract tokens only; never another language's private namespace
- [ ] **No credential in `localStorage`** — the ratchet may only shrink, never grow
- [ ] Accessibility floor holds: contrast gate green, visible focus, target ≥24×24, reduced motion honoured
- [ ] **The surface was rendered and looked at.** Gate-green is not design-reviewed
- [ ] Every new UI surface resolves under **all three registered languages**, or declares an explicit gap
- [ ] `progress.md` appended under a new dated heading — never edited in place
- [ ] Any structurally significant decision recorded in the ADR

### The evidence rule

A layer closes with an entry in `progress.md` containing **actual command output**, not a claim that
it passed. Where a gate is new, the entry must show it **observed failing** on a deliberate
regression. This project's own history is the argument: a pipeline believed green for months was
never running, and a test passed while the UI was visibly wrong.

---

## 3. Status reconciliation — ADR §16 is stale

The ADR roadmap still shows Phases 1 and 2 unchecked. They were completed and never ticked. Honest
state:

| ADR Phase | Claimed | Actual |
|---|---|---|
| Phase 0 — Foundation | `[x]` | ✅ complete — errors, config, logging, HTTP, auth, CI |
| Phase 1 — Shared Modules | `[ ]` | ✅ **complete** — validators, utils, pipes, directives, 32 components |
| Phase 2 — Layout & Feature | `[ ]` | ⚠️ **half** — shell/sidebar/header done; the "fully-worked example feature" is the showcase, which is a component catalogue, not a worked feature |
| Phase 3 — Optional Enhancements | `[ ]` | deferred; Storybook trigger (>15 components) has fired at 32 |

**Action in L1:** tick Phases 0–1, mark Phase 2 partial with the gap named, and point §16 at this
document for sequencing.

---

## 4. The layers

### L1 — Land what is outstanding · *~1 hour*

Nothing new. Clears the desk so later layers start from a clean main.

- [ ] Open **PR #6** for the two stranded commits (Modern's declaration, per-language design ideas)
- [ ] Reconcile ADR §16 status per §3 above
- [ ] Add a gate asserting every registered design idea's `load()` resolves — a typo in an import
      path currently surfaces only when someone navigates to it
- [ ] **Security housekeeping (not repo work):** `~/Pictures/inspo/highclimaxtechgithub-recovery-codes.txt`
      holds GitHub account recovery codes in plaintext. Move to a password manager, delete the file

**Exit gate:** `main` contains all completed work; ADR status matches reality; 9 CI jobs green.
**Evidence:** PR #6 merge commit; `gh pr checks` output.

---

### L2 — Product surface · *the main body of work*

The three stub pages become real. This is the layer that closes the gap between what the RDK claims
and what it is.

Each page is built against the reference library and must express itself under **all three
languages** — not by token-swapping, but as genuine per-language variants where structure differs
(D7). Where a language has no variant, the gap state renders.

#### L2.1 — Dashboard *(first: exercises the most of the library)*

- [ ] Real dashboard: KPI row, primary chart, recent-activity table, status surface
- [ ] Consumes existing organisms — `DataTable<T>`, `Card`, `Badge`, `Tabs` — rather than new markup
- [ ] Wired to `RdkListStore<T>` signal store with loading / empty / error states
- [ ] Per-language variants: Obsidian (dark card anchor, high density), Modern (conventional KPI
      grid), theEvolute (Lift Ladder elevation, Chromatic Key per entity)
- [ ] References: `kpi1-3`, `kpicta1-2`, `boardroom1-2`, `layout5DESIREDESIGNLAYOUT.jpg`

**Exit gate:** renders under all three languages; empty and error states reachable; E2E navigates
and asserts content; screenshots reviewed.

#### L2.2 — Auth surface

- [ ] Login built properly against `AuthStore` / `authGuard`, working with `devMockAuthInterceptor`
- [ ] Field-level validation via existing validators; `AppError` mapped to form errors
- [ ] **Adversarial tests:** invalid credentials, expired token, tampered JWT, `returnUrl` open-redirect
- [ ] Registration and password-reset surfaces, or an explicit decision not to ship them
- [ ] References: `authenticator1-2`, `landingauth1-2`, `onboarding1`

**Exit gate:** full login → guard → post-login-route flow green in Playwright; adversarial cases
pass; no credential written outside `TokenService`.

#### L2.3 — Landing

- [ ] Marketing landing using the L3 composition vocabulary (hero → social-proof → feature-grid →
      deep-dive → pricing → CTA → footer)
- [ ] Per-language: the section rhythm slot does real work here — Obsidian inverts surfaces, Modern
      uses its gradient anchor, theEvolute separates by elevation
- [ ] References: `asciilanding1`, `landingauth1-2`, `patterns1`, `pricing1-3`

**Exit gate:** renders under all three languages; Lighthouse-equivalent bundle budget respected;
reviewed rendered.

#### L2.4 — Route and navigation cleanup

- [ ] Re-add `register` / `profile` / `resources` routes, or record their removal as intentional
- [ ] Nav reflects the real surface, not the showcase

**L2 exit gate:** a clone of this repo runs `npm start` and lands on a real product, not stubs.
**Evidence:** screenshots per page per language; E2E output; `progress.md` entry.

---

### L3 — Backend integration & the `[ABSOLUTE]` breach · *blocked until a backend exists*

- [ ] Real `apiBaseUrl` / `authBaseUrl` in `environment.ts`
- [ ] **FLAG-11:** migrate JWTs out of `localStorage` to `HttpOnly; Secure; SameSite=Strict` cookies
- [ ] Auth interceptor stops attaching the bearer header; `withCredentials: true`
- [ ] **Revisit the CSRF dismissal in ADR §16** — "not applicable for Bearer token auth" is valid
      only while auth is header-based. The cookie migration reopens it
- [ ] Server headers: production `connect-src`, HSTS, `X-Frame-Options`, `Permissions-Policy`
- [ ] Integration tests hit the real backend

**Exit gate:** `check-no-localstorage-auth.mjs` ratchet reaches **zero**; ADR R-003 closes with
evidence; CSRF position restated.

---

### L4 — Governance debt · *~half a day, batchable*

Closes the remaining audit proposals.

- [ ] **P6 / FLAG-07 — replace the 100% function floor.** Two concrete instances now exist in this
      repo: the floor forced ceremony tests that assert nothing, and a theme-toggle test passed
      while the UI was visibly wrong. Coverage measured execution, not verification, twice. Keep
      the branch floor — it earned its place catching a validator test that never ran its branch
- [ ] **P5 / FLAG-08** — ratify or revert the `src/app/features/**` coverage exclusion; if kept,
      state plainly that the demo layer is unmeasured
- [ ] **P7** — supply-chain job: CycloneDX SBOM artifact + licence allow-list in-repo
- [ ] **P11** — pre-commit hygiene hooks (trailing whitespace, EOF, large files, merge markers,
      private keys); every hook needs a CI counterpart, since `--no-verify` exists
- [ ] **FLAG-09** — confirm the `search` → `searched` output rename before external consumers exist
- [ ] **FLAG-10** — migrate `@primeng/themes` → `@primeuix/themes`
- [ ] **Owed outward:** report the `\b`-vs-underscore false negative in
      `check-no-localstorage-auth.mjs` to `restaurant-management-system` and `theLodge` — their
      storage gates carry it and are weaker than they appear

**Exit gate:** every audit proposal is closed or explicitly accepted with a rationale.

---

### L5 — Protocol completion · *deliberately last*

Further refinement of the layer already ahead of the product. Do **not** start before L2 closes.

- [ ] **FLAG-15 / Tier B** — component semantic-role metadata, unlocking enforcement of
      `monospaceScope`, `functionalColorContainment`, `emphasisSurfaceBudget`
- [ ] Variants for the seven Obsidian-only design ideas
- [ ] **FLAG-12 follow-up** — `--color-surface-inverse*` contract tokens if a third emphasis
      treatment is genuinely needed (contract v1.2.0, all languages re-answer)
- [ ] L3 composition archetypes as reusable components
- [ ] Greyscale review automated for languages whose colour is load-bearing
- [ ] Storybook — the ADR's >15-component trigger fired at 32

---

## 5. Cross-cutting workstreams

Run continuously; not gated to a layer.

| Workstream | Rule |
|---|---|
| **Render and look** | No UI surface closes on gate-green alone. Screenshot it under every language |
| **Gate honesty** | Every new gate observed failing before it is trusted. State its tier; never imply enforcement that does not exist |
| **Ratchets shrink** | `localStorage` (6) and rule-C (0) may only decrease. A stale entry is itself a failure |
| **Docs follow reality** | `progress.md` appended, never rewritten. Machine root stays authoritative for the protocol |
| **Contract changes are versioned** | Adding a required token is breaking; every language re-answers before it ships |

---

## 6. Risk register

| # | Risk | L | I | Mitigation | Owner |
|---|---|---|---|---|---|
| R1 | Meta-layer keeps growing while product stays stubs | **H** | **H** | L5 gated behind L2; this document exists to hold that line | Dev Lead |
| R2 | FLAG-11 stays open indefinitely because no backend arrives | M | **H** | Detected + ratcheted meanwhile; ADR R-003 reopened at score 9 | Security |
| R3 | Per-language variants triple the product surface cost | **H** | M | Gap state is a first-class outcome; a language may legitimately not express an idea | Dev Lead |
| R4 | Contract churn as product work reveals missing tokens | M | M | Expected — elevation and type roles were found exactly this way. Version and re-answer | Dev Lead |
| R5 | Coverage floors keep producing ceremony tests | M | M | L4/P6 replaces the function floor; keep the branch floor | Dev Lead |
| R6 | Reference library rots — 247 images still hash-named | L | L | 298 usefully named; local vision inference is marginal on 7.7 GB / no GPU | Dev Lead |

---

## 7. Immediate next step

**Open PR #6**, then start **L2.1 (Dashboard)**.

Dashboard first because it exercises the most of the component library, has the richest reference
material, and is the surface where three design languages differ most visibly — which is the fastest
way to find out whether the protocol actually holds under product load, or only under a specimen.
