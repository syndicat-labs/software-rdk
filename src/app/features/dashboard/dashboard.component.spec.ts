import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { DashboardStore } from './dashboard.store';
import { ThemeService } from '../../core/theme/theme.service';
import { DashboardLayoutService } from '../../core/dashboard-layout/dashboard-layout.service';
import { createDefaultLayout } from '../../core/dashboard-layout/dashboard-layout.model';
import { APP_CONFIG } from '../../core/config/app-config.token';
import { DEFAULT_AUTH_CONFIG } from '../../core/config/app-config.model';

const TEST_CONFIG = {
  environment: { production: false, apiBaseUrl: '', authBaseUrl: '', logLevel: 'error' as const },
  api: { baseUrl: '', timeoutMs: 1000, maxRetries: 0 },
  auth: DEFAULT_AUTH_CONFIG,
  features: {},
};

function layoutServiceMock() {
  return {
    readLocal: () => null,
    load: () => of(createDefaultLayout()),
    save: () => of(undefined),
    writeLocal: () => undefined,
    clearLocal: () => undefined,
  };
}

const HOST_PROVIDERS = [
  { provide: APP_CONFIG, useValue: TEST_CONFIG },
  { provide: DashboardLayoutService, useValue: layoutServiceMock() },
];

describe('DashboardComponent (host)', () => {
  beforeEach(() => TestBed.resetTestingModule());
  afterEach(() => TestBed.resetTestingModule());

  it('renders the page title and current language label', async () => {
    await render(DashboardComponent, {
      providers: HOST_PROVIDERS,
    });
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getAllByText('Modern').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Modern variant by default', async () => {
    await render(DashboardComponent, {
      providers: HOST_PROVIDERS,
    });
    expect(document.querySelector('rdk-dashboard-modern')).not.toBeNull();
  });

  it('resolves the Obsidian variant when the theme is obsidian', async () => {
    const { fixture } = await render(DashboardComponent, {
      providers: HOST_PROVIDERS,
    });
    const theme = fixture.componentRef.injector.get(ThemeService);
    theme.set('obsidian');
    fixture.detectChanges();
    expect(fixture.componentRef.injector.get(ThemeService).current()).toBe('obsidian');
    expect(document.querySelector('rdk-dashboard-grid')).not.toBeNull();
  });

  it('resolves the Evolute variant when the theme is evolute', async () => {
    const { fixture } = await render(DashboardComponent, {
      providers: HOST_PROVIDERS,
    });
    const theme = fixture.componentRef.injector.get(ThemeService);
    theme.set('evolute');
    fixture.detectChanges();
    expect(document.querySelector('.de__panel')).not.toBeNull();
  });

  it('shows the loading state from the store', async () => {
    const { fixture } = await render(DashboardComponent, {
      providers: HOST_PROVIDERS,
    });
    const store = fixture.componentRef.injector.get(DashboardStore);
    store.reset();
    store.setLoading(true);
    fixture.detectChanges();
    expect(document.querySelector('[data-testid="dashboard-loading"]')).not.toBeNull();
  });

  it('clears the loading overlay once loading completes', async () => {
    const { fixture } = await render(DashboardComponent, {
      providers: HOST_PROVIDERS,
    });
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
    const { fixture } = await render(DashboardComponent, {
      providers: HOST_PROVIDERS,
    });
    const store = fixture.componentRef.injector.get(DashboardStore);
    store.reset();
    store.setItems([]);
    fixture.detectChanges();
    expect(document.querySelector('[data-testid="dashboard-empty"]')).not.toBeNull();
  });

  it('renders an explicit gap for a language with no dashboard variant', async () => {
    const { fixture } = await render(DashboardComponent, {
      providers: HOST_PROVIDERS,
    });
    const theme = fixture.componentRef.injector.get(ThemeService);
    (theme.current as unknown as { set: (v: string) => void }).set('unknown-theme');
    fixture.detectChanges();
    expect(document.querySelector('.db__gap')).not.toBeNull();
    expect(screen.getByText(/has not expressed a dashboard/)).toBeInTheDocument();
  });

  it('toggles edit mode via the edit button', async () => {
    const { fixture } = await render(DashboardComponent, {
      providers: HOST_PROVIDERS,
    });
    expect(screen.getByTestId('dashboard-edit-toggle')).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-undo')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /edit|done/i }));
    fixture.detectChanges();
    expect(screen.getByTestId('dashboard-undo')).toBeInTheDocument();
  });
});
