import { InjectionToken, Type } from '@angular/core';

export interface WidgetDefinition<_TConfig = unknown> {
  readonly id: string;
  readonly title: string;
  readonly component: Type<unknown>;
  readonly defaultColSpan: import('./dashboard-layout.model').ColSpan;
  readonly permissions?: readonly string[];
  readonly configSchema?: unknown;
  readonly description?: string;
}

export const WIDGET_REGISTRY = new InjectionToken<readonly WidgetDefinition[]>('WIDGET_REGISTRY');

/**
 * Registers widget definitions via DI. Usage in app.config.ts:
 *   provideWidgets({ id: 'revenue', title: 'Revenue', component: RevenueWidget, defaultColSpan: 3 })
 */
export function provideWidgets(...definitions: WidgetDefinition[]): { provide: typeof WIDGET_REGISTRY; useValue: readonly WidgetDefinition[]; multi: boolean }[] {
  return definitions.map((definition) => ({
    provide: WIDGET_REGISTRY,
    useValue: [definition] as readonly WidgetDefinition[],
    multi: true,
  }));
}

/**
 * Flattens the multi-provider registry.
 */
export function flattenWidgets(registry: readonly (readonly WidgetDefinition[])[]): readonly WidgetDefinition[] {
  return registry.flat() as readonly WidgetDefinition[];
}
