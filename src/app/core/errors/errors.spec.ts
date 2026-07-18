import { HttpErrorResponse } from '@angular/common/http';
import { fromHttpError, fromUnknown, isAppError } from './errors.factory';
import {
  AppError,
  ErrorCode,
  HTTP_STATUS_TO_ERROR_CODE,
  RETRYABLE_HTTP_STATUSES,
} from './errors.types';

describe('errors.types', () => {
  describe('HTTP_STATUS_TO_ERROR_CODE', () => {
    it('maps 401 to AUTH_TOKEN_INVALID', () => {
      expect(HTTP_STATUS_TO_ERROR_CODE[401]).toBe(ErrorCode.AUTH_TOKEN_INVALID);
    });

    it('maps 403 to AUTH_PERMISSION_DENIED', () => {
      expect(HTTP_STATUS_TO_ERROR_CODE[403]).toBe(ErrorCode.AUTH_PERMISSION_DENIED);
    });

    it('maps 404 to RESOURCE_NOT_FOUND', () => {
      expect(HTTP_STATUS_TO_ERROR_CODE[404]).toBe(ErrorCode.RESOURCE_NOT_FOUND);
    });

    it('maps 503 to INFRASTRUCTURE_SERVICE_UNAVAIL', () => {
      expect(HTTP_STATUS_TO_ERROR_CODE[503]).toBe(ErrorCode.INFRASTRUCTURE_SERVICE_UNAVAIL);
    });
  });

  describe('RETRYABLE_HTTP_STATUSES', () => {
    it('marks 503 as retryable', () => {
      expect(RETRYABLE_HTTP_STATUSES.has(503)).toBe(true);
    });

    it('marks 429 as retryable', () => {
      expect(RETRYABLE_HTTP_STATUSES.has(429)).toBe(true);
    });

    it('does not mark 404 as retryable', () => {
      expect(RETRYABLE_HTTP_STATUSES.has(404)).toBe(false);
    });

    it('does not mark 401 as retryable', () => {
      expect(RETRYABLE_HTTP_STATUSES.has(401)).toBe(false);
    });
  });
});

describe('fromHttpError', () => {
  function makeResponse(status: number, body?: unknown, url = '/api/test'): HttpErrorResponse {
    return new HttpErrorResponse({ status, error: body, url });
  }

  describe('network errors (status 0)', () => {
    it('returns INFRASTRUCTURE_NETWORK_ERROR for status 0', () => {
      const error = fromHttpError(makeResponse(0));
      expect(error.code).toBe(ErrorCode.INFRASTRUCTURE_NETWORK_ERROR);
    });

    it('sets retryable to true', () => {
      expect(fromHttpError(makeResponse(0)).retryable).toBe(true);
    });

    it('sets httpStatus to null', () => {
      expect(fromHttpError(makeResponse(0)).httpStatus).toBeNull();
    });
  });

  describe('server error envelope present', () => {
    it('uses error code from server envelope', () => {
      const body = { error: { code: 'AUTH_ACCOUNT_LOCKED', message: 'Account locked', retryable: false } };
      const error = fromHttpError(makeResponse(423, body));
      expect(error.code).toBe('AUTH_ACCOUNT_LOCKED');
    });

    it('uses message from server envelope', () => {
      const body = { error: { code: 'RESOURCE_NOT_FOUND', message: 'Item not found' } };
      const error = fromHttpError(makeResponse(404, body));
      expect(error.message).toBe('Item not found');
    });

    it('extracts field_errors from server envelope', () => {
      const body = { error: { code: 'VALIDATION_ERROR', message: 'Invalid', field_errors: { email: 'Invalid email' } } };
      const error = fromHttpError(makeResponse(400, body));
      expect(error.fieldErrors).toEqual({ email: 'Invalid email' });
    });

    it('sets fieldErrors to null when field_errors is absent', () => {
      const body = { error: { code: 'VALIDATION_ERROR', message: 'Invalid' } };
      const error = fromHttpError(makeResponse(400, body));
      expect(error.fieldErrors).toBeNull();
    });

    it('ignores non-string field_error values', () => {
      const body = { error: { code: 'VALIDATION_ERROR', message: 'Invalid', field_errors: { field: 42 } } };
      const error = fromHttpError(makeResponse(400, body));
      expect(error.fieldErrors).toBeNull();
    });
  });

  describe('no server envelope', () => {
    it('maps 404 to RESOURCE_NOT_FOUND using status table', () => {
      expect(fromHttpError(makeResponse(404)).code).toBe(ErrorCode.RESOURCE_NOT_FOUND);
    });

    it('maps 401 to AUTH_TOKEN_INVALID', () => {
      expect(fromHttpError(makeResponse(401)).code).toBe(ErrorCode.AUTH_TOKEN_INVALID);
    });

    it('maps unknown status to INFRASTRUCTURE_HTTP_ERROR', () => {
      expect(fromHttpError(makeResponse(418)).code).toBe(ErrorCode.INFRASTRUCTURE_HTTP_ERROR);
    });

    it('marks 503 as retryable', () => {
      expect(fromHttpError(makeResponse(503)).retryable).toBe(true);
    });

    it('marks 404 as not retryable', () => {
      expect(fromHttpError(makeResponse(404)).retryable).toBe(false);
    });

    it('preserves the HTTP status', () => {
      expect(fromHttpError(makeResponse(500)).httpStatus).toBe(500);
    });

    it('preserves the URL in context', () => {
      const error = fromHttpError(makeResponse(500, null, '/api/users'));
      expect(error.context['url']).toBe('/api/users');
    });

    it('stores original response as originalError', () => {
      const response = makeResponse(500);
      expect(fromHttpError(response).originalError).toBe(response);
    });
  });

  describe('null body', () => {
    it('handles null body gracefully', () => {
      const error = fromHttpError(makeResponse(500, null));
      expect(error.code).toBe(ErrorCode.INFRASTRUCTURE_HTTP_ERROR);
    });
  });
});

describe('fromUnknown', () => {
  it('returns the same AppError if already an AppError', () => {
    const original: AppError = {
      code: ErrorCode.RESOURCE_NOT_FOUND,
      message: 'Not found',
      context: {},
      retryable: false,
      httpStatus: 404,
      fieldErrors: null,
      originalError: null,
    };
    expect(fromUnknown(original)).toBe(original);
  });

  it('delegates to fromHttpError for HttpErrorResponse', () => {
    const response = new HttpErrorResponse({ status: 403, url: '/api/x' });
    const error = fromUnknown(response);
    expect(error.code).toBe(ErrorCode.AUTH_PERMISSION_DENIED);
  });

  it('wraps Error instances in INFRASTRUCTURE_UNKNOWN', () => {
    const error = fromUnknown(new Error('boom'));
    expect(error.code).toBe(ErrorCode.INFRASTRUCTURE_UNKNOWN);
    expect(error.retryable).toBe(false);
  });

  it('wraps string errors in INFRASTRUCTURE_UNKNOWN', () => {
    const error = fromUnknown('something went wrong');
    expect(error.code).toBe(ErrorCode.INFRASTRUCTURE_UNKNOWN);
  });

  it('wraps null in INFRASTRUCTURE_UNKNOWN', () => {
    const error = fromUnknown(null);
    expect(error.code).toBe(ErrorCode.INFRASTRUCTURE_UNKNOWN);
  });

  it('sets retryable to false for unknown errors', () => {
    expect(fromUnknown(new Error('oops')).retryable).toBe(false);
  });
});

describe('isAppError', () => {
  it('returns true for a valid AppError', () => {
    const appError: AppError = {
      code: ErrorCode.RESOURCE_NOT_FOUND,
      message: 'Not found',
      context: {},
      retryable: false,
      httpStatus: 404,
      fieldErrors: null,
      originalError: null,
    };
    expect(isAppError(appError)).toBe(true);
  });

  it('returns false for null', () => {
    expect(isAppError(null)).toBe(false);
  });

  it('returns false for a plain object missing code', () => {
    expect(isAppError({ message: 'oops', retryable: false })).toBe(false);
  });

  it('returns false for a string', () => {
    expect(isAppError('error')).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isAppError(undefined)).toBe(false);
  });
});
