import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { WIDGET_REGISTRY, flattenWidgets } from '../../../../core/dashboard-layout/widget-registry';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'rdk-widget-catalog-drawer',
  standalone: true,
  imports: [HasPermissionDirective, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible) {
      <div class="drawer__overlay" (click)="closed.emit()" data-testid="catalog-overlay"></div>
      <aside class="drawer" role="dialog" aria-label="Add widget" data-testid="catalog-drawer">
        <header class="drawer__head">
          <h2 class="drawer__title">Add widget</h2>
          <button type="button" class="drawer__close" (click)="closed.emit()" aria-label="Close">×</button>
        </header>
        <div class="drawer__body">
          @for (widget of widgets(); track widget.id) {
            <div class="drawer__item" *rdkHasPermission="widget.permissions ?? []">
              <div class="drawer__item-head">
                <span class="drawer__item-title">{{ widget.title }}</span>
                @if (widget.description) {
                  <span class="drawer__item-desc">{{ widget.description }}</span>
                }
              </div>
              <rdk-button variant="secondary" size="sm" (clicked)="add.emit(widget.id)" [attr.data-testid]="'add-' + widget.id">
                Add
              </rdk-button>
            </div>
          }
          @if (widgets().length === 0) {
            <p class="drawer__empty">No widgets available.</p>
          }
        </div>
      </aside>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .drawer__overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.32);
        z-index: 40;
      }

      .drawer {
        position: fixed;
        top: 0;
        right: 0;
        width: 22rem;
        max-width: 90vw;
        height: 100%;
        background: var(--color-bg-surface);
        border-left: 1px solid var(--color-border-default);
        box-shadow: var(--elevation-overlay);
        z-index: 41;
        display: flex;
        flex-direction: column;
      }

      .drawer__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-component-lg);
        border-bottom: 1px solid var(--color-border-default);
      }

      .drawer__title {
        margin: 0;
        font-size: 1rem;
        color: var(--color-text-primary);
        font-family: var(--font-heading);
      }

      .drawer__close {
        width: 1.5rem;
        height: 1.5rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-pill);
        background: var(--color-bg-surface);
        color: var(--color-text-secondary);
        cursor: pointer;
      }

      .drawer__close:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
      }

      .drawer__body {
        flex: 1;
        overflow: auto;
        padding: var(--space-component-lg);
        display: flex;
        flex-direction: column;
        gap: var(--space-component-md);
      }

      .drawer__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-component-md);
        padding: var(--space-component-md);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        background: var(--color-bg-base);
      }

      .drawer__item-head {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      .drawer__item-title {
        color: var(--color-text-primary);
        font-size: 0.875rem;
        font-weight: 600;
      }

      .drawer__item-desc {
        color: var(--color-text-muted);
        font-size: 0.75rem;
      }

      .drawer__empty {
        color: var(--color-text-muted);
        font-size: 0.875rem;
        margin: 0;
      }
    `,
  ],
})
export class WidgetCatalogDrawerComponent {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() add = new EventEmitter<string>();

  private readonly registry = inject(WIDGET_REGISTRY, { optional: true });

  protected widgets(): readonly import('../../../../core/dashboard-layout/widget-registry').WidgetDefinition[] {
    if (!this.registry) return [];
    // registry is multi-provider flattened array; if injected as single array, handle both
    const raw = this.registry as unknown as readonly unknown[];
    // When multi:true, Angular injects array of arrays (each useValue is [definition])
    // Our provideWidgets returns array of providers each with useValue [definition], so injected is [ [def], [def], ... ]
    // Flatten
    if (raw.length > 0 && Array.isArray(raw[0])) {
      return flattenWidgets(raw as unknown as readonly (readonly import('../../../../core/dashboard-layout/widget-registry').WidgetDefinition[])[]);
    }
    return raw as unknown as readonly import('../../../../core/dashboard-layout/widget-registry').WidgetDefinition[];
  }
}
