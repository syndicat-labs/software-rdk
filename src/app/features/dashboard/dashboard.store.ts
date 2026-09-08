import { computed, Injectable, signal } from '@angular/core';
import { RdkListStore } from '../../core/store/rdk-store.interface';
import { AppError } from '../../core/errors/errors.types';

export interface DashboardTransaction {
  readonly id: string;
  readonly reference: string;
  readonly customer: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: 'paid' | 'pending' | 'failed' | 'refunded';
  readonly date: string;
  readonly channel: string;
}

export interface DashboardMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly delta: number;
  readonly unit?: string;
}

/**
 * Owns the operational state for the dashboard surface: KPIs plus the
 * transactions list the operators scan at a glance. Implements the shared
 * `RdkListStore<T>` contract for the list so the feature can be driven by the
 * same store interface as the rest of the application.
 */
@Injectable({ providedIn: 'root' })
export class DashboardStore implements RdkListStore<DashboardTransaction> {
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<AppError | null>(null);
  private readonly itemsSignal = signal<DashboardTransaction[]>([]);
  private readonly metricsSignal = signal<DashboardMetric[]>([]);
  private readonly loadedSignal = signal(false);

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly items = this.itemsSignal.asReadonly();
  readonly isEmpty = computed(() => this.loadedSignal() && this.itemsSignal().length === 0);
  readonly metrics = this.metricsSignal.asReadonly();
  readonly loaded = this.loadedSignal.asReadonly();

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setError(error: AppError): void {
    this.errorSignal.set(error);
  }

  setItems(items: DashboardTransaction[]): void {
    this.itemsSignal.set(items);
    this.loadedSignal.set(true);
    this.errorSignal.set(null);
  }

  addItem(item: DashboardTransaction): void {
    this.itemsSignal.update((current) => [item, ...current]);
  }

  removeItem(id: string): void {
    this.itemsSignal.update((current) => current.filter((item) => item.id !== id));
  }

  setMetrics(metrics: DashboardMetric[]): void {
    this.metricsSignal.set(metrics);
  }

  reset(): void {
    this.itemsSignal.set([]);
    this.metricsSignal.set([]);
    this.loadingSignal.set(false);
    this.errorSignal.set(null);
    this.loadedSignal.set(false);
  }

  load(): void {
    this.setLoading(true);
    this.errorSignal.set(null);

    const metrics: DashboardMetric[] = [
      { id: 'revenue', label: 'Revenue', value: '£128,430', delta: 12.4, unit: 'MTD' },
      { id: 'orders', label: 'Orders', value: '1,284', delta: -3.1, unit: 'today' },
      { id: 'aov', label: 'Average order', value: '£94.18', delta: 2.7, unit: '30d' },
      { id: 'refunds', label: 'Refunds', value: '£1,920', delta: -0.8, unit: '30d' },
    ];

    const transactions: DashboardTransaction[] = [
      {
        id: 't-1',
        reference: 'INV-10423',
        customer: 'Atlas Freight Ltd',
        amount: 1284.0,
        currency: 'GBP',
        status: 'paid',
        date: '2026-08-30',
        channel: 'card',
      },
      {
        id: 't-2',
        reference: 'INV-10422',
        customer: 'Northwind Metals',
        amount: 459.5,
        currency: 'GBP',
        status: 'pending',
        date: '2026-08-30',
        channel: 'invoice',
      },
      {
        id: 't-3',
        reference: 'INV-10421',
        customer: 'Harbour & Howe',
        amount: 77.0,
        currency: 'GBP',
        status: 'failed',
        date: '2026-08-29',
        channel: 'card',
      },
      {
        id: 't-4',
        reference: 'INV-10420',
        customer: 'Quayside Trading',
        amount: 2040.0,
        currency: 'GBP',
        status: 'paid',
        date: '2026-08-29',
        channel: 'bacs',
      },
      {
        id: 't-5',
        reference: 'INV-10419',
        customer: 'Stellar Supply Co',
        amount: 312.25,
        currency: 'GBP',
        status: 'refunded',
        date: '2026-08-28',
        channel: 'card',
      },
    ];

    this.setMetrics(metrics);
    this.setItems(transactions);
    this.setLoading(false);
  }
}
