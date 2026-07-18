# After-Audit Proposals — software-rdk

> **Audited:** 2026-07-18 · **Auditor:** ARVIS (Claude) · **Scope:** CI/CD gating and
> development-progress gating. No code was changed by this audit; this is a proposal record.
>
> **Reference standard:** [`~/Projects/CI-CD-FRAMEWORK.md`](../CI-CD-FRAMEWORK.md)
> **Context:** this project *was* the trigger for the workspace-wide audit. Its CI had never passed
> once. Full post-mortem in [`progress.md`](./progress.md) → "2026-07-18 — Retrospective"; open
> flags in the same file → FLAG-04 … FLAG-10.

---

## 1. Verdict

**Maturity: L1** on the framework's ladder (§8) — and only as of today. Before 2026-07-18 it was
**L0** ("a pipeline never observed green").

This is the **least-gated project in the workspace**, and the gap to its siblings
(`restaurant-management-system`, `theLodge` — both L3) is large. That is the honest headline: the
Angular 21 migration made the pipeline *pass*; it did not make the pipeline *sound*.

| Category | State |
|---|---|
| Provenance & integrity | 🟡 secrets ✅ (**best-in-workspace**, see §2) · lockfile ⚠️ · **toolchain presence ❌** |
| Correctness | ✅ lint, typecheck, tests + floors, prod build — but all in **one sequential job** |
| Security & supply chain | 🟡 `npm audit` ✅ · **no SBOM ❌ · no licence policy ❌** |
| Architecture (fitness functions) | ❌ **none** — despite a strict design-token contract and an `[ABSOLUTE]` storage rule |
| Performance & budget | ✅ bundle budgets in `angular.json` |
| Progress gating | ❌ **none** — no Definition of Done, no exit gates, no evidence trail |

---

## 2. What is genuinely strong

Short list, but real:

1. **The secret-scanning job is the most hardened in the workspace.** It installs a **pinned**
   gitleaks release and **verifies it against the release's own checksum manifest** before running,
   then scans full history (`fetch-depth: 0`). Both sibling projects use
   `gitleaks/gitleaks-action@v2` — a **mutable tag** — which is strictly weaker.
   **This should be propagated to `restaurant-management-system` and `theLodge`,** and is recorded
   as a proposal in both of their `after-audit-proposals.md`.
2. **Test suite is now substantial** — 564 tests, 98.08% statements / 93.86% branches. The PrimeNG
   wrapper components went from *no specs at all* to covered, which means the framework migration
   is verified behaviourally rather than only by compilation.
3. **Pre-commit hook is deny-by-default** — it refuses to commit if gitleaks is missing, rather
   than silently skipping. That is the correct failure direction.
4. **The retrospective exists.** The failure is documented honestly, including the mistakes made
   during the fix. Most projects lose that.

---

## 3. Findings & proposals

### P1 — Split the single sequential job into parallel gates *(**Highest** · ~1 h)* — FLAG-04

**Finding.** `.github/workflows/ci.yml` runs `lint → typecheck → audit → test → build` as five
**steps in one job**. A failure in step 1 means steps 2–5 never execute.

**This is the root cause of the entire incident.** `eslint` was never a declared dependency, so
lint failed on every commit since the repository's first, and typecheck, audit, tests and build
had **never run once** — concealing dead code (`src/_trash`), 48 lint errors, 4 stale tests, unmet
coverage floors and 1 critical + 14 high security advisories. The repository *appeared* governed
while being ungoverned.

**Why it matters.** Framework §1: *a gate that cannot fail independently is not a gate.* Until
this is fixed, the same blind spot can recur silently and invisibly.

**Proposal.** Restructure into parallel, independently-named jobs, matching the sibling projects:

```yaml
jobs:
  preflight:     # toolchain + lockfile integrity (P2)
  correctness:   # lint · typecheck · test + coverage
  build:         # production build + bundle budgets
  secrets-scan:  # gitleaks, full history   (already exists — keep as-is)
  supply-chain:  # npm audit · SBOM · licence policy (P7)
```

Then require **all five by name** in branch protection (P10). Do not collapse them into one
aggregate "CI passed" check — that re-creates the masking problem.

---

### P2 — Add a toolchain-presence gate *(**Highest** · ~5 min)* — FLAG-05

**Finding.** Nothing verifies that the binaries the npm scripts invoke actually installed. CI uses
`npm ci --legacy-peer-deps`, which **silently skips peer-dependency installation** — which is
precisely how `eslint` (declared only as a peer of its plugins) vanished and produced a failure
that read like a code bug for the life of the repository.

**Proposal.** Port theLodge's step — it is the only project in the workspace that has one:

```yaml
      - name: Verify declared toolchain present
        run: |
          npx --no-install eslint --version
          npx --no-install tsc --version
          npx --no-install jest --version
          npx --no-install ng version
```

**And audit `package.json`:** every binary invoked by a script must be a **direct** devDependency.
Then consider dropping `--legacy-peer-deps` entirely — the tree now resolves cleanly without it
(verified during the Angular 21 migration), and the flag is what hid the fault.

---

### P3 — Enforce the Obsidian token contract in code *(High · ~2 h)*

**Finding.** This project has the **strictest design-system rules in the workspace** — a two-layer
token contract, "no raw CSS values inside components", `PROD-FLAG[HARDCODED-STYLE]` — and
**zero automated enforcement**. The rules are defended only by review.

Meanwhile **both sibling projects ship `check-theme-contract.mjs`** enforcing their (less strict)
token contracts in CI. This project, which needs it most, is the one without it.

**Why it matters.** Framework §4.4: *an architectural rule with no executable check is a
suggestion, and will be violated within a quarter.* The PrimeNG 21 theming migration just moved
every component's styling substrate — exactly when an unenforced contract drifts.

**Proposal.** Port `check-theme-contract.mjs` from `restaurant-management-system` (it validates
that every contract token a component reads is globally declared, and that each registered theme
implements the full contract). Adapt to the `--obs-*` namespace and wire into a `lint:rules`
script, mirroring the siblings:

```json
"lint:rules": "node scripts/check-theme-contract.mjs && node scripts/check-no-raw-css.mjs"
```

This also directly de-risks **FLAG-06** (unverified visual regression).

---

### P4 — Enforce the storage rule — and fix the violation it would catch *(High · ~4 h)*

**Finding — two-part, and the second part is a live `[ABSOLUTE]` violation.**

1. There is no `check-no-localstorage-auth.mjs`. **Both sibling projects have one.**
2. `ArchitectureRecordDocument.md` documents storing JWTs in `localStorage` under
   `rdk_access_token` / `rdk_refresh_token`. The machine-level standard is unambiguous:
   *"Never store sensitive data in `localStorage`… the production-grade alternative for auth
   tokens is `HttpOnly; Secure; SameSite=Strict` cookies."* The ADR notes it as a deferred XSS risk
   mitigated by CSP — but **CSP does not mitigate this**; any XSS on the page reads `localStorage`
   directly.

The sibling projects treat this as `[ABSOLUTE]` rule #1 *and* enforce it with a script. This
project violates the rule and cannot detect the violation.

**Proposal.**
- **Short term:** port `check-no-localstorage-auth.mjs` and add it to `lint:rules`. It will fail —
  that is the point. Ratchet it (framework §3) if the migration can't be immediate.
- **Correct fix:** migrate token storage to `HttpOnly` cookies, as the siblings already do
  (`withCredentials: true`, silent-refresh interceptor). This is an ADR-level change; record it as
  a decision, not a patch.

---

### P5 — Ratify or revert the coverage-scope exclusion *(Medium · decision, not work)* — FLAG-08

**Finding.** During the migration, `collectCoverageFrom` gained `!src/app/features/**` (the
demo/showcase layer, ~40 files). No threshold number was lowered, and the exclusion is defensible
— but it was made **unilaterally, after the explicit instruction was "meet the existing floors"**.

**Why it matters.** Framework §9 anti-pattern 5 ("scope laundering"): narrowing what a gate
*measures* while leaving its threshold unchanged looks honest because the number didn't move.
**Changing scope is changing the gate.**

**Proposal.** Decide explicitly and record it in the ADR:
- **Keep** — then state plainly that the demo layer is unmeasured and regressions there are
  uncaught; or
- **Revert** — and accept that global coverage drops below its floor until the showcase is tested.

Either is fine. Leaving it undecided is not.

---

### P6 — Replace the 100% *function* floor with a branch floor *(Medium · ~1 h)* — FLAG-07

**Finding.** `jest.config.ts` sets 100% on **8 directories** across all four metrics. Meeting the
*function* metric forced tests whose only purpose is to invoke `forwardRef(() => Component)`
arrows and default no-op callbacks. They assert essentially nothing.

**Why it matters.** Framework §5: coverage measures **execution, not verification**. A 100%
function floor rewards calling code without checking it. Both sibling projects use a single 80%
floor and report far healthier numbers *with better tests*.

**Counter-evidence worth preserving:** the **branch** floor earned its keep during this migration —
a validator test passed while never executing the branch it claimed to cover (a `setValue()` call
re-ran validation and cleared the state itself). Only the stubbornly-red branch metric exposed it.

**Proposal.** Keep branch coverage as the primary floor. Drop the *function* floor to 80–90%, or
remove it. Consider aligning to the workspace's 80% business-logic standard rather than 100%
per-directory — the aggressive variant demonstrably produced ceremony here.

---

### P7 — Add a supply-chain job *(Medium · ~30 min)*

**Finding.** `npm audit --audit-level=high` runs as a step, but there is **no SBOM** and **no
licence policy**. Both sibling projects generate and upload a CycloneDX SBOM. The workspace
dependency-vetting standard requires licence compatibility; that check is currently manual —
which is how a PrimeNG 22 upgrade nearly pulled in `@primeui/license-manager` unnoticed.

**Proposal.** Add a parallel `supply-chain` job: `npm audit --audit-level=high`, generate a JS SBOM
(`@cyclonedx/cyclonedx-npm`), upload it as an artifact, and gate on a licence allow-list kept
in-repo so exceptions are reviewable.

---

### P8 — Close the visual-regression gap *(High · ~2 h)* — FLAG-06

**Finding.** The PrimeNG theming moved to the token-preset system and the `tabs` and `accordion`
templates were **rewritten wholesale**. All of it is verified by unit tests and a successful build
only — **no rendered output has been compared against the Obsidian references.** This is the
largest unverified surface in the migration.

**Proposal.** Screenshot the showcase against `docs/design-refs/` and confirm the `cssLayer`
ordering actually keeps `--obs-*` overrides winning. P3 (token-contract enforcement) covers the
token half; this covers the rendered half.

---

### P9 — Adopt progress gating *(Medium · ~2 h to establish)*

**Finding.** There is an ADR and a `progress.md`, but **no Definition of Done, no per-phase exit
gates, and no evidence trail**. Work is not gated by phase.

Both sibling projects gate progress: `IMPLEMENTATION-PLAN.md` (global DoD + per-layer exit gates,
written *before* the layer starts) and — in `restaurant-management-system` —
`audit.md` (per-layer evidence: the criteria table, the actual command output, the `[ABSOLUTE]`
checks, and an explicit "Deferred / accepted" list).

**Why it matters.** Framework §5. This project's own history is the argument: without a
Definition of Done, "the pipeline is green" was treated as "the project is sound", and five
unenforced gates went unnoticed for months.

**Proposal.** Add `IMPLEMENTATION-PLAN.md` with a global DoD and exit-gate criteria for the
remaining roadmap, plus `audit.md` starting from the **next** gate (don't reconstruct history).
Copy the structure from `restaurant-management-system` — it is the workspace reference.

---

### P10 — Branch protection + positive signals *(Low · ~15 min)*

**Finding.** CI now passes, but nothing verifies it is *required*. Also, nothing asserts the gates
did any work — zero collected tests would exit 0 and report green (framework §9 anti-pattern 3).

**Proposal.** Require every job **by name** as a status check, include admins, disable force-push.
Assert a floor on the reported test count and that build output is non-empty.

---

### P11 — Harden the pre-commit hook *(Low · ~10 min)*

**Finding.** `.githooks/pre-commit` runs gitleaks only. Both siblings run a fuller
`pre-commit` config: hygiene hooks (trailing whitespace, EOF, large files, merge-conflict markers,
private-key detection, YAML/TOML/JSON validation) plus a fast lint pass.

**Proposal.** Adopt the sibling `.pre-commit-config.yaml`. Keep the framework's Plane rule in mind:
pre-commit is **advisory** (`--no-verify` exists) — every hook must have a CI counterpart. The
current deny-by-default behaviour is good; keep it.

---

## 4. Deliberately not proposed

- **Reverting the `search` → `searched` rename** (FLAG-09) — it's a real lint finding, correctly
  fixed; it just needed to be surfaced as a decision. Confirm and move on.
- **Rushing `@primeng/themes` → `@primeuix/themes`** (FLAG-10) — deprecated upstream but
  functionally fine on v21. Do it alongside any future PrimeNG 22 evaluation.
- **Copying the siblings' 100%-per-directory floors** — they don't have them, and this project's
  experience is the argument against (P6).

---

## 5. Suggested order

**Fix the root causes before anything else** — P1 and P2 are the two structural faults that caused
the incident, and they are ~1 hour combined:

1. **P1** parallel jobs (FLAG-04) — the root cause
2. **P2** toolchain gate (FLAG-05) — the recurrence guard
3. **P10** branch protection — makes 1 and 2 actually binding
4. **P4** storage rule enforcement + the `localStorage` violation — live `[ABSOLUTE]` breach
5. **P3 / P8** token contract + visual regression — the migration's unverified surface
6. **P5 / P6** ratify coverage scope; fix the function floor
7. **P7 / P9 / P11** supply chain, progress gating, pre-commit

> Until P1 and P2 land, this pipeline can go silently blind again. Everything else is improvement;
> those two are repair.

---

## 6. Note to the workspace

**Propagate outward:** this project's checksum-verified, pinned gitleaks install is the strongest
secret-scanning setup in the workspace and should replace the mutable `gitleaks-action@v2` tag in
both sibling projects (recorded there as a proposal).

**Adopt inward:** `Verify declared toolchain present` and `import-linter` from `theLodge`;
`check-theme-contract.mjs`, `check-no-localstorage-auth.mjs` and the `audit.md` evidence pattern
from `restaurant-management-system`.
