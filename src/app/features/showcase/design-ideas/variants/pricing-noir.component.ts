import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Column {
  readonly name: string;
  readonly price: string;
  readonly cadence: string;
  readonly summary: string;
  readonly features: readonly string[];
  readonly cta: string;
  readonly marked?: boolean;
}

/**
 * Pricing — Noir (`noir`), variant of Paper.
 *
 * The same broadsheet columns as Paper, set for night reading. The deviation is
 * owned by the night: `darkStrategy: single-palette` is this world's own
 * construction, `colorRole: functional-only` and `colorInHierarchy: excluded`
 * because once the acid highlight collapses to white there is no hue left in the
 * hierarchy. The recommended tier is the White Highlighter — warm-white on
 * warm-ink — and the headline scale does the ranking, exactly as on Paper.
 *
 * Contract tokens only.
 */
@Component({
  selector: 'rdk-pricing-noir',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pn">
      <header class="pn__head">
        <h2 class="pn__masthead">The same pricing, set for night</h2>
        <p class="pn__deck">
          Paper columns after lights-out: no glare, no gamut, the mark is white.
        </p>
      </header>

      <div class="pn__row">
        @for (column of columns; track column.name) {
          <article class="pn__col" [class.pn__col--marked]="column.marked">
            @if (column.marked) {
              <span class="pn__mark">Recommended</span>
            }
            <h3 class="pn__col-name">{{ column.name }}</h3>
            <p class="pn__col-summary">{{ column.summary }}</p>

            <p class="pn__price">
              <span class="pn__amount">{{ column.price }}</span>
              <span class="pn__cadence">{{ column.cadence }}</span>
            </p>

            <ul class="pn__features">
              @for (feature of column.features; track feature) {
                <li class="pn__feature">
                  <span class="pn__tick" aria-hidden="true">✓</span>
                  {{ feature }}
                </li>
              }
            </ul>

            <button type="button" class="pn__cta" [class.pn__cta--marked]="column.marked">
              {{ column.cta }}
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

      .pn__head {
        max-width: 46ch;
        margin-bottom: var(--space-layout-md);
        border-bottom: 2px solid var(--color-border-strong);
        padding-bottom: var(--space-component-md);
      }
      .pn__masthead {
        color: var(--color-text-primary);
        font-family: var(--font-heading);
        font-size: 2rem;
        line-height: 1.1;
      }
      .pn__deck {
        margin-top: var(--space-component-sm);
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        line-height: 1.6;
      }

      .pn__row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
        gap: var(--space-layout-sm);
        align-items: start;
      }

      /* Paper layers after dark: sheets still separate by rule. */
      .pn__col {
        position: relative;
        display: flex;
        flex-direction: column;
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        padding: var(--space-component-lg);
        gap: var(--space-component-sm);
      }

      /* White Highlighter: the featured element is warm-white on warm-ink,
         no hue allowed back. */
      .pn__mark {
        position: absolute;
        top: 0;
        right: var(--space-component-lg);
        transform: translateY(-50%);
        background: var(--color-bg-brand);
        color: var(--color-text-inverse);
        border-radius: var(--radius-pill);
        padding: 0.1875rem 0.625rem;
        font-size: 0.6875rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .pn__col-name {
        color: var(--color-text-primary);
        font-family: var(--font-heading);
        font-size: 1.125rem;
      }
      .pn__col-summary {
        margin-top: var(--space-component-xs);
        color: var(--color-text-secondary);
        font-size: 0.8125rem;
      }

      .pn__price {
        display: flex;
        align-items: baseline;
        gap: var(--space-component-xs);
        margin: var(--space-component-lg) 0 var(--space-component-sm);
      }
      .pn__amount {
        color: var(--color-text-primary);
        font-family: var(--font-data);
        font-size: 2.25rem;
        line-height: 1;
      }
      .pn__cadence {
        color: var(--color-text-muted);
        font-size: 0.8125rem;
      }

      .pn__features {
        list-style: none;
        margin: 0 0 var(--space-component-lg);
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-component-sm);
        flex: 1;
        color: var(--color-text-secondary);
        font-size: 0.8125rem;
      }
      .pn__feature {
        display: flex;
        gap: var(--space-component-sm);
        line-height: 1.5;
      }
      .pn__tick {
        color: var(--color-text-brand);
        flex-shrink: 0;
      }

      .pn__cta {
        width: 100%;
        min-height: 2.25rem;
        border-radius: var(--radius-component);
        border: 1px solid var(--color-border-default);
        background: var(--color-bg-surface);
        color: var(--color-text-primary);
        font: inherit;
        font-size: 0.875rem;
        cursor: pointer;
      }
      .pn__cta--marked {
        background: var(--color-bg-brand);
        border-color: var(--color-border-brand);
        color: var(--color-text-inverse);
      }
      .pn__cta:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }
    `,
  ],
})
export class PricingNoirComponent {
  protected readonly columns: readonly Column[] = [
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
      marked: true,
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