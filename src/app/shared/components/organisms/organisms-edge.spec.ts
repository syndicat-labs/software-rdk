import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { render } from '@testing-library/angular';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { AccordionComponent } from './accordion/accordion.component';
import { TabsComponent } from './tabs/tabs.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { ComboboxComponent } from './combobox/combobox.component';
import { ModalComponent, ModalSize } from './modal/modal.component';
import { DataTableComponent } from './data-table/data-table.component';

describe('AccordionComponent', () => {
  it('accepts items and the multiple flag', () => {
    const component = new AccordionComponent();
    component.items = [{ header: 'One', content: 'First' }];
    component.multiple = true;
    expect(component.items).toHaveLength(1);
    expect(component.multiple).toBe(true);
  });
});

describe('TabsComponent (PrimeNG v21 value handling)', () => {
  it('ignores an undefined value', () => {
    const component = new TabsComponent();
    const seen: number[] = [];
    component.tabChange.subscribe((v) => seen.push(v));
    component.onValueChange(undefined);
    expect(seen).toEqual([]);
  });

  it('accepts a numeric value', () => {
    const component = new TabsComponent();
    const seen: number[] = [];
    component.tabChange.subscribe((v) => seen.push(v));
    component.onValueChange(2);
    expect(component.activeIndex).toBe(2);
    expect(seen).toEqual([2]);
  });

  it('coerces a string value to a number', () => {
    const component = new TabsComponent();
    const seen: number[] = [];
    component.tabChange.subscribe((v) => seen.push(v));
    component.onValueChange('3');
    expect(component.activeIndex).toBe(3);
    expect(seen).toEqual([3]);
  });
});

describe('DatePickerComponent', () => {
  interface Internals {
    onValueChange(v: Date | null): void;
    onTouched(): void;
  }

  it('propagates value changes to the form and consumers', () => {
    const component = new DatePickerComponent();
    const internals = component as unknown as Internals;
    const seen: (Date | null)[] = [];
    component.valueChange.subscribe((v) => seen.push(v));
    const onChange = jest.fn();
    component.registerOnChange(onChange);
    const date = new Date('2026-07-18T00:00:00Z');
    internals.onValueChange(date);
    expect(onChange).toHaveBeenCalledWith(date);
    expect(seen).toEqual([date]);
  });

  it('supports writeValue, touched and disabled state', () => {
    const component = new DatePickerComponent();
    const internals = component as unknown as Internals;
    component.writeValue(null);
    expect(component.value).toBeNull();
    const touched = jest.fn();
    component.registerOnTouched(touched);
    internals.onTouched();
    expect(touched).toHaveBeenCalled();
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
  });

  it('uses safe no-op callbacks before registration', () => {
    const internals = new DatePickerComponent() as unknown as Internals;
    expect(() => internals.onValueChange(null)).not.toThrow();
    expect(() => internals.onTouched()).not.toThrow();
  });
});

describe('ComboboxComponent', () => {
  interface Internals {
    onSearch(event: { query: string }): void;
    onValueChange(v: unknown): void;
    onTouched(): void;
  }

  it('emits searched for an autocomplete query', () => {
    const component = new ComboboxComponent();
    const internals = component as unknown as Internals;
    const queries: string[] = [];
    component.searched.subscribe((q) => queries.push(q));
    internals.onSearch({ query: 'ang' });
    expect(queries).toEqual(['ang']);
  });

  it('emits selected for a value but not for null', () => {
    const component = new ComboboxComponent();
    const internals = component as unknown as Internals;
    const selected: unknown[] = [];
    component.selected.subscribe((v) => selected.push(v));
    const onChange = jest.fn();
    component.registerOnChange(onChange);
    internals.onValueChange({ label: 'Angular', value: 'ng' });
    internals.onValueChange(null);
    expect(selected).toHaveLength(1);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('supports writeValue, touched and disabled state', () => {
    const component = new ComboboxComponent();
    const internals = component as unknown as Internals;
    component.writeValue({ label: 'A', value: 'a' });
    expect(component.value).toEqual({ label: 'A', value: 'a' });
    const touched = jest.fn();
    component.registerOnTouched(touched);
    internals.onTouched();
    expect(touched).toHaveBeenCalled();
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
  });

  it('uses safe no-op callbacks before registration', () => {
    const internals = new ComboboxComponent() as unknown as Internals;
    expect(() => internals.onValueChange(null)).not.toThrow();
    expect(() => internals.onTouched()).not.toThrow();
  });
});

describe('ModalComponent', () => {
  it('maps every size to a width', () => {
    const component = new ModalComponent();
    const internals = component as unknown as { readonly modalWidth: string };
    const sizes: ModalSize[] = ['sm', 'md', 'lg', 'xl', 'full'];
    for (const size of sizes) {
      component.size = size;
      expect(internals.modalWidth).toBeTruthy();
    }
  });

  it('exposes visibility outputs', () => {
    const component = new ModalComponent();
    const closed = jest.fn();
    component.closed.subscribe(closed);
    component.closed.emit();
    expect(closed).toHaveBeenCalled();
  });
});

describe('CVA organisms register as value accessors', () => {
  const primeng = [provideAnimations(), providePrimeNG({ theme: { preset: Lara } })];

  it('rdk-date-picker binds via ngModel', async () => {
    await render('<rdk-date-picker [(ngModel)]="v" />', {
      imports: [DatePickerComponent, FormsModule],
      providers: primeng,
      componentProperties: { v: null },
    });
    expect(document.querySelector('rdk-date-picker')).toBeInTheDocument();
  });

  it('rdk-combobox binds via ngModel', async () => {
    await render('<rdk-combobox [(ngModel)]="v" [suggestions]="[]" />', {
      imports: [ComboboxComponent, FormsModule],
      providers: primeng,
      componentProperties: { v: null },
    });
    expect(document.querySelector('rdk-combobox')).toBeInTheDocument();
  });
});

describe('DataTableComponent', () => {
  it('holds columns and rows and emits row clicks', () => {
    const component = new DataTableComponent<{ a: number }>();
    component.columns = [{ field: 'a', header: 'A' } as never];
    component.rows = [{ a: 1 }];
    const clicked: { a: number }[] = [];
    component.rowClick.subscribe((r) => clicked.push(r));
    component.rowClick.emit({ a: 1 });
    expect(component.rows).toHaveLength(1);
    expect(clicked).toEqual([{ a: 1 }]);
  });
});
