import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DashboardMetric, DashboardTransaction } from '../dashboard.store';
import { CardComponent } from '../../../shared/components/organisms/card/card.component';
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
 * Dashboard — Modern (`rdk-default`).
 *
 * Modern's thesis is that convention is a feature: the operator should not have
 * to learn a hundred-and-first dashboard layout. So this is the familiar KPI
 * strip over a transactions table, in the shape the pattern is normally met.
 *
 * Surfaces separate with the Soft Card pattern — border and shallow lift
 * together, neither alone (`surfaceBoundary: hybrid`, `depthModel: shadow`).
 * Status is Signed and Coloured and confined to badge surfaces; the glyph is
 * always present so greyscale does not lose the meaning (`polarityEncoding:
 * color-led`, `functionalColorContainment: surface-permitted`).
 *
 * The featured metric is marked by the higher `--elevation-*` step and a brand
 * border — the Gradient Anchor pattern, the first of the two permitted emphasis
 * surfaces (`emphasisSurfaceBudget: 2`).
 *
 * Contract tokens only; no raw values, no foreign L0 reads.
 */
@Component({
  selector: 'rdk-dashboard-modern',
  standalone: true,
  imports: [CardComponent, BadgeComponent, DataTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="dm">
      <div class="dm__kpis">
        @for (kpi of metrics; track kpi.id) {
          <article class="dm__kpi" [class.dm__kpi--featured]="kpi.id === 'revenue'">
            <span class="dm__kpi-label">{{ kpi.label }}</span>
            <span class="dm__kpi-value">{{ kpi.value }}</span>
            <span class="dm__kpi-delta" [class.dm__kpi-delta--down]="kpi.delta < 0">
              {{ kpi.delta >= 0 ? '\u2191' : '\u2193' }} {{ Math.abs(kpi.delta) }}%
              <span class="dm__kpi-unit">{{ kpi.unit }}</span>
            </span>
          </article>
        }
      </div>

      <div class="dm__status" role="list" aria-label="Status summary">
        @for (status of statuses; track status) {
          <rdk-badge [variant]="STATUS_BADGE[status]" [dot]="true" role="listitem">
            {{ STATUS_LABEL[status] }} · {{ countFor(status) }}
          </rdk-badge>
        }
      </div>

      <rdk-card variant="default" padding="none" class="dm__table">
        <div slot="header" class="dm__table-head">
          <h2 class="dm__table-title">Recent transactions</h2>
          <span class="dm__table-meta">Live from settlement</span>
        </div>
        <rdk-data-table [columns]="columns" [rows]="rows" [loading]="loading" />
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

      .dm__kpis {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
        gap: var(--space-layout-xs);
      }

      /* Soft Card: border and lift together, neither alone. */
      .dm__kpi {
        display: flex;
        flex-direction: column;
        gap: var(--space-component-xs);
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        box-shadow: var(--elevation-raised);
        padding: var(--space-component-lg);
      }

      .dm__kpi--featured {
        box-shadow: var(--elevation-float);
        border-color: var(--color-border-brand);
      }

      .dm__kpi-label {
        color: var(--color-text-secondary);
        font-size: 0.8125rem;
        letter-spacing: 0.02em;
      }
      .dm__kpi-value {
        color: var(--color-text-primary);
        font-family: var(--font-data);
        font-size: 1.75rem;
        line-height: 1.1;
      }
      .dm__kpi-delta {
        color: var(--color-text-success);
        font-family: var(--font-data);
        font-size: 0.8125rem;
      }
      .dm__kpi-delta--down {
        color: var(--color-text-danger);
      }
      .dm__kpi-unit {
        color: var(--color-text-muted);
      }

      .dm__status {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-component-sm);
        margin: var(--space-layout-sm) 0 var(--space-layout-sm);
      }

      .dm__table-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--space-layout-xs);
        padding: var(--space-component-lg) var(--space-component-lg) 0;
      }
      .dm__table-title {
        margin: 0;
        color: var(--color-text-primary);
        font-family: var(--font-heading);
        font-size: 1.0625rem;
      }
      .dm__table-meta {
        color: var(--color-text-muted);
        font-size: 0.75rem;
      }
    `,
  ],
})
export class DashboardModernComponent {
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
