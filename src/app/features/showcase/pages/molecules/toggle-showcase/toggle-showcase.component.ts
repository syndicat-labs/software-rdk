import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToggleComponent } from '../../../../../shared/components/molecules/toggle/toggle.component';

@Component({
  selector: 'app-toggle-showcase',
  standalone: true,
  imports: [ToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .showcase-page { max-width: 600px; margin: 0 auto; }
    h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-4); color: var(--color-text-primary); }
    .showcase-page__intro { font-size: var(--text-lg); color: var(--color-text-secondary); margin: 0 0 var(--space-8); }
    .showcase-section { margin-bottom: var(--space-8); h2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); margin: 0 0 var(--space-4); color: var(--color-text-primary); } }
    .showcase-stack { display: flex; flex-direction: column; gap: var(--space-4); }
    .showcase-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-6); }
  `],
  template: `
    <div class="showcase-page">
      <h1>Toggle</h1>
      <p class="showcase-page__intro">On/off switch with ARIA role=switch, keyboard support, and sizes.</p>

      <section class="showcase-section">
        <h2>States</h2>
        <div class="showcase-stack">
          <rdk-toggle label="Notifications" />
          <rdk-toggle label="Dark mode (on)" [checked]="true" />
          <rdk-toggle label="Disabled off" [disabled]="true" />
          <rdk-toggle label="Disabled on" [checked]="true" [disabled]="true" />
        </div>
      </section>

      <section class="showcase-section">
        <h2>Sizes</h2>
        <div class="showcase-grid">
          <rdk-toggle label="Small" size="sm" />
          <rdk-toggle label="Medium" size="md" />
          <rdk-toggle label="Large" size="lg" />
        </div>
      </section>

      <section class="showcase-section">
        <h2>Label Position</h2>
        <div class="showcase-stack">
          <rdk-toggle label="Label on right (default)" labelPos="right" />
          <rdk-toggle label="Label on left" labelPos="left" />
        </div>
      </section>
    </div>
  `,
})
export class ToggleShowcaseComponent {
  checked = true;
}
