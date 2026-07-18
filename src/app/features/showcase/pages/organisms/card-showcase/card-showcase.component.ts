import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardComponent } from '../../../../../shared/components/organisms/card/card.component';
import { BadgeComponent } from '../../../../../shared/components/atoms/badge/badge.component';
import { ButtonComponent } from '../../../../../shared/components/atoms/button/button.component';
import { AvatarComponent } from '../../../../../shared/components/atoms/avatar/avatar.component';

@Component({
  selector: 'app-card-showcase',
  standalone: true,
  imports: [CardComponent, BadgeComponent, ButtonComponent, AvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .showcase-page { max-width: 900px; margin: 0 auto; }
    h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-4); color: var(--color-text-primary); }
    .showcase-page__intro { font-size: var(--text-lg); color: var(--color-text-secondary); margin: 0 0 var(--space-8); }
    .showcase-section { margin-bottom: var(--space-8); h2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); margin: 0 0 var(--space-4); color: var(--color-text-primary); } }
    .showcase-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); }
    .card-header { display: flex; align-items: center; justify-content: space-between; padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--color-border-default); }
    .card-header__title { font-weight: var(--font-semibold); color: var(--color-text-primary); }
    .card-footer { display: flex; align-items: center; justify-content: flex-end; gap: var(--space-2); padding: var(--space-4) var(--space-6); }
    .profile { display: flex; align-items: center; gap: var(--space-3); }
    .profile-info { display: flex; flex-direction: column; }
    .profile-name { font-weight: var(--font-semibold); color: var(--color-text-primary); }
    .profile-role { font-size: var(--text-sm); color: var(--color-text-muted); }
  `],
  template: `
    <div class="showcase-page">
      <h1>Card</h1>
      <p class="showcase-page__intro">Flexible container with variant styles and named content slots for header, footer, and actions.</p>

      <section class="showcase-section">
        <h2>Variants</h2>
        <div class="showcase-grid">
          <rdk-card variant="default">
            <div slot="header" class="card-header">
              <span class="card-header__title">Default</span>
              <rdk-badge variant="default">Card</rdk-badge>
            </div>
            <p>A standard card with a subtle border and shadow.</p>
          </rdk-card>

          <rdk-card variant="elevated">
            <div slot="header" class="card-header">
              <span class="card-header__title">Elevated</span>
            </div>
            <p>Uses a larger shadow for visual hierarchy.</p>
          </rdk-card>

          <rdk-card variant="outlined">
            <div slot="header" class="card-header">
              <span class="card-header__title">Outlined</span>
            </div>
            <p>Bold border, no shadow. Good for flat UIs.</p>
          </rdk-card>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Padding Options</h2>
        <div class="showcase-grid">
          <rdk-card padding="sm"><p style="margin:0">Small padding</p></rdk-card>
          <rdk-card padding="md"><p style="margin:0">Medium padding (default)</p></rdk-card>
          <rdk-card padding="lg"><p style="margin:0">Large padding</p></rdk-card>
        </div>
      </section>

      <section class="showcase-section">
        <h2>With Header + Footer</h2>
        <rdk-card padding="none">
          <div slot="header" class="card-header">
            <span class="card-header__title">User Profile</span>
            <rdk-badge variant="success" [dot]="true">Active</rdk-badge>
          </div>
          <div class="profile">
            <rdk-avatar name="Sarah Connor" size="lg" />
            <div class="profile-info">
              <span class="profile-name">Sarah Connor</span>
              <span class="profile-role">Engineering Manager</span>
            </div>
          </div>
          <div slot="footer" class="card-footer">
            <rdk-button variant="ghost" size="sm">Cancel</rdk-button>
            <rdk-button variant="primary" size="sm">View Profile</rdk-button>
          </div>
        </rdk-card>
      </section>
    </div>
  `,
})
export class CardShowcaseComponent {}
