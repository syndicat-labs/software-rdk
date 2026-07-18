import { InputComponent } from './input.component';

interface InputInternals {
  onInput(event: Event): void;
  onBlur(): void;
  clear(): void;
  readonly nearLimit: boolean;
  value: { (): string };
}

function inputEvent(value: string): Event {
  return { target: { value } } as unknown as Event;
}

describe('InputComponent', () => {
  let component: InputComponent;
  let internals: InputInternals;

  beforeEach(() => {
    component = new InputComponent();
    internals = component as unknown as InputInternals;
  });

  it('onInput updates the value signal and notifies change', () => {
    const onChange = jest.fn();
    component.registerOnChange(onChange);
    internals.onInput(inputEvent('hello'));
    expect(onChange).toHaveBeenCalledWith('hello');
    expect(internals.value()).toBe('hello');
  });

  it('onBlur notifies touched', () => {
    const onTouched = jest.fn();
    component.registerOnTouched(onTouched);
    internals.onBlur();
    expect(onTouched).toHaveBeenCalled();
  });

  it('clear resets the value, notifies change, and emits cleared', () => {
    const onChange = jest.fn();
    component.registerOnChange(onChange);
    const cleared = jest.fn();
    component.cleared.subscribe(cleared);
    component.writeValue('abc');
    internals.clear();
    expect(onChange).toHaveBeenCalledWith('');
    expect(internals.value()).toBe('');
    expect(cleared).toHaveBeenCalled();
  });

  it('clear focuses the input element when present', () => {
    const focus = jest.fn();
    (component as unknown as { inputEl: unknown }).inputEl = { nativeElement: { focus } };
    internals.clear();
    expect(focus).toHaveBeenCalled();
  });

  it('nearLimit reflects the maxLength threshold', () => {
    expect(internals.nearLimit).toBe(false);
    component.maxLength = 10;
    component.writeValue('123456789');
    expect(internals.nearLimit).toBe(true);
    component.maxLength = 100;
    component.writeValue('short');
    expect(internals.nearLimit).toBe(false);
  });

  it('writeValue coerces null to empty string', () => {
    component.writeValue(null);
    expect(internals.value()).toBe('');
  });

  it('setDisabledState toggles disabled', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
  });

  it('uses safe no-op callbacks before registration', () => {
    expect(() => internals.onInput(inputEvent('x'))).not.toThrow();
    expect(() => internals.onBlur()).not.toThrow();
  });
});
