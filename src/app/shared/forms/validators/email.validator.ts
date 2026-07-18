import { AbstractControl, ValidationErrors } from '@angular/forms';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function emailValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) {
    return null;
  }
  return EMAIL_PATTERN.test(String(value)) ? null : { email: true };
}
