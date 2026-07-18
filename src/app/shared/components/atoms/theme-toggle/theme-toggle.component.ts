import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ThemeService } from '../../../../core/theme/theme.service';

@Component({
  selector: 'rdk-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="theme-toggle"
      [class.theme-toggle--active]="themeService.current() === 'obsidian'"
      [class.theme-toggle--on-dark]="dark()"
      (click)="themeService.toggle()"
      [attr.aria-label]="themeService.current() === 'obsidian' ? 'Switch to Default theme' : 'Switch to Obsidian theme'"
      type="button"
    >
      <span class="theme-toggle__dot" aria-hidden="true"></span>
      <span class="theme-toggle__label">
        {{ themeService.current() === 'obsidian' ? 'Obsidian' : 'Default' }}
      </span>
    </button>
  `,
  styles: [`
    :host { display: inline-flex; }

    .theme-toggle {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1-5);
      padding: var(--space-1) var(--space-2-5) var(--space-1) var(--space-2);
      border-radius: var(--radius-pill);
      border: 1px solid var(--color-border-default);
      background: transparent;
      cursor: pointer;
      font-size: var(--text-xs);
      font-weight: var(--font-semibold);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--color-text-muted);
      transition:
        background var(--duration-200) var(--ease-in-out),
        border-color var(--duration-200) var(--ease-in-out),
        color var(--duration-200) var(--ease-in-out);

      &:hover {
        background: var(--color-hover-overlay);
        border-color: var(--color-border-strong);
        color: var(--color-text-secondary);
      }

      // Obsidian active state — dark pill. Uses --obs-* tokens which are
      // guaranteed to be defined when this class is applied (obsidian is active).
      &--active {
        background: var(--obs-surface-card-dark);
        border-color: var(--obs-surface-card-dark);
        color: var(--obs-text-on-dark);

        &:hover {
          background: var(--obs-badge-surface);
          border-color: var(--obs-badge-surface);
          color: var(--obs-text-on-dark);
        }

        .theme-toggle__dot {
          background: var(--obs-text-on-dark-muted);
        }
      }
    }

    // On dark page backgrounds (login/landing) — flip default-state to light
    .theme-toggle--on-dark:not(.theme-toggle--active) {
      border-color: rgba(255, 255, 255, 0.3);
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.5);
        color: rgba(255, 255, 255, 0.9);
      }

      .theme-toggle__dot {
        background: rgba(255, 255, 255, 0.5);
      }
    }

    .theme-toggle__dot {
      width: 0.4375rem;
      height: 0.4375rem;
      border-radius: var(--radius-pill);
      background: var(--color-text-muted);
      flex-shrink: 0;
    }

    .theme-toggle__label {
      font-family: var(--obs-font-display, 'Inter', system-ui, sans-serif);
      line-height: 1;
    }
  `],
})
export class ThemeToggleComponent {
  readonly dark = input(false);
  protected readonly themeService = inject(ThemeService);
}
