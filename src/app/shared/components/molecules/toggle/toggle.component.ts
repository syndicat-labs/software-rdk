import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';

export type ToggleSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'rdk-toggle',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
  ],
  template: `
    <label class="rdk-toggle" [ngClass]="hostClasses" [attr.aria-disabled]="disabled || null">
      @if (label && labelPos === 'left') {
        <span class="rdk-toggle__label rdk-toggle__label--left">{{ label }}</span>
      }

      <button
        type="button"
        class="rdk-toggle__track"
        [attr.role]="'switch'"
        [attr.aria-checked]="_checked()"
        [attr.aria-label]="label || 'Toggle'"
        [disabled]="disabled"
        (click)="toggle()"
        (keydown.space)="onSpace($event)"
        (keydown.enter)="toggle()"
      >
        <span class="rdk-toggle__thumb"></span>
      </button>

      @if (label && labelPos === 'right') {
        <span class="rdk-toggle__label rdk-toggle__label--right">{{ label }}</span>
      }
    </label>
  `,
  styles: [`
    :host { display: inline-flex; }

    .rdk-toggle {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2-5);
      cursor: pointer;
      user-select: none;

      &--disabled {
        opacity: 0.45;
        cursor: not-allowed;
        pointer-events: none;
      }
    }

    .rdk-toggle__track {
      position: relative;
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      width: var(--toggle-width-md);
      height: var(--toggle-height-md);
      padding: 0;
      border: none;
      border-radius: var(--radius-pill);
      background: var(--toggle-track-off);
      cursor: pointer;
      transition: background var(--toggle-duration) var(--ease-in-out);
      outline: none;

      &:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }

      &[aria-checked="true"] {
        background: var(--toggle-track-on);
      }
    }

    .rdk-toggle--sm .rdk-toggle__track {
      width: var(--toggle-width-sm);
      height: var(--toggle-height-sm);
    }

    .rdk-toggle--lg .rdk-toggle__track {
      width: var(--toggle-width-lg);
      height: var(--toggle-height-lg);
    }

    .rdk-toggle__thumb {
      position: absolute;
      left: 2px;
      width: calc(var(--toggle-height-md) - 4px);
      height: calc(var(--toggle-height-md) - 4px);
      border-radius: var(--radius-pill);
      background: var(--toggle-thumb);
      box-shadow: var(--shadow-xs);
      transition: transform var(--toggle-duration) var(--ease-in-out);

      @media (prefers-reduced-motion: no-preference) {
        .rdk-toggle__track[aria-checked="true"] & {
          transform: translateX(calc(var(--toggle-width-md) - var(--toggle-height-md)));
        }
      }
    }

    .rdk-toggle--sm .rdk-toggle__thumb {
      width: calc(var(--toggle-height-sm) - 4px);
      height: calc(var(--toggle-height-sm) - 4px);

      .rdk-toggle__track[aria-checked="true"] & {
        transform: translateX(calc(var(--toggle-width-sm) - var(--toggle-height-sm)));
      }
    }

    .rdk-toggle--lg .rdk-toggle__thumb {
      width: calc(var(--toggle-height-lg) - 4px);
      height: calc(var(--toggle-height-lg) - 4px);

      .rdk-toggle__track[aria-checked="true"] & {
        transform: translateX(calc(var(--toggle-width-lg) - var(--toggle-height-lg)));
      }
    }

    .rdk-toggle__label {
      font-size: var(--text-base);
      color: var(--color-text-primary);
    }
  `],
})
export class ToggleComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() labelPos: 'left' | 'right' = 'right';
  @Input() size: ToggleSize = 'md';
  @Input() disabled = false;
  @Input() set checked(v: boolean) { this._checked.set(v); }

  @Output() changed = new EventEmitter<boolean>();

  protected readonly _checked = signal(false);

  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  protected get hostClasses(): Record<string, boolean> {
    return {
      [`rdk-toggle--${this.size}`]: true,
      'rdk-toggle--disabled': this.disabled,
    };
  }

  protected toggle(): void {
    if (this.disabled) return;
    const next = !this._checked();
    this._checked.set(next);
    this.onChange(next);
    this.onTouched();
    this.changed.emit(next);
  }

  protected onSpace(event: Event): void {
    event.preventDefault();
    this.toggle();
  }

  writeValue(v: boolean | null): void {
    this._checked.set(!!v);
  }

  registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
