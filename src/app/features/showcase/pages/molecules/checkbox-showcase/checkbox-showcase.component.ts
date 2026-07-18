import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CheckboxComponent } from '../../../../../shared/components/molecules/checkbox/checkbox.component';
import { CheckboxGroupComponent } from '../../../../../shared/components/molecules/checkbox-group/checkbox-group.component';
import { FormFieldComponent } from '../../../../../shared/components/molecules/form-field/form-field.component';

@Component({
  selector: 'app-checkbox-showcase',
  standalone: true,
  imports: [CheckboxComponent, CheckboxGroupComponent, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .showcase-page { max-width: 600px; margin: 0 auto; }
    h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-4); color: var(--color-text-primary); }
    .showcase-page__intro { font-size: var(--text-lg); color: var(--color-text-secondary); margin: 0 0 var(--space-8); }
    .showcase-section { margin-bottom: var(--space-8); h2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); margin: 0 0 var(--space-4); color: var(--color-text-primary); } }
    .showcase-stack { display: flex; flex-direction: column; gap: var(--space-3); }
  `],
  template: `
    <div class="showcase-page">
      <h1>Checkbox</h1>
      <p class="showcase-page__intro">Accessible checkbox with label, indeterminate state, and sizes.</p>

      <section class="showcase-section">
        <h2>States</h2>
        <div class="showcase-stack">
          <rdk-checkbox label="Unchecked" />
          <rdk-checkbox label="Checked" [checked]="true" />
          <rdk-checkbox label="Indeterminate" [indeterminate]="true" />
          <rdk-checkbox label="Disabled unchecked" [disabled]="true" />
          <rdk-checkbox label="Disabled checked" [checked]="true" [disabled]="true" />
        </div>
      </section>

      <section class="showcase-section">
        <h2>Sizes</h2>
        <div class="showcase-stack">
          <rdk-checkbox label="Small" size="sm" />
          <rdk-checkbox label="Medium (default)" size="md" />
          <rdk-checkbox label="Large" size="lg" />
        </div>
      </section>

      <section class="showcase-section">
        <h2>Checkbox Group</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Select interests">
            <rdk-checkbox-group [options]="interests" />
          </rdk-form-field>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Checkbox Group — Horizontal</h2>
        <div class="showcase-stack">
          <rdk-checkbox-group [options]="days" orientation="h" />
        </div>
      </section>
    </div>
  `,
})
export class CheckboxShowcaseComponent {
  readonly interests = [
    { label: 'Technology', value: 'tech' },
    { label: 'Design', value: 'design' },
    { label: 'Business', value: 'business' },
    { label: 'Science', value: 'science' },
  ];

  readonly days = [
    { label: 'Mon', value: 'mon' },
    { label: 'Tue', value: 'tue' },
    { label: 'Wed', value: 'wed' },
    { label: 'Thu', value: 'thu' },
    { label: 'Fri', value: 'fri' },
  ];
}
