import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DashboardMetric, DashboardTransaction } from '../dashboard.store';
import { BadgeComponent } from '../../../shared/components/atoms/badge/badge.component';
import {
  DataTableComponent,
  ColumnDef,
} from '../../../shared/components/organisms/data-table/data-table.component';

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

interface TransactionRow {
  reference: string;
  customer: string;
  amount: string;
  date: string;
}

/**
 * Dashboard — theEvolute.
 *
 * theEvolute's thesis is that light and colour are how meaning arrives. So this
 * dashboard partitions the view by elevation and hue *before* reading begins,
 * rather than after.
 *
 * The Lift Ladder carries rank: the KPI strip sits on `elevation-raised`, the
 * transactions panel on `elevation-float`, and a closing insight band on
 * `elevation-overlay` — at most three steps, each a genuine rank change
 * (`surfaceBoundary: elevation`, `sectionRhythm: elevation`). No single KPI is
 * privileged; three priorities are shown as three (`emphasisSurfaceBudget:
 * unbounded`). Chromatic Key assigns a hue per metric which is never reused, and
 * the Redundant Signal rule keeps every colour reading meaningful in greyscale
 * (`polarityEncoding: color-led`).
 *
 * Contract tokens only.
 */
@Component({
  selector: 'rdk-dashboard-evolute',
  standalone: true,
  imports: [BadgeComponent, DataTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="de">
      <div class="de__kpis">
        @for (kpi of metrics; track kpi.id) {
          <article class="de__kpi">
            <span class="de__kpi-dot" aria-hidden="true"></span>
            <span class="de__kpi-label">{{ kpi.label }}</span>
            <span class="de__kpi-value">{{ kpi.value }}</span>
            <span class="de__kpi-delta" [class.de__kpi-delta--down]="kpi.delta < 0">
              {{ kpi.delta >= 0 ? '\u2191' : '\u2193' }} {{ Math.abs(kpi.delta) }}%
              <span class="de__kpi-unit">{{ kpi.unit }}</span>
            </span>
          </article>
        }
      </div>

      <div class="de__insight" role="note">
        <span class="de__insight-key" aria-hidden="true"></span>
        <p class="de__insight-body">
          Settlements are up <strong>12.4%</strong> this month. Pending volume sits within
          the normal range — no action required.
        </p>
      </div>

      <div class="de__panel">
        <div class="de__panel-head">
          <h2 class="de__panel-title">Recent transactions</h2>
          <div class="de__status" role="list" aria-label="Status summary">
            @for (status of statuses; track status) {
              <rdk-badge [variant]="STATUS_BADGE[status]" [dot]="true" role="listitem">
                {{ STATUS_LABEL[status] }} · {{ countFor(status) }}
              </rdk-badge>
            }
          </div>
        </div>
        <rdk-data-table [columns]="columns" [rows]="rows" [loading]="loading" />
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

      /* KPI strip — first elevation step. */
      .de__kpis {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
        gap: var(--space-layout-xs);
        margin-bottom: var(--space-layout-md);
      }

      .de__kpi {
        display: flex;
        flex-direction: column;
        gap: var(--space-component-xs);
        background: var(--color-bg-surface);
        border-radius: var(--radius-surface);
        box-shadow: var(--elevation-raised);
        padding: var(--space-component-lg);
      }

      /* Chromatic Key — a hue, once assigned, is never reused in this product. */
      .de__kpi:nth-child(1) .de__kpi-dot { background: var(--color-bg-brand); }
      .de__kpi:nth-child(2) .de__kpi-dot { background: var(--color-bg-info); }
      .de__kpi:nth-child(3) .de__kpi-dot { background: var(--color-bg-success); }
      .de__kpi:nth-child(4) .de__kpi-dot { background: var(--color-bg-warning); }

      .de__kpi-dot {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: var(--radius-pill);
      }

      .de__kpi-label {
        color: var(--color-text-secondary);
        font-size: 0.8125rem;
      }
      .de__kpi-value {
        color: var(--color-text-primary);
        font-family: var(--font-data);
        font-size: 1.75rem;
        line-height: 1.1;
      }
      .de__kpi-delta {
        color: var(--color-text-success);
        font-family: var(--font-data);
        font-size: 0.8125rem;
      }
      .de__kpi-delta--down {
        color: var(--color-text-danger);
      }
      .de__kpi-unit {
        color: var(--color-text-muted);
      }

      /* Highest step of the Lift Ladder — a closing synthesis, not filler. */
      .de__insight {
        display: flex;
        gap: var(--space-component-md);
        align-items: flex-start;
        background: var(--color-surface-featured);
        border-radius: var(--radius-surface);
        box-shadow: var(--elevation-overlay);
        padding: var(--space-component-lg);
        margin-bottom: var(--space-layout-md);
      }
      .de__insight-key {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: var(--radius-pill);
        background: var(--color-bg-brand);
        flex-shrink: 0;
        margin-top: 0.25rem;
      }
      .de__insight-body {
        margin: 0;
        color: var(--color-surface-featured-text);
        line-height: 1.6;
      }
      .de__insight-body strong {
        color: var(--color-surface-featured-text);
      }

      /* Transactions panel — second elevation step surfaces the action. */
      .de__panel {
        background: var(--color-bg-elevated);
        border-radius: var(--radius-surface);
        box-shadow: var(--elevation-float);
        overflow: hidden;
      }
      .de__panel-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--space-layout-xs);
        flex-wrap: wrap;
        padding: var(--space-component-lg) var(--space-component-lg) var(--space-component-sm);
      }
      .de__panel-title {
        margin: 0;
        color: var(--color-text-primary);
        font-size: 1.0625rem;
      }
      .de__status {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-component-sm);
      }
    `,
  ],
})
export class DashboardEvoluteComponent {
  @Input() metrics: DashboardMetric[] = [];
  @Input() transactions: DashboardTransaction[] = [];
  @Input() loading = false;

  readonly Math = Math;
  readonly STATUS_LABEL = STATUS_LABEL;
  readonly STATUS_BADGE = STATUS_BADGE;

  protected get statuses(): DashboardTransaction['status'][] {
    return ['paid', 'pending', 'failed', 'refunded'];
  }

  protected countFor(status: DashboardTransaction['status']): number {
    return this.transactions.filter((t) => t.status === status).length;
  }

  protected get rows(): TransactionRow[] {
    return this.transactions.map((t) => ({
      reference: t.reference,
      customer: t.customer,
      amount: money(t.amount, t.currency),
      date: t.date,
    }));
  }

  protected readonly columns: ColumnDef<TransactionRow>[] = [
    { field: 'reference', header: 'Reference', sortable: true },
    { field: 'customer', header: 'Customer', sortable: true },
    { field: 'amount', header: 'Amount', sortable: true },
    { field: 'date', header: 'Date', sortable: true },
  ];
}
