import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';

export interface ComboboxSuggestion {
  label: string;
  value: unknown;
}

@Component({
  selector: 'rdk-combobox',
  standalone: true,
  imports: [AutoCompleteModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxComponent),
      multi: true,
    },
  ],
  template: `
    <p-autoComplete
      class="rdk-combobox"
      [(ngModel)]="value"
      (ngModelChange)="onValueChange($event)"
      [suggestions]="suggestions"
      [optionLabel]="'label'"
      [multiple]="multiple"
      [minLength]="minLength"
      [placeholder]="placeholder"
      [disabled]="disabled"
      (completeMethod)="onSearch($event)"
      (onBlur)="onTouched()"
      [styleClass]="'rdk-combobox__ac'"
    />
  `,
  styles: [`
    :host { display: block; }

    ::ng-deep .rdk-combobox {
      width: 100%;

      .p-autocomplete { width: 100%; }

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
    }
  `],
})
export class ComboboxComponent implements ControlValueAccessor {
  @Input() suggestions: ComboboxSuggestion[] = [];
  @Input() placeholder = 'Search…';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() minLength = 1;
  @Input() multiple = false;

  @Output() searched = new EventEmitter<string>();
  @Output() selected = new EventEmitter<ComboboxSuggestion | ComboboxSuggestion[]>();

  value: ComboboxSuggestion | ComboboxSuggestion[] | null = null;

  private _onChange: (v: unknown) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onSearch(event: AutoCompleteCompleteEvent): void {
    this.searched.emit(event.query);
  }

  protected onValueChange(v: ComboboxSuggestion | ComboboxSuggestion[] | null): void {
    this._onChange(v);
    if (v) this.selected.emit(v);
  }

  writeValue(v: unknown): void {
    this.value = v as ComboboxSuggestion | ComboboxSuggestion[] | null;
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
