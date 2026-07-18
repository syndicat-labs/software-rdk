# Third-Party Notices

`software-rdk` is distributed under the MIT License (see [`LICENSE`](./LICENSE)). It incorporates
or derives from the third-party works listed below. Each entry records what was taken and under
which licence, so downstream consumers inherit a complete attribution chain.

Add an entry **at the time** material is incorporated, not retroactively.

---

## Runtime dependencies

Declared in `package.json` and resolved via `package-lock.json`. Their licences are reproduced in
`node_modules/<pkg>/LICENSE` and are not duplicated here.

| Package | Licence |
|---|---|
| Angular (`@angular/*`) | MIT |
| Angular CDK (`@angular/cdk`) | MIT |
| PrimeNG (`primeng`, `@primeng/themes`) | MIT |
| PrimeIcons (`primeicons`) | MIT |
| RxJS (`rxjs`) | Apache-2.0 |
| tslib | 0BSD |
| zone.js | MIT |

---

## Design and component sources

Material studied or adapted into this repository's components, tokens or design languages.

| Source | Licence | What was taken | Where it lives |
|---|---|---|---|
| _(none yet)_ | | | |

**Pending, approved for study:** [HyperUI](https://github.com/markmead/hyperui) (MIT),
[Preline](https://preline.co) (MIT), [Flowbite](https://flowbite.com) (MIT core),
[shadcn/ui](https://github.com/shadcn-ui/ui) (MIT), Headless UI (MIT). Entries are added here when
material is actually incorporated.

---

## Explicitly excluded sources

Recorded so the exclusion is durable and not re-litigated.

### Tailwind Plus — excluded, not licence-compatible

**Tailwind Plus** (formerly Tailwind UI), including the **Catalyst** UI kit, the **Oatmeal**
marketing kit and the **UI Blocks** collection, is a commercial product whose licence prohibits the
use this repository would make of it. `software-rdk` is a **public, cloneable starter kit**, which
the Tailwind Plus licence names as a prohibited use in three separate clauses:

> "Converting a Tailwind Plus template to another framework and making it available either for sale
> or for free."

> "Creating a theme, template, or project starter kit using the components, templates, or libraries
> and making it available either for sale or for free."

> "Creating a repository of your favorite Tailwind Plus components, templates, or libraries (or
> derivatives of them) and publishing it publicly."

Purchasing a licence does **not** resolve this. The restriction is on redistribution, not access: a
Team licence permits use within an *End Product*, and a publicly cloneable toolkit is not one.
Porting to Angular is specifically enumerated and is therefore not a workaround.

No Tailwind Plus markup, styling, component structure or derivative thereof may enter this
repository. Public *rendered* pages listed on <https://tailwindcss.com/showcase> are ordinary
websites and may be studied for design-language observation like any other public site; that is
distinct from incorporating Tailwind Plus source.
