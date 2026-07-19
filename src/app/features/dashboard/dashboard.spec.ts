import { render, screen, fireEvent } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { convertToParamMap } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
import { APP_CONFIG } from '../../core/config/app-config.token';
import type { AppConfig } from '../../core/config/app-config.model';

const config = {
  api: { baseUrl: '' },
  auth: { baseUrl: '' },
} as unknown as AppConfig;

/** Drives the scenario hook the component reads from the query string. */
function routeWith(scenario: string | null) {
  return {
    provide: ActivatedRoute,
    useValue: {
      queryParamMap: of(convertToParamMap(scenario ? { dashboard: scenario } : {})),
      paramMap: of(convertToParamMap({})),
      snapshot: { queryParamMap: convertToParamMap({}) },
    },
  };
}

async function renderDashboard(scenario: string | null = null) {
  return render(DashboardComponent, {
    providers: [
      provideRouter([]),
      routeWith(scenario),
      { provide: APP_CONFIG, useValue: config },
      DashboardService,
    ],
  });
}

describe('DashboardComponent', () => {
  describe('error path', () => {
    it('surfaces a failed load rather than rendering an empty dashboard', async () => {
      const { fixture } = await renderDashboard('error');
      await new Promise((r) => setTimeout(r, 400));
      fixture.detectChanges();

      expect(document.querySelector('rdk-error-display')).toBeInTheDocument();
    });

    it('offers no retry affordance for a non-retryable error', async () => {
      // fromUnknown() marks unknown failures non-retryable, and ErrorDisplay
      // only renders its action when error.retryable is true. Offering "try
      // again" for something that cannot succeed is worse than offering
      // nothing, so this asserts the absence deliberately.
      const { fixture } = await renderDashboard('error');
      await new Promise((r) => setTimeout(r, 400));
      fixture.detectChanges();

      expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
    });

    it('clears the error when a later load succeeds', async () => {
      const { fixture } = await renderDashboard('error');
      await new Promise((r) => setTimeout(r, 400));
      fixture.detectChanges();
      expect(document.querySelector('rdk-error-display')).toBeInTheDocument();

      const service = fixture.debugElement.injector.get(DashboardService);
      jest.spyOn(service, 'load').mockReturnValue(
        of({
          kpis: [
            {
              id: 'k1',
              label: 'Settled value',
              value: '£1.00',
              delta: '1%',
              direction: 'up' as const,
              favourable: true,
            },
          ],
          settlements: [],
        }),
      );

      fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
      expect(await screen.findByText('Settled value')).toBeInTheDocument();
      expect(document.querySelector('rdk-error-display')).not.toBeInTheDocument();
    });
  });

  describe('empty path', () => {
    it('shows the empty state when a load returns nothing', async () => {
      await renderDashboard('empty');
      expect(await screen.findByText(/no settlements yet/i)).toBeInTheDocument();
    });

    it('does not claim emptiness before the first load resolves', async () => {
      // "Not fetched yet" and "fetched, nothing there" are different states.
      await renderDashboard('empty');
      expect(screen.queryByText(/no settlements yet/i)).not.toBeInTheDocument();
    });
  });

  describe('happy path', () => {
    it('renders the KPI band', async () => {
      await renderDashboard();
      expect(await screen.findByText('Settled value')).toBeInTheDocument();
      expect(screen.getByText('£48,209.55')).toBeInTheDocument();
    });

    it('renders settlements once loaded', async () => {
      await renderDashboard();
      expect(await screen.findByText('Northwind Trading')).toBeInTheDocument();
      expect(screen.getByText('TXN-9F42-08C1')).toBeInTheDocument();
      expect(screen.getByText(/5 shown/)).toBeInTheDocument();
    });

    it('marks exactly one KPI as the emphasis surface', async () => {
      // Obsidian's emphasisSurfaceBudget is 1; more than one anchor would
      // violate the tightest declaration among registered languages.
      const { fixture } = await renderDashboard();
      await screen.findByText('Settled value');
      fixture.detectChanges();
      expect(document.querySelectorAll('.kpi--anchor')).toHaveLength(1);
    });

    it('gives each KPI delta a non-colour cue', async () => {
      // WCAG 1.4.1: colour may lead, but never travel alone.
      const { fixture } = await renderDashboard();
      await screen.findByText('Settled value');
      fixture.detectChanges();

      const deltas = document.querySelectorAll('.kpi__delta');
      expect(deltas.length).toBeGreaterThan(0);
      for (const delta of Array.from(deltas)) {
        expect(delta.querySelector('.kpi__arrow')?.textContent?.trim()).toMatch(/[↑↓→]/);
      }
    });

    it('exposes each KPI meter to assistive technology', async () => {
      const { fixture } = await renderDashboard();
      await screen.findByText('Settled value');
      fixture.detectChanges();

      const meters = screen.getAllByRole('progressbar');
      expect(meters.length).toBeGreaterThan(0);
      for (const meter of meters) {
        expect(meter).toHaveAttribute('aria-valuenow');
        expect(meter).toHaveAttribute('aria-label');
      }
    });

    it('renders no heading of its own — the shell owns the page h1', async () => {
      // Two h1 elements on one page breaks the document outline. The shell
      // renders the route title, so this surface must not add another.
      const { fixture } = await renderDashboard();
      await screen.findByText('Settled value');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('h1')).toHaveLength(0);
    });

    it('disables refresh while a load is in flight', async () => {
      await renderDashboard();
      const refresh = await screen.findByRole('button', { name: /refresh/i });
      fireEvent.click(refresh);
      expect(refresh).toBeDisabled();
    });
  });
});
