import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { applyServerErrors, getErrorMessage } from './form-error-handler';
import { markAllAsTouched, getFormErrors, resetServerErrors } from './form.utils';
import { requiredTrimValidator } from './validators/required-trim.validator';
import { emailValidator } from './validators/email.validator';
import { strongPasswordValidator } from './validators/strong-password.validator';
import { matchFieldsValidator } from './validators/match-fields.validator';
import { AppError, ErrorCode } from '../../core/errors/errors.types';

function buildError(overrides: Partial<AppError> = {}): AppError {
  return {
    code: ErrorCode.VALIDATION_ERROR,
    message: 'Validation failed',
    context: {},
    retryable: false,
    httpStatus: 422,
    fieldErrors: null,
    originalError: null,
    ...overrides,
  };
}

function buildForm(): FormGroup {
  const fb = new FormBuilder();
  return fb.group({
    username: ['', [requiredTrimValidator, emailValidator]],
    password: ['', [requiredTrimValidator, strongPasswordValidator]],
  });
}

describe('applyServerErrors', () => {
  it('sets serverError on matching controls and marks them touched', () => {
    const form = buildForm();
    const error = buildError({ fieldErrors: { username: 'Email already taken' } });

    applyServerErrors(form, error);

    expect(form.get('username')?.errors?.['serverError']).toBe('Email already taken');
    expect(form.get('username')?.touched).toBe(true);
  });

  it('ignores fieldError keys that do not match any control', () => {
    const form = buildForm();
    const error = buildError({ fieldErrors: { nonexistent: 'Some error' } });

    applyServerErrors(form, error);

    expect(form.get('username')?.errors?.['serverError']).toBeUndefined();
    expect(form.get('password')?.errors?.['serverError']).toBeUndefined();
  });

  it('does nothing when fieldErrors is null', () => {
    const form = buildForm();
    const error = buildError({ fieldErrors: null });

    applyServerErrors(form, error);

    expect(form.get('username')?.errors?.['serverError']).toBeUndefined();
    expect(form.get('password')?.errors?.['serverError']).toBeUndefined();
  });

  it('applies errors to multiple fields', () => {
    const form = buildForm();
    const error = buildError({
      fieldErrors: {
        username: 'Email taken',
        password: 'Password too common',
      },
    });

    applyServerErrors(form, error);

    expect(form.get('username')?.errors?.['serverError']).toBe('Email taken');
    expect(form.get('password')?.errors?.['serverError']).toBe('Password too common');
  });
});

describe('getErrorMessage', () => {
  it('returns null when control is not touched', () => {
    const form = buildForm();
    form.get('username')?.setValue('');

    expect(getErrorMessage(form, 'username')).toBeNull();
  });

  it('returns null when control has no errors', () => {
    const form = buildForm();
    form.get('username')?.setValue('test@example.com');
    form.get('username')?.markAsTouched();

    expect(getErrorMessage(form, 'username')).toBeNull();
  });

  it('returns null for a field that does not exist', () => {
    const form = buildForm();
    expect(getErrorMessage(form, 'nonexistent')).toBeNull();
  });

  it('returns server error message when serverError is set', () => {
    const form = buildForm();
    form.get('username')?.setErrors({ serverError: 'Email already taken' });
    form.get('username')?.markAsTouched();

    expect(getErrorMessage(form, 'username')).toBe('Email already taken');
  });

  it('returns required message for requiredTrim error', () => {
    const form = buildForm();
    form.get('username')?.setValue('');
    form.get('username')?.markAsTouched();

    expect(getErrorMessage(form, 'username')).toMatch(/is required/i);
  });

  it('uses label from labels map in error messages', () => {
    const form = buildForm();
    form.get('username')?.setValue('');
    form.get('username')?.markAsTouched();

    const msg = getErrorMessage(form, 'username', { username: 'Email address' });
    expect(msg).toBe('Email address is required.');
  });

  it('falls back to field name as label when labels map omits the field', () => {
    const form = buildForm();
    form.get('username')?.setValue('');
    form.get('username')?.markAsTouched();

    const msg = getErrorMessage(form, 'username');
    expect(msg).toBe('username is required.');
  });

  it('returns email message for email error', () => {
    const form = buildForm();
    form.get('username')?.setValue('not-an-email');
    form.get('username')?.markAsTouched();

    const msg = getErrorMessage(form, 'username', { username: 'Email' });
    expect(msg).toMatch(/valid email/i);
  });

  it('returns fieldsMismatch message', () => {
    const fb = new FormBuilder();
    const group = fb.group(
      {
        password: ['Secret1!'],
        confirm: ['Different1!'],
      },
      { validators: matchFieldsValidator('password', 'confirm') },
    );
    group.get('confirm')?.markAsTouched();

    const msg = getErrorMessage(group, 'confirm', { confirm: 'Confirm password' });
    expect(msg).toMatch(/does not match/i);
  });

  it('returns strongPassword minLength message', () => {
    const fb = new FormBuilder();
    const form = fb.group({ password: ['ab1!', [strongPasswordValidator]] });
    form.get('password')?.markAsTouched();

    expect(getErrorMessage(form, 'password', { password: 'Password' })).toMatch(/at least 8/i);
  });

  it('returns strongPassword missingUppercase message', () => {
    const fb = new FormBuilder();
    const form = fb.group({ password: ['abcdefg1!', [strongPasswordValidator]] });
    form.get('password')?.markAsTouched();

    expect(getErrorMessage(form, 'password', { password: 'Password' })).toMatch(/uppercase/i);
  });

  it('returns minlength message from Angular built-in validator', () => {
    const fb = new FormBuilder();
    const form = fb.group({ name: ['ab', [Validators.minLength(5)]] });
    form.get('name')?.markAsTouched();

    const msg = getErrorMessage(form, 'name', { name: 'Name' });
    expect(msg).toMatch(/at least 5/i);
  });

  it('returns maxlength message from Angular built-in validator', () => {
    const fb = new FormBuilder();
    const form = fb.group({ name: ['abcde', [Validators.maxLength(3)]] });
    form.get('name')?.markAsTouched();

    const msg = getErrorMessage(form, 'name', { name: 'Name' });
    expect(msg).toMatch(/no more than 3/i);
  });

  it('returns generic invalid message for unrecognised error key', () => {
    const form = buildForm();
    form.get('username')?.setErrors({ customRule: true });
    form.get('username')?.markAsTouched();

    expect(getErrorMessage(form, 'username', { username: 'Email' })).toBe('Email is invalid.');
  });
});

describe('markAllAsTouched', () => {
  it('marks a standalone FormGroup as touched', () => {
    const fb = new FormBuilder();
    const group = fb.group({ name: [''] });
    expect(group.get('name')?.touched).toBe(false);

    markAllAsTouched(group);

    expect(group.get('name')?.touched).toBe(true);
  });

  it('recursively marks nested FormGroup controls', () => {
    const fb = new FormBuilder();
    const outer = fb.group({
      inner: fb.group({
        field: [''],
      }),
    });
    const innerField = (outer.get('inner') as FormGroup).get('field');
    expect(innerField?.touched).toBe(false);

    markAllAsTouched(outer);

    expect(innerField?.touched).toBe(true);
  });
});

describe('getFormErrors', () => {
  it('returns empty object when no controls have errors', () => {
    const fb = new FormBuilder();
    const form = fb.group({ name: ['valid'] });

    expect(getFormErrors(form)).toEqual({});
  });

  it('returns errors keyed by field name', () => {
    const form = buildForm();
    form.get('username')?.setValue('');
    form.get('username')?.markAsTouched();

    const errors = getFormErrors(form);
    expect(errors['username']).toBeTruthy();
  });

  it('includes group-level errors under _group key', () => {
    const fb = new FormBuilder();
    const form = fb.group(
      { password: ['Secret1!'], confirm: ['Different1!'] },
      { validators: matchFieldsValidator('password', 'confirm') },
    );

    const errors = getFormErrors(form);
    expect(errors['_group']).toBeTruthy();
  });
});

describe('resetServerErrors', () => {
  it('clears serverError from controls', () => {
    const form = buildForm();
    form.get('username')?.setErrors({ serverError: 'Taken' });

    resetServerErrors(form);

    expect(form.get('username')?.errors?.['serverError']).toBeUndefined();
  });

  it('preserves other errors when clearing serverError', () => {
    const form = buildForm();
    form.get('username')?.setErrors({ serverError: 'Taken', required: true });

    resetServerErrors(form);

    expect(form.get('username')?.errors?.['serverError']).toBeUndefined();
    expect(form.get('username')?.errors?.['required']).toBe(true);
  });

  it('does nothing to controls without serverError', () => {
    const form = buildForm();
    form.get('username')?.setErrors({ required: true });

    resetServerErrors(form);

    expect(form.get('username')?.errors?.['required']).toBe(true);
  });
});
