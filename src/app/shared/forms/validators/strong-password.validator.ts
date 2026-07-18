import { AbstractControl, ValidationErrors } from '@angular/forms';

const MIN_LENGTH = 8;

export function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) {
    return null;
  }

  const str = String(value);
  const errors: Record<string, boolean> = {};

  if (str.length < MIN_LENGTH) {
    errors['minLength'] = true;
  }
  if (!/[A-Z]/.test(str)) {
    errors['missingUppercase'] = true;
  }
  if (!/[a-z]/.test(str)) {
    errors['missingLowercase'] = true;
  }
  if (!/[0-9]/.test(str)) {
    errors['missingNumber'] = true;
  }
  if (!/[^A-Za-z0-9]/.test(str)) {
    errors['missingSpecial'] = true;
  }

  return Object.keys(errors).length > 0 ? { strongPassword: errors } : null;
}
