import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ThemeService } from '../../../../core/theme/theme.service';
import { THEME_REGISTRY, type ThemeId } from '../../../../core/theme/token-contract';

/**
 * Design language selector.
 *
 * Was a two-state toggle cycling Default↔Obsidian, which stopped scaling the
 * moment a third language was registered. It is now a select driven by
 * THEME_REGISTRY, so registering a language makes it selectable with no edit
 * here — the same swap-invariance property the protocol claims for components.
 *
 * Reads contract tokens only. The previous implementation hardcoded
 * `current() === 'obsidian'` and styled its active state with `--obs-*`
 * tokens, which meant a shared atom carried one language's private namespace
 * and a hardcoded language id (FLAG-12). A native <select> also gives keyboard
 * and screen-reader behaviour for free, which the button did not.
 */
@Component({
  selector: 'rdk-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="theme-select" [class.theme-select--on-dark]="dark()">
      <span class="theme-select__label">Language</span>
      <select
        class="theme-select__control"
        [value]="themeService.current()"
        (change)="onSelect($event)"
        aria-label="Select design language"
      >
        @for (theme of themes; track theme.id) {
          <option [value]="theme.id">{{ theme.label }}</option>
        }
      </select>
    </label>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }

      .theme-select {
        display: inline-flex;
        align-items: center;
        gap: var(--space-component-sm);
      }

      .theme-select__label {
        font-size: 0.6875rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--color-text-muted);
      }

      .theme-select__control {
        appearance: none;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-component);
        background: var(--color-bg-surface);
        color: var(--color-text-primary);
        padding: 0.375rem 1.75rem 0.375rem 0.625rem;
        font: inherit;
        font-size: 0.8125rem;
        /* Minimum target size is law, not a language position. */
        min-height: 1.75rem;
        cursor: pointer;
        /* Chevron drawn as a background image so no icon font is required. */
        background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
          linear-gradient(135deg, currentColor 50%, transparent 50%);
        background-position:
          right 0.75rem center,
          right 0.5rem center;
        background-size:
          0.3125rem 0.3125rem,
          0.3125rem 0.3125rem;
        background-repeat: no-repeat;
        transition:
          border-color var(--duration-200) var(--ease-in-out),
          background-color var(--duration-200) var(--ease-in-out);
      }

      .theme-select__control:hover {
        border-color: var(--color-border-strong);
      }

      .theme-select__control:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
        border-color: var(--color-border-focus);
      }

      /* On dark chrome (app header, login) the surrounding surface is not a
         contract surface, so the control inverts to stay legible. */
      .theme-select--on-dark .theme-select__label {
        color: rgba(255, 255, 255, 0.6);
      }
      .theme-select--on-dark .theme-select__control {
        background-color: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.24);
        color: #ffffff;
      }
      .theme-select--on-dark .theme-select__control:hover {
        border-color: rgba(255, 255, 255, 0.4);
      }
    `,
  ],
})
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly themes = THEME_REGISTRY;

  /** Renders for placement on dark chrome rather than a contract surface. */
  readonly dark = input(false);

  protected onSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    // Narrowing through the registry rather than casting: an id absent from the
    // registry is not a ThemeId, and set() must not be handed one.
    const match = THEME_REGISTRY.find((theme) => theme.id === value);
    if (match) this.themeService.set(match.id as ThemeId);
  }
}
