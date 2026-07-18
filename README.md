# Angular RDK — Rapid Development Kit

An enterprise-grade Angular 19 starter template. Clone once, build forever. Every new project starts from a production-ready, tested, secure foundation instead of a blank workspace.

---

## What's included

| Layer | What it provides |
|---|---|
| **Error taxonomy** | Typed `AppError` + `ErrorCode` enum covering auth, validation, resource, and infrastructure failures |
| **Structured logging** | PII-safe JSON logging service with level filtering and production/dev modes |
| **HTTP layer** | `ApiClient` wrapper + 4 functional interceptors (request ID, auth token injection, error mapping, exponential retry) |
| **Auth** | Signal-based `AuthStore`, `AuthService` (login/logout/refresh/restoreSession), JWT `TokenService`, `authGuard` |
| **Form utilities** | 4 validators (requiredTrim, email, strongPassword, matchFields), server-error applicator, form error message helper |
| **Shared components** | `LoadingSpinner`, `ErrorDisplay`, `EmptyState`, `ConfirmDialog` |
| **Shared pipes/directives** | `SafeHtml`, `Truncate`, `HasPermission` (RBAC structural), `AutoFocus` |
| **Layout shell** | `AppShellComponent` with collapsible sidebar, header, and nested `<router-outlet>` |
| **Example feature** | Fully wired lazy-loaded feature demonstrating every pattern (list + detail + signal store + form + RBAC) |
| **CI/CD** | GitHub Actions workflow: lint → typecheck → audit → test → coverage gate → build |

**Stack:** Angular 19 · PrimeNG 17 · Angular Signals · Jest 29 · Playwright · ESLint + Prettier

---

## Quick start

```bash
# 1. Clone and rename
git clone <repo-url> my-project
cd my-project

# 2. Install dependencies
npm install

# 3. Configure environment
cp src/environments/environment.ts src/environments/environment.local.ts
# Edit environment.local.ts with your API base URL and auth URL

# 4. Start dev server
npm start
# → http://localhost:4200  (redirects to /login)
```

---

## Project commands

| Command | What it does |
|---|---|
| `npm start` | Dev server at localhost:4200 |
| `npm test` | Run all Jest unit tests |
| `npm run test:watch` | Jest in watch mode |
| `npm run test:coverage` | Jest with coverage report |
| `npm run test:ci` | Jest in CI mode (no watch, coverage enforced) |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build:prod` | Production build |
| `npm run format` | Prettier format |
| `npm run format:check` | Prettier check (CI) |

---

## Directory structure

```
src/app/
├── core/
│   ├── errors/          ← AppError type + ErrorCode enum (first file written — no deps)
│   ├── config/          ← APP_CONFIG injection token + AppConfig interface
│   ├── logging/         ← LoggingService (structured JSON, PII-safe)
│   ├── http/            ← ApiClient + 4 functional interceptors
│   ├── auth/            ← AuthStore (signals), AuthService, authGuard, TokenService
│   └── store/           ← RdkStore interfaces for NgRx compatibility
├── shared/
│   ├── forms/           ← Validators, applyServerErrors(), getErrorMessage(), form.utils
│   ├── components/      ← LoadingSpinner, ErrorDisplay, EmptyState, ConfirmDialog
│   ├── pipes/           ← SafeHtml, Truncate
│   └── directives/      ← HasPermission (RBAC), AutoFocus
├── layout/
│   ├── app-shell/       ← Top-level authenticated layout (header + sidebar + router-outlet)
│   ├── header/          ← Global header with sidebar toggle and user menu slot
│   └── sidebar/         ← Role-filtered nav with collapsed icon mode
└── features/
    ├── auth/
    │   └── login/       ← LoginComponent (wired to AuthService, uses shared validators)
    └── example/         ← Complete lazy-loaded feature demonstrating all patterns
```

### Module boundary rules

These rules are enforced by ESLint import restrictions and must not be violated:

1. **`core/`** — singleton services only. Never import from other `core/` modules except via DI.
2. **`shared/`** — presentational only. No direct HTTP calls, no business logic, no router navigation.
3. **`layout/`** — imports from `shared/` only. No feature-specific logic.
4. **`features/`** — imports from `core/` and `shared/`. Never imports from another feature directly.
5. Cross-feature communication goes through `core/` services or router state.

---

## How to add a feature

```bash
# Generate the component with the project's schematics defaults
ng generate component features/my-feature/my-feature-list

# Structure:
src/app/features/my-feature/
├── my-feature.routes.ts       ← lazy-loaded route definitions
├── my-feature.store.ts        ← signal store (provided: [] on the root component)
├── my-feature-list/
│   ├── my-feature-list.component.ts
│   └── my-feature-list.component.spec.ts
└── my-feature-detail/
    └── my-feature-detail.component.ts
```

Wire the feature into `app.routes.ts` as a lazy child of the `dashboard` route:

```typescript
{
  path: 'my-feature',
  loadChildren: () =>
    import('./features/my-feature/my-feature.routes').then(m => m.MY_FEATURE_ROUTES),
}
```

---

## Authentication flow

```
App bootstrap → AppComponent.ngOnInit() → authService.restoreSession()
  ↓ (token found & valid)              ↓ (no token / expired)
AuthStore.setUser()                    AuthStore stays empty
  ↓
authGuard → isAuthenticated() = true → allows navigation
                                     → false → redirects to /login?returnUrl=<original>

LoginComponent.onSubmit()
  → authService.login(credentials)
    → POST /auth/login
    → tokenService.setTokens()
    → authStore.setUser()
    → router.navigate([returnUrl])
```

**Token storage:** `localStorage` keys `rdk_access_token` / `rdk_refresh_token`.

**Configuring auth endpoints:** Set `auth.baseUrl`, `auth.loginPath`, `auth.logoutPath`, `auth.refreshPath` in `src/environments/environment.ts`.

Expected login response shape:
```json
{
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>",
  "user": { "id": "uuid", "roles": ["user", "admin"] }
}
```

---

## Changing the theme

PrimeNG 17 uses CSS-based theming. To swap themes, change the stylesheet in `angular.json`:

```json
"styles": [
  "node_modules/primeng/resources/themes/lara-dark-blue/theme.css",
  "node_modules/primeng/resources/primeng.min.css",
  "src/styles/styles.scss"
]
```

Available themes are under `node_modules/primeng/resources/themes/`. App-level CSS custom property overrides live in `src/styles/styles.scss`.

---

## Optional: NgRx

The RDK ships with Angular Signals for state by default. If a feature outgrows local signal stores, see `docs/ngrx/ngrx-migration.md` for step-by-step migration to NgRx feature slices. The `RdkStore<T>` interface in `core/store/` is satisfied by both Signals stores and NgRx stores, so the migration is isolated to the feature.

---

## Coverage thresholds

Enforced in `jest.config.ts`:

| Path | Required coverage |
|---|---|
| `core/errors/` | 100% |
| `core/auth/` | 100% |
| `core/logging/` | 100% |
| `core/http/` | 100% |
| `shared/forms/validators/` | 100% |
| `shared/pipes/` | 100% |
| `shared/directives/` | 100% |
| Global | 70% |

---

## Architecture

See `ArchitectureRecordDocument.md` for the full ARD (status: APPROVED), including ADRs for component model, interceptor strategy, state management, and testing toolchain decisions.
