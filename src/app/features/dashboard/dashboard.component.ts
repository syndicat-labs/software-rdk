import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import {
  DataTableComponent,
  type ColumnDef,
} from '../../shared/components/organisms/data-table/data-table.component';
import { ErrorDisplayComponent } from '../../shared/components/error-display/error-display.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { createListStore } from '../../core/store/list-store';
import { fromUnknown } from '../../core/errors/errors.factory';
import { DashboardService } from './dashboard.service';
import type { Kpi, Settlement } from './dashboard.model';

/**
 * Operational dashboard — the first real product surface in this toolkit.
 *
 * Written against contract tokens only, and deliberately as ONE implementation
 * rather than per-language variants. A dashboard is a product surface, not a
 * design idea: the protocol's central claim is that a component reads contract
 * tokens and swaps language with zero component edits, so this page is the test
 * of that claim under product load. Where a language's declaration cannot be
 * honoured here, that is a finding about the contract — not a licence to branch
 * on the active language, which would break swap invariance outright.
 *
 * Polarity follows the model's `favourable` flag plus a glyph, never colour
 * alone: Obsidian declares `weight-before-color` and theEvolute `color-led`, so
 * a surface hardcoding either would violate one of them.
 */
@Component({
  selector: 'rdk-dashboard',
  standalone: true,
  imports: [DataTableComponent, ErrorDisplayComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="dash">
      <header class="dash__head">
        <!-- No heading here: AppShell renders the page <h1> from route data.
             A second h1 duplicates it visually and breaks the document
             outline for screen readers. -->
        <p class="dash__sub">Operational state across active counterparties.</p>
        <button type="button" class="dash__refresh" (click)="reload()" [disabled]="store.loading()">
          {{ store.loading() ? 'Refreshing…' : 'Refresh' }}
        </button>
      </header>

      @if (store.error(); as err) {
        <rdk-error-display [error]="err" (retry)="reload()" />
      }

      <div class="kpis">
        @for (kpi of kpis(); track kpi.id) {
          <article class="kpi" [class.kpi--anchor]="kpi.id === anchorId()">
            <p class="kpi__label">{{ kpi.label }}</p>
            <p class="kpi__value">{{ kpi.value }}</p>

            <p class="kpi__delta" [class.kpi__delta--adverse]="!kpi.favourable">
              <span class="kpi__arrow" aria-hidden="true">{{ arrow(kpi) }}</span>
              <span>{{ kpi.delta }}</span>
              <span class="sr-only">{{ kpi.favourable ? 'favourable' : 'adverse' }}</span>
            </p>

            @if (kpi.progress !== undefined) {
              <div
                class="kpi__meter"
                role="progressbar"
                [attr.aria-valuenow]="kpi.progress"
                aria-valuemin="0"
                aria-valuemax="100"
                [attr.aria-label]="kpi.label + ' progress'"
              >
                <span class="kpi__meter-fill" [style.width.%]="kpi.progress"></span>
              </div>
            }
            @if (kpi.caption) {
              <p class="kpi__caption">{{ kpi.caption }}</p>
            }
          </article>
        }
      </div>

      <section class="panel">
        <header class="panel__head">
          <h2 class="panel__title">Recent settlements</h2>
          @if (!store.isEmpty()) {
            <span class="panel__count">{{ store.items().length }} shown</span>
          }
        </header>

        @if (store.isEmpty() && !store.error()) {
          <rdk-empty-state
            icon="pi pi-inbox"
            title="No settlements yet"
            message="Movements will appear here once counterparties begin settling."
          />
        } @else {
          <rdk-data-table [columns]="columns" [rows]="store.items()" [loading]="store.loading()" />
        }
      </section>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        background: var(--color-bg-base);
        min-height: 100%;
      }

      .dash {
        padding: var(--space-layout-md);
        display: flex;
        flex-direction: column;
        gap: var(--space-layout-sm);
      }

      .dash__head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--space-layout-xs);
        flex-wrap: wrap;
      }
      .dash__sub {
        color: var(--color-text-secondary);
        font-size: 0.875rem;
      }
      .dash__refresh {
        min-height: 2rem;
        padding: 0 var(--space-component-lg);
        border-radius: var(--radius-component);
        border: 1px solid var(--color-border-default);
        background: var(--color-bg-surface);
        color: var(--color-text-primary);
        font: inherit;
        font-size: 0.8125rem;
        cursor: pointer;
      }
      .dash__refresh:hover:not(:disabled) {
        background: var(--color-hover-overlay);
      }
      .dash__refresh:disabled {
        color: var(--color-text-disabled);
        cursor: default;
      }
      .dash__refresh:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }

      .kpis {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
        gap: var(--space-layout-xs);
      }

      .kpi {
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        box-shadow: var(--elevation-raised);
        padding: var(--space-component-lg);
      }

      /* One emphasis surface. Obsidian's budget is 1, Modern's 2 and
         theEvolute's unbounded; taking the minimum is the only choice that
         satisfies all three without branching on the active language. */
      .kpi--anchor {
        background: var(--color-surface-featured);
        border-color: var(--color-surface-featured-border);
      }
      .kpi--anchor .kpi__label,
      .kpi--anchor .kpi__caption {
        color: var(--color-surface-featured-muted);
      }
      .kpi--anchor .kpi__value,
      .kpi--anchor .kpi__delta {
        color: var(--color-surface-featured-text);
      }
      .kpi--anchor .kpi__meter {
        background: rgb(255 255 255 / 0.18);
      }
      .kpi--anchor .kpi__meter-fill {
        background: var(--color-surface-featured-text);
      }

      .kpi__label {
        color: var(--color-text-secondary);
        font-size: 0.75rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .kpi__value {
        margin-top: var(--space-component-sm);
        color: var(--color-text-primary);
        font-family: var(--font-data);
        font-size: 1.875rem;
        line-height: 1.1;
      }

      /* Weight carries polarity and the arrow is the non-colour cue. Colour is
         applied only on the adverse case, so a language refusing colour in
         hierarchy still reads correctly. */
      .kpi__delta {
        margin-top: var(--space-component-sm);
        display: flex;
        align-items: center;
        gap: var(--space-component-xs);
        color: var(--color-text-secondary);
        font-family: var(--font-data);
        font-size: 0.8125rem;
        font-weight: 600;
      }
      .kpi__delta--adverse {
        color: var(--color-text-danger);
      }
      .kpi__arrow {
        font-size: 0.875rem;
      }

      .kpi__meter {
        margin-top: var(--space-component-md);
        height: 0.375rem;
        border-radius: var(--radius-pill);
        background: var(--color-bg-sunken);
        overflow: hidden;
      }
      .kpi__meter-fill {
        display: block;
        height: 100%;
        border-radius: var(--radius-pill);
        background: var(--color-bg-brand);
      }
      .kpi__caption {
        margin-top: var(--space-component-sm);
        color: var(--color-text-muted);
        font-size: 0.75rem;
      }

      .panel {
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        box-shadow: var(--elevation-raised);
        padding: var(--space-component-lg);
      }
      .panel__head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        margin-bottom: var(--space-component-lg);
      }
      .panel__title {
        color: var(--color-text-primary);
        font-family: var(--font-heading);
        font-size: 1.0625rem;
      }
      .panel__count {
        color: var(--color-text-muted);
        font-family: var(--font-data);
        font-size: 0.75rem;
      }

      /* Outflows are lighter, not red: weight before colour. The sign glyph in
         the value is what actually carries direction. */
      .legend__amount--out {
        font-weight: 400;
        color: var(--color-text-muted);
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `,
  ],
})
export class DashboardComponent {
  private readonly service = inject(DashboardService);
  private readonly route = inject(ActivatedRoute);

  protected readonly store = createListStore<Settlement>();
  protected readonly kpis = signal<readonly Kpi[]>([]);

  /** Scenario hook so empty and error states are reachable in a running app. */
  private readonly scenario = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get('dashboard'))),
    { initialValue: null },
  );

  protected readonly columns: ColumnDef<Settlement>[] = [
    { field: 'reference', header: 'Reference', width: '12rem' },
    { field: 'counterparty', header: 'Counterparty', sortable: true },
    { field: 'amount', header: 'Amount', width: '9rem' },
    { field: 'state', header: 'State', width: '8rem' },
    { field: 'receivedAt', header: 'Received', width: '10rem' },
  ];

  /** The anchor is the first KPI; a view without data has no anchor. */
  protected readonly anchorId = computed(() => this.kpis()[0]?.id ?? null);

  constructor() {
    this.reload();
  }

  protected reload(): void {
    this.store.begin();
    this.service.load(this.scenario()).subscribe({
      next: (snapshot) => {
        this.kpis.set(snapshot.kpis);
        this.store.succeed(snapshot.settlements);
      },
      error: (err: unknown) => {
        this.kpis.set([]);
        this.store.fail(fromUnknown(err));
      },
    });
  }

  protected arrow(kpi: Kpi): string {
    return kpi.direction === 'up' ? '↑' : kpi.direction === 'down' ? '↓' : '→';
  }

}
