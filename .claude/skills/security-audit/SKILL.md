---
name: security-audit
description: Production security audit for the software-rdk Angular application. Checks authentication gates, CSP configuration, XSS surfaces, token handling, route exposure, and interceptor security. Run before any release candidate.
---

# Security Audit Skill

## Purpose

Run a production-readiness security audit on the software-rdk codebase. This skill checks the following threat surfaces and reports findings with severity and remediation guidance.

## Execution

When invoked, work through each check below in order. Use Bash, Read, and Grep tools to gather evidence. Report each finding with: **surface**, **severity** (Critical / High / Medium / Low / Info), **evidence** (file:line), and **remediation**.

---

## Check 1 — Route Authentication Gates

All routes that render authenticated content must have `canActivate: [authGuard]` and must NOT have `data: { public: true }`.

```bash
# Find all route definitions
grep -rn "canActivate\|data.*public\|public.*true" src/app --include="*.ts" | grep -v "spec\|\.git"
```

**Pass criteria:**
- Only `landing`, `login`, and `register` routes have `{ public: true }`
- `/app/**` parent has `canActivate: [authGuard]` with no `public: true`
- `/showcase` does NOT have `public: true`
- No component is accessible without passing `authGuard`

---

## Check 2 — Auth Guard Logic

Verify the guard correctly distinguishes public vs protected routes and redirects with `returnUrl`.

```bash
cat src/app/core/auth/auth.guard.ts
```

**Pass criteria:**
- Guard returns `true` only when `route.data?.['public'] === true` OR user is authenticated
- Redirect includes `{ queryParams: { returnUrl: _state.url } }`
- No hardcoded route strings (uses `config.auth.loginRoute`)

---

## Check 3 — Content Security Policy

```bash
grep -A5 "Content-Security-Policy" src/index.html
```

**Pass criteria:**
- `default-src 'self'`
- `script-src 'self'` — no `unsafe-eval`, no `unsafe-inline`
- `object-src 'none'`
- `base-uri 'self'`
- `form-action 'self'`
- `connect-src` does NOT contain `localhost` or any non-production origin
- No wildcard (`*`) origins except for `img-src` where `https:` is acceptable

**Production action required:** Set `connect-src 'self' https://your-api-domain.com` via server-side `Content-Security-Policy` header (meta-tag CSP does not cover `frame-ancestors`).

---

## Check 4 — XSS Surfaces

```bash
grep -rn "bypassSecurityTrust\|innerHTML\|dangerouslySet\|eval(" src/app --include="*.ts" | grep -v spec
```

**Pass criteria:**
- `bypassSecurityTrustHtml` only in `highlight.pipe.ts`, after `sanitize(SecurityContext.HTML, ...)` is called first — this is the approved safe pattern for rendering `<mark>` highlights
- Zero uses of `bypassSecurityTrustScript`, `bypassSecurityTrustUrl`, `bypassSecurityTrustResourceUrl` in production code
- Zero direct `innerHTML` assignments outside Angular template binding

---

## Check 5 — Token Storage & Handling

```bash
grep -rn "localStorage\|sessionStorage\|cookie" src/app --include="*.ts" | grep -v spec
```

**Pass criteria:**
- Token read/write isolated to `TokenService` only — no other file accesses localStorage for tokens
- `clearTokens()` called on logout and on auth error
- No token values logged (verify via `sanitizeContext` key list in `logging.model.ts`)

```bash
grep -n "SENSITIVE_KEYS\|password\|token\|secret" src/app/core/logging/logging.model.ts
```

**Recommended production hardening (not implementable client-side):**
- Move tokens to `HttpOnly` cookies managed by the backend (eliminates JavaScript-accessible token storage entirely)
- Set `SameSite=Strict` and `Secure` cookie attributes

---

## Check 6 — HTTP Interceptor Order & Dev Mock

```bash
grep -A15 "rdkHttpInterceptors\|devMockAuth" src/app/app.config.ts
grep -A5 "production" src/app/core/http/interceptors/dev-mock-auth.interceptor.ts
```

**Pass criteria:**
- `devMockAuthInterceptor` is listed FIRST in the interceptor chain (short-circuits before auth/error interceptors see mock responses)
- The interceptor immediately calls `return next(req)` when `config.environment.production === true`
- Invalid credential responses from the mock use `throwError(() => new HttpErrorResponse({...}))` — NOT `of(new HttpResponse({status:401}))` which would be received as a success

---

## Check 7 — Auth Interceptor Scope

```bash
cat src/app/core/http/interceptors/auth.interceptor.ts
```

**Pass criteria:**
- Token is only attached when `req.url.startsWith(config.api.baseUrl) || req.url.startsWith(config.auth.baseUrl)`
- Token is never attached to third-party URLs (e.g. Google Fonts CDN)
- `Bearer ` prefix is correct

---

## Check 8 — Retry Interceptor Safety

```bash
grep -n "RETRYABLE_HTTP_STATUSES\|retryable" src/app/core/errors/errors.types.ts
```

**Pass criteria:**
- Retryable statuses are: `408, 429, 503, 504` only
- `401` is NOT in the retryable set (avoids hammering auth endpoints on expired tokens)
- `400` is NOT retryable (client error — retrying won't change outcome)

---

## Check 9 — Input Validation at System Boundaries

```bash
grep -rn "requiredTrim\|emailValidator\|strongPassword\|maxLength" src/app/templates --include="*.ts"
```

**Pass criteria:**
- Every form field that accepts user input has at least one validator
- Login: `requiredTrim`, `emailValidator`, `Validators.maxLength(254)` on email; `Validators.maxLength(128)` on password
- Register: `strongPasswordValidator` on password; `matchFieldsValidator` on confirm-password group
- Profile change-password: `strongPasswordValidator` on new password; `matchFieldsValidator` on form group

---

## Check 10 — Error Handling & Information Disclosure

```bash
grep -rn "console\.log\|console\.error\|console\.warn" src/app --include="*.ts" | grep -v spec | grep -v "logging.service"
```

**Pass criteria:**
- No raw `console.*` calls outside `LoggingService.emit()`
- `LoggingService` uses `sanitizeContext()` on all context objects before output
- Error responses do not expose stack traces — `AppError` carries `code`, `message`, `context`, `retryable` only
- No raw `HttpErrorResponse` body surfaces to UI — all errors pass through `fromHttpError()` factory

---

## Check 11 — Dependency Audit

```bash
npm audit --audit-level=high 2>&1 | tail -20
```

**Pass criteria:**
- Zero High or Critical vulnerabilities
- All `@angular/*` packages on same major version
- PrimeNG version matches Angular version compatibility matrix

---

## Findings Template

For each failed check, report:

```
[SEVERITY] Check N — <Check Name>
Surface: <file:line>
Issue:   <what is wrong>
Fix:     <specific remediation>
```

## Production Deployment Checklist (server-level, not in this repo)

These cannot be enforced client-side but must be set at the deployment layer:

- [ ] Server sends `Content-Security-Policy` header (overrides meta-tag; add `frame-ancestors 'none'`)
- [ ] Server sends `Strict-Transport-Security: max-age=31536000; includeSubDomains` (HTTPS only)
- [ ] Server sends `X-Frame-Options: DENY`
- [ ] Server sends `Permissions-Policy: geolocation=(), microphone=(), camera=()`
- [ ] API server enforces rate-limiting on `/auth/login` and `/auth/register` (brute-force protection)
- [ ] Tokens issued as `HttpOnly; Secure; SameSite=Strict` cookies by the backend (eliminates XSS token theft)
- [ ] `environment.production = true` and `logLevel = 'warn'` in production build
- [ ] `devMockAuthInterceptor` exits immediately via `config.environment.production` check — verify this flag is `true` in prod config
