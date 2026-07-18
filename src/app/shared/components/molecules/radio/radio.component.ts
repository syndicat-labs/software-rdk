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

export interface RadioOption {
  label: string;
  value: unknown;
  disabled?: boolean;
}

@Component({
  selector: 'rdk-radio-group',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
  template: `
    <div
      class="rdk-radio-group"
      [ngClass]="'rdk-radio-group--' + orientation"
      role="radiogroup"
    >
      @for (option of options; track option.value) {
        <label
          class="rdk-radio"
          [class.rdk-radio--disabled]="option.disabled || disabled"
          [class.rdk-radio--checked]="isChecked(option.value)"
        >
          <span class="rdk-radio__circle">
            <input
              type="radio"
              class="rdk-radio__input"
              [name]="name"
              [value]="option.value"
              [checked]="isChecked(option.value)"
              [disabled]="option.disabled || disabled"
              (change)="onSelect(option.value)"
              (blur)="onTouched()"
            />
            <span class="rdk-radio__dot" aria-hidden="true"></span>
          </span>
          <span class="rdk-radio__label">{{ option.label }}</span>
        </label>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .rdk-radio-group {
      display: flex;
      gap: var(--space-3);

      &--v { flex-direction: column; }
      &--h { flex-direction: row; flex-wrap: wrap; }
    }

    .rdk-radio {
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

    .rdk-radio__circle {
      position: relative;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--check-size-md);
      height: var(--check-size-md);
      border: var(--check-border);
      border-radius: var(--radio-radius);
      background: var(--check-bg);
      transition:
        border-color var(--duration-150) var(--ease-out),
        background var(--duration-150) var(--ease-out);
    }

    .rdk-radio--checked .rdk-radio__circle {
      border-color: var(--check-checked-border);
      background: var(--check-checked-bg);
    }

    .rdk-radio__circle:has(input:focus-visible) {
      outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
      outline-offset: var(--color-focus-ring-offset);
    }

    .rdk-radio__input {
      position: absolute;
      inset: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      margin: 0;
    }

    .rdk-radio__dot {
      width: 0.375rem;
      height: 0.375rem;
      border-radius: var(--radius-pill);
      background: var(--check-mark-color);
      opacity: 0;
      transition: opacity var(--duration-150) var(--ease-out);
      pointer-events: none;
    }

    .rdk-radio--checked .rdk-radio__dot { opacity: 1; }

    .rdk-radio__label {
      font-size: var(--text-base);
      color: var(--color-text-primary);
    }
  `],
})
export class RadioGroupComponent implements ControlValueAccessor {
  @Input() options: RadioOption[] = [];
  @Input() orientation: 'v' | 'h' = 'v';
  @Input() disabled = false;
  @Input() name = `rdk-radio-${Math.random().toString(36).slice(2, 7)}`;

  @Output() changed = new EventEmitter<unknown>();

  protected readonly selected = signal<unknown>(null);

  private _onChange: (v: unknown) => void = () => {};
  protected onTouched: () => void = () => {};

  protected isChecked(value: unknown): boolean {
    return this.selected() === value;
  }

  protected onSelect(value: unknown): void {
    this.selected.set(value);
    this._onChange(value);
    this.changed.emit(value);
  }

  writeValue(v: unknown): void {
    this.selected.set(v);
  }

  registerOnChange(fn: (v: unknown) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
