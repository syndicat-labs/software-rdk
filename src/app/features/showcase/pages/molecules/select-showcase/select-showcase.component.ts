import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SelectComponent } from '../../../../../shared/components/molecules/select/select.component';
import { FormFieldComponent } from '../../../../../shared/components/molecules/form-field/form-field.component';

@Component({
  selector: 'app-select-showcase',
  standalone: true,
  imports: [SelectComponent, FormFieldComponent],
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
      <h1>Select</h1>
      <p class="showcase-page__intro">Dropdown select built on PrimeNG p-dropdown and p-multiSelect.</p>

      <section class="showcase-section">
        <h2>Single</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Country">
            <rdk-select [options]="countries" placeholder="Select a country" />
          </rdk-form-field>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Filterable</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Framework">
            <rdk-select [options]="frameworks" placeholder="Search frameworks…" [filter]="true" />
          </rdk-form-field>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Multiple</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Roles" hint="Select one or more roles">
            <rdk-select [options]="roles" placeholder="Select roles…" [multiple]="true" />
          </rdk-form-field>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Disabled</h2>
        <div class="showcase-stack">
          <rdk-select [options]="countries" placeholder="Disabled" [disabled]="true" />
        </div>
      </section>
    </div>
  `,
})
export class SelectShowcaseComponent {
  readonly countries = [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Canada', value: 'ca' },
    { label: 'Australia', value: 'au' },
    { label: 'Germany', value: 'de' },
  ];

  readonly frameworks = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'SolidJS', value: 'solid' },
  ];

  readonly roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
    { label: 'Contributor', value: 'contributor' },
  ];
}
