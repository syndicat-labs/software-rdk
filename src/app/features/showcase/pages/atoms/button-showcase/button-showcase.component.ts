import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/atoms/button/button.component';

@Component({
  selector: 'app-button-showcase',
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }

    .showcase-page {
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      font-size: var(--text-4xl);
      font-weight: var(--font-bold);
      margin: 0 0 var(--space-4);
      color: var(--color-text-primary);
    }

    .showcase-page__intro {
      font-size: var(--text-lg);
      color: var(--color-text-secondary);
      margin: 0 0 var(--space-8);
    }

    .showcase-section {
      margin-bottom: var(--space-8);

      h2 {
        font-size: var(--text-2xl);
        font-weight: var(--font-semibold);
        margin: 0 0 var(--space-4);
        color: var(--color-text-primary);
      }
    }

    .showcase-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--space-6);

      &--vertical {
        grid-template-columns: 1fr;
        max-width: 300px;
      }

      &--full {
        grid-template-columns: 1fr;
      }
    }

    .showcase-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);

      label {
        font-size: var(--text-sm);
        font-weight: var(--font-medium);
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
  `],
  template: `
    <div class="showcase-page">
      <h1>Button</h1>
      <p class="showcase-page__intro">A versatile, accessible button component with multiple variants and sizes.</p>

      <!-- Variants -->
      <section class="showcase-section">
        <h2>Variants</h2>
        <div class="showcase-grid">
          <div class="showcase-item">
            <label>Primary</label>
            <rdk-button variant="primary">Click me</rdk-button>
          </div>
          <div class="showcase-item">
            <label>Secondary</label>
            <rdk-button variant="secondary">Click me</rdk-button>
          </div>
          <div class="showcase-item">
            <label>Ghost</label>
            <rdk-button variant="ghost">Click me</rdk-button>
          </div>
          <div class="showcase-item">
            <label>Danger</label>
            <rdk-button variant="danger">Delete</rdk-button>
          </div>
          <div class="showcase-item">
            <label>Link</label>
            <rdk-button variant="link">Learn more</rdk-button>
          </div>
        </div>
      </section>

      <!-- Sizes -->
      <section class="showcase-section">
        <h2>Sizes</h2>
        <div class="showcase-grid showcase-grid--vertical">
          <div class="showcase-item">
            <label>Small</label>
            <rdk-button size="sm">Small</rdk-button>
          </div>
          <div class="showcase-item">
            <label>Medium (default)</label>
            <rdk-button size="md">Medium</rdk-button>
          </div>
          <div class="showcase-item">
            <label>Large</label>
            <rdk-button size="lg">Large</rdk-button>
          </div>
        </div>
      </section>

      <!-- States -->
      <section class="showcase-section">
        <h2>States</h2>
        <div class="showcase-grid">
          <div class="showcase-item">
            <label>Default</label>
            <rdk-button>Normal</rdk-button>
          </div>
          <div class="showcase-item">
            <label>Disabled</label>
            <rdk-button [disabled]="true">Disabled</rdk-button>
          </div>
          <div class="showcase-item">
            <label>Loading</label>
            <rdk-button [loading]="true">Loading…</rdk-button>
          </div>
        </div>
      </section>

      <!-- With Icons -->
      <section class="showcase-section">
        <h2>With Icons</h2>
        <div class="showcase-grid">
          <div class="showcase-item">
            <label>Icon left</label>
            <rdk-button icon="pi-save" iconPos="left">Save</rdk-button>
          </div>
          <div class="showcase-item">
            <label>Icon right</label>
            <rdk-button icon="pi-arrow-right" iconPos="right">Next</rdk-button>
          </div>
          <div class="showcase-item">
            <label>Icon only</label>
            <rdk-button icon="pi-pencil" [iconOnly]="true" size="md" />
          </div>
        </div>
      </section>

      <!-- Full Width -->
      <section class="showcase-section">
        <h2>Full Width</h2>
        <div class="showcase-grid showcase-grid--full">
          <div class="showcase-item">
            <rdk-button [fullWidth]="true">Full width button</rdk-button>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class ButtonShowcaseComponent {}
