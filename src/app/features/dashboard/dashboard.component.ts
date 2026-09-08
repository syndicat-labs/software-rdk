import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ThemeService, ThemeId } from '../../core/theme/theme.service';
import { THEME_REGISTRY } from '../../core/theme/token-contract';
import { DashboardStore } from './dashboard.store';
import { DashboardLayoutStore } from '../../core/dashboard-layout/dashboard-layout.store';
import { DashboardLayoutService } from '../../core/dashboard-layout/dashboard-layout.service';
import { LoggingService } from '../../core/logging/logging.service';
import { DashboardModernComponent } from './variants/dashboard-modern.component';
import { DashboardObsidianComponent } from './variants/dashboard-obsidian.component';
import { DashboardEvoluteComponent } from './variants/dashboard-evolute.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorDisplayComponent } from '../../shared/components/error-display/error-display.component';
import { ButtonComponent } from '../../shared/components/atoms/button/button.component';
import { NgComponentOutlet } from '@angular/common';
import { AppError } from '../../core/errors/errors.types';
import type { Type } from '@angular/core';

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
    NgComponentOutlet,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ErrorDisplayComponent,
    ButtonComponent,
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
        <rdk-button variant="secondary" size="sm" (clicked)="undo()" data-testid="dashboard-undo">Undo</rdk-button>
        <rdk-button variant="secondary" size="sm" (clicked)="resetLayout()" data-testid="dashboard-reset">Reset</rdk-button>
        <rdk-button variant="primary" size="sm" (clicked)="toggleEdit()" data-testid="dashboard-done">Done</rdk-button>
        <rdk-button variant="secondary" size="sm" (clicked)="cancelEdit()" data-testid="dashboard-cancel">Cancel</rdk-button>
      </div>
    }

    @if (persistError(); as err) {
      <rdk-error-display [error]="err" (retry)="retryPersist()" data-testid="dashboard-persist-error" />
    }

    @if (loadedVariant(); as variant) {
      <ng-container *ngComponentOutlet="variant.component; inputs: variant.inputs" />
    } @else if (variant()) {
      <p class="db__state">Loading widget…</p>
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

    @if (loading()) {
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
  private readonly theme = inject(ThemeService);
  private readonly store = inject(DashboardStore);
  private readonly layoutStore = inject(DashboardLayoutStore);
  private readonly layoutService = inject(DashboardLayoutService);
  private readonly logger = inject(LoggingService);

  protected readonly loading = this.store.loading;
  protected readonly error = this.store.error;
  protected readonly empty = this.store.isEmpty;

  protected readonly editMode = this.layoutStore.editMode;
  private readonly persistErrorSignal = signal<AppError | null>(null);
  protected readonly persistError = this.persistErrorSignal.asReadonly();

  protected readonly activeLabel = computed(
    () => THEME_REGISTRY.find((t) => t.id === this.theme.current())?.label ?? this.theme.current(),
  );

  private readonly variantTypes: Readonly<Record<ThemeId, Type<unknown> | undefined>> = {
    'rdk-default': DashboardModernComponent,
    obsidian: DashboardObsidianComponent,
    evolute: DashboardEvoluteComponent,
  };

  protected readonly variant = computed(
    () => this.variantTypes[this.theme.current()] ?? undefined,
  );

  protected readonly loadedVariant = computed(() => {
    const component = this.variant();
    if (!component) return undefined;
    return {
      component,
      inputs: {
        metrics: this.store.metrics(),
        transactions: this.store.items(),
        loading: this.store.loading(),
        layout: this.layoutStore.orderedWidgets(),
        editMode: this.layoutStore.editMode(),
      },
    };
  });

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

  protected retry(): void {
    this.store.reset();
    this.store.load();
  }

  protected retryPersist(): void {
    this.persistErrorSignal.set(null);
    this.persistLayout();
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
