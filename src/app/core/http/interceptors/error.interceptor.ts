import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { fromHttpError } from '../../errors/errors.factory';
import { LoggingService } from '../../logging/logging.service';

const MODULE = 'core/http/error-interceptor';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggingService);

  return next(req).pipe(
    catchError((rawError: unknown) => {
      if (!(rawError instanceof HttpErrorResponse)) {
        logger.error(MODULE, 'Non-HTTP error in HTTP pipeline', { url: req.url });
        return throwError(() => fromHttpError(new HttpErrorResponse({ status: 0, url: req.url })));
      }

      const appError = fromHttpError(rawError);

      if (appError.httpStatus !== null && appError.httpStatus >= 500) {
        logger.error(MODULE, 'Server error', { url: req.url, status: appError.httpStatus, code: appError.code });
      } else if (appError.httpStatus !== null && appError.httpStatus >= 400) {
        logger.warn(MODULE, 'Client error', { url: req.url, status: appError.httpStatus, code: appError.code });
      } else {
        logger.error(MODULE, 'Network error', { url: req.url, code: appError.code });
      }

      return throwError(() => appError);
    }),
  );
};
