import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AppError, RETRYABLE_HTTP_STATUSES } from '../../errors/errors.types';
import { isAppError } from '../../errors/errors.factory';
import { APP_CONFIG } from '../../config/app-config.token';
import { LoggingService } from '../../logging/logging.service';

const MODULE = 'core/http/retry-interceptor';
const BASE_DELAY_MS = 1_000;

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(APP_CONFIG);
  const logger = inject(LoggingService);
  const maxRetries = config.api.maxRetries;

  return attemptRequest(req, next, logger, maxRetries, 0);
};

function attemptRequest(
  req: Parameters<HttpInterceptorFn>[0],
  next: Parameters<HttpInterceptorFn>[1],
  logger: LoggingService,
  maxRetries: number,
  attempt: number,
): ReturnType<HttpInterceptorFn> {
  return next(req).pipe(
    catchError((error: unknown) => {
      const appError = isAppError(error) ? (error as AppError) : null;

      const isRetryable =
        appError?.retryable === true ||
        (appError?.httpStatus !== null && appError?.httpStatus !== undefined
          ? RETRYABLE_HTTP_STATUSES.has(appError.httpStatus)
          : false);

      if (!isRetryable || attempt >= maxRetries) {
        throw error;
      }

      const delayMs = BASE_DELAY_MS * Math.pow(2, attempt);
      logger.warn(MODULE, 'Retrying request', {
        url: req.url,
        attempt: attempt + 1,
        delayMs,
      });

      return timer(delayMs).pipe(
        switchMap(() => attemptRequest(req, next, logger, maxRetries, attempt + 1)),
      );
    }),
  );
}
