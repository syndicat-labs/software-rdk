import { FormControl, FormGroup } from '@angular/forms';
import { matchFieldsValidator } from './match-fields.validator';

describe('matchFieldsValidator (clearing behaviour)', () => {
  function group(primary: string, confirm: string): FormGroup {
    return new FormGroup({
      password: new FormControl(primary),
      confirmPassword: new FormControl(confirm),
    });
  }

  it('returns null when the confirm control is missing', () => {
    const validate = matchFieldsValidator('password', 'confirmPassword');
    const incomplete = new FormGroup({ password: new FormControl('a') });
    expect(validate(incomplete)).toBeNull();
  });

  it('returns null when the primary control is missing', () => {
    const validate = matchFieldsValidator('password', 'confirmPassword');
    const incomplete = new FormGroup({ confirmPassword: new FormControl('a') });
    expect(validate(incomplete)).toBeNull();
  });

  it('leaves unrelated errors untouched when the values match', () => {
    const validate = matchFieldsValidator('password', 'confirmPassword');
    const g = group('a', 'a');
    g.get('confirmPassword')!.setErrors({ required: true });
    expect(validate(g)).toBeNull();
    expect(g.get('confirmPassword')!.errors).toEqual({ required: true });
  });

  it('returns null for matching values with no prior errors', () => {
    const validate = matchFieldsValidator('password', 'confirmPassword');
    const g = group('same', 'same');
    expect(validate(g)).toBeNull();
    expect(g.get('confirmPassword')!.errors).toBeNull();
  });

  it('flags a mismatch and sets the confirm-control error', () => {
    const validate = matchFieldsValidator('password', 'confirmPassword');
    const g = group('a', 'b');
    expect(validate(g)).toEqual({ fieldsMismatch: true });
    expect(g.get('confirmPassword')!.errors).toEqual({ fieldsMismatch: true });
  });

  it('clears the mismatch error once the values match', () => {
    const validate = matchFieldsValidator('password', 'confirmPassword');
    const g = group('a', 'b');
    validate(g);
    g.get('confirmPassword')!.setValue('a');
    expect(validate(g)).toBeNull();
    expect(g.get('confirmPassword')!.errors).toBeNull();
  });

  it('clears the error object entirely when fieldsMismatch was the only error', () => {
    const validate = matchFieldsValidator('password', 'confirmPassword');
    const g = group('a', 'a');
    g.get('confirmPassword')!.setErrors({ fieldsMismatch: true });
    expect(validate(g)).toBeNull();
    expect(g.get('confirmPassword')!.errors).toBeNull();
  });

  it('preserves other errors when clearing the mismatch', () => {
    const validate = matchFieldsValidator('password', 'confirmPassword');
    const g = group('a', 'a');
    g.get('confirmPassword')!.setErrors({ fieldsMismatch: true, required: true });
    expect(validate(g)).toBeNull();
    expect(g.get('confirmPassword')!.errors).toEqual({ required: true });
  });
});
