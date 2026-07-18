import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type SpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'rdk-spinner',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rdk-spinner"
      [ngClass]="hostClasses"
      role="status"
      [attr.aria-label]="label"
      aria-live="polite"
    >
      <span class="rdk-spinner__ring" aria-hidden="true"></span>
      @if (showLabel && label) {
        <span class="rdk-spinner__label">{{ label }}</span>
      }
    </div>
  `,
  styles: [`
    :host { display: inline-block; }

    .rdk-spinner {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
    }

    .rdk-spinner--overlay {
      position: fixed;
      inset: 0;
      background: rgba(255 255 255 / 0.8);
      z-index: var(--z-overlay);
      display: flex;
    }

    // ── Sizes ──────────────────────────────────────────────────────────────────
    .rdk-spinner--sm .rdk-spinner__ring {
      width: var(--spinner-size-sm);
      height: var(--spinner-size-sm);
    }
    .rdk-spinner--md .rdk-spinner__ring {
      width: var(--spinner-size-md);
      height: var(--spinner-size-md);
    }
    .rdk-spinner--lg .rdk-spinner__ring {
      width: var(--spinner-size-lg);
      height: var(--spinner-size-lg);
      border-width: 4px;
    }

    // ── Ring ───────────────────────────────────────────────────────────────────
    .rdk-spinner__ring {
      display: inline-block;
      border: var(--spinner-stroke-width) solid var(--spinner-track-color);
      border-top-color: var(--spinner-fill-color);
      border-radius: var(--radius-pill);
      flex-shrink: 0;

      @media (prefers-reduced-motion: no-preference) {
        animation: spin var(--spinner-duration) linear infinite;
      }
    }

    // ── Color overrides ────────────────────────────────────────────────────────
    .rdk-spinner--brand   .rdk-spinner__ring { border-top-color: var(--color-brand-500); }
    .rdk-spinner--success .rdk-spinner__ring { border-top-color: var(--color-success-500); }
    .rdk-spinner--danger  .rdk-spinner__ring { border-top-color: var(--color-danger-500); }
    .rdk-spinner--muted   .rdk-spinner__ring { border-top-color: var(--color-neutral-400); }
    .rdk-spinner--white   .rdk-spinner__ring {
      border-color: rgba(255 255 255 / 0.3);
      border-top-color: var(--color-neutral-0);
    }

    .rdk-spinner__label {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
    }
  `],
})
export class SpinnerComponent {
  @Input() size: SpinnerSize = 'md';
  @Input() color: 'brand' | 'success' | 'danger' | 'muted' | 'white' = 'brand';
  @Input() label = 'Loading…';
  @Input() showLabel = false;
  @Input() overlay = false;

  protected get hostClasses(): Record<string, boolean> {
    return {
      [`rdk-spinner--${this.size}`]: true,
      [`rdk-spinner--${this.color}`]: true,
      'rdk-spinner--overlay': this.overlay,
    };
  }
}
