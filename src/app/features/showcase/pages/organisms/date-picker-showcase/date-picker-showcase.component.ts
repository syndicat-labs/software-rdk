import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DatePickerComponent } from '../../../../../shared/components/organisms/date-picker/date-picker.component';
import { FormFieldComponent } from '../../../../../shared/components/molecules/form-field/form-field.component';

@Component({
  selector: 'app-date-picker-showcase',
  standalone: true,
  imports: [DatePickerComponent, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .showcase-page { max-width: 600px; margin: 0 auto; }
    h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-4); color: var(--color-text-primary); }
    .showcase-page__intro { font-size: var(--text-lg); color: var(--color-text-secondary); margin: 0 0 var(--space-8); }
    .showcase-section { margin-bottom: var(--space-8); h2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); margin: 0 0 var(--space-4); color: var(--color-text-primary); } }
    .showcase-stack { display: flex; flex-direction: column; gap: var(--space-4); }
    .note { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-2); }
  `],
  template: `
    <div class="showcase-page">
      <h1>Date Picker</h1>
      <p class="showcase-page__intro">Calendar input wrapping PrimeNG p-calendar, reactive forms compatible.</p>

      <section class="showcase-section">
        <h2>Basic</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Date of birth">
            <rdk-date-picker placeholder="dd/mm/yyyy" (valueChange)="selected.set($event)" />
          </rdk-form-field>
          @if (selected()) {
            <p class="note">Selected: {{ selected()?.toLocaleDateString() }}</p>
          }
        </div>
      </section>

      <section class="showcase-section">
        <h2>With Time</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Scheduled at">
            <rdk-date-picker [showTime]="true" placeholder="dd/mm/yyyy hh:mm" />
          </rdk-form-field>
        </div>
      </section>

      <section class="showcase-section">
        <h2>With Min / Max</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Appointment" hint="Must be within the next 30 days">
            <rdk-date-picker [minDate]="today" [maxDate]="maxDate" />
          </rdk-form-field>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Disabled</h2>
        <div class="showcase-stack">
          <rdk-date-picker [disabled]="true" placeholder="Not available" />
        </div>
      </section>
    </div>
  `,
})
export class DatePickerShowcaseComponent {
  readonly selected = signal<Date | null>(null);
  readonly today = new Date();
  readonly maxDate = new Date(Date.now() + 30 * 24 * 3600 * 1000);

}
