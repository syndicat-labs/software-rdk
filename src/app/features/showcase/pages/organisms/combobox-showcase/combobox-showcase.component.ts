import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComboboxComponent, ComboboxSuggestion } from '../../../../../shared/components/organisms/combobox/combobox.component';
import { FormFieldComponent } from '../../../../../shared/components/molecules/form-field/form-field.component';

const ALL_FRAMEWORKS: ComboboxSuggestion[] = [
  { label: 'Angular',    value: 'angular' },
  { label: 'React',      value: 'react' },
  { label: 'Vue',        value: 'vue' },
  { label: 'Svelte',     value: 'svelte' },
  { label: 'SolidJS',   value: 'solid' },
  { label: 'Ember',      value: 'ember' },
  { label: 'Lit',        value: 'lit' },
  { label: 'Qwik',       value: 'qwik' },
];

@Component({
  selector: 'app-combobox-showcase',
  standalone: true,
  imports: [ComboboxComponent, FormFieldComponent],
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
      <h1>Combobox</h1>
      <p class="showcase-page__intro">Async-search autocomplete wrapping PrimeNG p-autoComplete.</p>

      <section class="showcase-section">
        <h2>Single select</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Framework" hint="Start typing to filter">
            <rdk-combobox
              [suggestions]="suggestions()"
              (searched)="onSearch($event)"
            />
          </rdk-form-field>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Multiple select</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Technologies used">
            <rdk-combobox
              [suggestions]="suggestions()"
              [multiple]="true"
              (searched)="onSearch($event)"
            />
          </rdk-form-field>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Disabled</h2>
        <div class="showcase-stack">
          <rdk-combobox [suggestions]="[]" [disabled]="true" placeholder="Disabled" />
        </div>
      </section>
    </div>
  `,
})
export class ComboboxShowcaseComponent {
  readonly suggestions = signal<ComboboxSuggestion[]>([]);

  onSearch(query: string): void {
    const q = query.toLowerCase();
    this.suggestions.set(
      ALL_FRAMEWORKS.filter((f) => f.label.toLowerCase().includes(q)),
    );
  }
}
