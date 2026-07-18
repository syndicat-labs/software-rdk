import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../../../../shared/components/atoms/icon/icon.component';

@Component({
  selector: 'app-icon-showcase',
  standalone: true,
  imports: [IconComponent],
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
      <h1>Icon</h1>
      <p class="showcase-page__intro">Decorative and semantic icon wrapper using PrimeIcons.</p>

      <section class="showcase-section">
        <h2>Sizes</h2>
        <div class="showcase-grid showcase-grid--center">
          <div class="showcase-item">
            <label>xs</label>
            <rdk-icon name="pi-home" size="xs" />
          </div>
          <div class="showcase-item">
            <label>sm</label>
            <rdk-icon name="pi-home" size="sm" />
          </div>
          <div class="showcase-item">
            <label>md</label>
            <rdk-icon name="pi-home" size="md" />
          </div>
          <div class="showcase-item">
            <label>lg</label>
            <rdk-icon name="pi-home" size="lg" />
          </div>
          <div class="showcase-item">
            <label>xl</label>
            <rdk-icon name="pi-home" size="xl" />
          </div>
          <div class="showcase-item">
            <label>2xl</label>
            <rdk-icon name="pi-home" size="2xl" />
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Common Icons</h2>
        <div class="showcase-grid showcase-grid--center">
          <div class="showcase-item">
            <label>home</label>
            <rdk-icon name="pi-home" size="lg" />
          </div>
          <div class="showcase-item">
            <label>user</label>
            <rdk-icon name="pi-user" size="lg" />
          </div>
          <div class="showcase-item">
            <label>settings</label>
            <rdk-icon name="pi-cog" size="lg" />
          </div>
          <div class="showcase-item">
            <label>check</label>
            <rdk-icon name="pi-check" size="lg" />
          </div>
          <div class="showcase-item">
            <label>close</label>
            <rdk-icon name="pi-times" size="lg" />
          </div>
          <div class="showcase-item">
            <label>save</label>
            <rdk-icon name="pi-save" size="lg" />
          </div>
          <div class="showcase-item">
            <label>delete</label>
            <rdk-icon name="pi-trash" size="lg" />
          </div>
          <div class="showcase-item">
            <label>search</label>
            <rdk-icon name="pi-search" size="lg" />
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Accessibility</h2>
        <div class="showcase-grid">
          <div class="showcase-item">
            <label>Decorative (default)</label>
            <rdk-icon name="pi-heart" size="lg" />
          </div>
          <div class="showcase-item">
            <label>Semantic with label</label>
            <rdk-icon name="pi-heart" size="lg" [decorative]="false" label="Favorite" />
          </div>
        </div>
      </section>
    </div>
  `,
})
export class IconShowcaseComponent {}
