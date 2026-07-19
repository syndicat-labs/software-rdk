import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Tier {
  readonly name: string;
  readonly price: string;
  readonly cadence: string;
  readonly summary: string;
  readonly features: readonly string[];
  readonly cta: string;
  readonly recommended?: boolean;
}

/**
 * Pricing — Modern (`rdk-default`).
 *
 * Modern's thesis is that convention is a feature: a reader who has seen a
 * hundred pricing tables should not have to learn a hundred-and-first. So this
 * is the three-tier table with a "Most popular" marker, in the order and shape
 * that pattern is normally met.
 *
 * The recommended tier is marked with brand colour and a badge rather than by
 * inverting its surface — `colorRole: brand-led`, `colorInHierarchy: supporting`.
 * `emphasisSurfaceBudget: 2` permits the marked tier plus the closing band.
 *
 * Contract tokens only.
 */
@Component({
  selector: 'rdk-pricing-modern',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pm">
      <header class="pm__head">
        <h2 class="pm__title">Simple, predictable pricing</h2>
        <p class="pm__sub">Every plan includes the full platform. Scale seats as you grow.</p>
      </header>

      <div class="pm__grid">
        @for (tier of tiers; track tier.name) {
          <article class="pm__tier" [class.pm__tier--recommended]="tier.recommended">
            @if (tier.recommended) {
              <span class="pm__badge">Most popular</span>
            }
            <h3 class="pm__tier-name">{{ tier.name }}</h3>
            <p class="pm__tier-summary">{{ tier.summary }}</p>

            <p class="pm__price">
              <span class="pm__amount">{{ tier.price }}</span>
              <span class="pm__cadence">{{ tier.cadence }}</span>
            </p>

            <ul class="pm__features">
              @for (feature of tier.features; track feature) {
                <li class="pm__feature">
                  <span class="pm__tick" aria-hidden="true">✓</span>
                  {{ feature }}
                </li>
              }
            </ul>

            <button
              type="button"
              class="pm__cta"
              [class.pm__cta--primary]="tier.recommended"
            >
              {{ tier.cta }}
            </button>
          </article>
        }
      </div>

      <aside class="pm__band">
        <div>
          <h3 class="pm__band-title">Need something larger?</h3>
          <p class="pm__band-body">
            Volume licensing, procurement review and a named contact.
          </p>
        </div>
        <button type="button" class="pm__cta pm__cta--onband">Talk to sales</button>
      </aside>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: var(--space-layout-md);
        background: var(--color-bg-base);
      }

      .pm__head {
        max-width: 46ch;
        margin-bottom: var(--space-layout-md);
      }
      .pm__title {
        color: var(--color-text-primary);
        font-family: var(--font-heading);
        font-size: 2rem;
        line-height: 1.15;
      }
      .pm__sub {
        margin-top: var(--space-component-md);
        color: var(--color-text-secondary);
        line-height: 1.6;
      }

      .pm__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
        gap: var(--space-layout-sm);
        align-items: start;
      }

      /* Soft Card: border and lift together, neither alone. */
      .pm__tier {
        position: relative;
        display: flex;
        flex-direction: column;
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        box-shadow: var(--elevation-raised);
        padding: var(--space-component-lg);
      }

      /* Recommended is marked by brand colour, not by inverting the surface. */
      .pm__tier--recommended {
        border-color: var(--color-border-brand);
        box-shadow: var(--elevation-float);
      }

      .pm__badge {
        position: absolute;
        top: 0;
        right: var(--space-component-lg);
        transform: translateY(-50%);
        background: var(--color-bg-brand);
        color: var(--color-text-inverse);
        border-radius: var(--radius-pill);
        padding: 0.1875rem 0.625rem;
        font-size: 0.6875rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .pm__tier-name {
        color: var(--color-text-primary);
        font-family: var(--font-heading);
        font-size: 1.125rem;
      }
      .pm__tier-summary {
        margin-top: var(--space-component-xs);
        color: var(--color-text-secondary);
        font-size: 0.8125rem;
      }

      .pm__price {
        display: flex;
        align-items: baseline;
        gap: var(--space-component-xs);
        margin: var(--space-component-lg) 0;
      }
      .pm__amount {
        color: var(--color-text-primary);
        font-family: var(--font-data);
        font-size: 2.25rem;
        line-height: 1;
      }
      .pm__cadence {
        color: var(--color-text-muted);
        font-size: 0.8125rem;
      }

      .pm__features {
        list-style: none;
        margin: 0 0 var(--space-component-lg);
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-component-sm);
        flex: 1;
      }
      .pm__feature {
        display: flex;
        gap: var(--space-component-sm);
        color: var(--color-text-secondary);
        font-size: 0.8125rem;
        line-height: 1.5;
      }
      .pm__tick {
        color: var(--color-text-brand);
        flex-shrink: 0;
      }

      .pm__cta {
        width: 100%;
        min-height: 2.25rem;
        border-radius: var(--radius-component);
        border: 1px solid var(--color-border-default);
        background: var(--color-bg-surface);
        color: var(--color-text-primary);
        font: inherit;
        font-size: 0.875rem;
        cursor: pointer;
        transition: background var(--duration-200) var(--ease-in-out);
      }
      .pm__cta:hover {
        background: var(--color-hover-overlay);
      }
      .pm__cta--primary {
        background: var(--color-bg-brand);
        border-color: var(--color-border-brand);
        color: var(--color-text-inverse);
      }
      .pm__cta:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }

      /* Gradient Anchor — the second permitted emphasis surface. */
      .pm__band {
        margin-top: var(--space-layout-md);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-layout-xs);
        flex-wrap: wrap;
        background: var(--color-surface-featured);
        border: 1px solid var(--color-surface-featured-border);
        border-radius: var(--radius-surface);
        padding: var(--space-component-lg);
      }
      .pm__band-title {
        color: var(--color-surface-featured-text);
        font-family: var(--font-heading);
        font-size: 1.0625rem;
      }
      .pm__band-body {
        margin-top: var(--space-component-xs);
        color: var(--color-surface-featured-muted);
        font-size: 0.8125rem;
      }
      .pm__cta--onband {
        width: auto;
        padding: 0 var(--space-component-lg);
        background: var(--color-bg-surface);
        border-color: transparent;
        color: var(--color-text-primary);
      }
    `,
  ],
})
export class PricingModernComponent {
  protected readonly tiers: readonly Tier[] = [
    {
      name: 'Starter',
      price: '£19',
      cadence: '/user/mo',
      summary: 'For small teams getting started.',
      features: ['Up to 10 seats', 'Core platform', 'Community support', '30-day history'],
      cta: 'Start free trial',
    },
    {
      name: 'Growth',
      price: '£49',
      cadence: '/user/mo',
      summary: 'For teams that need controls and reporting.',
      features: [
        'Unlimited seats',
        'Advanced reporting',
        'Priority support',
        '12-month history',
        'SSO and SCIM',
      ],
      cta: 'Start free trial',
      recommended: true,
    },
    {
      name: 'Scale',
      price: '£99',
      cadence: '/user/mo',
      summary: 'For organisations with compliance obligations.',
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
