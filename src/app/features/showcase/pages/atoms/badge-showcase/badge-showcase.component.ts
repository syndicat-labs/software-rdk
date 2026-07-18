import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeComponent } from '../../../../../shared/components/atoms/badge/badge.component';

@Component({
  selector: 'app-badge-showcase',
  standalone: true,
  imports: [BadgeComponent],
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
      <h1>Badge</h1>
      <p class="showcase-page__intro">Small labels or status indicators for tagging and categorization.</p>

      <section class="showcase-section">
        <h2>Variants</h2>
        <div class="showcase-grid">
          <div class="showcase-item">
            <label>Default</label>
            <rdk-badge variant="default">New</rdk-badge>
          </div>
          <div class="showcase-item">
            <label>Brand</label>
            <rdk-badge variant="brand">Featured</rdk-badge>
          </div>
          <div class="showcase-item">
            <label>Success</label>
            <rdk-badge variant="success">Active</rdk-badge>
          </div>
          <div class="showcase-item">
            <label>Warning</label>
            <rdk-badge variant="warning">Pending</rdk-badge>
          </div>
          <div class="showcase-item">
            <label>Danger</label>
            <rdk-badge variant="danger">Critical</rdk-badge>
          </div>
          <div class="showcase-item">
            <label>Info</label>
            <rdk-badge variant="info">Updated</rdk-badge>
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Sizes</h2>
        <div class="showcase-grid">
          <div class="showcase-item">
            <label>Small</label>
            <rdk-badge size="sm">SM</rdk-badge>
          </div>
          <div class="showcase-item">
            <label>Medium (default)</label>
            <rdk-badge size="md">MD</rdk-badge>
          </div>
          <div class="showcase-item">
            <label>Large</label>
            <rdk-badge size="lg">LG</rdk-badge>
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>With Dot</h2>
        <div class="showcase-grid">
          <div class="showcase-item">
            <label>With dot</label>
            <rdk-badge variant="success" [dot]="true">Online</rdk-badge>
          </div>
          <div class="showcase-item">
            <label>Dot only</label>
            <rdk-badge variant="success" [dot]="true" [dotOnly]="true" />
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Dismissible</h2>
        <div class="showcase-grid">
          <div class="showcase-item">
            <label>With close button</label>
            <rdk-badge variant="brand" [dismissible]="true">Closeable</rdk-badge>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class BadgeShowcaseComponent {}
