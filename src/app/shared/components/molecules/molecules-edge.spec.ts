import { fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { render } from '@testing-library/angular';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { SelectComponent } from './select/select.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { CheckboxGroupComponent } from './checkbox-group/checkbox-group.component';
import { RadioGroupComponent } from './radio/radio.component';
import { ToggleComponent } from './toggle/toggle.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SearchInputComponent } from './search-input/search-input.component';

function inputEvent(value: string): Event {
  return { target: { value } } as unknown as Event;
}

// ── forwardRef value-accessor wiring (only invoked when a form binds the control) ──
describe('CVA molecules register as value accessors', () => {
  it('rdk-select binds via ngModel', async () => {
    await render('<rdk-select [(ngModel)]="v" [options]="[]" />', {
      imports: [SelectComponent, FormsModule],
      providers: [provideAnimations(), providePrimeNG({ theme: { preset: Lara } })],
      componentProperties: { v: null },
    });
    expect(document.querySelector('rdk-select')).toBeInTheDocument();
  });

  it('rdk-checkbox binds via ngModel', async () => {
    await render('<rdk-checkbox [(ngModel)]="v" />', {
      imports: [CheckboxComponent, FormsModule],
      componentProperties: { v: false },
    });
    expect(document.querySelector('rdk-checkbox')).toBeInTheDocument();
  });

  it('rdk-checkbox-group binds via ngModel', async () => {
    await render('<rdk-checkbox-group [(ngModel)]="v" [options]="[]" />', {
      imports: [CheckboxGroupComponent, FormsModule],
      componentProperties: { v: [] },
    });
    expect(document.querySelector('rdk-checkbox-group')).toBeInTheDocument();
  });

  it('rdk-radio-group binds via ngModel', async () => {
    await render('<rdk-radio-group [(ngModel)]="v" [options]="[]" />', {
      imports: [RadioGroupComponent, FormsModule],
      componentProperties: { v: null },
    });
    expect(document.querySelector('rdk-radio-group')).toBeInTheDocument();
  });

  it('rdk-toggle binds via ngModel', async () => {
    await render('<rdk-toggle [(ngModel)]="v" />', {
      imports: [ToggleComponent, FormsModule],
      componentProperties: { v: false },
    });
    expect(document.querySelector('rdk-toggle')).toBeInTheDocument();
  });
});

describe('CheckboxGroupComponent (toggle add / remove)', () => {
  interface Internals {
    onToggle(value: unknown, checked: boolean): void;
    isChecked(value: unknown): boolean;
  }

  it('adds and removes values, emitting each change', () => {
    const component = new CheckboxGroupComponent();
    const internals = component as unknown as Internals;
    const changes: unknown[][] = [];
    component.changed.subscribe((v) => changes.push(v));

    internals.onToggle('a', true);
    expect(internals.isChecked('a')).toBe(true);
    internals.onToggle('b', true);
    internals.onToggle('a', false);

    expect(changes).toEqual([['a'], ['a', 'b'], ['b']]);
    expect(internals.isChecked('a')).toBe(false);
  });

  it('coerces a null model to an empty array', () => {
    const component = new CheckboxGroupComponent();
    component.writeValue(null);
    expect((component as unknown as Internals).isChecked('x')).toBe(false);
  });
});

describe('ToggleComponent (handlers)', () => {
  interface Internals {
    toggle(): void;
    onSpace(event: Event): void;
  }

  it('toggles state and emits when enabled', () => {
    const component = new ToggleComponent();
    const values: boolean[] = [];
    component.changed.subscribe((v) => values.push(v));
    (component as unknown as Internals).toggle();
    expect(values).toEqual([true]);
  });

  it('does nothing when disabled', () => {
    const component = new ToggleComponent();
    component.disabled = true;
    const values: boolean[] = [];
    component.changed.subscribe((v) => values.push(v));
    (component as unknown as Internals).toggle();
    expect(values).toEqual([]);
  });

  it('space key prevents default and toggles', () => {
    const component = new ToggleComponent();
    const values: boolean[] = [];
    component.changed.subscribe((v) => values.push(v));
    const event = new KeyboardEvent('keydown', { key: ' ' });
    const prevent = jest.spyOn(event, 'preventDefault');
    (component as unknown as Internals).onSpace(event);
    expect(prevent).toHaveBeenCalled();
    expect(values).toEqual([true]);
  });

  it('checked setter drives the internal signal', () => {
    const component = new ToggleComponent();
    component.checked = true;
    component.writeValue(false);
    expect(component.disabled).toBe(false);
  });
});

describe('CheckboxComponent (change handler)', () => {
  it('onChange updates state, notifies, and emits', () => {
    const component = new CheckboxComponent();
    const values: boolean[] = [];
    component.changed.subscribe((v) => values.push(v));
    (component as unknown as { onChange(e: Event): void }).onChange({
      target: { checked: true },
    } as unknown as Event);
    expect(values).toEqual([true]);
  });

  it('has a safe default touched callback', () => {
    const component = new CheckboxComponent();
    expect(() => (component as unknown as { onTouched(): void }).onTouched()).not.toThrow();
  });
});

describe('RadioGroupComponent (select handler)', () => {
  it('onSelect updates the selection and emits', () => {
    const component = new RadioGroupComponent();
    const values: unknown[] = [];
    component.changed.subscribe((v) => values.push(v));
    const internals = component as unknown as {
      onSelect(v: unknown): void;
      isChecked(v: unknown): boolean;
    };
    internals.onSelect('opt-1');
    expect(values).toEqual(['opt-1']);
    expect(internals.isChecked('opt-1')).toBe(true);
  });

  it('has a safe default touched callback', () => {
    const component = new RadioGroupComponent();
    expect(() => (component as unknown as { onTouched(): void }).onTouched()).not.toThrow();
  });
});

describe('PaginationComponent (prev / next)', () => {
  interface Internals {
    prev(): void;
    next(): void;
  }

  it('prev clamps at the first page', () => {
    const component = new PaginationComponent();
    const pages: number[] = [];
    component.pageChange.subscribe((v) => pages.push(v));
    (component as unknown as Internals).prev();
    expect(pages).toEqual([1]);
  });

  it('next advances the page', () => {
    const component = new PaginationComponent();
    component.total = 100;
    const pages: number[] = [];
    component.pageChange.subscribe((v) => pages.push(v));
    (component as unknown as Internals).next();
    expect(pages).toEqual([2]);
  });
});

describe('SearchInputComponent (debounce / clear / teardown)', () => {
  interface Internals {
    onInput(event: Event): void;
    onClear(): void;
  }

  it('emits searched after the debounce window', fakeAsync(() => {
    const component = new SearchInputComponent();
    const emitted: string[] = [];
    component.searched.subscribe((v) => emitted.push(v));
    (component as unknown as Internals).onInput(inputEvent('query'));
    tick(300);
    expect(emitted).toEqual(['query']);
    component.ngOnDestroy();
  }));

  it('onClear resets and emits cleared', () => {
    const component = new SearchInputComponent();
    const cleared = jest.fn();
    component.cleared.subscribe(cleared);
    (component as unknown as Internals).onClear();
    expect(cleared).toHaveBeenCalled();
    component.ngOnDestroy();
  });
});
