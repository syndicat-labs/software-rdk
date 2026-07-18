import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NgClass } from '@angular/common';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'rdk-badge',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="rdk-badge"
      [ngClass]="hostClasses"
      [attr.role]="dismissible ? 'status' : null"
    >
      @if (dot) {
        <span class="rdk-badge__dot" aria-hidden="true"></span>
      }
      @if (!dotOnly) {
        <ng-content />
      }
      @if (dismissible) {
        <button
          type="button"
          class="rdk-badge__dismiss"
          (click)="dismissed.emit()"
          [attr.aria-label]="'Dismiss'"
        >
          <span class="pi pi-times" aria-hidden="true"></span>
        </button>
      }
    </span>
  `,
  styles: [`
    :host { display: inline-flex; }

    .rdk-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      padding: var(--badge-padding-y) var(--badge-padding-x);
      height: var(--badge-height-md);
      font-size: var(--badge-font-size);
      font-weight: var(--badge-font-weight);
      font-family: var(--font-family);
      line-height: 1;
      border-radius: var(--badge-radius);
      white-space: nowrap;
      border: 1px solid transparent;
    }

    // ── Sizes ──────────────────────────────────────────────────────────────────
    .rdk-badge--sm { height: var(--badge-height-sm); font-size: 0.6875rem; }
    .rdk-badge--lg { height: var(--badge-height-lg); font-size: 0.8125rem; padding: var(--space-1) var(--space-2-5); }

    // ── Variants ───────────────────────────────────────────────────────────────
    .rdk-badge--default {
      background: var(--color-neutral-100);
      color: var(--color-neutral-700);
      border-color: var(--color-neutral-200);
    }
    .rdk-badge--brand {
      background: var(--color-brand-50);
      color: var(--color-brand-700);
      border-color: var(--color-brand-200);
    }
    .rdk-badge--success {
      background: var(--color-status-success-bg);
      color: var(--color-status-success-text);
      border-color: var(--color-status-success-border);
    }
    .rdk-badge--warning {
      background: var(--color-status-warning-bg);
      color: var(--color-status-warning-text);
      border-color: var(--color-status-warning-border);
    }
    .rdk-badge--danger {
      background: var(--color-status-danger-bg);
      color: var(--color-status-danger-text);
      border-color: var(--color-status-danger-border);
    }
    .rdk-badge--info {
      background: var(--color-status-info-bg);
      color: var(--color-status-info-text);
      border-color: var(--color-status-info-border);
    }

    // ── Dot ────────────────────────────────────────────────────────────────────
    .rdk-badge__dot {
      display: inline-block;
      width: var(--badge-dot-size);
      height: var(--badge-dot-size);
      border-radius: var(--radius-pill);
      background: currentColor;
      flex-shrink: 0;
    }

    // ── Dismiss ────────────────────────────────────────────────────────────────
    .rdk-badge__dismiss {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 0.875rem;
      height: 0.875rem;
      padding: 0;
      margin-left: var(--space-0-5);
      background: none;
      border: none;
      cursor: pointer;
      color: currentColor;
      opacity: 0.7;
      border-radius: var(--radius-sm);
      line-height: 1;

      &:hover { opacity: 1; }

      .pi { font-size: 0.625rem; }
    }
  `],
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() size: BadgeSize = 'md';
  @Input() dot = false;
  @Input() dotOnly = false;
  @Input() dismissible = false;

  @Output() dismissed = new EventEmitter<void>();

  protected get hostClasses(): Record<string, boolean> {
    return {
      [`rdk-badge--${this.variant}`]: true,
      [`rdk-badge--${this.size}`]: true,
    };
  }
}
