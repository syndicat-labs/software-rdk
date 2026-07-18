import { FormControl, FormGroup } from '@angular/forms';
import { requiredTrimValidator } from './required-trim.validator';
import { emailValidator } from './email.validator';
import { strongPasswordValidator } from './strong-password.validator';
import { matchFieldsValidator } from './match-fields.validator';

describe('requiredTrimValidator', () => {
  const ctrl = (value: unknown) => new FormControl(value);

  it('returns error for empty string', () => {
    expect(requiredTrimValidator(ctrl(''))).toEqual({ requiredTrim: true });
  });

  it('returns error for whitespace-only string', () => {
    expect(requiredTrimValidator(ctrl('   '))).toEqual({ requiredTrim: true });
  });

  it('returns error for null', () => {
    expect(requiredTrimValidator(ctrl(null))).toEqual({ requiredTrim: true });
  });

  it('returns error for undefined', () => {
    expect(requiredTrimValidator(ctrl(undefined))).toEqual({ requiredTrim: true });
  });

  it('returns null for non-empty string', () => {
    expect(requiredTrimValidator(ctrl('hello'))).toBeNull();
  });

  it('returns null for string with leading/trailing spaces but non-empty content', () => {
    expect(requiredTrimValidator(ctrl('  hello  '))).toBeNull();
  });

  it('returns null for 0 (non-empty numeric value)', () => {
    expect(requiredTrimValidator(ctrl(0))).toBeNull();
  });
});

describe('emailValidator', () => {
  const ctrl = (value: unknown) => new FormControl(value);

  it('returns null for empty string (not responsible for required)', () => {
    expect(emailValidator(ctrl(''))).toBeNull();
  });

  it('returns null for null', () => {
    expect(emailValidator(ctrl(null))).toBeNull();
  });

  it('returns null for valid email', () => {
    expect(emailValidator(ctrl('user@example.com'))).toBeNull();
  });

  it('returns null for email with subdomain', () => {
    expect(emailValidator(ctrl('user@mail.example.co.uk'))).toBeNull();
  });

  it('returns error for missing @', () => {
    expect(emailValidator(ctrl('userexample.com'))).toEqual({ email: true });
  });

  it('returns error for missing domain', () => {
    expect(emailValidator(ctrl('user@'))).toEqual({ email: true });
  });

  it('returns error for missing TLD', () => {
    expect(emailValidator(ctrl('user@example'))).toEqual({ email: true });
  });

  it('returns error for double @', () => {
    expect(emailValidator(ctrl('user@@example.com'))).toEqual({ email: true });
  });

  it('returns error for spaces in email', () => {
    expect(emailValidator(ctrl('user @example.com'))).toEqual({ email: true });
  });

  it('returns error for script injection attempt', () => {
    expect(emailValidator(ctrl('<script>alert(1)</script>@evil.com'))).toEqual({ email: true });
  });
});

describe('strongPasswordValidator', () => {
  const ctrl = (value: unknown) => new FormControl(value);

  it('returns null for empty value', () => {
    expect(strongPasswordValidator(ctrl(''))).toBeNull();
  });

  it('returns null for null', () => {
    expect(strongPasswordValidator(ctrl(null))).toBeNull();
  });

  it('returns null for a strong password', () => {
    expect(strongPasswordValidator(ctrl('Password1!'))).toBeNull();
  });

  it('returns minLength error for short password', () => {
    const result = strongPasswordValidator(ctrl('Ab1!'));
    expect(result?.['strongPassword']['minLength']).toBe(true);
  });

  it('returns missingUppercase for all-lowercase', () => {
    const result = strongPasswordValidator(ctrl('password1!'));
    expect(result?.['strongPassword']['missingUppercase']).toBe(true);
  });

  it('returns missingLowercase for all-uppercase', () => {
    const result = strongPasswordValidator(ctrl('PASSWORD1!'));
    expect(result?.['strongPassword']['missingLowercase']).toBe(true);
  });

  it('returns missingNumber for no digits', () => {
    const result = strongPasswordValidator(ctrl('Password!!'));
    expect(result?.['strongPassword']['missingNumber']).toBe(true);
  });

  it('returns missingSpecial for no special char', () => {
    const result = strongPasswordValidator(ctrl('Password1'));
    expect(result?.['strongPassword']['missingSpecial']).toBe(true);
  });

  it('returns multiple errors for very weak password', () => {
    const result = strongPasswordValidator(ctrl('abc'));
    expect(result?.['strongPassword']).toBeTruthy();
    expect(Object.keys(result?.['strongPassword'] as object).length).toBeGreaterThan(1);
  });
});

describe('matchFieldsValidator', () => {
  const group = (password: string, confirm: string) =>
    new FormGroup(
      { password: new FormControl(password), confirm: new FormControl(confirm) },
      { validators: matchFieldsValidator('password', 'confirm') },
    );

  it('returns null when fields match', () => {
    const g = group('Password1!', 'Password1!');
    expect(g.errors).toBeNull();
  });

  it('returns fieldsMismatch when fields differ', () => {
    const g = group('Password1!', 'Different1!');
    expect(g.errors?.['fieldsMismatch']).toBe(true);
  });

  it('sets error on confirm control when mismatch', () => {
    const g = group('Password1!', 'Different1!');
    expect(g.get('confirm')?.errors?.['fieldsMismatch']).toBe(true);
  });

  it('clears fieldsMismatch error from confirm when fields become equal', () => {
    const g = group('Password1!', 'Different1!');
    g.get('confirm')?.setValue('Password1!');
    expect(g.get('confirm')?.errors?.['fieldsMismatch']).toBeFalsy();
  });

  it('returns null for missing control names gracefully', () => {
    const g = new FormGroup(
      { password: new FormControl('abc') },
      { validators: matchFieldsValidator('password', 'missing') },
    );
    expect(g.errors).toBeNull();
  });
});
