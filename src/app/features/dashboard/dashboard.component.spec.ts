import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { DashboardComponent } from './dashboard.component';
import { DashboardStore } from './dashboard.store';
import { ThemeService } from '../../core/theme/theme.service';

describe('DashboardComponent (host)', () => {
  beforeEach(() => TestBed.resetTestingModule());
  afterEach(() => TestBed.resetTestingModule());

  it('renders the page title and current language label', async () => {
    await render(DashboardComponent);
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Modern')).toBeInTheDocument();
  });

  it('renders the Modern variant by default', async () => {
    await render(DashboardComponent);
    expect(document.querySelector('rdk-dashboard-modern')).not.toBeNull();
  });

  it('resolves the Obsidian variant when the theme is obsidian', async () => {
    const { fixture } = await render(DashboardComponent);
    const theme = fixture.componentRef.injector.get(ThemeService);
    theme.set('obsidian');
    fixture.detectChanges();
    expect(fixture.componentRef.injector.get(ThemeService).current()).toBe('obsidian');
    expect(document.querySelector('.dbo__kpi--anchor')).not.toBeNull();
  });

  it('resolves the Evolute variant when the theme is evolute', async () => {
    const { fixture } = await render(DashboardComponent);
    const theme = fixture.componentRef.injector.get(ThemeService);
    theme.set('evolute');
    fixture.detectChanges();
    expect(document.querySelector('.de__panel')).not.toBeNull();
  });

  it('shows the loading state from the store', async () => {
    const { fixture } = await render(DashboardComponent);
    const store = fixture.componentRef.injector.get(DashboardStore);
    store.reset();
    store.setLoading(true);
    fixture.detectChanges();
    expect(document.querySelector('[data-testid="dashboard-loading"]')).not.toBeNull();
  });

  it('clears the loading overlay once loading completes', async () => {
    const { fixture } = await render(DashboardComponent);
    const store = fixture.componentRef.injector.get(DashboardStore);
    store.reset();
    store.setLoading(true);
    fixture.detectChanges();
    expect(document.querySelector('[data-testid="dashboard-loading"]')).not.toBeNull();
    store.setLoading(false);
    store.setItems([
      {
        id: 'x',
        reference: 'INV-1',
        customer: 'Acme',
        amount: 100,
        currency: 'GBP',
        status: 'paid',
        date: '2026-08-30',
        channel: 'card',
      },
    ]);
    fixture.detectChanges();
    expect(document.querySelector('[data-testid="dashboard-loading"]')).toBeNull();
  });

  it('renders the empty state when loaded with no items', async () => {
    const { fixture } = await render(DashboardComponent);
    const store = fixture.componentRef.injector.get(DashboardStore);
    store.reset();
    store.setItems([]);
    fixture.detectChanges();
    expect(document.querySelector('[data-testid="dashboard-empty"]')).not.toBeNull();
  });

  it('renders an explicit gap for a language with no dashboard variant', async () => {
    const { fixture } = await render(DashboardComponent);
    const theme = fixture.componentRef.injector.get(ThemeService);
    (theme.current as unknown as { set: (v: string) => void }).set('unknown-theme');
    fixture.detectChanges();
    expect(document.querySelector('.db__gap')).not.toBeNull();
    expect(screen.getByText(/has not expressed a dashboard/)).toBeInTheDocument();
  });
});
