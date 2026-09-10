import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Tier {
  readonly name: string;
  readonly price: string;
  readonly cadence: string;
  readonly summary: string;
  readonly features: readonly string[];
  readonly cta: string;
  readonly featured?: boolean;
}

/**
 * Pricing — Gokul (`gokul`).
 *
 * The ops-terminal answer to the pricing problem: a compact print column, not a
 * marketing table. Figures are set in mono, separations are hairlines, and the
 * grid has no depth — `depthModel: flat`, `surfaceBoundary: border`,
 * `cornerPhilosophy: square`.
 *
 * Exactly one tier carries emphasis: the featured row is the lifted paper face
 * of the Ink Well / Display Figure patterns (`emphasisSurfaceBudget: 1`,
 * `colorInHierarchy: excluded`). It is marked by surface contrast alone — a light
 * sheet on ink — not by colour, so the decision-critical figure finds the eye
 * before anything else.
 *
 * Contract tokens only.
 */
@Component({
  selector: 'rdk-pricing-gokul',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pg">
      <header class="pg__head">
        <h2 class="pg__title">Plan the fleet — not a brochure</h2>
        <p class="pg__sub">
          Three tiers, one decision. Rows carry weight; the featured row carries the view.
        </p>
      </header>

      <div class="pg__grid">
        @for (tier of tiers; track tier.name) {
          <article class="pg__tier" [class.pg__tier--featured]="tier.featured">
            <div class="pg__tier-head">
              <h3 class="pg__tier-name">{{ tier.name }}</h3>
              <p class="pg__tier-summary">{{ tier.summary }}</p>
            </div>

            <p class="pg__price">
              <span class="pg__amount">{{ tier.price }}</span>
              <span class="pg__cadence">{{ tier.cadence }}</span>
            </p>

            <ul class="pg__features">
              @for (feature of tier.features; track feature) {
                <li class="pg__feature">
                  <span class="pg__tick" aria-hidden="true">▶</span>
                  {{ feature }}
                </li>
              }
            </ul>

            <button type="button" class="pg__cta" [class.pg__cta--featured]="tier.featured">
              {{ tier.cta }}
            </button>
          </article>
        }
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: var(--space-layout-md);
        background: var(--color-bg-base);
      }

      .pg__head {
        max-width: 46ch;
        margin-bottom: var(--space-layout-md);
      }
      .pg__title {
        color: var(--color-text-primary);
        font-family: var(--font-heading);
        font-size: 2rem;
        line-height: 1.1;
      }
      .pg__sub {
        margin-top: var(--space-component-sm);
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        line-height: 1.6;
      }

      .pg__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
        gap: var(--space-layout-xs);
        align-items: stretch;
      }

      /* Ink Well + Hairline Rule: separation by stroke and tone, never by lift. */
      .pg__tier {
        display: flex;
        flex-direction: column;
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        padding: var(--space-component-md);
        gap: var(--space-component-sm);
      }

      /* The featured tier flips to the lifted paper face — the one Display
         Figure per view, lightest ink on the darkest ground. */
      .pg__tier--featured {
        background: var(--color-surface-featured);
        border-color: var(--color-surface-featured-border);
        color: var(--color-surface-featured-text);
      }

      .pg__tier-name {
        color: inherit;
        font-family: var(--font-heading);
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .pg__tier-summary {
        margin-top: var(--space-component-xs);
        color: var(--color-text-muted);
        font-size: 0.75rem;
      }
      .pg__tier--featured .pg__tier-summary {
        color: var(--color-surface-featured-muted);
      }

      .pg__price {
        display: flex;
        align-items: baseline;
        gap: var(--space-component-xs);
        margin: var(--space-component-md) 0 var(--space-component-sm);
      }
      .pg__amount {
        font-family: var(--font-data);
        font-size: 2rem;
        line-height: 1;
      }
      .pg__cadence {
        color: var(--color-text-muted);
        font-size: 0.75rem;
      }
      .pg__tier--featured .pg__cadence {
        color: var(--color-surface-featured-muted);
      }

      .pg__features {
        list-style: none;
        margin: 0 0 var(--space-component-md);
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-component-sm);
        flex: 1;
        font-size: 0.8125rem;
        color: var(--color-text-secondary);
      }
      .pg__feature {
        display: flex;
        gap: var(--space-component-sm);
        line-height: 1.5;
      }
      .pg__tick {
        color: var(--color-text-brand);
        flex-shrink: 0;
        font-family: var(--font-data);
        font-size: 0.625rem;
      }
      .pg__tier--featured .pg__tick {
        color: var(--color-surface-featured-text);
      }

      .pg__cta {
        width: 100%;
        min-height: 2.25rem;
        border-radius: var(--radius-component);
        border: 1px solid var(--color-border-default);
        background: var(--color-bg-surface);
        color: var(--color-text-primary);
        font: inherit;
        font-size: 0.8125rem;
        font-family: var(--font-data);
        cursor: pointer;
        transition: background var(--duration-200) var(--ease-in-out);
      }
      .pg__cta--featured {
        background: var(--color-bg-brand);
        border-color: var(--color-border-brand);
        color: var(--color-text-inverse);
      }
      .pg__cta:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }
    `,
  ],
})
export class PricingGokulComponent {
  protected readonly tiers: readonly Tier[] = [
    {
      name: 'Starter',
      price: '£19',
      cadence: '/user/mo',
      summary: 'Small teams, core tooling.',
      features: ['Up to 10 seats', 'Core platform', 'Community support', '30-day history'],
      cta: 'Start free trial',
    },
    {
      name: 'Growth',
      price: '£49',
      cadence: '/user/mo',
      summary: 'Controls and reporting.',
      features: [
        'Unlimited seats',
        'Advanced reporting',
        'Priority support',
        '12-month history',
        'SSO and SCIM',
      ],
      cta: 'Start free trial',
      featured: true,
    },
    {
      name: 'Scale',
      price: '£99',
      cadence: '/user/mo',
      summary: 'Compliance obligations.',
      features: [
        'Everything in Growth',
        'Audit export',
        'Named success contact',
        'Unlimited history',
        'Custom data residency',
      ],
      cta: 'Contact sales',
    },
  ];
}