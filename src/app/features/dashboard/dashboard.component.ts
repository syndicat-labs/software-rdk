import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ThemeService } from '../../core/theme/theme.service';
import { THEME_REGISTRY } from '../../core/theme/token-contract';
import { DashboardStore } from './dashboard.store';
import { DashboardLayoutStore } from '../../core/dashboard-layout/dashboard-layout.store';
import { DashboardLayoutService } from '../../core/dashboard-layout/dashboard-layout.service';
import { DashboardUiService } from '../../core/dashboard-layout/dashboard-ui.service';
import { LoggingService } from '../../core/logging/logging.service';
import { DashboardModernComponent } from './variants/dashboard-modern.component';
import { DashboardObsidianComponent } from './variants/dashboard-obsidian.component';
import { DashboardEvoluteComponent } from './variants/dashboard-evolute.component';
import { BentoHomeComponent } from './bento/bento-home.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorDisplayComponent } from '../../shared/components/error-display/error-display.component';
import { ButtonComponent } from '../../shared/components/atoms/button/button.component';
import { WidgetCatalogDrawerComponent } from '../../shared/components/organisms/widget-catalog-drawer/widget-catalog-drawer.component';
import { WidgetConfigDrawerComponent } from '../../shared/components/organisms/widget-config-drawer/widget-config-drawer.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { WIDGET_REGISTRY } from '../../core/dashboard-layout/widget-registry';
import { AppError } from '../../core/errors/errors.types';
import type { WidgetInstance } from '../../core/dashboard-layout/dashboard-layout.model';

/**
 * Host for the dashboard surface. Resolves the active design language's
 * expression of a dashboard and handles the store's loading / empty / error
 * states above the variant, so every language sees the same state handling.
 *
 * When the active language has no dashboard variant, this renders an explicit
 * gap rather than substituting another language's layout — a missing variant is
 * information, not an excuse to fall back on someone else's structural choices.
 *
 * T7: owns editMode, layout order/size, and persistence. Position is data
 * (layout: WidgetInstance[]), not template — variants keep thesis, no variant
 * rewrites position logic.
 */
@Component({
  selector: 'rdk-dashboard',
  standalone: true,
  imports: [
    DashboardModernComponent,
    DashboardObsidianComponent,
    DashboardEvoluteComponent,
    BentoHomeComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ErrorDisplayComponent,
    ButtonComponent,
    WidgetCatalogDrawerComponent,
    WidgetConfigDrawerComponent,
    ConfirmDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="db__head">
      <h1 class="db__title">Overview</h1>
      <span class="db__lang">{{ activeLabel() }}</span>
      <span class="db__head-spacer"></span>
      <rdk-button
        variant="secondary"
        size="sm"
        (clicked)="toggleEdit()"
        [attr.aria-pressed]="editMode()"
        data-testid="dashboard-edit-toggle"
      >
        {{ editMode() ? 'Done' : 'Edit' }}
      </rdk-button>
    </header>

    @if (editMode()) {
      <div class="db__editbar" role="toolbar" aria-label="Edit dashboard">
        <rdk-button variant="secondary" size="sm" (clicked)="openCatalog()" data-testid="dashboard-add">Add widget</rdk-button>
        <rdk-button variant="secondary" size="sm" (clicked)="undo()" data-testid="dashboard-undo">Undo</rdk-button>
        <rdk-button variant="secondary" size="sm" (clicked)="resetLayout()" data-testid="dashboard-reset">Reset</rdk-button>
        <rdk-button variant="primary" size="sm" (clicked)="toggleEdit()" data-testid="dashboard-done">Done</rdk-button>
        <rdk-button variant="secondary" size="sm" (clicked)="cancelEdit()" data-testid="dashboard-cancel">Cancel</rdk-button>
      </div>
    }

    @if (persistError(); as err) {
      <rdk-error-display [error]="err" (retry)="retryPersist()" data-testid="dashboard-persist-error" />
    }

    <rdk-bento-home />

    @if (theme.current() === 'rdk-default') {
      <rdk-dashboard-modern
        [metrics]="store.metrics()"
        [transactions]="store.items()"
        [loading]="store.loading()"
        [layout]="layoutStore.orderedWidgets()"
        [editMode]="layoutStore.editMode()"
      />
    } @else if (theme.current() === 'obsidian') {
      <rdk-dashboard-obsidian
        [metrics]="store.metrics()"
        [transactions]="store.items()"
        [loading]="store.loading()"
        [layout]="layoutStore.orderedWidgets()"
        [editMode]="layoutStore.editMode()"
      />
    } @else if (theme.current() === 'evolute') {
      <rdk-dashboard-evolute
        [metrics]="store.metrics()"
        [transactions]="store.items()"
        [loading]="store.loading()"
        [layout]="layoutStore.orderedWidgets()"
        [editMode]="layoutStore.editMode()"
      />
    } @else {
      <section class="db__gap">
        <h2 class="db__gap-title">{{ activeLabel() }} has not expressed a dashboard</h2>
        <p class="db__gap-body">
          A dashboard carries a philosophy, so it is not a token swap. Showing another
          language's layout here would present structural choices this language may explicitly
          refuse as though they were its own. Switch language to view another expression.
        </p>
      </section>
    }

    @if (loading() && store.items().length === 0 && store.metrics().length === 0) {
      <div class="db__overlay" data-testid="dashboard-loading">
        <rdk-loading-spinner label="Loading dashboard…" [showLabel]="true" />
      </div>
    } @else if (error()) {
      <rdk-error-display [error]="error()" (retry)="retry()" data-testid="dashboard-error" />
    } @else if (empty()) {
      <rdk-empty-state
        title="No activity yet"
        message="Transactions will appear here once settlements begin."
        data-testid="dashboard-empty"
      />
    }

    <rdk-widget-catalog-drawer
      [visible]="ui.catalogVisible()"
      (closed)="ui.closeCatalog()"
      (add)="onAddWidget($event)"
    />

    <rdk-widget-config-drawer
      [visible]="ui.configVisible()"
      [widgetTitle]="ui.configWidgetId() ?? ''"
      [initialTitle]="ui.configInitialTitle()"
      (closed)="ui.closeConfig()"
      (save)="onSaveConfig($event)"
    />

    <rdk-confirm-dialog
      [visible]="ui.confirmVisible()"
      title="Remove widget?"
      message="This will remove the widget from your dashboard. You can add it again from the catalog."
      confirmLabel="Remove"
      cancelLabel="Cancel"
      (confirmed)="onConfirmRemove()"
      (cancelled)="ui.closeConfirm()"
    />
  `,
  styles: [
    `
      :host {
        display: block;
        background: var(--color-bg-base);
      }

      .db__head {
        display: flex;
        align-items: center;
        gap: var(--space-component-md);
        padding: var(--space-layout-sm) var(--space-layout-md);
        flex-wrap: wrap;
      }
      .db__head-spacer {
        flex: 1;
      }
      .db__title {
        color: var(--color-text-primary);
        font-family: var(--font-heading);
        margin: 0;
      }
      .db__lang {
        font-family: var(--font-data);
        font-size: 0.6875rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--color-text-secondary);
        background: var(--color-bg-sunken);
        border-radius: var(--radius-pill);
        padding: 0.125rem 0.5rem;
      }

      .db__editbar {
        display: flex;
        gap: var(--space-component-sm);
        padding: 0 var(--space-layout-md) var(--space-component-sm);
        flex-wrap: wrap;
      }

      .db__overlay {
        margin: var(--space-layout-md);
      }

      .db__gap {
        margin: var(--space-layout-md);
        padding: var(--space-layout-sm);
        border: 1px dashed var(--color-border-strong);
        border-radius: var(--radius-surface);
        background: var(--color-bg-sunken);
        max-width: 60ch;
      }
      .db__gap-title {
        color: var(--color-text-primary);
        font-family: var(--font-heading);
        font-size: 1rem;
        margin: 0;
      }
      .db__gap-body {
        margin: var(--space-component-sm) 0 0;
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        line-height: 1.6;
      }

      .db__state {
        padding: var(--space-layout-md);
        color: var(--color-text-muted);
      }
    `,
  ],
})
export class DashboardComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly store = inject(DashboardStore);
  protected readonly layoutStore = inject(DashboardLayoutStore);
  protected readonly ui = inject(DashboardUiService);
  private readonly layoutService = inject(DashboardLayoutService);
  private readonly logger = inject(LoggingService);
  private readonly widgetRegistry = inject(WIDGET_REGISTRY, { optional: true });

  protected readonly loading = this.store.loading;
  protected readonly error = this.store.error;
  protected readonly empty = this.store.isEmpty;

  protected readonly editMode = this.layoutStore.editMode;
  private readonly persistErrorSignal = signal<AppError | null>(null);
  protected readonly persistError = this.persistErrorSignal.asReadonly();

  protected readonly activeLabel = computed(
    () => THEME_REGISTRY.find((t) => t.id === this.theme.current())?.label ?? this.theme.current(),
  );

  constructor() {
    this.store.load();
    this.hydrateLayout();
  }

  protected toggleEdit(): void {
    const next = !this.layoutStore.editMode();
    this.layoutStore.setEditMode(next);
    this.logger.info('features/dashboard', next ? 'dashboard.edit_enter' : 'dashboard.edit_exit');
  }

  protected cancelEdit(): void {
    this.layoutStore.undo();
    this.layoutStore.setEditMode(false);
    this.logger.info('features/dashboard', 'dashboard.edit_cancel');
  }

  protected undo(): void {
    this.layoutStore.undo();
    this.persistLayout();
    this.logger.info('features/dashboard', 'dashboard.layout.undo');
  }

  protected resetLayout(): void {
    this.layoutStore.resetToDefault();
    this.persistLayout();
    this.logger.info('features/dashboard', 'dashboard.layout.reset');
  }

  protected openCatalog(): void {
    this.ui.openCatalog();
  }

  protected onAddWidget(widgetId: string): void {
    const definition = this.findDefinition(widgetId);
    const colSpan = (definition?.defaultColSpan ?? 3) as import('../../core/dashboard-layout/dashboard-layout.model').ColSpan;
    const instance: WidgetInstance = {
      id: `w-${widgetId}-${Date.now()}`,
      widgetId: widgetId as unknown as WidgetInstance['widgetId'],
      colSpan,
      order: this.layoutStore.layout().widgets.length,
    };
    this.layoutStore.addWidget(instance);
    this.persistLayout();
    this.ui.closeCatalog();
    this.logger.info('features/dashboard', 'dashboard.layout.added', { widgetId });
  }

  protected onSaveConfig(event: { title: string }): void {
    const widgetId = this.ui.configWidgetId();
    if (!widgetId) return;
    const layout = this.layoutStore.layout();
    const target = layout.widgets.find((w) => w.widgetId === widgetId || w.id === widgetId);
    if (!target) return;
    const updatedWidgets = layout.widgets.map((w) =>
      w.id === target.id ? { ...w, config: { ...(w.config ?? {}), title: event.title } } : w,
    );
    this.layoutStore.setLayout({ ...layout, widgets: updatedWidgets, updatedAt: new Date().toISOString() });
    this.persistLayout();
    this.ui.closeConfig();
    this.logger.info('features/dashboard', 'dashboard.layout.configured', { widgetId, title: event.title });
  }

  protected onConfirmRemove(): void {
    const metricId = this.ui.confirmRemove();
    if (!metricId) return;
    const instance = this.layoutStore.layout().widgets.find((w) => w.widgetId === metricId || w.id === metricId);
    if (instance) {
      this.layoutStore.removeWidget(instance.id);
      this.persistLayout();
      this.logger.info('features/dashboard', 'dashboard.layout.removed', { widgetId: metricId });
    }
  }

  protected retry(): void {
    this.store.reset();
    this.store.load();
  }

  protected retryPersist(): void {
    this.persistErrorSignal.set(null);
    this.persistLayout();
  }

  private findDefinition(widgetId: string): { id: string; defaultColSpan: number } | null {
    if (!this.widgetRegistry) return null;
    const raw = this.widgetRegistry as unknown as readonly unknown[];
    const flattened = raw.length > 0 && Array.isArray(raw[0])
      ? (raw as unknown as readonly (readonly { id: string; defaultColSpan: number }[])[]).flat()
      : (raw as readonly { id: string; defaultColSpan: number }[]);
    return flattened.find((d) => d.id === widgetId) ?? null;
  }

  private hydrateLayout(): void {
    const local = this.layoutService.readLocal();
    if (local) {
      this.layoutStore.setLayout(local);
    }

    this.layoutService.load().subscribe({
      next: (layout) => {
        this.layoutStore.setLayout(layout);
      },
      error: (error: AppError) => {
        this.persistErrorSignal.set(error);
        this.logger.warn('features/dashboard', 'dashboard.layout.hydrate_failed', { code: error.code });
      },
    });
  }

  private persistLayout(): void {
    const layout = this.layoutStore.layout();
    this.layoutService.save(layout).subscribe({
      next: () => {
        this.persistErrorSignal.set(null);
      },
      error: (error: AppError) => {
        this.persistErrorSignal.set(error);
      },
    });
  }
}
