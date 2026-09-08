import { computed, Injectable, signal } from '@angular/core';
import { ColSpan, createDefaultLayout, DashboardLayout, WidgetInstance } from './dashboard-layout.model';

const UNDO_DEPTH = 20;

@Injectable({ providedIn: 'root' })
export class DashboardLayoutStore {
  private readonly layoutSignal = signal<DashboardLayout>(createDefaultLayout());
  private readonly editModeSignal = signal(false);
  private readonly draggingSignal = signal(false);
  private readonly undoStack: DashboardLayout[] = [];

  readonly layout = this.layoutSignal.asReadonly();
  readonly editMode = this.editModeSignal.asReadonly();
  readonly isDragging = this.draggingSignal.asReadonly();

  readonly orderedWidgets = computed(() =>
    [...this.layoutSignal().widgets].sort((a, b) => a.order - b.order),
  );

  setLayout(layout: DashboardLayout): void {
    this.pushUndo();
    this.layoutSignal.set(layout);
  }

  setEditMode(value: boolean): void {
    this.editModeSignal.set(value);
    if (!value) {
      this.draggingSignal.set(false);
    }
  }

  setDragging(value: boolean): void {
    this.draggingSignal.set(value);
  }

  move(fromIndex: number, toIndex: number): void {
    const ordered = this.orderedWidgets();
    if (fromIndex < 0 || fromIndex >= ordered.length || toIndex < 0 || toIndex >= ordered.length) {
      return;
    }
    if (fromIndex === toIndex) return;

    this.pushUndo();

    const next = [...ordered];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);

    const reordered: WidgetInstance[] = next.map((widget, index) => ({ ...widget, order: index }));

    this.layoutSignal.update((current) => ({
      ...current,
      updatedAt: new Date().toISOString(),
      widgets: reordered,
    }));
  }

  resize(id: string, colSpan: ColSpan): void {
    const exists = this.layoutSignal().widgets.some((widget) => widget.id === id);
    if (!exists) return;

    const current = this.layoutSignal().widgets.find((widget) => widget.id === id);
    if (current?.colSpan === colSpan) return;

    this.pushUndo();

    this.layoutSignal.update((layout) => ({
      ...layout,
      updatedAt: new Date().toISOString(),
      widgets: layout.widgets.map((widget) => (widget.id === id ? { ...widget, colSpan } : widget)),
    }));
  }

  addWidget(instance: WidgetInstance): void {
    this.pushUndo();
    this.layoutSignal.update((layout) => ({
      ...layout,
      updatedAt: new Date().toISOString(),
      widgets: [...layout.widgets, { ...instance, order: layout.widgets.length }],
    }));
  }

  removeWidget(id: string): void {
    const exists = this.layoutSignal().widgets.some((widget) => widget.id === id);
    if (!exists) return;

    this.pushUndo();

    const filtered = this.layoutSignal()
      .widgets.filter((widget) => widget.id !== id)
      .map((widget, index) => ({ ...widget, order: index }));

    this.layoutSignal.update((layout) => ({
      ...layout,
      updatedAt: new Date().toISOString(),
      widgets: filtered,
    }));
  }

  undo(): void {
    const previous = this.undoStack.pop();
    if (!previous) return;
    this.layoutSignal.set(previous);
  }

  resetToDefault(): void {
    this.pushUndo();
    this.layoutSignal.set(createDefaultLayout());
  }

  private pushUndo(): void {
    this.undoStack.push(this.layoutSignal());
    if (this.undoStack.length > UNDO_DEPTH) {
      this.undoStack.shift();
    }
  }
}
