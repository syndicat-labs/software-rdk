import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { DashboardModernComponent } from './dashboard-modern.component';
import { DashboardObsidianComponent } from './dashboard-obsidian.component';
import { DashboardEvoluteComponent } from './dashboard-evolute.component';
import { DashboardMetric, DashboardTransaction } from '../dashboard.store';
import { DashboardLayoutService } from '../../../core/dashboard-layout/dashboard-layout.service';
import { createDefaultLayout } from '../../../core/dashboard-layout/dashboard-layout.model';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { DEFAULT_AUTH_CONFIG } from '../../../core/config/app-config.model';

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

const TEST_PROVIDERS = [
  { provide: APP_CONFIG, useValue: TEST_CONFIG },
  { provide: DashboardLayoutService, useValue: layoutServiceMock() },
];

const metrics: DashboardMetric[] = [
  { id: 'revenue', label: 'Revenue', value: '£128,430', delta: 12.4, unit: 'MTD' },
  { id: 'orders', label: 'Orders', value: '1,284', delta: -3.1, unit: 'today' },
];

const transactions: DashboardTransaction[] = [
  {
    id: 't-1',
    reference: 'INV-10423',
    customer: 'Atlas Freight Ltd',
    amount: 1284,
    currency: 'GBP',
    status: 'paid',
    date: '2026-08-30',
    channel: 'card',
  },
  {
    id: 't-2',
    reference: 'INV-10421',
    customer: 'Harbour & Howe',
    amount: 77,
    currency: 'GBP',
    status: 'failed',
    date: '2026-08-29',
    channel: 'card',
  },
  {
    id: 't-3',
    reference: 'INV-10424',
    customer: 'Vela GmbH',
    amount: 250,
    currency: 'EUR',
    status: 'refunded',
    date: '2026-08-27',
    channel: 'bacs',
  },
];

describe('DashboardModernComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders KPI cards with labels and values', async () => {
    await render(DashboardModernComponent, {
      inputs: { metrics, transactions },
      providers: TEST_PROVIDERS,
    });
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('£128,430')).toBeInTheDocument();
  });

  it('marks the featured revenue KPI', async () => {
    await render(DashboardModernComponent, {
      inputs: { metrics, transactions },
      providers: TEST_PROVIDERS,
    });
    const featured = document.querySelector('.kpi--featured');
    expect(featured).not.toBeNull();
    expect(featured?.textContent).toContain('Revenue');
  });

  it('formats amounts with the currency symbol', async () => {
    await render(DashboardModernComponent, {
      inputs: { metrics, transactions },
      providers: TEST_PROVIDERS,
    });
    expect(document.body.textContent).toContain('£1,284.00');
    expect(document.body.textContent).toContain('£77.00');
    expect(document.body.textContent).toContain('EUR 250.00');
  });

  it('renders a status summary badge per status', async () => {
    await render(DashboardModernComponent, {
      inputs: { metrics, transactions },
      providers: TEST_PROVIDERS,
    });
    expect(screen.getByText(/Paid · 1/)).toBeInTheDocument();
    expect(screen.getByText(/Failed · 1/)).toBeInTheDocument();
  });

  it('shows a down glyph for negative deltas', async () => {
    await render(DashboardModernComponent, {
      inputs: { metrics, transactions },
      providers: TEST_PROVIDERS,
    });
    const downs = document.querySelectorAll('.kpi__delta--down');
    expect(downs.length).toBeGreaterThan(0);
    expect(document.body.textContent).toContain('↓');
    expect(document.body.textContent).toContain('3.1%');
  });
});

describe('DashboardObsidianComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders KPI cards', async () => {
    await render(DashboardObsidianComponent, {
      inputs: { metrics, transactions },
      providers: TEST_PROVIDERS,
    });
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders exactly one dark anchor card', async () => {
    await render(DashboardObsidianComponent, {
      inputs: { metrics, transactions },
      providers: TEST_PROVIDERS,
    });
    const featured = document.querySelectorAll('.kpi--featured');
    expect(featured.length).toBe(1);
    expect(featured[0].textContent).toContain('Orders');
  });

  it('renders status as a badge per row', async () => {
    await render(DashboardObsidianComponent, {
      inputs: { metrics, transactions },
      providers: TEST_PROVIDERS,
    });
    expect(screen.getByText('Paid')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('formats amounts in monospace cells', async () => {
    await render(DashboardObsidianComponent, {
      inputs: { metrics, transactions },
      providers: TEST_PROVIDERS,
    });
    expect(document.body.textContent).toContain('£1,284.00');
    const mono = document.querySelectorAll('.dbo__td--mono');
    expect(mono.length).toBeGreaterThan(0);
  });

  it('renders the transaction reference and customer', async () => {
    await render(DashboardObsidianComponent, {
      inputs: { metrics, transactions },
      providers: TEST_PROVIDERS,
    });
    expect(screen.getByText('INV-10423')).toBeInTheDocument();
    expect(screen.getByText('Atlas Freight Ltd')).toBeInTheDocument();
  });
});

describe('DashboardEvoluteComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders KPI cards with labels', async () => {
    await render(DashboardEvoluteComponent, {
      inputs: { metrics, transactions },
      providers: TEST_PROVIDERS,
    });
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
  });

  it('renders a synthesis insight band', async () => {
    await render(DashboardEvoluteComponent, {
      inputs: { metrics, transactions },
      providers: TEST_PROVIDERS,
    });
    expect(document.querySelector('.de__insight')).not.toBeNull();
  });

  it('renders a status summary with counts', async () => {
    await render(DashboardEvoluteComponent, {
      inputs: { metrics, transactions },
      providers: TEST_PROVIDERS,
    });
    expect(screen.getByText(/Paid · 1/)).toBeInTheDocument();
    expect(screen.getByText(/Failed · 1/)).toBeInTheDocument();
  });

  it('renders transaction rows', async () => {
    await render(DashboardEvoluteComponent, {
      inputs: { metrics, transactions },
      providers: TEST_PROVIDERS,
    });
    expect(screen.getByText('INV-10423')).toBeInTheDocument();
    expect(screen.getByText('Atlas Freight Ltd')).toBeInTheDocument();
  });
});
