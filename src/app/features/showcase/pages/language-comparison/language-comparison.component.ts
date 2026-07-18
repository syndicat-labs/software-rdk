import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { THEME_REGISTRY } from '../../../../core/theme/token-contract';
import { getDesignLanguage } from '../../../../core/theme/design-language';

/**
 * Renders one identical specimen per registered design language.
 *
 * The specimen is a single `ng-template` instantiated once per language via
 * `ngTemplateOutlet`, so the markup is not merely similar — it is the same
 * template. Any visual difference between panels is therefore attributable to
 * the `data-theme` attribute alone, which is the protocol's swap-invariance
 * claim made observable rather than asserted.
 *
 * The specimen reads ONLY contract tokens. A private token (`--obs-*`,
 * `--evo-*`) here would resolve under one language and collapse under the
 * others, which is exactly the failure this page exists to expose.
 */
@Component({
  selector: 'rdk-language-comparison',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="intro">
      <h1>Design language comparison</h1>
      <p>
        One template, rendered once per registered language. Only the
        <code>data-theme</code> attribute differs between panels — no component code, no conditional
        styling. Divergence below is the languages disagreeing, which is the point.
      </p>
    </header>

    <div class="grid">
      @for (theme of themes; track theme.id) {
        <section class="panel" [attr.data-theme]="theme.id">
          <div class="panel__body">
            <div class="panel__head">
              <h2>{{ theme.label }}</h2>
              <p class="panel__id">{{ theme.id }}</p>
              @if (thesisFor(theme.id); as thesis) {
                <p class="panel__thesis">{{ thesis }}</p>
              } @else {
                <p class="panel__thesis panel__thesis--none">No declaration — contract only</p>
              }
            </div>
            <ng-container [ngTemplateOutlet]="specimen" />
          </div>
        </section>
      }
    </div>

    <ng-template #specimen>
      <!-- Surface + type hierarchy -->
      <article class="card">
        <h3 class="card__title">Settlement summary</h3>
        <p class="card__sub">Reconciled 12 minutes ago</p>
        <p class="card__amount">£48,209.55</p>
        <p class="card__meta">
          Reference <span class="mono">TXN-9F42-08C1</span>
        </p>
      </article>

      <!-- Emphasis surface -->
      <article class="card card--featured">
        <h3 class="card__title">Featured surface</h3>
        <p class="card__sub card__sub--featured">
          How each language anchors its most important value
        </p>
      </article>

      <!-- Status colour containment -->
      <div class="row">
        <span class="badge badge--success">Settled</span>
        <span class="badge badge--warning">Pending</span>
        <span class="badge badge--danger">Failed</span>
      </div>

      <!-- Polarity encoding -->
      <div class="ledger">
        <div class="ledger__row">
          <span>Credit</span><span class="mono ledger__credit">+ £1,200.00</span>
        </div>
        <div class="ledger__row">
          <span>Debit</span><span class="mono ledger__debit">− £340.00</span>
        </div>
      </div>

      <!-- Interactive + border treatment -->
      <div class="row">
        <button type="button" class="btn btn--primary">Approve</button>
        <button type="button" class="btn">Cancel</button>
      </div>
      <input class="input" placeholder="Search transactions" aria-label="Search transactions" />
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: var(--space-layout-md);
      }

      .intro {
        max-width: 60ch;
        margin-bottom: var(--space-layout-md);
      }
      .intro h1 {
        color: var(--color-text-primary);
        margin-bottom: var(--space-component-sm);
      }
      .intro p {
        color: var(--color-text-secondary);
        line-height: 1.6;
      }
      .intro code {
        font-family: var(--font-data);
        color: var(--color-text-brand);
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
        gap: var(--space-layout-sm);
        align-items: start;
      }

      /* The panel itself is neutral scaffolding; every token inside resolves
         against the panel's own data-theme. */
      .panel {
        background: var(--color-bg-base);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        overflow: hidden;
      }
      .panel__body {
        display: flex;
        flex-direction: column;
        gap: var(--space-layout-xs);
        padding: var(--space-layout-xs);
      }
      .panel__head h2 {
        color: var(--color-text-primary);
      }
      .panel__id {
        font-family: var(--font-data);
        font-size: 0.75rem;
        color: var(--color-text-muted);
      }
      .panel__thesis {
        margin-top: var(--space-component-sm);
        color: var(--color-text-secondary);
        font-size: 0.8125rem;
        line-height: 1.5;
      }
      .panel__thesis--none {
        color: var(--color-text-muted);
        font-style: italic;
      }

      .card {
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        padding: var(--space-component-lg);
      }
      .card__title {
        color: var(--color-text-primary);
        font-size: 1rem;
      }
      .card__sub {
        color: var(--color-text-secondary);
        font-size: 0.8125rem;
      }
      .card__amount {
        color: var(--color-text-primary);
        font-family: var(--font-data);
        font-size: 1.75rem;
        margin: var(--space-component-md) 0;
      }
      .card__meta {
        color: var(--color-text-muted);
        font-size: 0.75rem;
      }

      .card--featured {
        background: var(--color-surface-featured);
        border-color: var(--color-surface-featured-border);
      }
      .card--featured .card__title {
        color: var(--color-surface-featured-text);
      }
      .card__sub--featured {
        color: var(--color-surface-featured-muted);
      }

      .row {
        display: flex;
        gap: var(--space-component-sm);
        flex-wrap: wrap;
      }

      .badge {
        border-radius: var(--radius-pill);
        padding: 0.25rem 0.625rem;
        font-size: 0.75rem;
        border: 1px solid transparent;
      }
      .badge--success {
        background: var(--color-status-success-bg);
        border-color: var(--color-status-success-border);
        color: var(--color-status-success-text);
      }
      .badge--warning {
        background: var(--color-status-warning-bg);
        border-color: var(--color-status-warning-border);
        color: var(--color-status-warning-text);
      }
      .badge--danger {
        background: var(--color-status-danger-bg);
        border-color: var(--color-status-danger-border);
        color: var(--color-status-danger-text);
      }

      .ledger {
        background: var(--color-bg-sunken);
        border-radius: var(--radius-component);
        padding: var(--space-component-md);
      }
      .ledger__row {
        display: flex;
        justify-content: space-between;
        padding: var(--space-component-xs) 0;
        color: var(--color-text-secondary);
        font-size: 0.8125rem;
      }
      /* Weight is applied unconditionally; each language decides via its tokens
         whether colour also participates. */
      .ledger__credit {
        color: var(--color-text-success);
        font-weight: 600;
      }
      .ledger__debit {
        color: var(--color-text-danger);
      }

      .btn {
        border-radius: var(--radius-component);
        border: 1px solid var(--color-border-default);
        background: var(--color-bg-surface);
        color: var(--color-text-primary);
        padding: 0.5rem 0.875rem;
        font-size: 0.8125rem;
        min-height: 2rem;
        cursor: pointer;
      }
      .btn--primary {
        background: var(--color-bg-brand);
        border-color: var(--color-border-brand);
        color: var(--color-text-inverse);
      }
      .btn:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }

      .input {
        width: 100%;
        border-radius: var(--radius-component);
        border: 1px solid var(--color-border-default);
        background: var(--color-bg-surface);
        color: var(--color-text-primary);
        padding: 0.5rem 0.75rem;
        font-size: 0.8125rem;
      }
      .input::placeholder {
        color: var(--color-text-muted);
      }
      .input:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
        border-color: var(--color-border-focus);
      }

      .mono {
        font-family: var(--font-data);
      }
    `,
  ],
})
export class LanguageComparisonComponent {
  readonly themes = THEME_REGISTRY;

  thesisFor(id: string): string | undefined {
    return getDesignLanguage(id)?.philosophy.thesis;
  }
}
