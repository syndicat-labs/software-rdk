import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RadioGroupComponent } from '../../../../../shared/components/molecules/radio/radio.component';
import { FormFieldComponent } from '../../../../../shared/components/molecules/form-field/form-field.component';

@Component({
  selector: 'app-radio-showcase',
  standalone: true,
  imports: [RadioGroupComponent, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .showcase-page { max-width: 600px; margin: 0 auto; }
    h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-4); color: var(--color-text-primary); }
    .showcase-page__intro { font-size: var(--text-lg); color: var(--color-text-secondary); margin: 0 0 var(--space-8); }
    .showcase-section { margin-bottom: var(--space-8); h2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); margin: 0 0 var(--space-4); color: var(--color-text-primary); } }
    .showcase-stack { display: flex; flex-direction: column; gap: var(--space-4); }
  `],
  template: `
    <div class="showcase-page">
      <h1>Radio Group</h1>
      <p class="showcase-page__intro">Mutually exclusive selection with accessible radiogroup semantics.</p>

      <section class="showcase-section">
        <h2>Vertical (default)</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Preferred contact method">
            <rdk-radio-group [options]="contactMethods" orientation="v" />
          </rdk-form-field>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Horizontal</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Subscription plan">
            <rdk-radio-group [options]="plans" orientation="h" />
          </rdk-form-field>
        </div>
      </section>

      <section class="showcase-section">
        <h2>With Disabled Option</h2>
        <div class="showcase-stack">
          <rdk-radio-group [options]="tiers" orientation="v" />
        </div>
      </section>
    </div>
  `,
})
export class RadioShowcaseComponent {
  readonly contactMethods = [
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'SMS', value: 'sms' },
  ];

  readonly plans = [
    { label: 'Free', value: 'free' },
    { label: 'Pro', value: 'pro' },
    { label: 'Enterprise', value: 'enterprise' },
  ];

  readonly tiers = [
    { label: 'Starter', value: 'starter' },
    { label: 'Growth', value: 'growth' },
    { label: 'Enterprise (unavailable)', value: 'enterprise', disabled: true },
  ];
}
