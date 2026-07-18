# Changelog

---

## [Unreleased] — Two-Layer Token Contract Architecture

### Summary
Formalized the design token system into a versioned two-layer contract architecture. Every theme is now a named, validated implementation of a semantic token interface. The "default" theme is no longer an implicit fallback — it is an explicit named theme registered in the ThemeService.

---

### New Files

#### `src/styles/tokens/_contract.scss`
Replaces `_semantic.scss` as the semantic token layer. Key differences:
- Each token is annotated with its semantic role (what it means, not what it looks like).
- Values on `:root` are fallback insurance only — they activate when no `[data-theme]` ancestor is present. In normal operation, a named theme always overrides them.
- Contract is versioned (`v1.0.0`). Adding a required token here is a breaking change — all registered themes must satisfy it before shipping.

#### `src/styles/themes/_rdk-default.scss`
The RDK default palette extracted into a proper named theme: `[data-theme="rdk-default"]`. Previously the default was implicit — removing `data-theme` fell through to `:root`. Now it is an explicit, registered, validatable implementation of the contract. Values are identical to the former `_semantic.scss` defaults.

#### `src/app/core/theme/token-contract.ts`
TypeScript contract registry. Exports:
- `CONTRACT_VERSION` — semver string, must match `_contract.scss`.
- `THEME_REGISTRY` — readonly array of `ThemeDefinition` objects (id, label, description).
- `ThemeId` — union type derived from the registry. Unknown theme IDs are a compile error.
- `CONTRACT_TOKENS` — readonly array of every required CSS custom property name.
- `validateTheme(element, themeId)` — checks all contract tokens resolve to non-empty values on the given element. Development use only.

---

### Modified Files

#### `src/styles/styles.scss`
Updated import order and comments:
- `@use 'tokens/semantic'` → `@use 'tokens/contract'`
- Added `@use 'themes/rdk-default'` before `@use 'themes/obsidian'`
- Updated section comment to describe the two-layer contract model.

#### `src/app/core/theme/theme.service.ts`
- `Theme` type (`'obsidian' | 'default'`) replaced by `ThemeId` derived from `THEME_REGISTRY`.
- `'default'` theme ID replaced by `'rdk-default'`.
- `applyToDocument()` now always calls `setAttribute('data-theme', id)` — `removeAttribute` removed. Removing `data-theme` is an error state, not a valid theme.
- `toggle()` now cycles through all registered themes in registry order rather than hardcoded binary flip.
- Added `registry` property exposing `THEME_REGISTRY` for consumers (e.g. theme pickers).
- Added `validateCurrentTheme()` — called on startup in dev mode via `requestAnimationFrame`. Logs missing contract tokens to the console.
- Stored theme validation now checks against the registry; unknown stored values fall back to `rdk-default`.

#### `src/app/shared/components/atoms/theme-toggle/theme-toggle.component.ts`
Replaced all hardcoded CSS values with contract and primitive tokens:
- `#111111` → `var(--obs-surface-card-dark)` (valid — only used when obsidian class is active)
- `#2a2a2a` → `var(--obs-badge-surface)`
- `rgba(255,255,255,0.9)` / `#ffffff` → `var(--obs-text-on-dark)`
- `rgba(255,255,255,0.85)` → `var(--obs-text-on-dark-muted)`
- `rgba(0,0,0,0.18)` → `var(--color-border-default)`
- `rgba(0,0,0,0.5)` → `var(--color-text-muted)`
- `rgba(0,0,0,0.06)` → `var(--color-hover-overlay)`
- `0.375rem` gap → `var(--space-1-5)`
- `0.25rem 0.625rem` padding → `var(--space-1) var(--space-2-5)`
- `9999px` radius → `var(--radius-pill)`
- `0.75rem` font-size → `var(--text-xs)`
- `600` font-weight → `var(--font-semibold)`
- `200ms cubic-bezier(...)` → `var(--duration-200) var(--ease-in-out)`
- Renamed class `theme-toggle--obsidian` → `theme-toggle--active` (more semantically neutral).
- Font family reference updated to `var(--obs-font-display, 'Inter', system-ui, sans-serif)`.

#### `docs/design-refs/DESIGN-SYSTEM.md`
Replaced "Theme Bridge Architecture" section with "Design Token Architecture". Documents:
- The two-layer model (primitives → contract → component → themes).
- File paths and responsibility of each layer.
- How to add a new theme (4-step process).
- ThemeService contract (always-set rule, registry, dev validation).
- Updated token namespace rules table with primitives, contract, component, and `--obs-*` rows.

---

### Trashed Files

#### `.trash/_semantic.scss.bak`
Original `src/styles/tokens/_semantic.scss`. Superseded by `_contract.scss` and `_rdk-default.scss`. Kept for reference. Safe to permanently delete once the new token layers have been verified in a full build and visual regression check.

---

### Migration Notes

- Any code that checks `themeService.current() === 'default'` must be updated to `=== 'rdk-default'`.
- Any code that calls `document.documentElement.removeAttribute('data-theme')` directly must be replaced with `themeService.set('rdk-default')`.
- Stored `localStorage` values of `'default'` will fall back to `'rdk-default'` automatically on next load via `readStoredTheme()`.
- `--obs-*` tokens referenced outside `[data-theme="obsidian"]` context will produce undefined values under `rdk-default`. Audit component stylesheets for direct `--obs-*` references.

---

## [Unreleased] — Store Interfaces · Template System · Utility Components

### Summary
Added the first reusable store contracts (signal-based), a template registration system for multi-tenant nav wiring, and four utility components (ConfirmDialog, EmptyState, ErrorDisplay, LoadingSpinner). Three of the new components carry hardcoded style violations (FLAG-03) to be resolved before production use.

---

### New Files

#### `src/app/core/store/rdk-store.interface.ts`
Three generic signal-based store interfaces that all feature stores should implement:
- `RdkStore<T>` — base: `loading` + `error` signals, `setLoading()`, `setError()`, `reset()`
- `RdkListStore<T>` — extends base: `items` + `isEmpty` signals, `setItems()`, `addItem()`, `removeItem()`
- `RdkDetailStore<T>` — extends base: `selected` signal, `setSelected()`

#### `src/app/core/templates/template.types.ts`
`RdkTemplate` interface — `id: string` + `navItems: NavItem[]`. Typed descriptor for a feature template.

#### `src/app/core/templates/provide-template.ts`
`provideTemplate(template: RdkTemplate): Provider[]` — registers `NAV_ITEMS` multi-provider from a template definition. Replaces ad-hoc `{ provide: NAV_ITEMS, useValue: ..., multi: true }` call sites.

#### `src/app/shared/components/confirm-dialog/confirm-dialog.component.ts`
PrimeNG `p-dialog` wrapper. Inputs: `visible`, `title`, `message`, `confirmLabel`, `cancelLabel`, `confirmButtonClass`. Outputs: `confirmed`, `cancelled` (completed in `ngOnDestroy`). Selector: `rdk-confirm-dialog`.

#### `src/app/shared/components/empty-state/empty-state.component.ts`
Empty list / search-result state component. Inputs: `title`, `message`, `icon` (PrimeIcon class). Action slot via `<ng-content>`. Selector: `rdk-empty-state`.
⚠ FLAG-03: Uses raw spacing and font-size values — must be tokenised before production use.

#### `src/app/shared/components/error-display/error-display.component.ts`
Renders an `AppError` using PrimeNG `p-message`. Severity mapped from `ErrorCode`: auth + validation errors → `warn`, all others → `error`. Shows retry button when `error.retryable && showRetry`. Emits `retry` EventEmitter. Selector: `rdk-error-display`.

#### `src/app/shared/components/loading-spinner/loading-spinner.component.ts`
PrimeNG `p-progressSpinner` wrapper. Inputs: `size` (px), `label`, `showLabel`, `overlay`. Overlay mode: `position: fixed; inset: 0` with semi-transparent background. Selector: `rdk-loading-spinner`.
⚠ FLAG-03: Uses raw overlay background value — must be tokenised before production use.

---

### Open Flags

#### ⚠ FLAG-03 · Hardcoded styles in utility components
**Files:** `empty-state.component.ts`, `loading-spinner.component.ts`, `confirm-dialog.component.ts`
Raw CSS values used in component styles (`0.75rem`, `2rem`, `rgba(255 255 255 / 0.8)`, `1.125rem`, etc.) instead of contract tokens. Violates `PROD-FLAG[HARDCODED-STYLE]`. Resolve before these components are used in production features.
