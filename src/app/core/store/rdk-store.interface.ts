import { Signal } from '@angular/core';
import { AppError } from '../errors/errors.types';

export interface RdkStore {
  readonly loading: Signal<boolean>;
  readonly error: Signal<AppError | null>;
  setLoading(loading: boolean): void;
  setError(error: AppError): void;
  reset(): void;
}

export interface RdkListStore<T> extends RdkStore {
  readonly items: Signal<T[]>;
  readonly isEmpty: Signal<boolean>;
  setItems(items: T[]): void;
  addItem(item: T): void;
  removeItem(id: string): void;
}

export interface RdkDetailStore<T> extends RdkStore {
  readonly selected: Signal<T | null>;
  setSelected(item: T | null): void;
}
