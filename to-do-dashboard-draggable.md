# T7 — Draggable & Modifiable KPI Cards · Forward To-Do

> **Source:** research session 2026-09-08 · Angular 21.2 + `@angular/cdk@21.2.14` already installed.
> **Status:** ready to build · **Next session starts at §0**
> Every task is bound by `IMPLEMENTATION-PLAN.md` §2 (Definition of Done + evidence rule) and the Design Language Protocol (`~/Claude files/design-language-protocol.md`).

---

## 0. Next session — start here (5 min)

1. Read this file + `src/app/features/dashboard/dashboard.store.ts:30` + `dashboard.component.ts:130` + the three variants (`dashboard-modern/obsidian/evolute.component.ts`).
2. Answer the 7 questions in §6 — they gate the persistence and scope model. Recommended answers are marked; overriding any is an ADR amendment, not a re-plan.
3. Open the ADR amendment stub in §1 and confirm it. Do not write feature code before the ADR patch is on the branch.

---

## 1. ADR amendment required before code

File: `ArchitectureRecordDocument.md`

| Concern | Decision to record |
|---|---|
| **A. Library** | `@angular/cdk/drag-drop` as primary (zero new dep, bundle ~0 KB). `angular-gridster2`/`gridstack` deferred behind feature flag `dashboardGrid: 'cdk' \| 'gridster'` — escalation only if free-form resize + collision is required. |
| **B. Layout model** | `DashboardLayout { version, updatedAt, widgets: WidgetInstance[] }` where `WidgetInstance { id, widgetId, colSpan, order, config? }` with **closed union** `colSpan: 3|4|6|12` (12-col grid). No free pixels. |
| **C. Widget registry** | `WidgetRegistry` (core, `providedIn: 'root'`) + `provideWidgets()` factory; `WidgetDefinition<TConfig>` owns `id, component, defaultSize, configSchema, permissions, title`. |
| **D. Persistence** | `DashboardLayoutService` → `ApiClient.put('/api/v1/dashboard/layout')` with `request-id` + retry honouring `Retry-After` (`ArchitectureRecordDocument.md:423`). Fallback to `localStorage['rdk_dashboard_layout_v1']` when offline; reconcile on next save. Layout is **non-sensitive** (FLAG-11 ratchet unaffected) but cap at 10 KB and validate at boundary. |
| **E. Personalisation** | Per-user layout persisted; per-role seed as default template (admin publishes template, user overrides). Last-write-wins v1; `version` field for future OT/CRDT. |
| **F. Error taxonomy** | Add `DASHBOARD_LAYOUT_INVALID` (400) + `DASHBOARD_PERSIST_FAILED` (5xx) to `src/app/core/errors/errors.types.ts:1`. |
| **G. Design protocol** | Variants keep thesis; position is **data** (`layout: WidgetInstance[]` input), not template. No variant rewrites position logic. Gap state (`dashboard.component.ts:44`) unchanged. |

If any of A–G is rejected, update this file before coding.

---

## 2. Locked context (do not re-decide)

- Stack: Angular 21.2 standalone + OnPush + Signals, PrimeNG 21.1, SCSS semantic tokens — `package.json:28-43`, `angular.json:24-42`.
- Token contract v1.1.0 — 90 semantic tokens (`src/styles/tokens/_contract.scss:13`, `src/app/core/theme/token-contract.ts:47`). Components read only `CONTRACT_TOKENS`; never `--obs-*`/`--evo-*` directly. `scripts/check-theme-contract.mjs` gates it (`package.json:22`).
- Current KPI source is hardcoded in `DashboardStore.load()` (`dashboard.store.ts:79-88`) — 4 metrics (`revenue/orders/aov/refunds`) + 5 transactions. No drag state exists today; greps for `cdkDrag`/`gridster`/`gridstack` are empty.
- `@angular/cdk` is already a dependency (`package.json:30`) — no `PROD-FLAG[UNVETTED-DEP]` on this path.

---

## 3. Build order — gated, no layer starts before prior is green

### T7.0 — Foundation
- [ ] ADR patch (§1) on branch, reviewed.
- [ ] `src/app/core/errors/errors.types.ts` — add `DASHBOARD_LAYOUT_INVALID`, `DASHBOARD_PERSIST_FAILED`.
- [ ] `src/app/core/dashboard-layout/widget-registry.ts` — `WidgetDefinition<TConfig>`, `WIDGET_REGISTRY` token, `provideWidgets()`.
- [ ] `src/app/core/dashboard-layout/dashboard-layout.model.ts` — `WidgetInstance`, `DashboardLayout` (closed `colSpan` union), `WidgetId` branded type.
- [ ] `src/app/core/dashboard-layout/layout-validator.ts` — zero-trust validator at persistence boundary (unknown `colSpan`, `widgetId: '<script>'`, oversized array → `DASHBOARD_LAYOUT_INVALID`). Use existing `errors.factory.ts` shape.

### T7.1 — Layout engine
- [ ] `src/app/core/dashboard-layout/dashboard-layout.store.ts` — signals `layout`, `editMode`, `isDragging`; `computed orderedWidgets`; `move(from,to)`, `resize(id,colSpan)`, `undo()` (stack depth 20), `resetToDefault()`.
- [ ] `src/app/shared/components/atoms/kpi-card/kpi-card.component.ts` — extract presentational card from today's inline variants; inputs `metric: DashboardMetric`, `featured?: boolean`; emits `configure`, `remove`; `ChangeDetectionStrategy.OnPush`; styles via `var(--*)` only.
- [ ] `src/app/shared/components/organisms/dashboard-grid/dashboard-grid.component.ts` — presentational grid: `cdkDropList` + `cdkDrag` with drag handle, `cdkDragPreview`/`cdkDragPlaceholder`, `cdkDropListDropped → moveItemInArray`, keyboard reorder (Space + Arrows per CDK a11y), `prefers-reduced-motion` disables animation (`design-language-protocol.md:3.5`), `ResizeObserver → colSpan` per breakpoint (`xs:12, sm:6, md:4, lg:3`). WCAG 2.2 §2.5.8 target ≥24×24.

### T7.2 — Modifiability
- [ ] `src/app/features/dashboard/dashboard.component.ts` — wire `DashboardLayoutStore`; `[Edit]` toggle in `db__head` (`dashboard.component.ts:34`); edit bar `Done/Cancel/Reset/Undo`; drag handles visible **only** in `editMode` (prevents accidental drag).
- [ ] Add/remove: `WidgetCatalogDrawer` (PrimeNG Drawer) lists `widgetRegistry` filtered by `HasPermissionDirective`; remove via `×` → `ConfirmDialogComponent`; add via drawer.
- [ ] Configure: per-card `config` drawer using existing `shared/forms/validators/*` + `FormErrorHandler`; `AppError.fieldErrors` mapping.
- [ ] Resize: edge handle or `±` size buttons → `resize(id, colSpan)` clamped to closed union.
- [ ] Variants (`dashboard-modern|obsidian|evolute.component.ts`) — consume `layout: WidgetInstance[]` as input, keep thesis intact (`obsidian:25-dark-anchor`, `modern:42-soft-card`, `evolute:35-lift-ladder`). No position logic duplicated per variant.

### T7.3 — Persistence
- [ ] `src/app/core/dashboard-layout/dashboard-layout.service.ts` — `load(): Observable<DashboardLayout>`, `save(layout): Observable<void>` via `ApiClient`; `validateTheme` prior to `setItems`; on `DASHBOARD_PERSIST_FAILED` surface via `ErrorDisplayComponent` (`dashboard.component.ts:59`) with `retryable:true`.
- [ ] Offline fallback: `localStorage['rdk_dashboard_layout_v1']` read on boot, written on every `move/resize`; reconcile (backend wins) on next successful `save`. Enforce 10 KB cap; never store PII. Ratchet stays shrink-only (`scripts/check-no-localstorage-auth.mjs`).
- [ ] `src/app/features/dashboard/dashboard.store.ts` — `load()` now hydrates from `DashboardLayoutService`; keep hardcoded seed as `DEFAULT_LAYOUT` for first run / reset.

### T7.4 — Cross-application (only if "across the application" = beyond dashboard)
- [ ] `src/app/shared/components/organisms/widget-host/widget-host.component.ts` — presentational host `*widgetHost="widgetId; config"` via registry; no `core/` import.
- [ ] `provideWidgets()` at `src/app/app.config.ts` — registry available route-wide. Keep `DashboardLayoutStore` in `core/` (singleton, not `shared/`).

### T7.5 — Observability & hardening
- [ ] `LoggingService` events: `dashboard.layout.reordered`, `dashboard.layout.resized`, `dashboard.layout.persist_failed` (sanitised `widgetId` only; PII exclusion list `ArchitectureRecordDocument.md:593`).
- [ ] Contrast + `lint:rules` green; no raw style values; no foreign `--obs-*` reads outside `themes/`.

---

## 4. Definition of Done (from `IMPLEMENTATION-PLAN.md` §2)

- [ ] `npm run lint` · `npm run typecheck` · `npm run lint:rules` clean
- [ ] `npm run test:ci` green; per-directory floors met — `core/dashboard-layout` **100%**, `features/dashboard` **80%**; branch floor holds (no ceremony tests)
- [ ] Error paths before happy paths; `layout-validator` adversarial cases: `colSpan:999`, `widgetId:'<script>'`, `widgets: Array(1000)`, `JSON.parse` throw → `DASHBOARD_LAYOUT_INVALID`
- [ ] Playwright drives real app: mouse drag, keyboard drag (Space+Arrows), resize, add/remove, persist-then-reload, empty-board state
- [ ] `npm run build:prod` within budget (627 kB initial baseline `progress.md:334`)
- [ ] Every surface renders under all three languages or declares explicit gap (`dashboard.component.ts:44`); screenshots reviewed (render-and-look rule)
- [ ] `progress.md` appended with **actual command output**; new gate shown failing first
- [ ] No credential in `localStorage` growth; `localStorage` ratchet may only shrink

---

## 5. Tests to write

**Unit (`DashboardLayoutStore`, `layout-validator`):** reorder, resize clamp, validator rejection, undo, `resetToDefault`, unknown `widgetId` type error.

**Integration (`DashboardLayoutService` + interceptors):** `load`/`save` via `HttpTestingController`, parallel save while token refresh in flight (single PUT), 429 honours `Retry-After`.

**Component (`DashboardGridComponent`):** `cdkDropListDropped` synthetic event + keyboard path (`@testing-library/angular`), `OnPush` + `trackBy` correctness.

**E2E (Playwright):** `/app/dashboard` — drag via mouse + keyboard, `prefers-reduced-motion` assertion, remove-all → empty state, persist → reload → same order.

---

## 6. Open questions — answer at session start

| # | Question | Recommended | If you choose otherwise… |
|---|---|---|---|
| Q1 | Scope of "modifiable" | Reorder + resize + add/remove + per-card config | Resize is the cost driver; reordering-only cuts T7.2 by ~60% |
| Q2 | Persistence | Backend `PUT /api/v1/dashboard/layout` + `localStorage` fallback | `localStorage`-only is cheaper but not multi-device |
| Q3 | Grid model | Fixed 12-col responsive grid (closed `colSpan` union) | Free-form board → Gridster2 path, token remap, ADR override |
| Q4 | Personalisation | Per-user (backend), per-role seed as default | Shared global default = no per-user override; simpler |
| Q5 | Cross-route | Dashboard-only v1, `WidgetHost` as follow-up | App-wide widgets → T7.4 moves into v1 |
| Q6 | Catalog | Open registry (any team registers a widget) | Fixed 4 KPIs = no registry needed, but not extensible |
| Q7 | Edit affordance | Explicit Edit mode toggle | Always-draggable = accidental drag on touch |

> Default to **Recommended** unless you have a reason not to. Each deviation is an ADR amendment.

---

## 7. File map (proposed)

```
src/app/core/dashboard-layout/
├── dashboard-layout.model.ts
├── dashboard-layout.store.ts
├── dashboard-layout.service.ts
├── widget-registry.ts
└── layout-validator.ts
src/app/shared/components/
├── atoms/kpi-card/kpi-card.component.ts
└── organisms/dashboard-grid/dashboard-grid.component.ts
src/app/features/dashboard/
├── dashboard.component.ts          # edit-mode wiring
└── variants/
    ├── dashboard-modern.component.ts   # consumes layout input
    ├── dashboard-obsidian.component.ts
    └── dashboard-evolute.component.ts
tests/
├── dashboard-layout.store.spec.ts
├── layout-validator.spec.ts
├── dashboard-layout.service.spec.ts
└── e2e/dashboard-draggable.spec.ts
```

---

## 8. References

- Current store: `src/app/features/dashboard/dashboard.store.ts:30-147`
- Host + gap state: `src/app/features/dashboard/dashboard.component.ts:130-173`
- Variants: `src/app/features/dashboard/variants/dashboard-modern.component.ts:55`, `dashboard-obsidian.component.ts:42`, `dashboard-evolute.component.ts:53`
- Token contract: `src/styles/tokens/_contract.scss:13`, `src/app/core/theme/token-contract.ts:47`
- Design protocol: `~/Claude files/design-language-protocol.md:3-4`
- CI gates: `package.json:22` (`lint:rules`), `ArchitectureRecordDocument.md:13` (testing), `IMPLEMENTATION-PLAN.md:2` (DoD)
- Progress baseline: `progress.md:334` (627 kB initial)

---

## 9. Immediate command checklist

```bash
git checkout -b feature/dashboard-draggable-kpis
npm ci
npm run lint && npm run typecheck && npm run lint:rules   # baseline
# — implement T7.0 →
npm run test:ci
npm run build:prod
npx playwright test --project=chromium  # after T7.1
```
