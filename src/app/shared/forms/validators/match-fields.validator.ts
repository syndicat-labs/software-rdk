import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchFieldsValidator(primaryField: string, confirmField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const primary = group.get(primaryField);
    const confirm = group.get(confirmField);

    if (!primary || !confirm) {
      return null;
    }

    if (primary.value !== confirm.value) {
      confirm.setErrors({ ...confirm.errors, fieldsMismatch: true });
      return { fieldsMismatch: true };
    }

    if (confirm.errors?.['fieldsMismatch']) {
      const { fieldsMismatch: _, ...rest } = confirm.errors;
      confirm.setErrors(Object.keys(rest).length > 0 ? rest : null);
    }

    return null;
  };
}
