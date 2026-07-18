# NgRx Optional Integration Guide

## When to migrate

Migrate from Angular Signals stores to NgRx when:
- A single feature requires more than 6 signal stores
- State must be shared across lazy-loaded routes in real-time
- Complex async operations need cancellation (switchMap) centrally managed
- Your team already has an NgRx standard and wants DevTools time-travel debugging

## Prerequisites

```bash
npm install @ngrx/store @ngrx/effects @ngrx/store-devtools
```

Mark these as optional peer deps in `package.json`:

```json
{
  "peerDependenciesMeta": {
    "@ngrx/store": { "optional": true },
    "@ngrx/effects": { "optional": true }
  }
}
```

## Step 1: Add NgRx providers in app.config.ts

```typescript
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    // existing providers...
    provideStore({}),
    provideEffects([]),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.environment.production }),
  ],
};
```

## Step 2: Implement RdkListStore with NgRx

The `RdkListStore<T>` interface (in `core/store/rdk-store.interface.ts`) is implemented by both the Signal-based store and the NgRx implementation. Components depend on the interface, not the concrete class.

```typescript
// features/example/store/example.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ExampleItem } from '../example.store';
import { AppError } from '../../../core/errors/errors.types';

export const ExampleActions = createActionGroup({
  source: 'Example',
  events: {
    'Load Items': emptyProps(),
    'Load Items Success': props<{ items: ExampleItem[] }>(),
    'Load Items Failure': props<{ error: AppError }>(),
    'Add Item Success': props<{ item: ExampleItem }>(),
    'Remove Item': props<{ id: string }>(),
  },
});
```

```typescript
// features/example/store/example.reducer.ts
import { createFeature, createReducer, on } from '@ngrx/store';
import { ExampleItem } from '../example.store';
import { AppError } from '../../../core/errors/errors.types';
import { ExampleActions } from './example.actions';

interface ExampleState {
  items: ExampleItem[];
  loading: boolean;
  error: AppError | null;
}

const initialState: ExampleState = { items: [], loading: false, error: null };

export const exampleFeature = createFeature({
  name: 'example',
  reducer: createReducer(
    initialState,
    on(ExampleActions.loadItems, (state) => ({ ...state, loading: true, error: null })),
    on(ExampleActions.loadItemsSuccess, (state, { items }) => ({ ...state, items, loading: false })),
    on(ExampleActions.loadItemsFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(ExampleActions.addItemSuccess, (state, { item }) => ({ ...state, items: [...state.items, item] })),
    on(ExampleActions.removeItem, (state, { id }) => ({ ...state, items: state.items.filter((i) => i.id !== id) })),
  ),
});
```

```typescript
// features/example/store/example.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiClient } from '../../../core/http/api-client.service';
import { ExampleItem } from '../example.store';
import { ExampleActions } from './example.actions';
import { fromUnknown } from '../../../core/errors/errors.factory';

@Injectable()
export class ExampleEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ApiClient);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExampleActions.loadItems),
      switchMap(() =>
        this.api.get<ExampleItem[]>('/example-items').pipe(
          map((items) => ExampleActions.loadItemsSuccess({ items })),
          catchError((err: unknown) =>
            of(ExampleActions.loadItemsFailure({ error: fromUnknown(err) })),
          ),
        ),
      ),
    ),
  );
}
```

## Step 3: Replace the Signal store in the component

```typescript
// Before (Signal store)
import { ExampleStore } from '../example.store';
providers: [ExampleStore]

// After (NgRx - no local provider needed, feature state is global)
import { Store } from '@ngrx/store';
import { exampleFeature } from './store/example.reducer';
import { ExampleActions } from './store/example.actions';

readonly items = this.store.selectSignal(exampleFeature.selectItems);
readonly loading = this.store.selectSignal(exampleFeature.selectLoading);
readonly error = this.store.selectSignal(exampleFeature.selectError);

constructor(private store: Store) {}

loadItems(): void {
  this.store.dispatch(ExampleActions.loadItems());
}
```

## Signal stores remain the default

The RDK ships with Signal-based stores as the default. NgRx is an opt-in. Do not add `@ngrx/store` to the base `package.json` — it must be installed explicitly by projects that need it.
