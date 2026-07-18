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

export type CheckboxSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'rdk-checkbox',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <label class="rdk-checkbox" [ngClass]="hostClasses">
      <span class="rdk-checkbox__box" [class.rdk-checkbox__box--indeterminate]="indeterminate">
        <input
          type="checkbox"
          class="rdk-checkbox__input"
          [checked]="_checked()"
          [indeterminate]="indeterminate"
          [disabled]="disabled"
          [attr.id]="inputId || null"
          [attr.aria-describedby]="ariaDescribedBy || null"
          (change)="onChange($event)"
          (blur)="onTouched()"
        />
        @if (indeterminate) {
          <span class="rdk-checkbox__mark rdk-checkbox__mark--indeterminate" aria-hidden="true">—</span>
        } @else if (_checked()) {
          <span class="rdk-checkbox__mark" aria-hidden="true">
            <svg viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        }
      </span>

      @if (label) {
        <span class="rdk-checkbox__label">{{ label }}</span>
      } @else {
        <span class="rdk-checkbox__label"><ng-content /></span>
      }
    </label>
  `,
  styles: [`
    :host { display: inline-flex; }

    .rdk-checkbox {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2-5);
      cursor: pointer;
      user-select: none;
      line-height: var(--leading-snug);

      &--disabled {
        opacity: 0.45;
        cursor: not-allowed;
        pointer-events: none;
      }
    }

    .rdk-checkbox__box {
      position: relative;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--check-size-md);
      height: var(--check-size-md);
      border: var(--check-border);
      border-radius: var(--check-radius);
      background: var(--check-bg);
      transition:
        border-color var(--duration-150) var(--ease-out),
        background var(--duration-150) var(--ease-out);
    }

    .rdk-checkbox--sm .rdk-checkbox__box {
      width: var(--check-size-sm);
      height: var(--check-size-sm);
    }

    .rdk-checkbox--lg .rdk-checkbox__box {
      width: var(--check-size-lg);
      height: var(--check-size-lg);
    }

    .rdk-checkbox__input {
      position: absolute;
      inset: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      margin: 0;

      &:focus-visible + .rdk-checkbox__mark, &:focus-visible {
        // focus handled on parent .rdk-checkbox__box
      }
    }

    .rdk-checkbox__input:checked ~ .rdk-checkbox__box,
    .rdk-checkbox__box:has(input:checked) {
      border-color: var(--check-checked-border);
      background: var(--check-checked-bg);
    }

    .rdk-checkbox__box:has(input:checked) {
      border-color: var(--check-checked-border);
      background: var(--check-checked-bg);
    }

    .rdk-checkbox__box:has(input:focus-visible) {
      outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
      outline-offset: var(--color-focus-ring-offset);
    }

    .rdk-checkbox__mark {
      pointer-events: none;
      color: var(--check-mark-color);
      line-height: 1;

      svg {
        width: 0.625rem;
        height: 0.5rem;
        display: block;
      }

      &--indeterminate {
        font-size: 0.6875rem;
        font-weight: var(--font-bold);
        line-height: 1;
        color: var(--check-mark-color);
      }
    }

    .rdk-checkbox__label {
      font-size: var(--text-base);
      color: var(--color-text-primary);
    }
  `],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() size: CheckboxSize = 'md';
  @Input() disabled = false;
  @Input() indeterminate = false;
  @Input() inputId?: string;
  @Input() ariaDescribedBy?: string;
  @Input() set checked(v: boolean) { this._checked.set(v); }

  @Output() changed = new EventEmitter<boolean>();

  protected readonly _checked = signal(false);

  private _onChange: (v: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  protected get hostClasses(): Record<string, boolean> {
    return {
      [`rdk-checkbox--${this.size}`]: true,
      'rdk-checkbox--disabled': this.disabled,
    };
  }

  protected onChange(event: Event): void {
    const v = (event.target as HTMLInputElement).checked;
    this._checked.set(v);
    this._onChange(v);
    this.changed.emit(v);
  }

  writeValue(v: boolean | null): void {
    this._checked.set(!!v);
  }

  registerOnChange(fn: (v: boolean) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
