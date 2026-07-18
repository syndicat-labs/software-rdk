import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'rdk-input',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="rdk-input" [ngClass]="wrapperClasses">
      <ng-content select="[slot=prefix]" />

      <input
        #inputEl
        class="rdk-input__control"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [readonly]="readonly"
        [attr.maxlength]="maxLength || null"
        [attr.id]="inputId || null"
        [attr.aria-describedby]="ariaDescribedBy || null"
        [attr.aria-invalid]="hasError || null"
        [value]="value()"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="focused.set(true)"
      />

      @if (clearable && value()) {
        <button
          type="button"
          class="rdk-input__clear"
          (click)="clear()"
          aria-label="Clear input"
          [disabled]="disabled"
        >
          <span class="pi pi-times" aria-hidden="true"></span>
        </button>
      }

      <ng-content select="[slot=suffix]" />
    </div>

    @if (showCount && maxLength) {
      <div class="rdk-input__count" [class.rdk-input__count--near-limit]="nearLimit">
        {{ value().length }} / {{ maxLength }}
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .rdk-input {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      height: var(--input-height-md);
      padding: 0 var(--input-padding-x);
      border: var(--input-border-width) solid var(--input-border-color);
      border-radius: var(--input-border-radius);
      background: var(--input-bg);
      transition: var(--input-transition);

      &:focus-within {
        border-color: var(--color-border-focus);
        box-shadow: var(--input-focus-shadow);
      }
    }

    .rdk-input--sm { height: var(--input-height-sm); font-size: var(--text-sm); }
    .rdk-input--lg { height: var(--input-height-lg); font-size: var(--text-lg); }

    .rdk-input--error {
      border-color: var(--color-border-danger);

      &:focus-within {
        border-color: var(--color-border-danger);
        box-shadow: 0 0 0 var(--color-focus-ring-width) rgba(239, 68, 68, 0.15);
      }
    }

    .rdk-input--disabled {
      background: var(--input-bg-disabled);
      opacity: 0.6;
      cursor: not-allowed;
    }

    .rdk-input__control {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      font-family: var(--font-family);
      font-size: var(--input-font-size);
      color: var(--color-text-primary);
      line-height: 1;

      &::placeholder { color: var(--color-text-muted); }
      &:disabled { cursor: not-allowed; }
    }

    .rdk-input__clear {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      padding: 0;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-muted);
      border-radius: var(--radius-sm);
      flex-shrink: 0;
      line-height: 1;

      &:hover { color: var(--color-text-secondary); }
      .pi { font-size: 0.625rem; }
    }

    .rdk-input__count {
      margin-top: var(--space-1);
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      text-align: right;

      &--near-limit { color: var(--color-warning-600); }
    }
  `],
})
export class InputComponent implements ControlValueAccessor {
  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() clearable = false;
  @Input() maxLength?: number;
  @Input() showCount = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() hasError = false;
  @Input() inputId?: string;
  @Input() ariaDescribedBy?: string;

  @Output() cleared = new EventEmitter<void>();

  protected readonly value = signal('');
  protected readonly focused = signal(false);

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected get wrapperClasses(): Record<string, boolean> {
    return {
      [`rdk-input--${this.size}`]: this.size !== 'md',
      'rdk-input--error': this.hasError,
      'rdk-input--disabled': this.disabled,
    };
  }

  protected get nearLimit(): boolean {
    return !!this.maxLength && this.value().length >= this.maxLength * 0.9;
  }

  protected onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  protected clear(): void {
    this.value.set('');
    this.onChange('');
    this.cleared.emit();
    this.inputEl?.nativeElement.focus();
  }

  writeValue(v: string | null): void {
    this.value.set(v ?? '');
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
