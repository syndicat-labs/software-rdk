import { HttpErrorResponse } from '@angular/common/http';
import {
  AppError,
  ErrorCode,
  HTTP_STATUS_TO_ERROR_CODE,
  RETRYABLE_HTTP_STATUSES,
} from './errors.types';

export function fromHttpError(response: HttpErrorResponse): AppError {
  const status = response.status;
  const body = response.error as Record<string, unknown> | null;

  const serverError = body?.['error'] as Record<string, unknown> | undefined;

  if (serverError && typeof serverError['code'] === 'string') {
    return {
      code: serverError['code'] as ErrorCode,
      message: typeof serverError['message'] === 'string' ? serverError['message'] : defaultMessage(status),
      context: { url: response.url, status },
      retryable: RETRYABLE_HTTP_STATUSES.has(status),
      httpStatus: status,
      fieldErrors: extractFieldErrors(serverError['field_errors']),
      originalError: response,
    };
  }

  if (status === 0) {
    return {
      code: ErrorCode.INFRASTRUCTURE_NETWORK_ERROR,
      message: 'A network error occurred. Please check your connection and try again.',
      context: { url: response.url },
      retryable: true,
      httpStatus: null,
      fieldErrors: null,
      originalError: response,
    };
  }

  return {
    code: HTTP_STATUS_TO_ERROR_CODE[status] ?? ErrorCode.INFRASTRUCTURE_HTTP_ERROR,
    message: defaultMessage(status),
    context: { url: response.url, status },
    retryable: RETRYABLE_HTTP_STATUSES.has(status),
    httpStatus: status,
    fieldErrors: null,
    originalError: response,
  };
}

export function fromUnknown(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof HttpErrorResponse) {
    return fromHttpError(error);
  }

  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'An unexpected error occurred.';

  return {
    code: ErrorCode.INFRASTRUCTURE_UNKNOWN,
    message: 'An unexpected error occurred. Please try again.',
    context: { originalMessage: message },
    retryable: false,
    httpStatus: null,
    fieldErrors: null,
    originalError: error,
  };
}

export function isAppError(value: unknown): value is AppError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    'retryable' in value
  );
}

function defaultMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'The request contained invalid data. Please check your input and try again.',
    401: 'Your session has expired. Please sign in again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource could not be found.',
    408: 'The request timed out. Please try again.',
    409: 'This action conflicts with existing data.',
    410: 'This resource is no longer available.',
    423: 'This resource is currently locked.',
    429: 'Too many requests. Please wait a moment and try again.',
    500: 'A server error occurred. Please try again later.',
    502: 'The server is temporarily unavailable. Please try again later.',
    503: 'The service is temporarily unavailable. Please try again later.',
    504: 'The server took too long to respond. Please try again.',
  };
  return messages[status] ?? 'An unexpected error occurred. Please try again.';
}

function extractFieldErrors(raw: unknown): Record<string, string> | null {
  if (typeof raw !== 'object' || raw === null) {
    return null;
  }
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === 'string') {
      result[key] = value;
    }
  }
  return Object.keys(result).length > 0 ? result : null;
}
