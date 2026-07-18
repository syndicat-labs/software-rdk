import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'rdk-form-field',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rdk-field" [ngClass]="{ 'rdk-field--error': !!error, 'rdk-field--required': required }">
      @if (label) {
        <label class="rdk-field__label" [attr.for]="id">
          {{ label }}
          @if (required) {
            <span class="rdk-field__required" aria-hidden="true">*</span>
          }
        </label>
      }

      <div class="rdk-field__control">
        <ng-content />
      </div>

      @if (hint && !error) {
        <p class="rdk-field__hint" [attr.id]="id ? id + '-hint' : null">{{ hint }}</p>
      }

      @if (error) {
        <p class="rdk-field__error" role="alert" [attr.id]="id ? id + '-error' : null">
          <span class="pi pi-exclamation-circle rdk-field__error-icon" aria-hidden="true"></span>
          {{ error }}
        </p>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .rdk-field {
      display: flex;
      flex-direction: column;
      gap: var(--field-gap);
    }

    .rdk-field__label {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--field-label-size);
      font-weight: var(--field-label-weight);
      color: var(--color-text-primary);
    }

    .rdk-field__required {
      color: var(--color-danger-500);
    }

    .rdk-field__control {
      display: flex;
      flex-direction: column;
    }

    .rdk-field__hint {
      margin: 0;
      font-size: var(--field-hint-size);
      color: var(--color-text-muted);
      line-height: var(--leading-normal);
    }

    .rdk-field__error {
      margin: 0;
      display: flex;
      align-items: center;
      gap: var(--space-1-5);
      font-size: var(--field-error-size);
      color: var(--color-text-danger);
      line-height: var(--leading-normal);
    }

    .rdk-field__error-icon {
      font-size: 0.75rem;
      flex-shrink: 0;
    }
  `],
})
export class FormFieldComponent {
  @Input() label?: string;
  @Input() hint?: string;
  @Input() error?: string | null;
  @Input() required = false;
  @Input() id?: string;
}
