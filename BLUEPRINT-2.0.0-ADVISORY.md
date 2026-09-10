# Blueprint 2.0.0 — Authority State & Upgrade Advisory (software-rdk)

> Generated 2026-09-09 from `/home/work/build-blueprint` (canonical machine standards root, v2.0.0).
> This file is advisory. It does not override project rules — but the machine standards DO:
> per §16, project files may extend but never override the machine-level standards.

## 1. Current state of authority

- **Root + version:** the authoritative standards moved to `/home/work/build-blueprint`,
  pinned aggregate **2.0.0** (`VERSION`, `MANIFEST.json` sha256-pinning 179 files), git-tracked,
  tag `build-blueprint-v2.0.0`.
- **Thin index + 17 modules:** `CLAUDE.md` is a thin index over `standards/01…17` (persona,
  build modes & the **closed 23-tag `PROD-FLAG[...]` registry**, philosophy, assumption
  discipline, production readiness, security, dependency vetting, error handling, code quality,
  testing, data & API, observability & CI/CD, tech & ADR, branch hygiene, design system,
  **project inheritance**, AI governance).
- **ADR v2 + five-layer security:** `ArchitectureDecisionRecord.md` (28 sections; §17 =
  five-layer security matrix L1–L5, canonical authority `SECURITY-FRAMEWORK.md`) +
  `ADR-FRAMEWORK.md` + `templates/adr-enterprise-annex.md`.
- **Design:** `design-language-protocol.md` — **18 closed slots**, philosophy schema, Tier A–C
  gates. Your ARD amendment of 2026-07-18 adopted a *v1.0.0* of this protocol; the machine
  root now carries the authoritative 18-slot version.
- **Ledger:** `assumptions&errors.md` — machine-wide, 27 entries; read the pattern index
  before declaring work complete; append any new wrong claim/gate-caught defect.
- **Enforcement:** `scripts/lint-standards.sh` (**8 gates** incl. `retrieval-current`),
  `assemble-claude.sh`, `verify-ledger.sh`, `install-blueprint.mjs`, `check-no-secrets.sh`,
  `check-no-localstorage-auth.mjs`, `build-chunks.mjs`, `retrieve.mjs`.
- **RAG + skill:** 137 chunks, 25 sources in `retrieval/` — query with
  `node /home/work/build-blueprint/scripts/retrieve.mjs --query "<terms>"`. The
  `blueprint-guard` skill is registered at `~/.claude/skills/blueprint-guard`.

## 2. Strict adherence — what "compliant" means here

1. **ADR before code (§13).** Every consequential decision goes through the ADR process. Your
   `ArchitectureRecordDocument.md` (ADR-001…005 + amendments up to T7-2026-09-08) is historical;
   new decisions enter through the v2 28-section template (see §3 migration).
2. **Ask, don't assume (§04, `[ABSOLUTE]`).** Stop on ambiguous-but-consequential instruction.
3. **No destructive action without per-action confirmation (§06, `[ABSOLUTE]`).** Live DB, `.env`,
   auth/TLS, data-losing migrations, stateful infra — confirm every time.
4. **Never store auth tokens in `localStorage`/`sessionStorage` (§06 `[ABSOLUTE]`).**
   `HttpOnly; Secure; SameSite=Strict` cookies only. An Angular SPA is this rule's primary
   risk surface — enforced by `check-no-localstorage-auth`.
5. **Maintain the ledger.** Any gate-caught defect or wrong claim gets appended, indexed by the
   reasoning that produced it.
6. **Build mode is PRODUCTION** unless an explicit `[PROTO]` block; every bypass annotated with
   a closed `PROD-FLAG[tag]` and closed by a Production Readiness Checklist (§02).

## 3. Full upgrade recommendations

| # | Action | Rationale / mechanics |
|---|---|---|
| 1 | **Pin the blueprint snapshot** | `node /home/work/build-blueprint/scripts/install-blueprint.mjs . --pin 2.0.0` → `.blueprint/` with all 179 files integrity-verified. Re-pin on each bump. |
| 2 | **Add a machine-standards pointer** | Your root has no `CLAUDE.md` (only `.claude/`). Add one line registering the inheritance chain: "Machine standards: `/home/work/build-blueprint` v2.0.0 (`CLAUDE.md` index + `standards/01–17`); project files extend, never override." |
| 3 | **Migrate ARD → machine ADR gate** | `ArchitectureRecordDocument.md` is your running ADR register. The ADR-GATE requires an `ArchitectureDecisionRecord.md` at root. Keep the ARD as the appendix-bearing record; add a thin `ArchitectureDecisionRecord.md` declaring `blueprintVersion: 2.0.0`, mapping the 28 sections onto the ARD (§17 = five-layer matrix), and registering accepted risks. Log the mapping in the ledger. |
| 4 | **Wholesale 23-flag registry** | Adopt the closed 23-tag `PROD-FLAG[...]` registry from `standards/02`; grep-and-re-annotate old bypass markers. |
| 5 | **Wire the enforcement chain** | You already have `.githooks/` on the repo. Add the machine `check-no-secrets.sh` + `check-no-localstorage-auth.mjs` (or install the `.githooks/pre-commit` from the blueprint). The Angular client is the `localStorage`-token audit target. |
| 6 | **Re-align design protocol to 18 slots** | Your 2026-07-18 DLP-v1.0.0 amendment predates the authoritative 18-slot protocol. Diff your theme/token contract against `design-language-protocol.md` (exactly 18 slots, philosophy schema, Tier A gate). Your `check-theme-contract.mjs`/`check-contrast.mjs` are the enforcement points to upgrade. |
| 7 | **Signals state + testing floor** | §10: 80% coverage floor + adversarial tests (you already use Jest/Playwright — extend the adversarial set). §08: typed error taxonomy with the mandatory minimum categories. |
| 8 | **Supply chain (L5)** | Angular dependency surface: `npm audit`/`pip-audit` as a CI/SBOM gate per `SECURITY-FRAMEWORK.md` L5 + SLSA/sigstore. `npm` tree is already large (node_modules present) — this is the highest-leverage L5 item. |
| 9 | **Retrieval as the default lookup** | `node /home/work/build-blueprint/scripts/retrieve.mjs --query "<topic>" [--module N]` instead of paraphrasing rule text. |

## 4. Deprecation window

The pre-modular single-file machine `CLAUDE.md`/old inheritance chain is superseded; old ARD
names have a 90-day deprecation window (see `MIGRATIONS.md` / `COMPATIBILITY.md`).
`ArchitectureRecordDocument.md` as a *working* file is not forbidden, but it must not satisfy
the machine ADR-GATE without the mapping in step 3.