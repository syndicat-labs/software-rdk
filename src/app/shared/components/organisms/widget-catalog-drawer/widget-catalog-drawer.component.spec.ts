import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { WidgetCatalogDrawerComponent } from './widget-catalog-drawer.component';
import { WIDGET_REGISTRY } from '../../../../core/dashboard-layout/widget-registry';
import { AuthStore } from '../../../../core/auth/auth.store';

describe('WidgetCatalogDrawerComponent', () => {
  it('renders overlay and drawer when visible', async () => {
    await render(WidgetCatalogDrawerComponent, { inputs: { visible: true } });
    expect(screen.getByTestId('catalog-drawer')).toBeInTheDocument();
    expect(screen.getByTestId('catalog-overlay')).toBeInTheDocument();
  });

  it('hides when not visible', async () => {
    await render(WidgetCatalogDrawerComponent, { inputs: { visible: false } });
    expect(screen.queryByTestId('catalog-drawer')).toBeNull();
  });

  it('emits closed on overlay click and close button', async () => {
    const { fixture } = await render(WidgetCatalogDrawerComponent, { inputs: { visible: true } });
    const spy = jest.spyOn(fixture.componentInstance.closed, 'emit');
    fireEvent.click(screen.getByTestId('catalog-overlay'));
    expect(spy).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('renders widgets from registry and emits add', async () => {
    const widgets = [{ id: 'revenue', title: 'Revenue', component: null as never, defaultColSpan: 3 as const }];
    const { fixture } = await render(WidgetCatalogDrawerComponent, {
      inputs: { visible: true },
      providers: [{ provide: WIDGET_REGISTRY, useValue: [widgets] }],
    });
    // HasPermission hides when not authenticated — set user so widget is visible
    TestBed.inject(AuthStore).setUser({ id: 'u1', roles: ['user'] });
    fixture.detectChanges();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    const spy = jest.spyOn(fixture.componentInstance.add, 'emit');
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(spy).toHaveBeenCalledWith('revenue');
  });

  it('shows empty when registry empty', async () => {
    await render(WidgetCatalogDrawerComponent, { inputs: { visible: true }, providers: [{ provide: WIDGET_REGISTRY, useValue: [] }] });
    expect(screen.getByText(/No widgets available/)).toBeInTheDocument();
  });
});
