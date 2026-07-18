import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChipComponent } from '../../../../../shared/components/atoms/chip/chip.component';

@Component({
  selector: 'app-chip-showcase',
  standalone: true,
  imports: [ChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .showcase-page { max-width: 900px; margin: 0 auto; }
    h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-4); color: var(--color-text-primary); }
    .showcase-page__intro { font-size: var(--text-lg); color: var(--color-text-secondary); margin: 0 0 var(--space-8); }
    .showcase-section { margin-bottom: var(--space-8); h2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); margin: 0 0 var(--space-4); color: var(--color-text-primary); } }
    .showcase-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-6); }
    .showcase-item { display: flex; flex-direction: column; gap: var(--space-3); label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text-muted); } }
  `],
  template: `
    <div class="showcase-page">
      <h1>Chip</h1>
      <p class="showcase-page__intro">Small interactive tags or filter pills for selection and categorization.</p>

      <section class="showcase-section">
        <h2>Variants</h2>
        <div class="showcase-grid">
          <div class="showcase-item">
            <rdk-chip label="Default" variant="default" />
          </div>
          <div class="showcase-item">
            <rdk-chip label="Brand" variant="brand" />
          </div>
          <div class="showcase-item">
            <rdk-chip label="Success" variant="success" />
          </div>
          <div class="showcase-item">
            <rdk-chip label="Warning" variant="warning" />
          </div>
          <div class="showcase-item">
            <rdk-chip label="Danger" variant="danger" />
          </div>
          <div class="showcase-item">
            <rdk-chip label="Info" variant="info" />
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>With Icons</h2>
        <div class="showcase-grid">
          <div class="showcase-item">
            <rdk-chip label="Tag" variant="brand" icon="pi-tag" />
          </div>
          <div class="showcase-item">
            <rdk-chip label="User" variant="brand" icon="pi-user" />
          </div>
          <div class="showcase-item">
            <rdk-chip label="Check" variant="success" icon="pi-check" />
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Selectable</h2>
        <div class="showcase-grid">
          <div class="showcase-item">
            <rdk-chip label="Not Selected" variant="default" [selectable]="true" [selected]="false" />
          </div>
          <div class="showcase-item">
            <rdk-chip label="Selected" variant="brand" [selectable]="true" [selected]="true" />
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Dismissible</h2>
        <div class="showcase-grid">
          <div class="showcase-item">
            <rdk-chip label="Close me" variant="brand" [dismissible]="true" />
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>States</h2>
        <div class="showcase-grid">
          <div class="showcase-item">
            <rdk-chip label="Normal" variant="brand" />
          </div>
          <div class="showcase-item">
            <rdk-chip label="Disabled" variant="brand" [disabled]="true" />
          </div>
        </div>
      </section>
    </div>
  `,
})
export class ChipShowcaseComponent {}
