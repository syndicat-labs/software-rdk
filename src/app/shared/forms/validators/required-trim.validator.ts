import { AbstractControl, ValidationErrors } from '@angular/forms';

export function requiredTrimValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null || value === undefined || String(value).trim().length === 0) {
    return { requiredTrim: true };
  }
  return null;
}
