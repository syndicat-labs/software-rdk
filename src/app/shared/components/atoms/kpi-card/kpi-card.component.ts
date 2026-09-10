import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import type { DashboardMetric } from '../../../../features/dashboard/dashboard.store';

@Component({
  selector: 'rdk-kpi-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="kpi" [class.kpi--featured]="featured" [class.kpi--obsidian]="variant === 'obsidian'" [class.kpi--evolute]="variant === 'evolute'">
      @if (variant === 'evolute' && showDot) {
        <span class="kpi__dot" [attr.data-chromatic-key]="chromaticKey" aria-hidden="true"></span>
      }
      <span class="kpi__label">{{ metric.label }}</span>
      <span class="kpi__value">{{ metric.value }}</span>
      <span class="kpi__delta" [class.kpi__delta--down]="metric.delta < 0">
        {{ metric.delta >= 0 ? '↑' : '↓' }} {{ absDelta }}%
        @if (metric.unit) {
          <span class="kpi__unit">{{ metric.unit }}</span>
        }
      </span>
      @if (showActions) {
        <div class="kpi__actions">
          <button type="button" class="kpi__action" (click)="configure.emit(metric.id)" aria-label="Configure {{ metric.label }}">⋯</button>
          <button type="button" class="kpi__action kpi__action--remove" (click)="remove.emit(metric.id)" aria-label="Remove {{ metric.label }}">×</button>
        </div>
      }
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .kpi {
        display: flex;
        flex-direction: column;
        gap: var(--space-component-xs);
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        box-shadow: var(--elevation-raised);
        padding: var(--space-component-lg);
        position: relative;
      }

      .kpi--featured {
        box-shadow: var(--elevation-float);
        border-color: var(--color-border-brand);
      }

      .kpi--obsidian.kpi--featured {
        background: var(--color-surface-featured);
        border-color: var(--color-surface-featured-border);
      }

      .kpi--obsidian.kpi--featured .kpi__label,
      .kpi--obsidian.kpi--featured .kpi__unit {
        color: var(--color-surface-featured-muted);
      }

      .kpi--obsidian.kpi--featured .kpi__value {
        color: var(--color-surface-featured-text);
      }

      .kpi__dot {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: var(--radius-pill);
        flex-shrink: 0;
      }

      .kpi--evolute .kpi__dot {
        background: var(--color-bg-brand);
      }

      /* Chromatic Key is data, not DOM position: a reordered dashboard no
         longer repaints the kpi dots, because the key belongs to the metric. */
      .kpi--evolute .kpi__dot[data-chromatic-key='1'] { background: var(--color-bg-brand); }
      .kpi--evolute .kpi__dot[data-chromatic-key='2'] { background: var(--color-bg-info); }
      .kpi--evolute .kpi__dot[data-chromatic-key='3'] { background: var(--color-bg-success); }
      .kpi--evolute .kpi__dot[data-chromatic-key='4'] { background: var(--color-bg-warning); }

      .kpi__label {
        color: var(--color-text-secondary);
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .kpi__value {
        color: var(--color-text-primary);
        font-family: var(--font-data);
        font-size: 1.75rem;
        line-height: 1.1;
      }

      .kpi__delta {
        color: var(--color-text-success);
        font-family: var(--font-data);
        font-size: 0.8125rem;
      }

      .kpi__delta--down {
        color: var(--color-text-danger);
      }

      .kpi__unit {
        color: var(--color-text-muted);
      }

      .kpi__actions {
        position: absolute;
        top: var(--space-component-sm);
        right: var(--space-component-sm);
        display: flex;
        gap: var(--space-component-xs);
      }

      .kpi__action {
        width: 1.5rem;
        height: 1.5rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-pill);
        background: var(--color-bg-surface);
        color: var(--color-text-secondary);
        cursor: pointer;
        font-size: 0.875rem;
        line-height: 1;
      }

      .kpi__action:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }

      .kpi__action--remove:hover {
        background: var(--color-bg-danger-subtle);
        border-color: var(--color-border-danger);
        color: var(--color-text-danger);
      }
    `,
  ],
})
export class KpiCardComponent {
  @Input({ required: true }) metric!: DashboardMetric;
  @Input() featured = false;
  @Input() showActions = false;
  @Input() variant: 'modern' | 'obsidian' | 'evolute' = 'modern';
  @Input() showDot = false;
  /** Evolute chromatic identity, independent of DOM position (1–4). */
  @Input() chromaticKey: 1 | 2 | 3 | 4 = 1;

  @Output() configure = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  get absDelta(): number {
    return Math.abs(this.metric.delta);
  }
}
