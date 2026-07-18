import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DividerComponent } from '../../../../../shared/components/atoms/divider/divider.component';

@Component({
  selector: 'app-divider-showcase',
  standalone: true,
  imports: [DividerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="showcase-page">
      <h1>Divider</h1>
      <p class="showcase-page__intro">Semantic separators for horizontal and vertical layouts.</p>

      <section class="showcase-section">
        <h2>Horizontal</h2>
        <div class="showcase-box">
          <p>Content above divider</p>
          <rdk-divider />
          <p>Content below divider</p>
        </div>
      </section>

      <section class="showcase-section">
        <h2>With Label</h2>
        <div class="showcase-box">
          <p>Already have an account?</p>
          <rdk-divider label="Or continue with" />
          <p>Social login options</p>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Label Alignment</h2>
        <div class="showcase-item">
          <label>Left</label>
          <div class="showcase-box">
            <rdk-divider label="Left" labelAlign="left" />
          </div>
        </div>
        <div class="showcase-item">
          <label>Center</label>
          <div class="showcase-box">
            <rdk-divider label="Center" labelAlign="center" />
          </div>
        </div>
        <div class="showcase-item">
          <label>Right</label>
          <div class="showcase-box">
            <rdk-divider label="Right" labelAlign="right" />
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Vertical</h2>
        <div class="showcase-box showcase-box--flex">
          <span>Left side</span>
          <rdk-divider direction="v" />
          <span>Right side</span>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .showcase-page { max-width: 900px; margin: 0 auto; }
    h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-4); color: var(--color-text-primary); }
    .showcase-page__intro { font-size: var(--text-lg); color: var(--color-text-secondary); margin: 0 0 var(--space-8); }
    .showcase-section { margin-bottom: var(--space-8); h2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); margin: 0 0 var(--space-4); color: var(--color-text-primary); } }
    .showcase-item { display: flex; flex-direction: column; gap: var(--space-3); label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text-muted); } }
    .showcase-box {
      padding: var(--space-4);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-component);
      background: var(--color-bg-elevated);
      &--flex { display: flex; gap: var(--space-4); align-items: center; }
      p { margin: 0; }
    }
  `],
})
export class DividerShowcaseComponent {}
