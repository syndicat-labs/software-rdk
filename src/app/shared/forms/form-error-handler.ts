import { FormGroup } from '@angular/forms';
import { AppError } from '../../core/errors/errors.types';

export function applyServerErrors(form: FormGroup, error: AppError): void {
  if (!error.fieldErrors) {
    return;
  }
  for (const [field, message] of Object.entries(error.fieldErrors)) {
    const control = form.get(field);
    if (control) {
      control.setErrors({ serverError: message });
      control.markAsTouched();
    }
  }
}

export function getErrorMessage(
  form: FormGroup,
  field: string,
  labels?: Record<string, string>,
): string | null {
  const control = form.get(field);
  if (!control || !control.touched || !control.errors) {
    return null;
  }

  const fieldLabel = labels?.[field] ?? field;

  if (control.errors['serverError']) {
    return String(control.errors['serverError']);
  }
  if (control.errors['requiredTrim'] || control.errors['required']) {
    return `${fieldLabel} is required.`;
  }
  if (control.errors['email']) {
    return `${fieldLabel} must be a valid email address.`;
  }
  if (control.errors['fieldsMismatch']) {
    return `${fieldLabel} does not match.`;
  }
  if (control.errors['strongPassword']) {
    const sub = control.errors['strongPassword'] as Record<string, boolean>;
    if (sub['minLength']) return `${fieldLabel} must be at least 8 characters.`;
    if (sub['missingUppercase']) return `${fieldLabel} must contain an uppercase letter.`;
    if (sub['missingLowercase']) return `${fieldLabel} must contain a lowercase letter.`;
    if (sub['missingNumber']) return `${fieldLabel} must contain a number.`;
    if (sub['missingSpecial']) return `${fieldLabel} must contain a special character.`;
  }
  if (control.errors['minlength']) {
    return `${fieldLabel} must be at least ${control.errors['minlength'].requiredLength} characters.`;
  }
  if (control.errors['maxlength']) {
    return `${fieldLabel} must be no more than ${control.errors['maxlength'].requiredLength} characters.`;
  }

  return `${fieldLabel} is invalid.`;
}
