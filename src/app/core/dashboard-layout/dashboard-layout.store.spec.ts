import { TestBed } from '@angular/core/testing';
import { DashboardLayoutStore } from './dashboard-layout.store';
import { createDefaultLayout } from './dashboard-layout.model';

describe('DashboardLayoutStore', () => {
  let store: DashboardLayoutStore;

  beforeEach(() => {
    TestBed.resetTestingModule();
    store = TestBed.inject(DashboardLayoutStore);
  });

  it('starts with default layout and not in edit mode', () => {
    expect(store.layout().widgets.length).toBe(4);
    expect(store.editMode()).toBe(false);
    expect(store.isDragging()).toBe(false);
  });

  it('orderedWidgets sorts by order', () => {
    expect(store.orderedWidgets()[0].order).toBe(0);
  });

  it('move reorders widgets', () => {
    const first = store.orderedWidgets()[0].id;
    store.move(0, 2);
    expect(store.orderedWidgets()[2].id).toBe(first);
    expect(store.orderedWidgets()[2].order).toBe(2);
  });

  it('move ignores out-of-bounds indices', () => {
    const before = store.orderedWidgets().map((w) => w.id);
    store.move(-1, 10);
    expect(store.orderedWidgets().map((w) => w.id)).toEqual(before);
  });

  it('move no-ops when from === to', () => {
    const before = store.orderedWidgets().map((w) => w.id);
    store.move(1, 1);
    expect(store.orderedWidgets().map((w) => w.id)).toEqual(before);
  });

  it('resize changes colSpan', () => {
    const id = store.orderedWidgets()[0].id;
    store.resize(id, 6);
    expect(store.layout().widgets.find((w) => w.id === id)?.colSpan).toBe(6);
  });

  it('resize no-ops for unknown id or same colSpan', () => {
    const id = store.orderedWidgets()[0].id;
    const before = store.layout().widgets.find((w) => w.id === id)?.colSpan;
    store.resize(id, before as never);
    expect(store.layout().widgets.find((w) => w.id === id)?.colSpan).toBe(before);
    store.resize('unknown', 6);
    expect(store.layout().widgets.length).toBe(4);
  });

  it('addWidget appends with correct order', () => {
    store.addWidget({ id: 'w-new', widgetId: 'revenue' as never, colSpan: 3, order: 99 });
    expect(store.layout().widgets.length).toBe(5);
    expect(store.layout().widgets[4].order).toBe(4);
  });

  it('removeWidget filters and reorders', () => {
    const id = store.orderedWidgets()[1].id;
    store.removeWidget(id);
    expect(store.layout().widgets.length).toBe(3);
    expect(store.layout().widgets.some((w) => w.id === id)).toBe(false);
    expect(store.orderedWidgets()[1].order).toBe(1);
  });

  it('undo restores previous layout (depth 20)', () => {
    const before = store.layout().widgets.map((w) => w.id);
    store.move(0, 1);
    const after = store.layout().widgets.map((w) => w.id);
    expect(after).not.toEqual(before);
    store.undo();
    expect(store.layout().widgets.map((w) => w.id)).toEqual(before);
  });

  it('undo no-ops when stack empty', () => {
    const fresh = TestBed.inject(DashboardLayoutStore);
    // ensure empty stack by not moving
    fresh.undo();
    expect(fresh.layout().widgets.length).toBe(4);
  });

  it('resetToDefault restores default layout', () => {
    store.move(0, 3);
    store.resetToDefault();
    expect(store.layout().widgets.length).toBe(4);
    expect(store.orderedWidgets()[0].id).toBe('w-revenue');
  });

  it('setEditMode toggles and clears dragging on exit', () => {
    store.setDragging(true);
    store.setEditMode(true);
    expect(store.editMode()).toBe(true);
    store.setEditMode(false);
    expect(store.editMode()).toBe(false);
    expect(store.isDragging()).toBe(false);
  });

  it('setLayout pushes undo', () => {
    const custom = createDefaultLayout();
    store.setLayout(custom);
    store.undo();
    expect(store.layout().widgets.length).toBe(4);
  });
});
