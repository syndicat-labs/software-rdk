import { SelectComponent } from './select.component';

interface SelectInternals {
  onValueChange(value: unknown): void;
  onTouched(): void;
}

describe('SelectComponent', () => {
  let component: SelectComponent;
  let internals: SelectInternals;

  beforeEach(() => {
    component = new SelectComponent();
    internals = component as unknown as SelectInternals;
  });

  it('defaults to a single, enabled select with no value', () => {
    expect(component.multiple).toBe(false);
    expect(component.disabled).toBe(false);
    expect(component.value).toBeNull();
  });

  it('writeValue stores the model value', () => {
    component.writeValue(['a', 'b']);
    expect(component.value).toEqual(['a', 'b']);
  });

  it('onValueChange emits and notifies the registered change callback', () => {
    const changed: unknown[] = [];
    component.changed.subscribe((v) => changed.push(v));
    const onChange = jest.fn();
    component.registerOnChange(onChange);
    internals.onValueChange('picked');
    expect(onChange).toHaveBeenCalledWith('picked');
    expect(changed).toEqual(['picked']);
  });

  it('invokes the registered touched callback', () => {
    const touched = jest.fn();
    component.registerOnTouched(touched);
    internals.onTouched();
    expect(touched).toHaveBeenCalled();
  });

  it('setDisabledState toggles the disabled flag', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
    component.setDisabledState(false);
    expect(component.disabled).toBe(false);
  });

  it('uses safe no-op callbacks before registration', () => {
    expect(() => internals.onValueChange('x')).not.toThrow();
    expect(() => internals.onTouched()).not.toThrow();
  });
});
