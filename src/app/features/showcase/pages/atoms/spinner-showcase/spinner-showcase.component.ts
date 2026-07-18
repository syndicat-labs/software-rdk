import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpinnerComponent } from '../../../../../shared/components/atoms/spinner/spinner.component';

@Component({
  selector: 'app-spinner-showcase',
  standalone: true,
  imports: [SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .showcase-page { max-width: 900px; margin: 0 auto; }
    h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-4); color: var(--color-text-primary); }
    .showcase-page__intro { font-size: var(--text-lg); color: var(--color-text-secondary); margin: 0 0 var(--space-8); }
    .showcase-section { margin-bottom: var(--space-8); h2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); margin: 0 0 var(--space-4); color: var(--color-text-primary); } }
    .showcase-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-6); &--center { justify-items: center; } }
    .showcase-item { display: flex; flex-direction: column; gap: var(--space-3); label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text-muted); } }
  `],
  template: `
    <div class="showcase-page">
      <h1>Spinner</h1>
      <p class="showcase-page__intro">Loading indicator with customizable size and color.</p>

      <section class="showcase-section">
        <h2>Sizes</h2>
        <div class="showcase-grid showcase-grid--center">
          <div class="showcase-item">
            <label>Small</label>
            <rdk-spinner size="sm" />
          </div>
          <div class="showcase-item">
            <label>Medium</label>
            <rdk-spinner size="md" />
          </div>
          <div class="showcase-item">
            <label>Large</label>
            <rdk-spinner size="lg" />
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Colors</h2>
        <div class="showcase-grid showcase-grid--center">
          <div class="showcase-item">
            <label>Brand</label>
            <rdk-spinner color="brand" />
          </div>
          <div class="showcase-item">
            <label>Success</label>
            <rdk-spinner color="success" />
          </div>
          <div class="showcase-item">
            <label>Danger</label>
            <rdk-spinner color="danger" />
          </div>
          <div class="showcase-item">
            <label>Muted</label>
            <rdk-spinner color="muted" />
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>With Label</h2>
        <div class="showcase-grid showcase-grid--center">
          <div class="showcase-item">
            <label>Hidden label (aria-label only)</label>
            <rdk-spinner label="Loading data…" [showLabel]="false" />
          </div>
          <div class="showcase-item">
            <label>Visible label</label>
            <rdk-spinner label="Loading…" [showLabel]="true" />
          </div>
        </div>
      </section>
    </div>
  `,
})
export class SpinnerShowcaseComponent {}
