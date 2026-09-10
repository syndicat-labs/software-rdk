import { render, screen, fireEvent } from '@testing-library/angular';
import { KpiCardComponent } from './kpi-card.component';
import { DashboardMetric } from '../../../../features/dashboard/dashboard.store';

const metric: DashboardMetric = { id: 'revenue', label: 'Revenue', value: '£128,430', delta: 12.4, unit: 'MTD' };

describe('KpiCardComponent', () => {
  it('renders label, value and delta', async () => {
    await render(KpiCardComponent, { inputs: { metric } });
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('£128,430')).toBeInTheDocument();
    expect(screen.getByText(/12\.4%/)).toBeInTheDocument();
  });

  it('applies featured styling', async () => {
    await render(KpiCardComponent, { inputs: { metric, featured: true } });
    expect(document.querySelector('.kpi--featured')).not.toBeNull();
  });

  it('shows actions when enabled and emits events', async () => {
    const { fixture } = await render(KpiCardComponent, { inputs: { metric, showActions: true } });
    const comp = fixture.componentInstance as KpiCardComponent;
    const removeSpy = jest.spyOn(comp.remove, 'emit');
    const configureSpy = jest.spyOn(comp.configure, 'emit');
    fireEvent.click(screen.getByLabelText(/Remove Revenue/));
    expect(removeSpy).toHaveBeenCalledWith('revenue');
    fireEvent.click(screen.getByLabelText(/Configure Revenue/));
    expect(configureSpy).toHaveBeenCalledWith('revenue');
  });

  it('hides actions when disabled', async () => {
    await render(KpiCardComponent, { inputs: { metric, showActions: false } });
    expect(screen.queryByLabelText(/Remove/)).toBeNull();
  });

  it('renders down glyph for negative delta', async () => {
    const neg: DashboardMetric = { ...metric, delta: -3.1 };
    await render(KpiCardComponent, { inputs: { metric: neg } });
    expect(screen.getByText(/↓/)).toBeInTheDocument();
  });

  it('applies obsidian featured variant', async () => {
    await render(KpiCardComponent, { inputs: { metric, featured: true, variant: 'obsidian' } });
    expect(document.querySelector('.kpi--obsidian')).not.toBeNull();
  });

  it('shows dot for evolute variant', async () => {
    await render(KpiCardComponent, { inputs: { metric, variant: 'evolute', showDot: true } });
    expect(document.querySelector('.kpi__dot')).not.toBeNull();
  });
});
