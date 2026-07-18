import { TextareaComponent } from './textarea.component';

interface TextareaInternals {
  onInput(event: Event): void;
  onBlur(): void;
  readonly nearLimit: boolean;
  value: { (): string };
}

function textareaEvent(value: string, scrollHeight = 0): Event {
  return { target: { value, style: {} as CSSStyleDeclaration, scrollHeight } } as unknown as Event;
}

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let internals: TextareaInternals;

  beforeEach(() => {
    component = new TextareaComponent();
    internals = component as unknown as TextareaInternals;
  });

  it('onInput updates the value and notifies change', () => {
    const onChange = jest.fn();
    component.registerOnChange(onChange);
    internals.onInput(textareaEvent('typed'));
    expect(onChange).toHaveBeenCalledWith('typed');
    expect(internals.value()).toBe('typed');
  });

  it('onInput auto-grows the element when autoGrow is enabled', () => {
    component.autoGrow = true;
    const style = {} as CSSStyleDeclaration;
    const target = { value: 'x', style, scrollHeight: 42 };
    internals.onInput({ target } as unknown as Event);
    expect(style.height).toBe('42px');
  });

  it('onBlur notifies touched', () => {
    const onTouched = jest.fn();
    component.registerOnTouched(onTouched);
    internals.onBlur();
    expect(onTouched).toHaveBeenCalled();
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
    expect(() => internals.onInput(textareaEvent('x'))).not.toThrow();
    expect(() => internals.onBlur()).not.toThrow();
  });
});
