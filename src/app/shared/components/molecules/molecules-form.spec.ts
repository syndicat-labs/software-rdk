import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormFieldComponent } from './form-field/form-field.component';
import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { ToggleComponent } from './toggle/toggle.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { CheckboxGroupComponent } from './checkbox-group/checkbox-group.component';
import { RadioGroupComponent } from './radio/radio.component';

// ─── FormFieldComponent ───────────────────────────────────────────────────────
describe('FormFieldComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders label text', async () => {
    await render('<rdk-form-field label="Email"><input /></rdk-form-field>', {
      imports: [FormFieldComponent],
    });
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('shows required asterisk when required=true', async () => {
    await render('<rdk-form-field label="Name" [required]="true"><input /></rdk-form-field>', {
      imports: [FormFieldComponent],
    });
    expect(document.querySelector('.rdk-field__required')).toBeInTheDocument();
  });

  it('does not show required asterisk by default', async () => {
    await render('<rdk-form-field label="Name"><input /></rdk-form-field>', {
      imports: [FormFieldComponent],
    });
    expect(document.querySelector('.rdk-field__required')).not.toBeInTheDocument();
  });

  it('renders hint text when no error', async () => {
    await render('<rdk-form-field hint="Must be unique"><input /></rdk-form-field>', {
      imports: [FormFieldComponent],
    });
    expect(screen.getByText('Must be unique')).toBeInTheDocument();
  });

  it('renders error message', async () => {
    await render('<rdk-form-field error="This field is required"><input /></rdk-form-field>', {
      imports: [FormFieldComponent],
    });
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('hides hint when error is present', async () => {
    await render(
      '<rdk-form-field hint="Helper text" error="Error!"><input /></rdk-form-field>',
      { imports: [FormFieldComponent] },
    );
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });

  it('applies rdk-field--error class when error present', async () => {
    await render('<rdk-form-field error="Error"><input /></rdk-form-field>', {
      imports: [FormFieldComponent],
    });
    expect(document.querySelector('.rdk-field--error')).toBeInTheDocument();
  });

  it('projects content inside control slot', async () => {
    await render('<rdk-form-field><input id="my-input" /></rdk-form-field>', {
      imports: [FormFieldComponent],
    });
    expect(document.querySelector('#my-input')).toBeInTheDocument();
  });
});

// ─── InputComponent ───────────────────────────────────────────────────────────
describe('InputComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders an input element', async () => {
    await render('<rdk-input />', { imports: [InputComponent] });
    expect(document.querySelector('.rdk-input__control')).toBeInTheDocument();
  });

  it('sets placeholder', async () => {
    await render('<rdk-input placeholder="Enter email" />', { imports: [InputComponent] });
    expect(document.querySelector('.rdk-input__control')).toHaveAttribute('placeholder', 'Enter email');
  });

  it('is disabled when disabled=true', async () => {
    await render('<rdk-input [disabled]="true" />', { imports: [InputComponent] });
    expect(document.querySelector('.rdk-input__control')).toBeDisabled();
  });

  it('emits value changes via ControlValueAccessor', async () => {
    const fn = jest.fn();
    await render(
      '<rdk-input (input)="fn($event)" />',
      { imports: [InputComponent], componentProperties: { fn } },
    );
    fireEvent.input(document.querySelector('.rdk-input__control')!, { target: { value: 'hello' } });
    expect(fn).toHaveBeenCalled();
  });

  it('shows clear button when clearable=true and has value', async () => {
    const { detectChanges } = await render(
      '<rdk-input [clearable]="true" />',
      { imports: [InputComponent] },
    );
    fireEvent.input(document.querySelector('.rdk-input__control')!, { target: { value: 'test' } });
    detectChanges();
    expect(document.querySelector('.rdk-input__clear')).toBeInTheDocument();
  });

  it('does not show clear button when no value', async () => {
    await render('<rdk-input [clearable]="true" />', { imports: [InputComponent] });
    expect(document.querySelector('.rdk-input__clear')).not.toBeInTheDocument();
  });

  it('applies error class when hasError=true', async () => {
    await render('<rdk-input [hasError]="true" />', { imports: [InputComponent] });
    expect(document.querySelector('.rdk-input--error')).toBeInTheDocument();
  });

  it('writes value via ControlValueAccessor', async () => {
    const control = new FormControl('hello');
    const { detectChanges } = await render(
      '<rdk-input [formControl]="ctrl" />',
      { imports: [InputComponent, ReactiveFormsModule], componentProperties: { ctrl: control } },
    );
    detectChanges();
    expect((document.querySelector('.rdk-input__control') as HTMLInputElement).value).toBe('hello');
  });

  it('calls setDisabledState', async () => {
    const control = new FormControl({ value: '', disabled: true });
    await render(
      '<rdk-input [formControl]="ctrl" />',
      { imports: [InputComponent, ReactiveFormsModule], componentProperties: { ctrl: control } },
    );
    expect(document.querySelector('.rdk-input--disabled')).toBeInTheDocument();
  });
});

// ─── TextareaComponent ────────────────────────────────────────────────────────
describe('TextareaComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders a textarea element', async () => {
    await render('<rdk-textarea />', { imports: [TextareaComponent] });
    expect(document.querySelector('.rdk-textarea__control')).toBeInTheDocument();
  });

  it('sets placeholder', async () => {
    await render('<rdk-textarea placeholder="Write here" />', { imports: [TextareaComponent] });
    expect(document.querySelector('.rdk-textarea__control')).toHaveAttribute('placeholder', 'Write here');
  });

  it('sets rows attribute', async () => {
    await render('<rdk-textarea [rows]="5" />', { imports: [TextareaComponent] });
    expect(document.querySelector('.rdk-textarea__control')).toHaveAttribute('rows', '5');
  });

  it('is disabled when disabled=true', async () => {
    await render('<rdk-textarea [disabled]="true" />', { imports: [TextareaComponent] });
    expect(document.querySelector('.rdk-textarea__control')).toBeDisabled();
  });

  it('applies error class when hasError=true', async () => {
    await render('<rdk-textarea [hasError]="true" />', { imports: [TextareaComponent] });
    expect(document.querySelector('.rdk-textarea--error')).toBeInTheDocument();
  });

  it('shows character count when showCount=true and maxLength set', async () => {
    await render('<rdk-textarea [showCount]="true" [maxLength]="100" />', {
      imports: [TextareaComponent],
    });
    expect(screen.getByText('0 / 100')).toBeInTheDocument();
  });

  it('writes value via ControlValueAccessor', async () => {
    const control = new FormControl('initial text');
    const { detectChanges } = await render(
      '<rdk-textarea [formControl]="ctrl" />',
      { imports: [TextareaComponent, ReactiveFormsModule], componentProperties: { ctrl: control } },
    );
    detectChanges();
    expect((document.querySelector('.rdk-textarea__control') as HTMLTextAreaElement).value).toBe('initial text');
  });
});

// ─── ToggleComponent ──────────────────────────────────────────────────────────
describe('ToggleComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders a button with role=switch', async () => {
    await render('<rdk-toggle />', { imports: [ToggleComponent] });
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('is unchecked by default', async () => {
    await render('<rdk-toggle />', { imports: [ToggleComponent] });
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('is checked after click', async () => {
    const { detectChanges } = await render('<rdk-toggle />', { imports: [ToggleComponent] });
    fireEvent.click(screen.getByRole('switch'));
    detectChanges();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('emits changed event on toggle', async () => {
    const fn = jest.fn();
    await render('<rdk-toggle (changed)="fn($event)" />', {
      imports: [ToggleComponent],
      componentProperties: { fn },
    });
    fireEvent.click(screen.getByRole('switch'));
    expect(fn).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', async () => {
    const fn = jest.fn();
    await render('<rdk-toggle [disabled]="true" (changed)="fn($event)" />', {
      imports: [ToggleComponent],
      componentProperties: { fn },
    });
    fireEvent.click(screen.getByRole('switch'));
    expect(fn).not.toHaveBeenCalled();
  });

  it('renders label text when label provided', async () => {
    await render('<rdk-toggle label="Dark mode" />', { imports: [ToggleComponent] });
    expect(screen.getByText('Dark mode')).toBeInTheDocument();
  });

  it('writes checked state via ControlValueAccessor', async () => {
    const control = new FormControl(true);
    const { detectChanges } = await render(
      '<rdk-toggle [formControl]="ctrl" />',
      { imports: [ToggleComponent, ReactiveFormsModule], componentProperties: { ctrl: control } },
    );
    detectChanges();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('sets disabled via setDisabledState', async () => {
    const control = new FormControl({ value: false, disabled: true });
    await render(
      '<rdk-toggle [formControl]="ctrl" />',
      { imports: [ToggleComponent, ReactiveFormsModule], componentProperties: { ctrl: control } },
    );
    expect(document.querySelector('.rdk-toggle--disabled')).toBeInTheDocument();
  });

  it('applies size class', async () => {
    await render('<rdk-toggle size="lg" />', { imports: [ToggleComponent] });
    expect(document.querySelector('.rdk-toggle--lg')).toBeInTheDocument();
  });
});

// ─── CheckboxComponent ────────────────────────────────────────────────────────
describe('CheckboxComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders a checkbox input', async () => {
    await render('<rdk-checkbox label="Accept terms" />', { imports: [CheckboxComponent] });
    expect(document.querySelector('input[type="checkbox"]')).toBeInTheDocument();
  });

  it('renders label text', async () => {
    await render('<rdk-checkbox label="Remember me" />', { imports: [CheckboxComponent] });
    expect(screen.getByText('Remember me')).toBeInTheDocument();
  });

  it('is unchecked by default', async () => {
    await render('<rdk-checkbox label="Check" />', { imports: [CheckboxComponent] });
    expect(document.querySelector('input[type="checkbox"]')).not.toBeChecked();
  });

  it('emits changed on check', async () => {
    const fn = jest.fn();
    await render('<rdk-checkbox label="Check" (changed)="fn($event)" />', {
      imports: [CheckboxComponent],
      componentProperties: { fn },
    });
    fireEvent.click(document.querySelector('input[type="checkbox"]')!);
    expect(fn).toHaveBeenCalledWith(true);
  });

  it('is disabled when disabled=true', async () => {
    await render('<rdk-checkbox label="Check" [disabled]="true" />', { imports: [CheckboxComponent] });
    expect(document.querySelector('input[type="checkbox"]')).toBeDisabled();
  });

  it('applies size class', async () => {
    await render('<rdk-checkbox label="Check" size="lg" />', { imports: [CheckboxComponent] });
    expect(document.querySelector('.rdk-checkbox--lg')).toBeInTheDocument();
  });

  it('writes checked state via ControlValueAccessor', async () => {
    const control = new FormControl(true);
    const { detectChanges } = await render(
      '<rdk-checkbox label="Check" [formControl]="ctrl" />',
      { imports: [CheckboxComponent, ReactiveFormsModule], componentProperties: { ctrl: control } },
    );
    detectChanges();
    expect(document.querySelector('input[type="checkbox"]')).toBeChecked();
  });
});

// ─── CheckboxGroupComponent ───────────────────────────────────────────────────
describe('CheckboxGroupComponent', () => {
  const options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c', disabled: true },
  ];

  beforeEach(() => TestBed.resetTestingModule());

  it('renders all options', async () => {
    await render('<rdk-checkbox-group [options]="opts" />', {
      imports: [CheckboxGroupComponent],
      componentProperties: { opts: options },
    });
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('emits changed with selected values', async () => {
    const fn = jest.fn();
    await render('<rdk-checkbox-group [options]="opts" (changed)="fn($event)" />', {
      imports: [CheckboxGroupComponent],
      componentProperties: { opts: options, fn },
    });
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    fireEvent.click(checkboxes[0]);
    expect(fn).toHaveBeenCalledWith(['a']);
  });

  it('writes preselected values via ControlValueAccessor', async () => {
    const control = new FormControl(['a', 'b']);
    const { detectChanges } = await render(
      '<rdk-checkbox-group [options]="opts" [formControl]="ctrl" />',
      {
        imports: [CheckboxGroupComponent, ReactiveFormsModule],
        componentProperties: { opts: options, ctrl: control },
      },
    );
    detectChanges();
    const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(true);
    expect(checkboxes[2].checked).toBe(false);
  });
});

// ─── RadioGroupComponent ──────────────────────────────────────────────────────
describe('RadioGroupComponent', () => {
  const options = [
    { label: 'Red', value: 'red' },
    { label: 'Green', value: 'green' },
    { label: 'Blue', value: 'blue', disabled: true },
  ];

  beforeEach(() => TestBed.resetTestingModule());

  it('renders all radio options', async () => {
    await render('<rdk-radio-group [options]="opts" />', {
      imports: [RadioGroupComponent],
      componentProperties: { opts: options },
    });
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Green')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
  });

  it('has role=radiogroup', async () => {
    await render('<rdk-radio-group [options]="opts" />', {
      imports: [RadioGroupComponent],
      componentProperties: { opts: options },
    });
    expect(document.querySelector('[role="radiogroup"]')).toBeInTheDocument();
  });

  it('emits changed when option selected', async () => {
    const fn = jest.fn();
    await render('<rdk-radio-group [options]="opts" (changed)="fn($event)" />', {
      imports: [RadioGroupComponent],
      componentProperties: { opts: options, fn },
    });
    const radios = document.querySelectorAll('input[type="radio"]');
    fireEvent.click(radios[0]);
    expect(fn).toHaveBeenCalledWith('red');
  });

  it('writes preselected value via ControlValueAccessor', async () => {
    const control = new FormControl('green');
    const { detectChanges } = await render(
      '<rdk-radio-group [options]="opts" [formControl]="ctrl" />',
      {
        imports: [RadioGroupComponent, ReactiveFormsModule],
        componentProperties: { opts: options, ctrl: control },
      },
    );
    detectChanges();
    const radios = document.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    expect(radios[1].checked).toBe(true);
  });

  it('disables individual option', async () => {
    await render('<rdk-radio-group [options]="opts" />', {
      imports: [RadioGroupComponent],
      componentProperties: { opts: options },
    });
    const radios = document.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    expect(radios[2].disabled).toBe(true);
  });
});
