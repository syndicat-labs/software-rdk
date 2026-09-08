import { TestBed } from '@angular/core/testing';
import { DashboardStore } from './dashboard.store';
import { fromHttpError } from '../../core/errors/errors.factory';
import { HttpErrorResponse } from '@angular/common/http';

describe('DashboardStore', () => {
  let store: DashboardStore;

  beforeEach(() => {
    TestBed.resetTestingModule();
    store = TestBed.inject(DashboardStore);
  });

  describe('initial state', () => {
    it('starts empty, not loading, no error, not loaded', () => {
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.items()).toEqual([]);
      expect(store.metrics()).toEqual([]);
      expect(store.isEmpty()).toBe(false);
      expect(store.loaded()).toBe(false);
    });
  });

  describe('load()', () => {
    it('populates metrics and transactions and clears loading', () => {
      store.load();
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.metrics().length).toBe(4);
      expect(store.items().length).toBeGreaterThan(0);
      expect(store.loaded()).toBe(true);
      expect(store.isEmpty()).toBe(false);
    });

    it('marks loading during the load and clears error', () => {
      store.setError(fromHttpError(new HttpErrorResponse({ status: 500 })));
      expect(store.error()).not.toBeNull();

      store.load();
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
    });
  });

  describe('error handling', () => {
    it('setError stores a typed error', () => {
      const err = fromHttpError(new HttpErrorResponse({ status: 503 }));
      store.setError(err);
      expect(store.error()).not.toBeNull();
      expect(store.error()?.httpStatus).toBe(503);
    });

    it('reset() clears loading, error, items and loaded flag', () => {
      store.load();
      store.setError(fromHttpError(new HttpErrorResponse({ status: 400 })));
      store.reset();

      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.items()).toEqual([]);
      expect(store.metrics()).toEqual([]);
      expect(store.loaded()).toBe(false);
    });
  });

  describe('list operations', () => {
    it('addItem prepends to the list', () => {
      store.setItems([{ id: 'a' } as never]);
      store.addItem({ id: 'b' } as never);
      expect(store.items()[0].id).toBe('b');
    });

    it('removeItem filters out by id', () => {
      store.setItems([
        { id: 'a' } as never,
        { id: 'b' } as never,
        { id: 'c' } as never,
      ]);
      store.removeItem('b');
      expect(store.items().map((i) => i.id)).toEqual(['a', 'c']);
    });

    it('removeItem with unknown id leaves the list unchanged', () => {
      store.setItems([{ id: 'a' } as never]);
      store.removeItem('zzz');
      expect(store.items().length).toBe(1);
    });
  });

  describe('setLoading', () => {
    it('drives the loading signal', () => {
      store.setLoading(true);
      expect(store.loading()).toBe(true);
      store.setLoading(false);
      expect(store.loading()).toBe(false);
    });
  });
});
