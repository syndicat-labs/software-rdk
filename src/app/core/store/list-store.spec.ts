import { createListStore } from './list-store';
import { fromUnknown } from '../errors/errors.factory';
import { ErrorCode } from '../errors/errors.types';

interface Row {
  readonly id: string;
  readonly label: string;
  readonly amount?: number;
}

const rows: Row[] = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
];

describe('createListStore', () => {
  describe('error paths', () => {
    it('records an error and stops loading', () => {
      const store = createListStore<Row>();
      store.begin();
      store.fail(fromUnknown(new Error('network down')));

      expect(store.error()?.code).toBe(ErrorCode.INFRASTRUCTURE_UNKNOWN);
      expect(store.loading()).toBe(false);
    });

    it('retains items when a refresh fails', () => {
      // Replacing a populated table with an error wipes context the user may
      // still need; a failed refresh is not the data ceasing to exist.
      const store = createListStore<Row>();
      store.succeed(rows);
      store.begin();
      store.fail(fromUnknown(new Error('refresh failed')));

      expect(store.items()).toHaveLength(2);
      expect(store.error()).not.toBeNull();
    });

    it('clears a previous error when a new load begins', () => {
      const store = createListStore<Row>();
      store.fail(fromUnknown(new Error('first')));
      store.begin();

      expect(store.error()).toBeNull();
      expect(store.loading()).toBe(true);
    });

    it('clears the error on a successful load', () => {
      const store = createListStore<Row>();
      store.fail(fromUnknown(new Error('boom')));
      store.succeed(rows);

      expect(store.error()).toBeNull();
      expect(store.items()).toHaveLength(2);
    });

    it('setError also stops loading', () => {
      const store = createListStore<Row>();
      store.setLoading(true);
      store.setError(fromUnknown(new Error('x')));

      expect(store.loading()).toBe(false);
    });

    it('removeItem is a no-op for an unknown id', () => {
      const store = createListStore<Row>();
      store.succeed(rows);
      store.removeItem('does-not-exist');

      expect(store.items()).toHaveLength(2);
    });

    it('updateItem is a no-op for an unknown id', () => {
      const store = createListStore<Row>();
      store.succeed(rows);
      store.updateItem('nope', { label: 'Changed' });

      expect(store.items().map((r) => r.label)).toEqual(['Alpha', 'Beta']);
    });
  });

  describe('isEmpty', () => {
    it('is false before any load, even with no items', () => {
      // "Not fetched yet" and "fetched, nothing there" are different states;
      // rendering an empty state for the former tells the user the wrong thing.
      const store = createListStore<Row>();

      expect(store.items()).toHaveLength(0);
      expect(store.loaded()).toBe(false);
      expect(store.isEmpty()).toBe(false);
    });

    it('is true once a load completes with no items', () => {
      const store = createListStore<Row>();
      store.succeed([]);

      expect(store.isEmpty()).toBe(true);
    });

    it('is false once a load completes with items', () => {
      const store = createListStore<Row>();
      store.succeed(rows);

      expect(store.isEmpty()).toBe(false);
    });

    it('is true after a load that fails with nothing previously held', () => {
      const store = createListStore<Row>();
      store.begin();
      store.fail(fromUnknown(new Error('x')));

      expect(store.isEmpty()).toBe(true);
    });
  });

  describe('happy path', () => {
    it('starts empty and idle', () => {
      const store = createListStore<Row>();

      expect(store.items()).toEqual([]);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.loaded()).toBe(false);
    });

    it('accepts initial items without marking itself loaded', () => {
      const store = createListStore<Row>({ initial: rows });

      expect(store.items()).toHaveLength(2);
      expect(store.loaded()).toBe(false);
    });

    it('adds, updates and removes by id', () => {
      const store = createListStore<Row>();
      store.succeed(rows);

      store.addItem({ id: 'c', label: 'Gamma' });
      expect(store.items()).toHaveLength(3);

      store.updateItem('c', { label: 'Gamma prime' });
      expect(store.items().find((r) => r.id === 'c')?.label).toBe('Gamma prime');

      store.removeItem('a');
      expect(store.items().map((r) => r.id)).toEqual(['b', 'c']);
    });

    it('honours a custom identity function', () => {
      interface Keyed {
        readonly reference: string;
        readonly label: string;
      }
      const store = createListStore<Keyed>({ idOf: (item) => item.reference });
      store.succeed([
        { reference: 'TXN-1', label: 'One' },
        { reference: 'TXN-2', label: 'Two' },
      ]);

      store.removeItem('TXN-1');
      expect(store.items().map((i) => i.reference)).toEqual(['TXN-2']);
    });

    it('does not alias the array it was given', () => {
      const source: Row[] = [{ id: 'a', label: 'Alpha' }];
      const store = createListStore<Row>();
      store.succeed(source);
      source.push({ id: 'b', label: 'Beta' });

      expect(store.items()).toHaveLength(1);
    });

    it('reset returns it to the pre-load state', () => {
      const store = createListStore<Row>();
      store.succeed(rows);
      store.fail(fromUnknown(new Error('x')));
      store.reset();

      expect(store.items()).toEqual([]);
      expect(store.error()).toBeNull();
      expect(store.loading()).toBe(false);
      expect(store.loaded()).toBe(false);
      expect(store.isEmpty()).toBe(false);
    });
  });
});
