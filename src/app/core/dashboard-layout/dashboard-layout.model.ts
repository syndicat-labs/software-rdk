/** Closed 12-col grid spans — no free pixels. */
export type ColSpan = 3 | 4 | 6 | 12;

export const COL_SPANS: readonly ColSpan[] = [3, 4, 6, 12] as const;

/** Branded widget identifier — nominal, not structural. */
export type WidgetId = string & { readonly __brand: unique symbol };

export function toWidgetId(value: string): WidgetId {
  return value as WidgetId;
}

export interface WidgetInstance {
  readonly id: string;
  readonly widgetId: WidgetId;
  readonly colSpan: ColSpan;
  readonly order: number;
  readonly config?: Readonly<Record<string, unknown>>;
}

export interface DashboardLayout {
  readonly version: number;
  readonly updatedAt: string;
  readonly widgets: readonly WidgetInstance[];
}

export const DASHBOARD_LAYOUT_VERSION = 1;
export const DASHBOARD_LAYOUT_STORAGE_KEY = 'rdk_dashboard_layout_v1';
export const DASHBOARD_LAYOUT_MAX_BYTES = 10 * 1024;

export const DEFAULT_WIDGETS: readonly WidgetInstance[] = [
  { id: 'w-revenue', widgetId: toWidgetId('revenue'), colSpan: 3, order: 0 },
  { id: 'w-orders', widgetId: toWidgetId('orders'), colSpan: 3, order: 1 },
  { id: 'w-aov', widgetId: toWidgetId('aov'), colSpan: 3, order: 2 },
  { id: 'w-refunds', widgetId: toWidgetId('refunds'), colSpan: 3, order: 3 },
] as const;

export function createDefaultLayout(): DashboardLayout {
  return {
    version: DASHBOARD_LAYOUT_VERSION,
    updatedAt: new Date().toISOString(),
    widgets: DEFAULT_WIDGETS,
  };
}
