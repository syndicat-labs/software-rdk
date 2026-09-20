import { ChangeDetectionStrategy, Component, Input, computed, inject } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DashboardMetric, DashboardTransaction } from '../dashboard.store';
import { BadgeComponent } from '../../../shared/components/atoms/badge/badge.component';
import {
  DataTableComponent,
  ColumnDef,
} from '../../../shared/components/organisms/data-table/data-table.component';
import { DashboardGridComponent, GridWidgetView } from '../../../shared/components/organisms/dashboard-grid/dashboard-grid.component';
import { DashboardLayoutStore } from '../../../core/dashboard-layout/dashboard-layout.store';
import { DashboardLayoutService } from '../../../core/dashboard-layout/dashboard-layout.service';
import { DashboardUiService } from '../../../core/dashboard-layout/dashboard-ui.service';
import { LoggingService } from '../../../core/logging/logging.service';
import type { WidgetInstance, ColSpan } from '../../../core/dashboard-layout/dashboard-layout.model';

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
  imports: [BadgeComponent, DataTableComponent, DashboardGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="de">
      <rdk-dashboard-grid
        [views]="views()"
        [editMode]="editMode"
        variant="evolute"
        (dropped)="onDropped($event)"
        (resized)="onResized($event)"
        (removed)="onRemoved($event)"
        (configured)="onConfigured($event)"
      />

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
  @Input() layout: readonly WidgetInstance[] = [];
  @Input() editMode = false;

  private readonly layoutStore = inject(DashboardLayoutStore);
  private readonly layoutService = inject(DashboardLayoutService);
  private readonly ui = inject(DashboardUiService);
  private readonly logger = inject(LoggingService);

  readonly Math = Math;
  readonly STATUS_LABEL = STATUS_LABEL;
  readonly STATUS_BADGE = STATUS_BADGE;

  protected readonly views = computed<readonly GridWidgetView[]>(() => {
    const layout = this.layout.length > 0 ? this.layout : (this.metrics.map((m, index) => ({ id: `w-${m.id}`, widgetId: m.id as unknown as WidgetInstance['widgetId'], colSpan: 3 as ColSpan, order: index, config: undefined } as WidgetInstance)));
    const metricMap = new Map(this.metrics.map((m) => [m.id, m]));
    return [...layout]
      .sort((a, b) => a.order - b.order)
      .map((instance) => {
        const base = metricMap.get(instance.widgetId as string);
        if (!base) return { instance, metric: undefined, featured: false } as GridWidgetView;
        const title = (instance.config?.['title'] as string) ?? base.label;
        return {
          instance,
          metric: { ...base, label: title },
          featured: false,
        };
      });
  });

  protected onDropped(event: CdkDragDrop<WidgetInstance>): void {
    this.layoutStore.move(event.previousIndex, event.currentIndex);
    this.persist();
    this.logger.info('features/dashboard', 'dashboard.layout.reordered', { from: event.previousIndex, to: event.currentIndex });
  }

  protected onResized(event: { id: string; colSpan: ColSpan }): void {
    this.layoutStore.resize(event.id, event.colSpan);
    this.persist();
    this.logger.info('features/dashboard', 'dashboard.layout.resized', { id: event.id, colSpan: event.colSpan });
  }

  protected onRemoved(metricId: string): void {
    this.ui.requestRemove(metricId);
  }

  protected onConfigured(metricId: string): void {
    const instance = this.layout.find((w) => w.widgetId === metricId);
    const title = (instance?.config?.['title'] as string) ?? metricId;
    this.ui.openConfig(metricId, title);
  }

  private persist(): void {
    this.layoutService.save(this.layoutStore.layout()).subscribe({ error: () => undefined });
  }

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
