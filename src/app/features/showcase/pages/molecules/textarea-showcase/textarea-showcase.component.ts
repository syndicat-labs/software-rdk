import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextareaComponent } from '../../../../../shared/components/molecules/textarea/textarea.component';
import { FormFieldComponent } from '../../../../../shared/components/molecules/form-field/form-field.component';

@Component({
  selector: 'app-textarea-showcase',
  standalone: true,
  imports: [TextareaComponent, FormFieldComponent],
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
      <h1>Textarea</h1>
      <p class="showcase-page__intro">Multi-line text input with optional auto-grow and character count.</p>

      <section class="showcase-section">
        <h2>Basic</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Description">
            <rdk-textarea placeholder="Enter a description…" />
          </rdk-form-field>
        </div>
      </section>

      <section class="showcase-section">
        <h2>States</h2>
        <div class="showcase-stack">
          <rdk-textarea placeholder="Default" />
          <rdk-textarea placeholder="Disabled" [disabled]="true" />
          <rdk-textarea placeholder="Error state" [hasError]="true" />
        </div>
      </section>

      <section class="showcase-section">
        <h2>Character Count</h2>
        <div class="showcase-stack">
          <rdk-form-field label="Bio" hint="Tell us about yourself">
            <rdk-textarea placeholder="I am…" [maxLength]="200" [showCount]="true" [rows]="4" />
          </rdk-form-field>
        </div>
      </section>
    </div>
  `,
})
export class TextareaShowcaseComponent {}
