import { computed, signal, type Signal } from '@angular/core';
import type { AppError } from '../errors/errors.types';
import type { RdkListStore } from './rdk-store.interface';

/**
 * Signal-backed reference implementation of `RdkListStore<T>`.
 *
 * The interface shipped without one, so a team cloning this toolkit received a
 * contract and nothing to instantiate — every feature had to invent its own
 * loading/error/empty handling, which is the duplication the interface existed
 * to prevent.
 *
 * Identity is resolved through `idOf` rather than assuming an `id` field, so
 * the store works for domain types that key on `reference`, `sku` or a
 * composite, without forcing a shape on the caller.
 */
export interface ListStoreOptions<T> {
  /** How a stable identity is read from an item. Defaults to `item.id`. */
  readonly idOf?: (item: T) => string;
  readonly initial?: readonly T[];
}

export interface ListStore<T> extends RdkListStore<T> {
  /** True once a load has completed at least once — distinguishes "no data yet" from "no data". */
  readonly loaded: Signal<boolean>;
  /** Replaces items and marks the store loaded, clearing any prior error. */
  succeed(items: readonly T[]): void;
  /** Records a failure without discarding the items already on screen. */
  fail(error: AppError): void;
  /** Marks a load in flight and clears the previous error. */
  begin(): void;
  updateItem(id: string, patch: Partial<T>): void;
}

export function createListStore<T>(options: ListStoreOptions<T> = {}): ListStore<T> {
  const idOf = options.idOf ?? ((item: T) => String((item as { id?: unknown }).id ?? ''));

  const items = signal<T[]>([...(options.initial ?? [])]);
  const loading = signal(false);
  const loaded = signal(false);
  const error = signal<AppError | null>(null);

  // isEmpty is only meaningful once a load has completed: before that, an empty
  // list means "not fetched", and rendering an empty state for it tells the
  // user the wrong thing.
  const isEmpty = computed(() => loaded() && items().length === 0);

  return {
    items: items.asReadonly(),
    loading: loading.asReadonly(),
    loaded: loaded.asReadonly(),
    error: error.asReadonly(),
    isEmpty,

    setItems(next: T[]): void {
      items.set([...next]);
    },

    addItem(item: T): void {
      items.update((current) => [...current, item]);
    },

    removeItem(id: string): void {
      items.update((current) => current.filter((item) => idOf(item) !== id));
    },

    updateItem(id: string, patch: Partial<T>): void {
      items.update((current) =>
        current.map((item) => (idOf(item) === id ? { ...item, ...patch } : item)),
      );
    },

    setLoading(next: boolean): void {
      loading.set(next);
    },

    setError(next: AppError): void {
      error.set(next);
      loading.set(false);
    },

    begin(): void {
      loading.set(true);
      error.set(null);
    },

    succeed(next: readonly T[]): void {
      items.set([...next]);
      loaded.set(true);
      loading.set(false);
      error.set(null);
    },

    fail(next: AppError): void {
      // Items are deliberately retained: replacing a populated table with an
      // error wipes context the user may still need, and a refresh failure is
      // not the same as the data ceasing to exist.
      error.set(next);
      loading.set(false);
      loaded.set(true);
    },

    reset(): void {
      items.set([]);
      loading.set(false);
      loaded.set(false);
      error.set(null);
    },
  };
}
