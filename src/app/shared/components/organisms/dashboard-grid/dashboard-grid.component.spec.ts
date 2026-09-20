import { render, screen, fireEvent } from '@testing-library/angular';
import { DashboardGridComponent, GridWidgetView } from './dashboard-grid.component';
import { createDefaultLayout } from '../../../../core/dashboard-layout/dashboard-layout.model';
import { DashboardMetric } from '../../../../features/dashboard/dashboard.store';

const metrics: DashboardMetric[] = [
  { id: 'revenue', label: 'Revenue', value: '£128,430', delta: 12.4, unit: 'MTD' },
  { id: 'orders', label: 'Orders', value: '1,284', delta: -3.1, unit: 'today' },
];

function views(layout = createDefaultLayout()): GridWidgetView[] {
  const map = new Map(metrics.map((m) => [m.id, m]));
  return layout.widgets.slice(0, 2).map((instance, index) => ({
    instance: { ...instance, order: index, colSpan: 3 as const },
    metric: map.get(instance.widgetId as string),
    featured: instance.widgetId === 'revenue',
  }));
}

describe('DashboardGridComponent', () => {
  it('renders KPI cards for each view', async () => {
    await render(DashboardGridComponent, { inputs: { views: views(), editMode: false, variant: 'modern' } });
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
  });

  it('shows drag handles only in editMode', async () => {
    const { rerender } = await render(DashboardGridComponent, { inputs: { views: views(), editMode: false } });
    expect(document.querySelector('.grid__handle')).toBeNull();
    await rerender({ inputs: { views: views(), editMode: true } } as never);
    expect(document.querySelector('.grid__handle')).not.toBeNull();
  });

  it('hides handles when editMode false', async () => {
    await render(DashboardGridComponent, { inputs: { views: views(), editMode: false } });
    expect(document.querySelector('.grid__handle')).toBeNull();
  });

  it('emits resized when resize button clicked', async () => {
    const { fixture } = await render(DashboardGridComponent, { inputs: { views: views(), editMode: true } });
    const spy = jest.spyOn(fixture.componentInstance.resized, 'emit');
    const btns = document.querySelectorAll<HTMLButtonElement>('.grid__resize-btn');
    expect(btns.length).toBeGreaterThan(0);
    fireEvent.click(btns[0]);
    expect(spy).toHaveBeenCalled();
  });

  it('emits removed when kpi card remove clicked in editMode', async () => {
    const { fixture } = await render(DashboardGridComponent, { inputs: { views: views(), editMode: true } });
    const spy = jest.spyOn(fixture.componentInstance.removed, 'emit');
    fireEvent.click(screen.getByLabelText(/Remove Revenue/));
    expect(spy).toHaveBeenCalledWith('revenue');
  });

  it('renders unknown widget placeholder', async () => {
    const unknownViews: GridWidgetView[] = [
      { instance: { id: 'w-unknown', widgetId: 'unknown' as never, colSpan: 3, order: 0 }, metric: undefined, featured: false },
    ];
    await render(DashboardGridComponent, { inputs: { views: unknownViews, editMode: false } });
    expect(screen.getByText(/Unknown widget/)).toBeInTheDocument();
  });

  it('applies variant to kpi cards', async () => {
    await render(DashboardGridComponent, { inputs: { views: views(), editMode: false, variant: 'evolute' } });
    expect(document.querySelector('.kpi__dot')).not.toBeNull();
  });
});
