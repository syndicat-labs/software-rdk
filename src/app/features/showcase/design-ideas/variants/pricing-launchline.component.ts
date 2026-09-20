import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Ticket {
  readonly name: string;
  readonly price: string;
  readonly cadence: string;
  readonly summary: string;
  readonly features: readonly string[];
  readonly cta: string;
  readonly anchored?: boolean;
}

/**
 * Pricing — Launchline Obsidian (`launchline-obsidian`), variant of Obsidian.
 *
 * The terminal deck answer to the pricing problem. The deck cuts, it does not
 * animate; prompts, output and figures share the monospace voice
 * (`monospaceScope: unrestricted`, `typeRoleAssignment` display = JetBrains Mono);
 * density is compact to fit more runway per screen.
 *
 * The recommended tier is the single Dark Card Anchor — the near-black inverted
 * well carrying the decision-critical figure `sectionRhythm: surface-inversion`,
 * `emphasisSurfaceBudget: 1`. Every other tier is a prompt line: marked by
 * weight and offset, never by colour (`colorInHierarchy: excluded`,
 * `polarityEncoding: weight-before-color`).
 *
 * Contract tokens only.
 */
@Component({
  selector: 'rdk-pricing-launchline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pl">
      <header class="pl__head">
        <h2 class="pl__title">Pricing — launch an engine, not a brochure</h2>
        <p class="pl__sub">Three runways. The anchored console carries the go decision.</p>
      </header>

      <div class="pl__deck">
        @for (ticket of tickets; track ticket.name) {
          <article class="pl__ticket" [class.pl__ticket--anchored]="ticket.anchored">
            <p class="pl__name">{{ ticket.name }}</p>
            <p class="pl__summary">{{ ticket.summary }}</p>

            <p class="pl__price">
              <span class="pl__amount">{{ ticket.price }}</span>
              <span class="pl__cadence">{{ ticket.cadence }}</span>
            </p>

            <ul class="pl__features">
              @for (feature of ticket.features; track feature) {
                <li class="pl__feature">
                  <span class="pl__tick" aria-hidden="true">&gt;</span>
                  {{ feature }}
                </li>
              }
            </ul>

            <button type="button" class="pl__cta" [class.pl__cta--anchored]="ticket.anchored">
              {{ ticket.cta }}
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

      .pl__head {
        max-width: 46ch;
        margin-bottom: var(--space-layout-md);
        border-bottom: 1px solid var(--color-border-strong);
        padding-bottom: var(--space-component-md);
      }
      .pl__title {
        color: var(--color-text-primary);
        font-family: var(--font-heading);
        font-size: 2rem;
        line-height: 1.1;
      }
      .pl__sub {
        margin-top: var(--space-component-sm);
        color: var(--color-text-secondary);
        font-family: var(--font-data);
        font-size: 0.8125rem;
        line-height: 1.6;
      }

      .pl__deck {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
        gap: var(--space-layout-sm);
        align-items: stretch;
      }

      /* Prompt Line: every tier is a state, marked by weight and offset. */
      .pl__ticket {
        display: flex;
        flex-direction: column;
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        box-shadow: var(--elevation-raised);
        padding: var(--space-component-md);
        gap: var(--space-component-sm);
      }

      /* Dark Card Anchor: the one inverted console, near-black, mono figure. */
      .pl__ticket--anchored {
        background: var(--color-surface-featured);
        border-color: var(--color-surface-featured-border);
        color: var(--color-surface-featured-text);
        box-shadow: var(--elevation-float);
      }

      .pl__name {
        font-family: var(--font-data);
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .pl__summary {
        margin-top: var(--space-component-xs);
        color: var(--color-text-muted);
        font-size: 0.75rem;
        line-height: 1.5;
      }
      .pl__ticket--anchored .pl__summary {
        color: var(--color-surface-featured-muted);
      }

      .pl__price {
        display: flex;
        align-items: baseline;
        gap: var(--space-component-xs);
        margin: var(--space-component-md) 0 var(--space-component-sm);
      }
      .pl__amount {
        font-family: var(--font-data);
        font-size: 2rem;
        line-height: 1;
      }
      .pl__cadence {
        color: var(--color-text-muted);
        font-family: var(--font-data);
        font-size: 0.75rem;
      }
      .pl__ticket--anchored .pl__cadence {
        color: var(--color-surface-featured-muted);
      }

      .pl__features {
        list-style: none;
        margin: 0 0 var(--space-component-md);
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-component-sm);
        flex: 1;
        color: var(--color-text-secondary);
        font-family: var(--font-data);
        font-size: 0.75rem;
        line-height: 1.5;
      }

      .pl__cta {
        width: 100%;
        min-height: 2.25rem;
        border-radius: var(--radius-component);
        border: 1px solid var(--color-border-default);
        background: var(--color-bg-surface);
        color: var(--color-text-primary);
        font: inherit;
        font-family: var(--font-data);
        font-size: 0.8125rem;
        cursor: pointer;
      }
      .pl__cta--anchored {
        background: var(--color-bg-brand);
        border-color: var(--color-border-brand);
        color: var(--color-text-inverse);
      }
      .pl__cta:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }
    `,
  ],
})
export class PricingLaunchlineComponent {
  protected readonly tickets: readonly Ticket[] = [
    {
      name: 'starter_engine',
      price: '£19',
      cadence: '/user/mo',
      summary: 'Small teams, core tooling.',
      features: ['up to 10 seats', 'core platform', 'community support', '30-day history'],
      cta: 'start_free_trial',
    },
    {
      name: 'growth_engine',
      price: '£49',
      cadence: '/user/mo',
      summary: 'Controls and reporting.',
      features: [
        'unlimited seats',
        'advanced reporting',
        'priority support',
        '12-month history',
        'sso_and_scim',
      ],
      cta: 'start_free_trial',
      anchored: true,
    },
    {
      name: 'scale_engine',
      price: '£99',
      cadence: '/user/mo',
      summary: 'Compliance obligations.',
      features: [
        'everything_in_growth',
        'audit_export',
        'named_success_contact',
        'unlimited_history',
        'custom_data_residency',
      ],
      cta: 'contact_sales',
    },
  ];
}