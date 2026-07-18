import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AvatarComponent } from '../../../../../shared/components/atoms/avatar/avatar.component';

@Component({
  selector: 'app-avatar-showcase',
  standalone: true,
  imports: [AvatarComponent],
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
      <h1>Avatar</h1>
      <p class="showcase-page__intro">User profile images with fallback to initials or icon.</p>

      <section class="showcase-section">
        <h2>Sizes</h2>
        <div class="showcase-grid showcase-grid--center">
          <div class="showcase-item">
            <label>xs</label>
            <rdk-avatar name="Alice Brown" size="xs" />
          </div>
          <div class="showcase-item">
            <label>sm</label>
            <rdk-avatar name="Bob Smith" size="sm" />
          </div>
          <div class="showcase-item">
            <label>md</label>
            <rdk-avatar name="Carol White" size="md" />
          </div>
          <div class="showcase-item">
            <label>lg</label>
            <rdk-avatar name="Diana Green" size="lg" />
          </div>
          <div class="showcase-item">
            <label>xl</label>
            <rdk-avatar name="Eve Black" size="xl" />
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Shapes</h2>
        <div class="showcase-grid showcase-grid--center">
          <div class="showcase-item">
            <label>Circle</label>
            <rdk-avatar name="Frank Miller" shape="circle" size="lg" />
          </div>
          <div class="showcase-item">
            <label>Rounded</label>
            <rdk-avatar name="Grace Lee" shape="rounded" size="lg" />
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Fallback Behavior</h2>
        <div class="showcase-grid showcase-grid--center">
          <div class="showcase-item">
            <label>Initials from name</label>
            <rdk-avatar name="John Doe" size="lg" />
          </div>
          <div class="showcase-item">
            <label>No name (icon)</label>
            <rdk-avatar size="lg" />
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>With Image</h2>
        <div class="showcase-grid showcase-grid--center">
          <div class="showcase-item">
            <label>From src</label>
            <rdk-avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" alt="Avatar" size="lg" />
          </div>
          <div class="showcase-item">
            <label>Invalid src (falls back to initials)</label>
            <rdk-avatar src="https://invalid.test/404.jpg" name="Test User" size="lg" />
          </div>
        </div>
      </section>
    </div>
  `,
})
export class AvatarShowcaseComponent {}
