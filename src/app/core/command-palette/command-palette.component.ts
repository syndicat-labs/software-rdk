import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandEntry, PaletteSection } from './command-palette.model';
import { CommandPaletteService } from './command-palette.service';

const SECTION_LABELS: Record<PaletteSection, string> = {
  recents: 'Continue where you left off',
  navigation: 'Go to',
  create: 'Create',
  actions: 'Actions',
};

const SECTION_ORDER: readonly PaletteSection[] = ['recents', 'navigation', 'create', 'actions'];

/**
 * Cmd+K command palette (Linear-style): a keyboard-native launcher that mixes
 * navigation, quick actions, Create recipes, and "continue where you left off"
 * recents into one searchable surface. Deck-first, no decorative motion.
 */
@Component({
  selector: 'rdk-command-palette',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="palette">
        <div class="palette__scrim" (click)="close()"></div>
        <div
          class="palette__dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          (keydown)="onKeydown($event)"
        >
          <div class="palette__search">
            <span class="pi pi-search palette__search-icon" aria-hidden="true"></span>
            <input
              class="palette__input"
              [value]="query()"
              (input)="onInput($event)"
              placeholder="Search the toolkit…"
              spellcheck="false"
              autocomplete="off"
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-list"
              aria-label="Search the toolkit"
            />
            <kbd class="palette__kbd">esc</kbd>
          </div>

          <ul class="palette__list" id="palette-list" role="listbox" aria-label="Commands">
            @for (group of groups(); track group.section) {
              <li class="palette__group-label" aria-hidden="true">{{ group.label }}</li>
              @for (entry of group.items; track entry.id) {
                <li role="option" [attr.aria-selected]="activeIndex() === indexOf(entry)">
                  <button
                    type="button"
                    class="palette__item"
                    [class.palette__item--active]="activeIndex() === indexOf(entry)"
                    (mouseenter)="setActiveById(entry.id)"
                    (click)="run(entry)"
                  >
                    <span class="pi palette__item-icon" [ngClass]="entry.icon"></span>
                    <span class="palette__item-label">{{ entry.label }}</span>
                    @if (entry.hint) {
                      <span class="palette__item-hint">{{ entry.hint }}</span>
                    }
                  </button>
                </li>
              }
            }
          </ul>

          @if (filtered().length === 0) {
            <p class="palette__empty">No results for “{{ query() }}”.</p>
          }

          <div class="palette__footer">
            <span>↑↓ navigate</span>
            <span>↵ open</span>
            <span>esc close</span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .palette {
        position: fixed;
        inset: 0;
        z-index: 80;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 18vh;
      }

      .palette__scrim {
        position: absolute;
        inset: 0;
        background: var(--color-bg-overlay);
      }

      .palette__dialog {
        position: relative;
        width: min(36rem, calc(100vw - 2rem));
        background: var(--color-bg-elevated);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        box-shadow: var(--elevation-overlay);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .palette__search {
        display: flex;
        align-items: center;
        gap: var(--space-component-sm);
        padding: var(--space-component-md);
        border-bottom: 1px solid var(--color-border-muted);
      }

      .palette__search-icon {
        color: var(--color-text-muted);
        font-size: 0.875rem;
        flex-shrink: 0;
      }

      .palette__input {
        flex: 1;
        min-width: 0;
        background: none;
        border: none;
        outline: none;
        font: inherit;
        font-size: 0.9375rem;
        color: var(--color-text-primary);
        caret-color: var(--color-text-brand);

        &::placeholder {
          color: var(--color-text-muted);
        }
      }

      .palette__kbd {
        font-family: var(--font-data);
        font-size: 0.625rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--color-text-muted);
        background: var(--color-bg-sunken);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-component);
        padding: 0.125rem 0.375rem;
        flex-shrink: 0;
      }

      .palette__list {
        list-style: none;
        margin: 0;
        padding: var(--space-component-sm);
        max-height: 20rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0.0625rem;
      }

      .palette__group-label {
        font-family: var(--font-data);
        font-size: 0.625rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-text-muted);
        padding: var(--space-component-xs) var(--space-component-sm);
      }

      .palette__item {
        display: flex;
        align-items: center;
        gap: var(--space-component-sm);
        width: 100%;
        padding: 0.5rem 0.625rem;
        border: none;
        border-radius: var(--radius-component);
        background: none;
        cursor: pointer;
        font: inherit;
        text-align: left;
        color: var(--color-text-primary);

        &--active {
          background: var(--color-bg-brand-subtle);
          outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
          outline-offset: var(--color-focus-ring-offset);
        }
      }

      .palette__item-icon {
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        background: var(--color-bg-sunken);
        border-radius: var(--radius-component);
      }

      .palette__item-label {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .palette__item-hint {
        color: var(--color-text-muted);
        font-family: var(--font-data);
        font-size: 0.6875rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 12rem;
      }

      .palette__empty {
        margin: 0;
        padding: var(--space-layout-sm);
        color: var(--color-text-secondary);
        font-size: 0.8125rem;
        text-align: center;
      }

      .palette__footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--space-component-md);
        padding: var(--space-component-sm) var(--space-component-md);
        border-top: 1px solid var(--color-border-muted);

        span {
          font-family: var(--font-data);
          font-size: 0.625rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }
      }
    `,
  ],
})
export class CommandPaletteComponent {
  private readonly service = inject(CommandPaletteService);
  private readonly el = inject(ElementRef);

  protected readonly activeIndex = signal(0);
  protected readonly query = signal('');
  private readonly entries = signal<CommandEntry[]>([]);
  private readonly flat = computed(() => {
    const items: CommandEntry[] = [];
    for (const group of this.groups()) items.push(...group.items);
    return items;
  });

  protected readonly visible = this.service.visible;

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const all = this.entries();
    if (!q) return all;
    return all.filter((e) =>
      [e.label, e.hint ?? '', ...e.keywords].join(' ').toLowerCase().includes(q),
    );
  });

  protected readonly groups = computed(() => {
    const sections = new Map<PaletteSection, CommandEntry[]>();
    for (const entry of this.filtered()) {
      const bucket = sections.get(entry.section) ?? [];
      bucket.push(entry);
      sections.set(entry.section, bucket);
    }
    return SECTION_ORDER.filter((s) => sections.has(s)).map((section) => ({
      section,
      label: SECTION_LABELS[section],
      items: sections.get(section) ?? [],
    }));
  });

  constructor() {
    effect(() => {
      if (this.service.visible()) {
        this.entries.set(this.service.buildEntries());
        this.query.set('');
        this.activeIndex.set(0);
        queueMicrotask(() => {
          const root = this.el.nativeElement as HTMLElement;
          root.querySelector<HTMLInputElement>('.palette__input')?.focus();
        });
      }
    });
  }

  protected indexOf(entry: CommandEntry): number {
    return this.flat().indexOf(entry);
  }

  protected setActiveById(id: string): void {
    const index = this.flat().findIndex((e) => e.id === id);
    if (index >= 0) this.activeIndex.set(index);
  }

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.activeIndex.set(0);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const list = this.flat();
    if (list.length === 0) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.update((i) => (i + 1) % list.length);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.update((i) => (i - 1 + list.length) % list.length);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const active = list[this.activeIndex()];
      if (active) this.run(active);
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
    }
  }

  protected run(entry: CommandEntry): void {
    this.service.run(entry);
  }

  protected close(): void {
    this.service.close();
  }
}