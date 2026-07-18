import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: unknown;
  disabled?: boolean;
}

@Component({
  selector: 'rdk-select',
  standalone: true,
  imports: [DropdownModule, MultiSelectModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    @if (!multiple) {
      <p-dropdown
        class="rdk-select"
        [options]="options"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [filter]="filter"
        [showClear]="clearable"
        optionLabel="label"
        optionValue="value"
        optionDisabled="disabled"
        [(ngModel)]="value"
        (ngModelChange)="onValueChange($event)"
        (onBlur)="onTouched()"
        [styleClass]="'rdk-select__dropdown'"
      />
    } @else {
      <p-multiSelect
        class="rdk-select"
        [options]="options"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [filter]="filter"
        optionLabel="label"
        optionValue="value"
        optionDisabled="disabled"
        [(ngModel)]="value"
        (ngModelChange)="onValueChange($event)"
        (onBlur)="onTouched()"
        [styleClass]="'rdk-select__dropdown'"
      />
    }
  `,
  styles: [`
    :host { display: block; }

    ::ng-deep .rdk-select__dropdown {
      width: 100%;

      .p-dropdown, .p-multiselect {
        width: 100%;
        border-radius: var(--input-border-radius);
        border-color: var(--input-border-color);

        &:focus, &.p-focus {
          border-color: var(--color-border-focus);
          box-shadow: var(--input-focus-shadow);
        }
      }
    }
  `],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Select…';
  @Input() disabled = false;
  @Input() filter = false;
  @Input() multiple = false;
  @Input() clearable = false;

  @Output() changed = new EventEmitter<unknown>();

  value: unknown = null;

  private _onChange: (v: unknown) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onValueChange(v: unknown): void {
    this._onChange(v);
    this.changed.emit(v);
  }

  writeValue(v: unknown): void {
    this.value = v;
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
