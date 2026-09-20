import { ErrorCode } from '../errors/errors.types';
import { parseAndValidateLayout, validateLayout } from './layout-validator';
import { createDefaultLayout, DASHBOARD_LAYOUT_MAX_BYTES } from './dashboard-layout.model';

describe('layout-validator', () => {
  it('accepts the default layout', () => {
    const layout = createDefaultLayout();
    const result = validateLayout(layout);
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.value.widgets.length).toBe(4);
  });

  it('rejects non-object', () => {
    const result = validateLayout(null);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error.code).toBe(ErrorCode.DASHBOARD_LAYOUT_INVALID);
  });

  it('rejects missing version', () => {
    const result = validateLayout({ updatedAt: new Date().toISOString(), widgets: [] });
    expect(result.valid).toBe(false);
  });

  it('rejects invalid colSpan 999', () => {
    const layout = createDefaultLayout();
    const bad = { ...layout, widgets: [{ ...layout.widgets[0], colSpan: 999 }] };
    const result = validateLayout(bad);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error.message).toMatch(/colSpan/);
  });

  it('rejects widgetId with script tag', () => {
    const layout = createDefaultLayout();
    const bad = { ...layout, widgets: [{ ...layout.widgets[0], widgetId: '<script>alert(1)</script>' }] };
    const result = validateLayout(bad);
    expect(result.valid).toBe(false);
  });

  it('rejects widgetId with invalid characters', () => {
    const layout = createDefaultLayout();
    const bad = { ...layout, widgets: [{ ...layout.widgets[0], widgetId: 'bad id!' }] };
    const result = validateLayout(bad);
    expect(result.valid).toBe(false);
  });

  it('rejects oversized widgets array (1000)', () => {
    const layout = createDefaultLayout();
    const widgets = Array.from({ length: 1000 }, (_, i) => ({ id: `w-${i}`, widgetId: `widget-${i}`, colSpan: 3, order: i }));
    const bad = { ...layout, widgets };
    const result = validateLayout(bad);
    expect(result.valid).toBe(false);
  });

  it('rejects duplicate widget ids', () => {
    const layout = createDefaultLayout();
    const bad = { ...layout, widgets: [layout.widgets[0], layout.widgets[0]] };
    const result = validateLayout(bad);
    expect(result.valid).toBe(false);
  });

  it('rejects config with script content', () => {
    const layout = createDefaultLayout();
    const bad = { ...layout, widgets: [{ ...layout.widgets[0], config: { note: '<script>evil</script>' } }] };
    const result = validateLayout(bad);
    expect(result.valid).toBe(false);
  });

  it('rejects layout exceeding 10KB', () => {
    const layout = createDefaultLayout();
    const largeWidgets = Array.from({ length: 20 }, (_, i) => ({
      id: `w-${i}`,
      widgetId: `widget-${i}`,
      colSpan: 3 as const,
      order: i,
      config: { data: 'x'.repeat(600) },
    }));
    const bad = { ...layout, widgets: largeWidgets };
    // force over cap
    const json = JSON.stringify(bad);
    if (json.length <= DASHBOARD_LAYOUT_MAX_BYTES) {
      // if not over, add more
      const bigger = { ...bad, widgets: [...largeWidgets, ...largeWidgets] };
      const result = validateLayout(bigger);
      expect(result.valid).toBe(false);
    } else {
      const result = validateLayout(bad);
      expect(result.valid).toBe(false);
    }
  });

  it('parseAndValidateLayout handles malformed JSON', () => {
    const result = parseAndValidateLayout('not-json{');
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error.code).toBe(ErrorCode.DASHBOARD_LAYOUT_INVALID);
  });

  it('parseAndValidateLayout handles JSON throw', () => {
    const result = parseAndValidateLayout('{"version": 1, "updatedAt": "2026-01-01T00:00:00.000Z", "widgets": []}');
    expect(result.valid).toBe(true);
  });

  it('rejects invalid updatedAt', () => {
    const layout = { version: 1, updatedAt: 'not-a-date', widgets: [] };
    const result = validateLayout(layout);
    expect(result.valid).toBe(false);
  });

  it('rejects non-integer order', () => {
    const layout = createDefaultLayout();
    const bad = { ...layout, widgets: [{ ...layout.widgets[0], order: 1.5 }] };
    const result = validateLayout(bad);
    expect(result.valid).toBe(false);
  });
});
