import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NgClass } from '@angular/common';

export type ChipVariant = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'rdk-chip',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="rdk-chip"
      [ngClass]="hostClasses"
      [attr.role]="selectable ? 'checkbox' : null"
      [attr.aria-checked]="selectable ? selected : null"
      [attr.tabindex]="selectable && !disabled ? '0' : null"
      (click)="onSelect()"
      (keydown.enter)="onSelect()"
      (keydown.space)="onSelectSpace($any($event))"
    >
      @if (icon) {
        <span class="pi rdk-chip__icon" [ngClass]="icon" aria-hidden="true"></span>
      }
      @if (label) {
        <span class="rdk-chip__label">{{ label }}</span>
      } @else {
        <span class="rdk-chip__label"><ng-content /></span>
      }
      @if (dismissible) {
        <button
          type="button"
          class="rdk-chip__dismiss"
          (click)="onDismiss($event)"
          [attr.aria-label]="'Remove ' + (label ?? 'chip')"
          [disabled]="disabled"
        >
          <span class="pi pi-times" aria-hidden="true"></span>
        </button>
      }
    </span>
  `,
  styles: [`
    :host { display: inline-flex; }

    .rdk-chip {
      display: inline-flex;
      align-items: center;
      gap: var(--chip-gap);
      height: var(--chip-height);
      padding: 0 var(--chip-padding-x);
      font-size: var(--chip-font-size);
      font-weight: var(--chip-font-weight);
      font-family: var(--font-family);
      line-height: 1;
      border-radius: var(--chip-radius);
      border: 1px solid transparent;
      white-space: nowrap;
      transition:
        background var(--duration-150) var(--ease-out),
        border-color var(--duration-150) var(--ease-out),
        color var(--duration-150) var(--ease-out);
    }

    // ── Selectable ─────────────────────────────────────────────────────────────
    .rdk-chip--selectable {
      cursor: pointer;

      &:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }
    }

    .rdk-chip--selected { font-weight: var(--font-semibold); }

    .rdk-chip--disabled {
      opacity: 0.45;
      cursor: not-allowed;
      pointer-events: none;
    }

    // ── Variants ───────────────────────────────────────────────────────────────
    .rdk-chip--default {
      background: var(--color-neutral-100);
      color: var(--color-neutral-700);
      border-color: var(--color-neutral-200);

      &.rdk-chip--selected, &.rdk-chip--selectable:hover {
        background: var(--color-neutral-200);
        border-color: var(--color-neutral-300);
      }
    }

    .rdk-chip--brand {
      background: var(--color-brand-50);
      color: var(--color-brand-700);
      border-color: var(--color-brand-200);

      &.rdk-chip--selected, &.rdk-chip--selectable:hover {
        background: var(--color-brand-100);
        border-color: var(--color-brand-400);
      }
    }

    .rdk-chip--success {
      background: var(--color-status-success-bg);
      color: var(--color-status-success-text);
      border-color: var(--color-status-success-border);
    }

    .rdk-chip--warning {
      background: var(--color-status-warning-bg);
      color: var(--color-status-warning-text);
      border-color: var(--color-status-warning-border);
    }

    .rdk-chip--danger {
      background: var(--color-status-danger-bg);
      color: var(--color-status-danger-text);
      border-color: var(--color-status-danger-border);
    }

    .rdk-chip--info {
      background: var(--color-status-info-bg);
      color: var(--color-status-info-text);
      border-color: var(--color-status-info-border);
    }

    .rdk-chip__icon { font-size: var(--chip-icon-size); }

    .rdk-chip__dismiss {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1rem;
      height: 1rem;
      padding: 0;
      margin-left: var(--space-0-5);
      background: none;
      border: none;
      cursor: pointer;
      color: currentColor;
      opacity: 0.6;
      border-radius: var(--radius-sm);
      line-height: 1;
      flex-shrink: 0;

      &:hover { opacity: 1; }
      .pi { font-size: 0.5625rem; }
    }
  `],
})
export class ChipComponent {
  @Input() label?: string;
  @Input() icon?: string;
  @Input() variant: ChipVariant = 'default';
  @Input() selected = false;
  @Input() selectable = false;
  @Input() dismissible = false;
  @Input() disabled = false;

  @Output() selectedChange = new EventEmitter<boolean>();
  @Output() dismissed = new EventEmitter<void>();

  protected get hostClasses(): Record<string, boolean> {
    return {
      [`rdk-chip--${this.variant}`]: true,
      'rdk-chip--selectable': this.selectable,
      'rdk-chip--selected': this.selected,
      'rdk-chip--disabled': this.disabled,
    };
  }

  protected onSelect(): void {
    if (this.selectable && !this.disabled) {
      this.selectedChange.emit(!this.selected);
    }
  }

  protected onSelectSpace(event: KeyboardEvent): void {
    event.preventDefault();
    this.onSelect();
  }

  protected onDismiss(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.dismissed.emit();
    }
  }
}
