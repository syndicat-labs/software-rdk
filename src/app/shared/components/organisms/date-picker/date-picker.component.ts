import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'rdk-date-picker',
  standalone: true,
  imports: [DatePickerModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
  template: `
    <p-datepicker
      class="rdk-date-picker"
      [(ngModel)]="value"
      (ngModelChange)="onValueChange($event)"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [showTime]="showTime"
      [dateFormat]="dateFormat"
      [minDate]="minDate ?? undefined"
      [maxDate]="maxDate ?? undefined"
      [showIcon]="true"
      [showButtonBar]="true"
      [styleClass]="'rdk-date-picker__calendar'"
      (onBlur)="onTouched()"
    />
  `,
  styles: [`
    :host { display: block; }

    ::ng-deep .rdk-date-picker {
      width: 100%;

      .p-datepicker {
        width: 100%;
      }

      .p-inputtext {
        width: 100%;
        height: var(--input-height-md);
        border-radius: var(--input-border-radius);
        border-color: var(--input-border-color);
        font-family: var(--font-family);

        &:focus {
          border-color: var(--color-border-focus);
          box-shadow: var(--input-focus-shadow);
        }
      }

      .p-datepicker-dropdown {
        border-radius: 0 var(--input-border-radius) var(--input-border-radius) 0;
      }
    }
  `],
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() placeholder = 'Select date…';
  @Input() disabled = false;
  @Input() showTime = false;
  @Input() dateFormat = 'dd/mm/yy';
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;

  @Output() valueChange = new EventEmitter<Date | null>();

  value: Date | null = null;

  private _onChange: (v: Date | null) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onValueChange(v: Date | null): void {
    this._onChange(v);
    this.valueChange.emit(v);
  }

  writeValue(v: Date | null): void {
    this.value = v;
  }

  registerOnChange(fn: (v: Date | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
