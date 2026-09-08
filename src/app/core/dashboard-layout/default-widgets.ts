import { KpiCardComponent } from '../../shared/components/atoms/kpi-card/kpi-card.component';
import type { WidgetDefinition } from './widget-registry';

export const DEFAULT_WIDGET_DEFINITIONS: readonly WidgetDefinition[] = [
  {
    id: 'revenue',
    title: 'Revenue',
    component: KpiCardComponent as unknown as WidgetDefinition['component'],
    defaultColSpan: 3,
    description: 'Monthly revenue',
  },
  {
    id: 'orders',
    title: 'Orders',
    component: KpiCardComponent as unknown as WidgetDefinition['component'],
    defaultColSpan: 3,
    description: 'Orders today',
  },
  {
    id: 'aov',
    title: 'Average order',
    component: KpiCardComponent as unknown as WidgetDefinition['component'],
    defaultColSpan: 3,
    description: '30-day average order value',
  },
  {
    id: 'refunds',
    title: 'Refunds',
    component: KpiCardComponent as unknown as WidgetDefinition['component'],
    defaultColSpan: 3,
    description: 'Refunds in last 30 days',
  },
] as const;
