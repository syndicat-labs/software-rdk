import { HttpErrorResponse } from '@angular/common/http';
import { fromHttpError } from './errors.factory';
import { ErrorCode } from './errors.types';

describe('fromHttpError (server envelope with non-string message)', () => {
  it('falls back to the default message when the envelope message is not a string', () => {
    const response = new HttpErrorResponse({
      status: 400,
      error: { error: { code: 'VALIDATION_ERROR', message: 123 } },
      url: '/x',
    });
    const appError = fromHttpError(response);
    expect(appError.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(appError.message).toBe(
      'The request contained invalid data. Please check your input and try again.',
    );
  });
});
