import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  Input,
  signal,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'rdk-textarea',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  template: `
    <div class="rdk-textarea" [class.rdk-textarea--error]="hasError" [class.rdk-textarea--disabled]="disabled">
      <textarea
        #textareaEl
        class="rdk-textarea__control"
        [rows]="rows"
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
      >{{ value() }}</textarea>
    </div>

    @if (showCount && maxLength) {
      <div class="rdk-textarea__count" [class.rdk-textarea__count--near-limit]="nearLimit">
        {{ value().length }} / {{ maxLength }}
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .rdk-textarea {
      border: var(--input-border-width) solid var(--input-border-color);
      border-radius: var(--input-border-radius);
      background: var(--input-bg);
      transition: var(--input-transition);

      &:focus-within {
        border-color: var(--color-border-focus);
        box-shadow: var(--input-focus-shadow);
      }

      &--error {
        border-color: var(--color-border-danger);

        &:focus-within {
          border-color: var(--color-border-danger);
          box-shadow: 0 0 0 var(--color-focus-ring-width) rgba(239, 68, 68, 0.15);
        }
      }

      &--disabled {
        background: var(--input-bg-disabled);
        opacity: 0.6;
      }
    }

    .rdk-textarea__control {
      width: 100%;
      padding: var(--input-padding-x);
      border: none;
      outline: none;
      background: transparent;
      font-family: var(--font-family);
      font-size: var(--input-font-size);
      color: var(--color-text-primary);
      resize: vertical;
      box-sizing: border-box;
      line-height: var(--leading-normal);

      &::placeholder { color: var(--color-text-muted); }
      &:disabled { cursor: not-allowed; resize: none; }
    }

    .rdk-textarea__count {
      margin-top: var(--space-1);
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      text-align: right;

      &--near-limit { color: var(--color-warning-600); }
    }
  `],
})
export class TextareaComponent implements ControlValueAccessor {
  @ViewChild('textareaEl') textareaEl!: ElementRef<HTMLTextAreaElement>;

  @Input() rows = 3;
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() maxLength?: number;
  @Input() showCount = false;
  @Input() autoGrow = false;
  @Input() hasError = false;
  @Input() inputId?: string;
  @Input() ariaDescribedBy?: string;

  protected readonly value = signal('');

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected get nearLimit(): boolean {
    return !!this.maxLength && this.value().length >= this.maxLength * 0.9;
  }

  protected onInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    this.value.set(el.value);
    this.onChange(el.value);
    if (this.autoGrow) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }

  protected onBlur(): void {
    this.onTouched();
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
