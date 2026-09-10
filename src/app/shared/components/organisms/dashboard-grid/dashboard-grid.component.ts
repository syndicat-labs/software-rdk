import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDrag, CdkDragHandle, CdkDragPlaceholder, CdkDragPreview, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { KpiCardComponent } from '../../atoms/kpi-card/kpi-card.component';
import type { DashboardMetric } from '../../../../features/dashboard/dashboard.store';
import type { ColSpan, WidgetInstance } from '../../../../core/dashboard-layout/dashboard-layout.model';

export interface GridWidgetView {
  readonly instance: WidgetInstance;
  readonly metric: DashboardMetric | undefined;
  readonly featured: boolean;
}

@Component({
  selector: 'rdk-dashboard-grid',
  standalone: true,
  imports: [DragDropModule, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPreview, CdkDragPlaceholder, KpiCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="grid"
      cdkDropList
      cdkDropListOrientation="mixed"
      [cdkDropListDisabled]="!editMode"
      (cdkDropListDropped)="dropped.emit($event)"
    >
      @for (view of views; track view.instance.id) {
        <div
          class="grid__item"
          [class.grid__item--dragging]="editMode"
          [attr.data-colspan]="view.instance.colSpan"
          cdkDrag
          [cdkDragDisabled]="!editMode"
          [cdkDragData]="view.instance"
        >
          @if (editMode) {
            <button type="button" class="grid__handle" cdkDragHandle aria-label="Drag {{ view.metric?.label ?? view.instance.widgetId }}">⠿</button>
            <div class="grid__resize" role="group" aria-label="Resize {{ view.metric?.label ?? view.instance.widgetId }}">
              <button type="button" class="grid__resize-btn" (click)="resized.emit({ id: view.instance.id, colSpan: 3 })" [disabled]="view.instance.colSpan === 3" aria-label="Small">S</button>
              <button type="button" class="grid__resize-btn" (click)="resized.emit({ id: view.instance.id, colSpan: 6 })" [disabled]="view.instance.colSpan === 6" aria-label="Medium">M</button>
              <button type="button" class="grid__resize-btn" (click)="resized.emit({ id: view.instance.id, colSpan: 12 })" [disabled]="view.instance.colSpan === 12" aria-label="Large">L</button>
            </div>
          }

          @if (view.metric) {
            <rdk-kpi-card
              [metric]="view.metric"
              [featured]="view.featured"
              [variant]="variant"
              [showDot]="variant === 'evolute'"
              [showActions]="editMode"
              (remove)="removed.emit($event)"
              (configure)="configured.emit($event)"
            />
          } @else {
            <div class="grid__unknown">Unknown widget {{ view.instance.widgetId }}</div>
          }

          <div *cdkDragPreview class="grid__preview">
            @if (view.metric) {
              <rdk-kpi-card [metric]="view.metric" [featured]="view.featured" [variant]="variant" [showDot]="variant === 'evolute'" />
            }
          </div>
          <div *cdkDragPlaceholder class="grid__placeholder"></div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: var(--space-layout-xs);
      }

      .grid__item {
        grid-column: span 3;
        position: relative;
      }

      .grid__item[data-colspan='3'] {
        grid-column: span 3;
      }
      .grid__item[data-colspan='4'] {
        grid-column: span 4;
      }
      .grid__item[data-colspan='6'] {
        grid-column: span 6;
      }
      .grid__item[data-colspan='12'] {
        grid-column: span 12;
      }

      @media (max-width: 768px) {
        .grid__item {
          grid-column: span 12 !important;
        }
      }

      @media (min-width: 769px) and (max-width: 1024px) {
        .grid__item[data-colspan='12'] {
          grid-column: span 12;
        }
        .grid__item[data-colspan='6'] {
          grid-column: span 6;
        }
        .grid__item[data-colspan='3'],
        .grid__item[data-colspan='4'] {
          grid-column: span 6;
        }
      }

      .grid__handle {
        position: absolute;
        top: var(--space-component-xs);
        left: var(--space-component-xs);
        width: 1.5rem;
        height: 1.5rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-pill);
        background: var(--color-bg-surface);
        color: var(--color-text-muted);
        cursor: grab;
        z-index: 1;
        font-size: 0.75rem;
      }

      .grid__handle:active {
        cursor: grabbing;
      }

      .grid__handle:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }

      .grid__resize {
        position: absolute;
        bottom: var(--space-component-xs);
        right: var(--space-component-xs);
        display: flex;
        gap: 0.125rem;
        z-index: 1;
      }

      .grid__resize-btn {
        width: 1.25rem;
        height: 1.25rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-pill);
        background: var(--color-bg-surface);
        color: var(--color-text-secondary);
        cursor: pointer;
        font-size: 0.625rem;
        font-weight: 600;
      }

      .grid__resize-btn:disabled {
        opacity: 0.4;
        cursor: default;
      }

      .grid__resize-btn:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }

      .grid__unknown {
        padding: var(--space-component-lg);
        background: var(--color-bg-surface);
        border: 1px dashed var(--color-border-strong);
        border-radius: var(--radius-surface);
        color: var(--color-text-muted);
        font-size: 0.875rem;
      }

      .grid__preview {
        opacity: 0.9;
        transform: rotate(1deg);
        box-shadow: var(--elevation-overlay);
        border-radius: var(--radius-surface);
      }

      .grid__placeholder {
        background: var(--color-bg-sunken);
        border: 1px dashed var(--color-border-strong);
        border-radius: var(--radius-surface);
        min-height: 6rem;
      }

      @media (prefers-reduced-motion: reduce) {
        .grid__preview {
          transform: none;
        }

        .grid__item {
          transition: none !important;
        }
      }

      /* WCAG 2.2 2.5.8 target size */
      .grid__handle,
      .grid__resize-btn {
        min-width: 24px;
        min-height: 24px;
      }
    `,
  ],
})
export class DashboardGridComponent {
  @Input() views: readonly GridWidgetView[] = [];
  @Input() editMode = false;
  @Input() variant: 'modern' | 'obsidian' | 'evolute' = 'modern';

  @Output() dropped = new EventEmitter<import('@angular/cdk/drag-drop').CdkDragDrop<WidgetInstance>>();
  @Output() resized = new EventEmitter<{ id: string; colSpan: ColSpan }>();
  @Output() removed = new EventEmitter<string>();
  @Output() configured = new EventEmitter<string>();
}
