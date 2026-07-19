import { Injectable, inject } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { APP_CONFIG } from '../../core/config/app-config.token';
import type { DashboardSnapshot } from './dashboard.model';

/**
 * Supplies the dashboard snapshot.
 *
 * There is no backend yet (IMPLEMENTATION-PLAN L3), so this returns a fixture
 * behind the same Observable contract a real endpoint would use — the component
 * and store are written against the shape they will keep, and swapping in
 * `ApiClient` is a change here only.
 *
 * The fixture is not "happy path only": `?dashboard=empty` and `?dashboard=error`
 * make the empty and failure states reachable in a running app, because those
 * states are the ones that rot when nobody can see them.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly config = inject(APP_CONFIG);

  private static readonly LATENCY_MS = 320;

  load(scenario: string | null = null): Observable<DashboardSnapshot> {
    if (scenario === 'error') {
      return throwError(() => new Error('Dashboard feed unavailable')).pipe(
        delay(DashboardService.LATENCY_MS),
      );
    }
    if (scenario === 'empty') {
      return of({ kpis: [], settlements: [] }).pipe(delay(DashboardService.LATENCY_MS));
    }
    return of(DashboardService.FIXTURE).pipe(delay(DashboardService.LATENCY_MS));
  }

  /** True once a real API origin is configured; L3 flips this over. */
  get isLive(): boolean {
    return Boolean(this.config.api.baseUrl);
  }

  private static readonly FIXTURE: DashboardSnapshot = {
    kpis: [
      {
        id: 'settled-value',
        label: 'Settled value',
        value: '£48,209.55',
        delta: '4.8%',
        direction: 'up',
        favourable: true,
        progress: 72,
        caption: 'Against £67,000 target',
      },
      {
        id: 'pending-value',
        label: 'Awaiting settlement',
        value: '£6,140.00',
        delta: '2.1%',
        direction: 'up',
        favourable: false,
        progress: 18,
        caption: '12 payments in flight',
      },
      {
        id: 'failure-rate',
        label: 'Failure rate',
        value: '0.9%',
        delta: '0.4pp',
        direction: 'down',
        favourable: true,
        progress: 9,
        caption: 'Rolling 7 days',
      },
      {
        id: 'counterparties',
        label: 'Active counterparties',
        value: '38',
        delta: '0',
        direction: 'flat',
        favourable: true,
        caption: 'No change this week',
      },
    ],
    settlements: [
      {
        id: 's1',
        reference: 'TXN-9F42-08C1',
        counterparty: 'Northwind Trading',
        amount: '£12,400.00',
        signedAmount: '+ £12,400.00',
        state: 'settled',
        receivedAt: '12 minutes ago',
      },
      {
        id: 's2',
        reference: 'TXN-9F41-77B4',
        counterparty: 'Halcyon Freight',
        amount: '£3,180.00',
        signedAmount: '+ £3,180.00',
        state: 'settled',
        receivedAt: '48 minutes ago',
      },
      {
        id: 's3',
        reference: 'TXN-9F40-2D19',
        counterparty: 'Meridian Supply',
        amount: '£980.00',
        signedAmount: '− £980.00',
        state: 'failed',
        receivedAt: '2 hours ago',
      },
      {
        id: 's4',
        reference: 'TXN-9F3E-A007',
        counterparty: 'Cobalt Logistics',
        amount: '£6,140.00',
        signedAmount: '+ £6,140.00',
        state: 'pending',
        receivedAt: '3 hours ago',
      },
      {
        id: 's5',
        reference: 'TXN-9F3C-4410',
        counterparty: 'Aster Materials',
        amount: '£24,509.55',
        signedAmount: '+ £24,509.55',
        state: 'settled',
        receivedAt: 'Yesterday',
      },
    ],
  };
}
