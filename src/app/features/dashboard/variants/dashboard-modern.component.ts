import { ChangeDetectionStrategy, Component, Input, computed, inject } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DashboardMetric, DashboardTransaction } from '../dashboard.store';
import { CardComponent } from '../../../shared/components/organisms/card/card.component';
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
  imports: [CardComponent, BadgeComponent, DataTableComponent, DashboardGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="dm">
      <rdk-dashboard-grid
        [views]="views()"
        [editMode]="editMode"
        variant="modern"
        (dropped)="onDropped($event)"
        (resized)="onResized($event)"
        (removed)="onRemoved($event)"
        (configured)="onConfigured($event)"
      />

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
        if (!base) return { instance, metric: undefined, featured: instance.widgetId === 'revenue' } as GridWidgetView;
        const title = (instance.config?.['title'] as string) ?? base.label;
        return {
          instance,
          metric: { ...base, label: title },
          featured: instance.widgetId === 'revenue',
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
    this.layoutService.save(this.layoutStore.layout()).subscribe({
      error: () => undefined,
    });
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
