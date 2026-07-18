import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Service {
  readonly index: string;
  readonly title: string;
  readonly points: readonly string[];
}

/**
 * Pricing — theEvolute (`evolute`).
 *
 * Structure informed by `docs/design-refs/pricing2.jpg`: a flush row of tiles,
 * the first an illustrated gradient anchor, the rest indexed `/01 /02 /03` with
 * a checklist settling to the bottom edge.
 *
 * The philosophy drives the differences from Modern's table:
 *
 * - `emphasisSurfaceBudget: unbounded` — no tier is marked "most popular". The
 *   refusal is explicit: "manufacturing importance with a single anchor".
 * - `sectionRhythm: elevation` — tiles separate by lift, not by inversion.
 * - `decoration: gradient-and-illustration` with Gradient as Vector — the anchor
 *   tile's gradient runs along the reading direction, encoding progression.
 * - `colorInHierarchy: primary` — each tile carries a hue, which is what the
 *   Chromatic Key pattern is for. The index numeral is the redundant non-colour
 *   cue that keeps it conformant in greyscale.
 *
 * Contract tokens only.
 */
@Component({
  selector: 'rdk-pricing-evolute',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pe">
      <header class="pe__head">
        <h2 class="pe__title">
          <span class="pe__title-lead">Engagements shaped</span> around how your team already works
        </h2>
      </header>

      <div class="pe__row">
        <article class="pe__anchor">
          <div class="pe__anchor-art" aria-hidden="true"></div>
          <p class="pe__anchor-label">Our engagements.</p>
        </article>

        @for (service of services; track service.index) {
          <article class="pe__tile">
            <header class="pe__tile-head">
              <h3 class="pe__tile-title">{{ service.title }}</h3>
              <span class="pe__index" aria-hidden="true">/ {{ service.index }}</span>
            </header>

            <ul class="pe__points">
              @for (point of service.points; track point) {
                <li class="pe__point">
                  <span class="pe__tick" aria-hidden="true">✓</span>
                  {{ point }}
                </li>
              }
            </ul>

            <a class="pe__more" href="#" (click)="$event.preventDefault()">
              Learn more <span aria-hidden="true">↗</span>
            </a>
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

      .pe__head {
        max-width: 44ch;
        margin-bottom: var(--space-layout-md);
      }
      .pe__title {
        color: var(--color-text-secondary);
        font-family: var(--font-heading);
        font-size: 2rem;
        line-height: 1.2;
        font-weight: 500;
      }
      /* Colour carries the emphasis inside the sentence — colorInHierarchy: primary. */
      .pe__title-lead {
        color: var(--color-text-primary);
      }

      /* Flush row: tiles meet, separation is lift rather than gap or rule. */
      .pe__row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
        border-radius: var(--radius-surface);
        overflow: hidden;
        box-shadow: var(--elevation-float);
      }

      .pe__anchor {
        position: relative;
        display: flex;
        align-items: flex-end;
        min-height: 22rem;
        padding: var(--space-component-lg);
        background: var(--color-surface-featured);
      }
      /* Gradient as Vector: direction runs with the reading order. */
      .pe__anchor-art {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(
            120% 80% at 20% 15%,
            var(--color-bg-brand-subtle) 0%,
            transparent 60%
          );
        opacity: 0.5;
      }
      .pe__anchor-label {
        position: relative;
        color: var(--color-surface-featured-text);
        font-family: var(--font-heading);
        font-size: 1.125rem;
      }

      .pe__tile {
        display: flex;
        flex-direction: column;
        min-height: 22rem;
        padding: var(--space-component-lg);
        background: var(--color-bg-surface);
        border-left: 1px solid var(--color-border-muted);
      }

      .pe__tile-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--space-component-sm);
      }
      .pe__tile-title {
        color: var(--color-text-primary);
        font-family: var(--font-heading);
        font-size: 1.0625rem;
      }
      /* Redundant Signal: the numeral survives greyscale, so hue is never the
         sole carrier of which tile is which. */
      .pe__index {
        font-family: var(--font-data);
        font-size: 0.75rem;
        color: var(--color-text-muted);
      }

      .pe__points {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-component-sm);
        /* Checklist settles to the bottom edge, per the reference. */
        margin-top: auto;
      }
      .pe__point {
        display: flex;
        gap: var(--space-component-sm);
        color: var(--color-text-secondary);
        font-size: 0.8125rem;
        line-height: 1.5;
      }
      .pe__tick {
        color: var(--color-text-brand);
        flex-shrink: 0;
      }

      .pe__more {
        margin-top: var(--space-component-lg);
        color: var(--color-text-brand);
        font-size: 0.8125rem;
        text-decoration: none;
        /* Target size is law regardless of density. */
        min-height: 1.5rem;
        display: inline-flex;
        align-items: center;
        gap: var(--space-component-xs);
      }
      .pe__more:hover {
        text-decoration: underline;
      }
      .pe__more:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }
    `,
  ],
})
export class PricingEvoluteComponent {
  protected readonly services: readonly Service[] = [
    {
      index: '01',
      title: 'Discovery sprint.',
      points: [
        'Map the current workflow',
        'Identify the costly steps',
        'Agree success measures',
        'Leave with a plan',
      ],
    },
    {
      index: '02',
      title: 'Build partnership.',
      points: [
        'Embedded delivery team',
        'Fortnightly increments',
        'Your stack, your repo',
        'Handover as we go',
      ],
    },
    {
      index: '03',
      title: 'Ongoing care.',
      points: [
        'Named contact',
        'Agreed response times',
        'Quarterly review',
        'Roadmap input',
      ],
    },
  ];
}
