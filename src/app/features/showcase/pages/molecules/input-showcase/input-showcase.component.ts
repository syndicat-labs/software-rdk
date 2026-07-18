import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputComponent } from '../../../../../shared/components/molecules/input/input.component';
import { FormFieldComponent } from '../../../../../shared/components/molecules/form-field/form-field.component';

@Component({
  selector: 'app-input-showcase',
  standalone: true,
  imports: [InputComponent, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .showcase-page { max-width: 600px; margin: 0 auto; }
    h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-4); color: var(--color-text-primary); }
    .showcase-page__intro { font-size: var(--text-lg); color: var(--color-text-secondary); margin: 0 0 var(--space-8); }
    .showcase-section { margin-bottom: var(--space-8); h2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); margin: 0 0 var(--space-4); color: var(--color-text-primary); } }
    .showcase-stack { display: flex; flex-direction: column; gap: var(--space-4); }
    .showcase-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); }
    .icon-prefix, .icon-suffix { display: flex; align-items: center; padding: 0 var(--space-2); color: var(--color-text-muted); font-size: 0.875rem; }
  `],
  template: `
    <div class="showcase-page">
      <h1>Input</h1>
      <p class="showcase-page__intro">Text input with support for sizes, icons, clearable, and character count.</p>

      <section class="showcase-section">
        <h2>Sizes</h2>
        <div class="showcase-stack">
          <rdk-input size="sm" placeholder="Small input" />
          <rdk-input size="md" placeholder="Medium input (default)" />
          <rdk-input size="lg" placeholder="Large input" />
        </div>
      </section>

      <section class="showcase-section">
        <h2>States</h2>
        <div class="showcase-stack">
          <rdk-input placeholder="Default" />
          <rdk-input placeholder="Disabled" [disabled]="true" />
          <rdk-input placeholder="Read-only" [readonly]="true" />
          <rdk-input placeholder="Error state" [hasError]="true" />
        </div>
      </section>

      <section class="showcase-section">
        <h2>With Prefix / Suffix</h2>
        <div class="showcase-stack">
          <rdk-input placeholder="Search…">
            <span slot="prefix" class="icon-prefix">
              <span class="pi pi-search"></span>
            </span>
          </rdk-input>
          <rdk-input placeholder="Enter URL">
            <span slot="prefix" class="icon-prefix" style="font-size:var(--text-sm); color:var(--color-text-muted)">https://</span>
          </rdk-input>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Clearable</h2>
        <div class="showcase-stack">
          <rdk-input placeholder="Type to clear…" [clearable]="true" />
        </div>
      </section>

      <section class="showcase-section">
        <h2>Character Count</h2>
        <div class="showcase-stack">
          <rdk-input placeholder="Max 50 chars" [maxLength]="50" [showCount]="true" />
        </div>
      </section>

      <section class="showcase-section">
        <h2>Input Types</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Email">
            <rdk-input type="email" placeholder="you@example.com" />
          </rdk-form-field>
          <rdk-form-field label="Password">
            <rdk-input type="password" placeholder="••••••••" />
          </rdk-form-field>
          <rdk-form-field label="Number">
            <rdk-input type="number" placeholder="42" />
          </rdk-form-field>
        </div>
      </section>
    </div>
  `,
})
export class InputShowcaseComponent {}
