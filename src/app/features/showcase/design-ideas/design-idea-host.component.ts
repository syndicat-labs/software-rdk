import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  type Type,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ThemeService } from '../../../core/theme/theme.service';
import { THEME_REGISTRY } from '../../../core/theme/token-contract';
import { DESIGN_IDEAS, getDesignIdea, getVariant } from './design-idea';

/**
 * Resolves a design idea against the *active* design language and renders that
 * language's expression of it.
 *
 * When a language has not expressed the idea, this renders the gap explicitly
 * rather than falling back to another language's work. Substituting Obsidian's
 * pricing page under theEvolute would show a structure theEvolute's declaration
 * explicitly refuses — a single dark anchor card under a language whose
 * emphasis budget is unbounded — and present it as that language's position.
 */
@Component({
  selector: 'rdk-design-idea-host',
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (idea(); as current) {
      <header class="idea-head">
        <div class="idea-head__row">
          <h1 class="idea-head__title">{{ current.label }}</h1>
          <span class="idea-head__lang">{{ activeLabel() }}</span>
        </div>
        <p class="idea-head__brief">{{ current.brief }}</p>
        @if (variant(); as v) {
          <p class="idea-head__emphasis">{{ v.emphasis }}</p>
        }
      </header>

      @if (loaded(); as cmp) {
        <ng-container *ngComponentOutlet="cmp" />
      } @else if (variant()) {
        <p class="idea-state">Loading…</p>
      } @else {
        <section class="idea-gap">
          <h2 class="idea-gap__title">{{ activeLabel() }} has not expressed this idea</h2>
          <p class="idea-gap__body">
            A design idea carries a philosophy, so it cannot be re-skinned by swapping tokens.
            Showing another language's version here would present structural choices this language
            may explicitly refuse as though they were its own.
          </p>
          @if (expressedBy().length) {
            <p class="idea-gap__by">
              Expressed by: <strong>{{ expressedBy().join(', ') }}</strong> — switch language to
              view.
            </p>
          }
        </section>
      }
    } @else {
      <p class="idea-state">Unknown design idea.</p>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .idea-head {
        padding: var(--space-layout-sm) var(--space-layout-md) 0;
        max-width: 70ch;
      }
      .idea-head__row {
        display: flex;
        align-items: baseline;
        gap: var(--space-component-md);
        flex-wrap: wrap;
      }
      .idea-head__title {
        color: var(--color-text-primary);
        font-family: var(--font-heading);
      }
      .idea-head__lang {
        font-family: var(--font-data);
        font-size: 0.6875rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--color-text-secondary);
        background: var(--color-bg-sunken);
        border-radius: var(--radius-pill);
        padding: 0.125rem 0.5rem;
      }
      .idea-head__brief {
        margin-top: var(--space-component-sm);
        color: var(--color-text-secondary);
        line-height: 1.6;
      }
      .idea-head__emphasis {
        margin-top: var(--space-component-sm);
        color: var(--color-text-muted);
        font-size: 0.8125rem;
        line-height: 1.6;
      }

      .idea-gap {
        margin: var(--space-layout-md);
        padding: var(--space-layout-sm);
        border: 1px dashed var(--color-border-strong);
        border-radius: var(--radius-surface);
        background: var(--color-bg-sunken);
        max-width: 60ch;
      }
      .idea-gap__title {
        color: var(--color-text-primary);
        font-size: 1rem;
        font-family: var(--font-heading);
      }
      .idea-gap__body {
        margin-top: var(--space-component-sm);
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        line-height: 1.6;
      }
      .idea-gap__by {
        margin-top: var(--space-component-md);
        color: var(--color-text-muted);
        font-size: 0.8125rem;
      }
      .idea-gap__by strong {
        color: var(--color-text-primary);
      }

      .idea-state {
        padding: var(--space-layout-md);
        color: var(--color-text-muted);
      }
    `,
  ],
})
export class DesignIdeaHostComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly theme = inject(ThemeService);

  private readonly ideaId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('ideaId') ?? '')),
    { initialValue: '' },
  );

  protected readonly idea = computed(() => getDesignIdea(this.ideaId()));

  protected readonly variant = computed(() => {
    const idea = this.idea();
    return idea ? getVariant(idea, this.theme.current()) : undefined;
  });

  protected readonly activeLabel = computed(
    () => THEME_REGISTRY.find((t) => t.id === this.theme.current())?.label ?? this.theme.current(),
  );

  /** Labels of the languages that have expressed this idea, for the gap state. */
  protected readonly expressedBy = computed(() => {
    const idea = this.idea();
    if (!idea) return [];
    return idea.variants
      .map((v) => THEME_REGISTRY.find((t) => t.id === v.language)?.label ?? v.language)
      .filter((label) => label !== this.activeLabel());
  });

  protected readonly loaded = signal<Type<unknown> | null>(null);

  constructor() {
    effect((onCleanup) => {
      const variant = this.variant();
      this.loaded.set(null);
      if (!variant) return;

      // A late-resolving import for a variant the user has already navigated
      // away from must not overwrite the current one.
      let stale = false;
      onCleanup(() => {
        stale = true;
      });
      void variant.load().then((cmp) => {
        if (!stale) this.loaded.set(cmp);
      });
    });
  }

  protected readonly allIdeas = DESIGN_IDEAS;
}
