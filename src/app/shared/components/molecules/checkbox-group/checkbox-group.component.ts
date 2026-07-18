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
import { CheckboxComponent } from '../checkbox/checkbox.component';

export interface CheckboxOption {
  label: string;
  value: unknown;
  disabled?: boolean;
}

@Component({
  selector: 'rdk-checkbox-group',
  standalone: true,
  imports: [CheckboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true,
    },
  ],
  template: `
    <div
      class="rdk-checkbox-group"
      [class.rdk-checkbox-group--h]="orientation === 'h'"
      role="group"
    >
      @for (option of options; track option.value) {
        <rdk-checkbox
          [label]="option.label"
          [checked]="isChecked(option.value)"
          [disabled]="option.disabled || disabled"
          (changed)="onToggle(option.value, $event)"
        />
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .rdk-checkbox-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);

      &--h { flex-direction: row; flex-wrap: wrap; }
    }
  `],
})
export class CheckboxGroupComponent implements ControlValueAccessor {
  @Input() options: CheckboxOption[] = [];
  @Input() orientation: 'v' | 'h' = 'v';
  @Input() disabled = false;

  @Output() changed = new EventEmitter<unknown[]>();

  protected readonly selected = signal<unknown[]>([]);

  private _onChange: (v: unknown[]) => void = () => {};
  private _onTouched: () => void = () => {};

  protected isChecked(value: unknown): boolean {
    return this.selected().includes(value);
  }

  protected onToggle(value: unknown, checked: boolean): void {
    const current = this.selected();
    const next = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    this.selected.set(next);
    this._onChange(next);
    this._onTouched();
    this.changed.emit(next);
  }

  writeValue(v: unknown[] | null): void {
    this.selected.set(v ?? []);
  }

  registerOnChange(fn: (v: unknown[]) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
