import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/theme/theme.service';
import { THEME_REGISTRY } from '../../../core/theme/token-contract';
import { CommandRecentsService } from '../../../core/command-palette/command-recents.service';
import { CommandPaletteService } from '../../../core/command-palette/command-palette.service';

/**
 * Bento editorial hero — the first impression a user gets after login.
 *
 * Presents the toolkit as a product ("what can you build, where you left off,
 * what to do next") rather than a component gallery. Reads contract tokens
 * only, so the same composition renders correctly across every registered
 * design language; the featured/anchored cell carries the contrast anchor the
 * language already declares.
 *
 * Empty state (no recents yet) frames the library and starters as the first
 * action; populated state surfaces "Continue where you left off" from the
 * command palette's recents index.
 */
@Component({
  selector: 'rdk-bento-home',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bento" data-testid="bento-home">
      <article class="bento__cell bento__cell--hero">
        <p class="bento__eyebrow">RDK Toolkit</p>
        <h2 class="bento__hero-title">Build a product, not a gallery.</h2>
        <p class="bento__hero-body">
          Pick a design language, fork a starter, and ship a composed surface —
          pricing, dashboard, checkout — in the language you chose.
        </p>
        <div class="bento__hero-actions">
          <a class="bento__cta" routerLink="/showcase/new-design-ideas/pricing-section">
            Browse starters
          </a>
          <button type="button" class="bento__ghost" (click)="openPalette()">
            <span class="pi pi-search" aria-hidden="true"></span>
            Search everything
            <kbd>⌘K</kbd>
          </button>
        </div>
        <p class="bento__hero-meta">
          {{ languageCount() }} languages · 90-token contract · WCAG AA
        </p>
      </article>

      <article class="bento__cell bento__cell--wide" data-testid="bento-recents">
        <h3 class="bento__title">Continue where you left off</h3>
        @if (recents().length > 0) {
          <ul class="bento__list">
            @for (recent of recents(); track recent.url) {
              <li>
                <a class="bento__link" [routerLink]="recent.url">{{ recent.label }}</a>
              </li>
            }
          </ul>
        } @else {
          <p class="bento__cell-body">
            Nothing open yet. Fork a starter and it will live here, ready to continue.
          </p>
          <a class="bento__cell-action" routerLink="/showcase/atoms/button">Browse the library</a>
        }
      </article>

      <article class="bento__cell">
        <h3 class="bento__title">Library</h3>
        <p class="bento__cell-body">Components and composed blocks you can preview, copy, and fork.</p>
        <a class="bento__cell-action" routerLink="/showcase/atoms/button">Explore components</a>
      </article>

      <article class="bento__cell">
        <h3 class="bento__title">Starters</h3>
        <p class="bento__cell-body">Full pages — pricing, ERP dashboard, checkout, invoices — per language.</p>
        <a class="bento__cell-action" routerLink="/showcase/new-design-ideas/pricing-section">See starters</a>
      </article>

      <article class="bento__cell">
        <h3 class="bento__title">Design language</h3>
        <p class="bento__cell-body">
          Active: <strong>{{ activeLabel() }}</strong> ({{ activeIndex() + 1 }} of {{ languageCount() }}).
        </p>
        <a class="bento__cell-action" routerLink="/showcase/protocol/languages">Compare languages</a>
      </article>
    </section>
  `,
  styles: [
    `
      .bento {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: var(--space-component-md);
        margin-bottom: var(--space-layout-md);
      }

      .bento__cell {
        grid-column: span 12;
        display: flex;
        flex-direction: column;
        gap: var(--space-component-sm);
        padding: var(--space-layout-sm);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        background: var(--color-bg-surface);
      }

      .bento__cell--hero {
        grid-column: span 12;
        background: var(--color-surface-featured);
        border-color: var(--color-surface-featured-border);
        color: var(--color-surface-featured-text);
      }

      @media (min-width: 64rem) {
        .bento__cell--hero { grid-column: span 7; }
        .bento__cell--wide { grid-column: span 5; }
        .bento__cell:not(.bento__cell--hero):not(.bento__cell--wide) { grid-column: span 4; }
      }

      .bento__eyebrow {
        margin: 0;
        font-family: var(--font-data);
        font-size: 0.6875rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-surface-featured-muted);
      }

      .bento__hero-title {
        margin: 0;
        font-family: var(--font-display);
        font-size: clamp(1.5rem, 3vw, 2rem);
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.1;
        color: var(--color-surface-featured-text);
      }

      .bento__hero-body {
        margin: 0;
        max-width: 42ch;
        font-size: 0.9375rem;
        line-height: 1.55;
        color: var(--color-surface-featured-muted);
      }

      .bento__hero-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-component-md);
        margin-top: var(--space-component-sm);
      }

      .bento__cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-component);
        background: var(--color-bg-brand);
        color: var(--color-text-inverse);
        font-size: 0.875rem;
        font-weight: 600;
        text-decoration: none;
        transition: filter var(--duration-200) var(--ease-in-out);

        &:hover {
          filter: brightness(1.08);
        }
      }

      .bento__ghost {
        display: inline-flex;
        align-items: center;
        gap: var(--space-component-sm);
        padding: 0.5rem 0.875rem;
        border: 1px solid var(--color-surface-featured-border);
        border-radius: var(--radius-component);
        background: rgba(255, 255, 255, 0.06);
        color: var(--color-surface-featured-text);
        cursor: pointer;
        font: inherit;
        font-size: 0.8125rem;

        .pi { font-size: 0.75rem; }

        kbd {
          font-family: var(--font-data);
          font-size: 0.625rem;
          text-transform: uppercase;
          color: var(--color-surface-featured-muted);
          border: 1px solid var(--color-surface-featured-border);
          border-radius: var(--radius-component);
          padding: 0.0625rem 0.3125rem;
        }
      }

      .bento__hero-meta {
        margin: var(--space-component-sm) 0 0;
        font-family: var(--font-data);
        font-size: 0.6875rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--color-surface-featured-muted);
      }

      .bento__title {
        margin: 0;
        font-family: var(--font-heading);
        font-size: 0.9375rem;
        font-weight: 700;
        color: var(--color-text-primary);
      }

      .bento__cell-body {
        margin: 0;
        font-size: 0.8125rem;
        line-height: 1.55;
        color: var(--color-text-secondary);

        strong {
          color: var(--color-text-primary);
        }
      }

      .bento__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-component-xs);
      }

      .bento__link {
        display: inline-flex;
        align-items: center;
        gap: var(--space-component-xs);
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-brand);
        text-decoration: none;

        &::before {
          content: '';
          width: 0.4375rem;
          height: 0.4375rem;
          border-radius: 50%;
          background: var(--color-bg-brand);
        }
      }

      .bento__cell-action {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--color-text-brand);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    `,
  ],
})
export class BentoHomeComponent {
  private readonly theme = inject(ThemeService);
  private readonly recentsService = inject(CommandRecentsService);
  private readonly palette = inject(CommandPaletteService);

  protected readonly recents = this.recentsService.list;
  protected readonly languageCount = computed(() => this.theme.registry.length);

  protected readonly activeLabel = computed(
    () => THEME_REGISTRY.find((t) => t.id === this.theme.current())?.label ?? this.theme.current(),
  );

  protected readonly activeIndex = computed(
    () => THEME_REGISTRY.findIndex((t) => t.id === this.theme.current()),
  );

  protected openPalette(): void {
    this.palette.open();
  }
}