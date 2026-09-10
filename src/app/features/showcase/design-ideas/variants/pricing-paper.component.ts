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
 * Pricing — Paper (`paper`).
 *
 * The newsprint answer to the pricing problem: three broadsheet columns divided
 * by hairlines (`sectionRhythm: border-rule`), a masthead headline in Montserrat,
 * figures set in mono, and warm paper beneath it all (`surfaceBoundary: border`,
 * `depthModel: flat`).
 *
 * The recommended tier carries the Highlighter Mark — the language's single
 * emphasis surface (`emphasisSurfaceBudget: 1`, `colorRole: brand-led`): an
 * acid-yellow sheet, which is what the signature hue is for and nothing else
 * shares it. Ink Accounting keeps every figure legible in greyscale.
 *
 * Contract tokens only.
 */
@Component({
  selector: 'rdk-pricing-paper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pp">
      <header class="pp__head">
        <h2 class="pp__masthead">Pricing, set in columns</h2>
        <p class="pp__deck">
          Three pages to choose from. The masthead says what they are; the mark says
          where to start.
        </p>
      </header>

      <div class="pp__row">
        @for (column of columns; track column.name) {
          <article class="pp__col" [class.pp__col--marked]="column.marked">
            @if (column.marked) {
              <span class="pp__mark">Recommended</span>
            }
            <h3 class="pp__col-name">{{ column.name }}</h3>
            <p class="pp__col-summary">{{ column.summary }}</p>

            <p class="pp__price">
              <span class="pp__amount">{{ column.price }}</span>
              <span class="pp__cadence">{{ column.cadence }}</span>
            </p>

            <ul class="pp__features">
              @for (feature of column.features; track feature) {
                <li class="pp__feature">
                  <span class="pp__tick" aria-hidden="true">✓</span>
                  {{ feature }}
                </li>
              }
            </ul>

            <button type="button" class="pp__cta" [class.pp__cta--marked]="column.marked">
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

      .pp__head {
        max-width: 46ch;
        margin-bottom: var(--space-layout-md);
        border-bottom: 2px solid var(--color-border-strong);
        padding-bottom: var(--space-component-md);
      }
      .pp__masthead {
        color: var(--color-text-primary);
        font-family: var(--font-heading);
        font-size: 2rem;
        line-height: 1.1;
      }
      .pp__deck {
        margin-top: var(--space-component-sm);
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        line-height: 1.6;
      }

      .pp__row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
        gap: var(--space-layout-sm);
        align-items: start;
      }

      /* Newsprint Column: sheets separate by rule, no lift, no depth. */
      .pp__col {
        position: relative;
        display: flex;
        flex-direction: column;
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        padding: var(--space-component-lg);
        gap: var(--space-component-sm);
      }

      .pp__mark {
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

      .pp__col-name {
        color: var(--color-text-primary);
        font-family: var(--font-heading);
        font-size: 1.125rem;
      }
      .pp__col-summary {
        margin-top: var(--space-component-xs);
        color: var(--color-text-secondary);
        font-size: 0.8125rem;
      }

      .pp__price {
        display: flex;
        align-items: baseline;
        gap: var(--space-component-xs);
        margin: var(--space-component-lg) 0 var(--space-component-sm);
      }
      .pp__amount {
        color: var(--color-text-primary);
        font-family: var(--font-data);
        font-size: 2.25rem;
        line-height: 1;
      }
      .pp__cadence {
        color: var(--color-text-muted);
        font-size: 0.8125rem;
      }

      .pp__features {
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
      .pp__feature {
        display: flex;
        gap: var(--space-component-sm);
        line-height: 1.5;
      }
      .pp__tick {
        color: var(--color-text-brand);
        flex-shrink: 0;
      }

      .pp__cta {
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
      .pp__cta--marked {
        background: var(--color-bg-brand);
        border-color: var(--color-border-brand);
        color: var(--color-text-inverse);
      }
      .pp__cta:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }
    `,
  ],
})
export class PricingPaperComponent {
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