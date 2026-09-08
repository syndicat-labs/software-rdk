import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DashboardMetric, DashboardTransaction } from '../dashboard.store';
import { CardComponent } from '../../../shared/components/organisms/card/card.component';
import { BadgeComponent } from '../../../shared/components/atoms/badge/badge.component';

function money(amount: number, currency: string): string {
  const symbol = currency === 'GBP' ? '\u00A3' : `${currency} `;
  return `${symbol}${amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
}

const STATUS_LABEL: Record<DashboardTransaction['status'], string> = {
  paid: 'Paid',
  pending: 'Pending',
  failed: 'Failed',
  refunded: 'Refunded',
};

const STATUS_BADGE: Record<DashboardTransaction['status'], 'success' | 'warning' | 'danger' | 'info'> = {
  paid: 'success',
  pending: 'warning',
  failed: 'danger',
  refunded: 'info',
};

/**
 * Dashboard — Obsidian.
 *
 * Obsidian's thesis is that restraint is law: hierarchy is solved at the
 * structure level so colour carries only meaning. This is the dense KPI grid
 * with a single Dark Card Anchor holding the decision-critical figure
 * (`emphasisSurfaceBudget: 1`); every other surface holds, never competes.
 *
 * Polarity is Financial-Polarity-Without-Colour — weight before colour, with the
 * arrow glyph always present (`polarityEncoding: weight-before-color`).
 * Functional colour is confined to pill badges; it never coats surfaces, rows or
 * body text (`functionalColorContainment: badge-only`). Machine data — amounts,
 * references, dates — runs in monospace (`monospaceScope: data-only`). Space is
 * earned by importance (`density: high`, `spaceAllocation: earned-by-importance`).
 *
 * Contract tokens only.
 */
@Component({
  selector: 'rdk-dashboard-obsidian',
  standalone: true,
  imports: [CardComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="dbo">
      <div class="dbo__kpis">
        @for (kpi of metrics; track kpi.id) {
          <article class="dbo__kpi" [class.dbo__kpi--anchor]="kpi.id === 'orders'">
            <span class="dbo__kpi-label">{{ kpi.label }}</span>
            <span class="dbo__kpi-value">{{ kpi.value }}</span>
            <span
              class="dbo__kpi-delta"
              [class.dbo__kpi-delta--up]="kpi.delta >= 0"
              [class.dbo__kpi-delta--down]="kpi.delta < 0"
            >
              {{ kpi.delta >= 0 ? '\u2191' : '\u2193' }} {{ Math.abs(kpi.delta) }}%
              <span class="dbo__kpi-unit">{{ kpi.unit }}</span>
            </span>
          </article>
        }
      </div>

      <rdk-card variant="default" padding="none" class="dbo__panel">
        <div slot="header" class="dbo__panel-head">
          <h2 class="dbo__panel-title">Recent transactions</h2>
          <span class="dbo__panel-meta">{{ transactions.length }} settled</span>
        </div>
        <table class="dbo__table">
          <thead>
            <tr>
              <th class="dbo__th">Reference</th>
              <th class="dbo__th">Customer</th>
              <th class="dbo__th dbo__th--right">Amount</th>
              <th class="dbo__th">Status</th>
              <th class="dbo__th">Date</th>
            </tr>
          </thead>
          <tbody>
            @for (t of transactions; track t.id) {
              <tr class="dbo__row">
                <td class="dbo__td dbo__td--mono">{{ t.reference }}</td>
                <td class="dbo__td">{{ t.customer }}</td>
                <td class="dbo__td dbo__td--mono dbo__td--right">{{ money(t.amount, t.currency) }}</td>
                <td class="dbo__td">
                  <rdk-badge [variant]="STATUS_BADGE[t.status]" [dot]="true">{{ STATUS_LABEL[t.status] }}</rdk-badge>
                </td>
                <td class="dbo__td dbo__td--mono dbo__td--muted">{{ t.date }}</td>
              </tr>
            }
          </tbody>
        </table>
      </rdk-card>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: var(--space-layout-md);
        background: var(--color-bg-base);
      }

      /* Dense KPI grid — space earned by importance. */
      .dbo__kpis {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
        gap: var(--space-component-md);
        margin-bottom: var(--space-layout-sm);
      }

      .dbo__kpi {
        display: flex;
        flex-direction: column;
        gap: var(--space-component-xs);
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-muted);
        border-radius: var(--radius-component);
        padding: var(--space-component-md);
      }

      /* The single Dark Card Anchor — exactly one per layout. */
      .dbo__kpi--anchor {
        background: var(--color-surface-featured);
        border-color: var(--color-surface-featured-border);

        .dbo__kpi-label { color: var(--color-surface-featured-muted); }
        .dbo__kpi-value { color: var(--color-surface-featured-text); }
        .dbo__kpi-unit  { color: var(--color-surface-featured-muted); }
      }

      .dbo__kpi-label {
        color: var(--color-text-secondary);
        font-size: 0.6875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .dbo__kpi-value {
        color: var(--color-text-primary);
        font-family: var(--font-data);
        font-size: 1.5rem;
        line-height: 1;
      }
      .dbo__kpi-delta {
        font-family: var(--font-data);
        font-size: 0.75rem;
      }
      /* Weight before colour — the glyph is always present. */
      .dbo__kpi-delta--up {
        color: var(--color-text-success);
        font-weight: 700;
      }
      .dbo__kpi-delta--down {
        color: var(--color-text-danger);
        font-weight: 400;
      }
      .dbo__kpi-unit {
        color: var(--color-text-muted);
        font-weight: 400;
      }

      .dbo__panel-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--space-layout-xs);
        padding: var(--space-component-md) var(--space-component-lg);
      }
      .dbo__panel-title {
        margin: 0;
        color: var(--color-text-primary);
        font-size: 0.875rem;
        font-weight: 700;
        letter-spacing: -0.01em;
      }
      .dbo__panel-meta {
        color: var(--color-text-muted);
        font-family: var(--font-data);
        font-size: 0.75rem;
      }

      .dbo__table {
        width: 100%;
        border-collapse: collapse;
      }
      .dbo__th {
        padding: var(--space-component-sm) var(--space-component-lg);
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--color-text-secondary);
        text-align: left;
        background: var(--color-bg-sunken);
        border-bottom: 1px solid var(--color-border-default);
      }
      .dbo__th--right {
        text-align: right;
      }
      .dbo__row {
        border-bottom: 1px solid var(--color-border-muted);
        &:hover { background: var(--color-bg-sunken); }
        &:last-child { border-bottom: none; }
      }
      .dbo__td {
        padding: var(--space-component-sm) var(--space-component-lg);
        font-size: 0.875rem;
        color: var(--color-text-primary);
      }
      .dbo__td--mono {
        font-family: var(--font-data);
        font-size: 0.8125rem;
      }
      .dbo__td--muted {
        color: var(--color-text-muted);
      }
      .dbo__td--right {
        text-align: right;
      }
    `,
  ],
})
export class DashboardObsidianComponent {
  @Input() metrics: DashboardMetric[] = [];
  @Input() transactions: DashboardTransaction[] = [];
  @Input() loading = false;

  readonly Math = Math;
  readonly STATUS_LABEL = STATUS_LABEL;
  readonly STATUS_BADGE = STATUS_BADGE;
  readonly money = money;
}
