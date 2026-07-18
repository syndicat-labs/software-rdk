import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NgClass } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'rdk-button',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="rdk-btn"
      [ngClass]="hostClasses"
      [type]="type"
      [disabled]="disabled || loading"
      [attr.aria-disabled]="disabled || loading"
      [attr.aria-busy]="loading || null"
      (click)="onButtonClick($event)"
    >
      @if (loading) {
        <span class="rdk-btn__spinner" aria-hidden="true"></span>
      } @else if (icon && iconPos === 'left') {
        <span class="pi rdk-btn__icon rdk-btn__icon--left" [ngClass]="icon" aria-hidden="true"></span>
      }

      @if (!iconOnly) {
        <span class="rdk-btn__label"><ng-content /></span>
      }

      @if (!loading && icon && iconPos === 'right') {
        <span class="pi rdk-btn__icon rdk-btn__icon--right" [ngClass]="icon" aria-hidden="true"></span>
      }
    </button>
  `,
  styles: [`
    :host { display: inline-block; }
    :host([hidden]) { display: none; }

    .rdk-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--btn-icon-gap);
      padding: 0 var(--btn-padding-x-md);
      height: var(--btn-height-md);
      font-family: var(--font-family);
      font-size: var(--btn-font-size-md);
      font-weight: var(--btn-font-weight);
      letter-spacing: var(--btn-letter-spacing);
      line-height: 1;
      border: 1.5px solid transparent;
      border-radius: var(--btn-radius);
      cursor: pointer;
      text-decoration: none;
      white-space: nowrap;
      transition: var(--btn-transition);
      position: relative;
      user-select: none;
      outline: none;

      &:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }

      &:active:not(:disabled) {
        transform: translateY(1px);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.45;
      }
    }

    // ── Sizes ──────────────────────────────────────────────────────────────────
    .rdk-btn--sm {
      height: var(--btn-height-sm);
      padding: 0 var(--btn-padding-x-sm);
      font-size: var(--btn-font-size-sm);
    }
    .rdk-btn--lg {
      height: var(--btn-height-lg);
      padding: 0 var(--btn-padding-x-lg);
      font-size: var(--btn-font-size-lg);
    }

    // ── Variants ───────────────────────────────────────────────────────────────
    .rdk-btn--primary {
      background: var(--color-brand-500);
      border-color: var(--color-brand-500);
      color: var(--color-neutral-0);
      box-shadow: 0 1px 2px rgba(99, 102, 241, 0.25);

      &:hover:not(:disabled) {
        background: var(--color-brand-600);
        border-color: var(--color-brand-600);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
        transform: translateY(-1px);
      }
    }

    .rdk-btn--secondary {
      background: var(--color-bg-surface);
      border-color: var(--color-border-strong);
      color: var(--color-text-primary);
      box-shadow: var(--shadow-xs);

      &:hover:not(:disabled) {
        background: var(--color-bg-sunken);
        border-color: var(--color-brand-400);
        color: var(--color-brand-600);
      }
    }

    .rdk-btn--ghost {
      background: transparent;
      border-color: transparent;
      color: var(--color-text-secondary);

      &:hover:not(:disabled) {
        background: var(--color-hover-overlay);
        color: var(--color-text-primary);
      }
    }

    .rdk-btn--danger {
      background: var(--color-danger-500);
      border-color: var(--color-danger-500);
      color: var(--color-neutral-0);
      box-shadow: 0 1px 2px rgba(239, 68, 68, 0.25);

      &:hover:not(:disabled) {
        background: var(--color-danger-600);
        border-color: var(--color-danger-600);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
        transform: translateY(-1px);
      }
    }

    .rdk-btn--link {
      background: transparent;
      border-color: transparent;
      color: var(--color-text-brand);
      text-decoration: underline;
      text-underline-offset: 2px;
      padding: 0;
      height: auto;

      &:hover:not(:disabled) {
        color: var(--color-brand-700);
      }
    }

    // ── Full width ─────────────────────────────────────────────────────────────
    .rdk-btn--full { width: 100%; }

    // ── Icon-only ──────────────────────────────────────────────────────────────
    .rdk-btn--icon-only {
      padding: 0;
      width: var(--btn-height-md);

      &.rdk-btn--sm { width: var(--btn-height-sm); }
      &.rdk-btn--lg { width: var(--btn-height-lg); }
    }

    // ── Loading ────────────────────────────────────────────────────────────────
    .rdk-btn__spinner {
      display: inline-block;
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: var(--radius-pill);
      flex-shrink: 0;

      @media (prefers-reduced-motion: no-preference) {
        animation: spin var(--spinner-duration) linear infinite;
      }
    }

    .rdk-btn__icon {
      font-size: 0.875em;
      flex-shrink: 0;
    }
  `],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon?: string;
  @Input() iconPos: 'left' | 'right' = 'left';
  @Input() fullWidth = false;
  @Input() iconOnly = false;

  @Output() clicked = new EventEmitter<MouseEvent>();

  protected get hostClasses(): Record<string, boolean> {
    return {
      [`rdk-btn--${this.variant}`]: true,
      [`rdk-btn--${this.size}`]: true,
      'rdk-btn--full': this.fullWidth,
      'rdk-btn--icon-only': this.iconOnly,
      'rdk-btn--loading': this.loading,
    };
  }

  protected onButtonClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
