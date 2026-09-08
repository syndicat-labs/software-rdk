import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeService, ThemeId } from '../../core/theme/theme.service';
import { THEME_REGISTRY } from '../../core/theme/token-contract';
import { DashboardStore } from './dashboard.store';
import { DashboardModernComponent } from './variants/dashboard-modern.component';
import { DashboardObsidianComponent } from './variants/dashboard-obsidian.component';
import { DashboardEvoluteComponent } from './variants/dashboard-evolute.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorDisplayComponent } from '../../shared/components/error-display/error-display.component';
import { NgComponentOutlet } from '@angular/common';
import type { Type } from '@angular/core';

/**
 * Host for the dashboard surface. Resolves the active design language's
 * expression of a dashboard and handles the store's loading / empty / error
 * states above the variant, so every language sees the same state handling.
 *
 * When the active language has no dashboard variant, this renders an explicit
 * gap rather than substituting another language's layout — a missing variant is
 * information, not an excuse to fall back on someone else's structural choices.
 */
@Component({
  selector: 'rdk-dashboard',
  standalone: true,
  imports: [
    NgComponentOutlet,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ErrorDisplayComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="db__head">
      <h1 class="db__title">Overview</h1>
      <span class="db__lang">{{ activeLabel() }}</span>
    </header>

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
        align-items: baseline;
        gap: var(--space-component-md);
        padding: var(--space-layout-sm) var(--space-layout-md);
        flex-wrap: wrap;
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

  protected readonly loading = this.store.loading;
  protected readonly error = this.store.error;
  protected readonly empty = this.store.isEmpty;

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
      },
    };
  });

  constructor() {
    this.store.load();
  }

  protected retry(): void {
    this.store.reset();
    this.store.load();
  }
}
