import { ChangeDetectionStrategy, Component, Input, computed, inject } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DashboardMetric, DashboardTransaction } from '../dashboard.store';
import { CardComponent } from '../../../shared/components/organisms/card/card.component';
import { BadgeComponent } from '../../../shared/components/atoms/badge/badge.component';
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
  imports: [CardComponent, BadgeComponent, DashboardGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="dbo">
      <rdk-dashboard-grid
        [views]="views()"
        [editMode]="editMode"
        variant="obsidian"
        (dropped)="onDropped($event)"
        (resized)="onResized($event)"
        (removed)="onRemoved($event)"
        (configured)="onConfigured($event)"
      />

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
  @Input() layout: readonly WidgetInstance[] = [];
  @Input() editMode = false;

  private readonly layoutStore = inject(DashboardLayoutStore);
  private readonly layoutService = inject(DashboardLayoutService);
  private readonly ui = inject(DashboardUiService);
  private readonly logger = inject(LoggingService);

  readonly Math = Math;
  readonly STATUS_LABEL = STATUS_LABEL;
  readonly STATUS_BADGE = STATUS_BADGE;
  readonly money = money;

  protected readonly views = computed<readonly GridWidgetView[]>(() => {
    const layout = this.layout.length > 0 ? this.layout : (this.metrics.map((m, index) => ({ id: `w-${m.id}`, widgetId: m.id as unknown as WidgetInstance['widgetId'], colSpan: 3 as ColSpan, order: index, config: undefined } as WidgetInstance)));
    const metricMap = new Map(this.metrics.map((m) => [m.id, m]));
    return [...layout]
      .sort((a, b) => a.order - b.order)
      .map((instance) => {
        const base = metricMap.get(instance.widgetId as string);
        if (!base) return { instance, metric: undefined, featured: instance.widgetId === 'orders' } as GridWidgetView;
        const title = (instance.config?.['title'] as string) ?? base.label;
        return {
          instance,
          metric: { ...base, label: title },
          featured: instance.widgetId === 'orders',
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
}
