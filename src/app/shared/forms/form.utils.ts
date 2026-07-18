import { AbstractControl, FormGroup } from '@angular/forms';

export function markAllAsTouched(control: AbstractControl): void {
  control.markAsTouched({ onlySelf: true });
  if (control instanceof FormGroup) {
    for (const child of Object.values(control.controls)) {
      markAllAsTouched(child);
    }
  }
}

export function getFormErrors(group: FormGroup): Record<string, unknown> {
  const errors: Record<string, unknown> = {};
  for (const [key, control] of Object.entries(group.controls)) {
    if (control.errors) {
      errors[key] = control.errors;
    }
  }
  if (group.errors) {
    errors['_group'] = group.errors;
  }
  return errors;
}

export function resetServerErrors(group: FormGroup): void {
  for (const control of Object.values(group.controls)) {
    if (control.errors?.['serverError']) {
      const { serverError: _, ...rest } = control.errors;
      control.setErrors(Object.keys(rest).length > 0 ? rest : null);
    }
  }
}
