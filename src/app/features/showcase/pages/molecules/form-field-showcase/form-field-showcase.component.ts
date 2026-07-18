import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../../../shared/components/molecules/form-field/form-field.component';
import { InputComponent } from '../../../../../shared/components/molecules/input/input.component';

@Component({
  selector: 'app-form-field-showcase',
  standalone: true,
  imports: [FormFieldComponent, InputComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .showcase-page { max-width: 600px; margin: 0 auto; }
    h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-4); color: var(--color-text-primary); }
    .showcase-page__intro { font-size: var(--text-lg); color: var(--color-text-secondary); margin: 0 0 var(--space-8); }
    .showcase-section { margin-bottom: var(--space-8); h2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); margin: 0 0 var(--space-4); color: var(--color-text-primary); } }
    .showcase-stack { display: flex; flex-direction: column; gap: var(--space-6); }
  `],
  template: `
    <div class="showcase-page">
      <h1>Form Field</h1>
      <p class="showcase-page__intro">Wrapper that pairs any input control with a label, hint, and error message.</p>

      <section class="showcase-section">
        <h2>Basic</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Email address" id="email-basic">
            <rdk-input placeholder="you@example.com" inputId="email-basic" />
          </rdk-form-field>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Required</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Full name" [required]="true" id="fullname">
            <rdk-input placeholder="Jane Doe" inputId="fullname" />
          </rdk-form-field>
        </div>
      </section>

      <section class="showcase-section">
        <h2>With Hint</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Username" hint="Must be 3–20 characters, letters and numbers only" id="username">
            <rdk-input placeholder="johndoe42" inputId="username" />
          </rdk-form-field>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Error State</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Email address" error="Please enter a valid email address" id="email-err">
            <rdk-input placeholder="bad-email" [hasError]="true" inputId="email-err" [formControl]="badEmail" />
          </rdk-form-field>
        </div>
      </section>
    </div>
  `,
})
export class FormFieldShowcaseComponent {
  readonly badEmail = new FormControl('not-an-email', Validators.email);
}
