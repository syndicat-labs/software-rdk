import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiClient } from '../http/api-client.service';
import { LoggingService } from '../logging/logging.service';
import { AppError, ErrorCode } from '../errors/errors.types';
import { fromHttpError, fromUnknown } from '../errors/errors.factory';
import { HttpErrorResponse } from '@angular/common/http';
import { DASHBOARD_LAYOUT_STORAGE_KEY, DashboardLayout, DASHBOARD_LAYOUT_MAX_BYTES, createDefaultLayout } from './dashboard-layout.model';
import { parseAndValidateLayout, validateLayout } from './layout-validator';

const MODULE = 'core/dashboard-layout';
const API_PATH = '/api/v1/dashboard/layout';

@Injectable({ providedIn: 'root' })
export class DashboardLayoutService {
  private readonly api = inject(ApiClient);
  private readonly logger = inject(LoggingService);

  load(): Observable<DashboardLayout> {
    return this.api.get<DashboardLayout>(API_PATH).pipe(
      map((raw) => {
        const result = validateLayout(raw);
        if (!result.valid) {
          throw result.error;
        }
        this.writeLocal(result.value);
        this.logger.info(MODULE, 'dashboard.layout.loaded', { widgetCount: result.value.widgets.length });
        return result.value;
      }),
      catchError((error: unknown) => {
        const local = this.readLocal();
        if (local) {
          this.logger.warn(MODULE, 'dashboard.layout.load_failed_fallback_local', { code: (error as AppError)?.code ?? 'unknown' });
          return of(local);
        }

        if (error instanceof HttpErrorResponse || (error as AppError)?.code) {
          const appError = error instanceof HttpErrorResponse ? fromHttpError(error) : (error as AppError);
          // Fallback to default layout as last resort, but surface as persist_failed so UI can retry
          if (appError.httpStatus === 404) {
            this.logger.info(MODULE, 'dashboard.layout.not_found_use_default');
            return of(createDefaultLayout());
          }
          return throwError(() => ({ ...appError, code: ErrorCode.DASHBOARD_PERSIST_FAILED, retryable: appError.retryable } as AppError));
        }

        const appError = fromUnknown(error);
        return throwError(() => ({ ...appError, code: ErrorCode.DASHBOARD_PERSIST_FAILED } as AppError));
      }),
    );
  }

  save(layout: DashboardLayout): Observable<void> {
    const validation = validateLayout(layout);
    if (!validation.valid) {
      return throwError(() => validation.error);
    }

    const bytes = JSON.stringify(layout).length;
    if (bytes > DASHBOARD_LAYOUT_MAX_BYTES) {
      const error: AppError = {
        code: ErrorCode.DASHBOARD_PERSIST_FAILED,
        message: 'Dashboard layout exceeds size cap.',
        context: { bytes },
        retryable: false,
        httpStatus: null,
        fieldErrors: null,
        originalError: null,
      };
      return throwError(() => error);
    }

    this.writeLocal(layout);

    return this.api.put<void>(API_PATH, layout).pipe(
      tap(() => {
        this.logger.info(MODULE, 'dashboard.layout.persisted', { widgetCount: layout.widgets.length });
      }),
      map(() => undefined),
      catchError((error: unknown) => {
        const appError = error instanceof HttpErrorResponse ? fromHttpError(error) : fromUnknown(error);
        const persistError: AppError = {
          ...appError,
          code: ErrorCode.DASHBOARD_PERSIST_FAILED,
          message: appError.message || 'Failed to persist dashboard layout.',
          retryable: appError.retryable,
        };
        this.logger.warn(MODULE, 'dashboard.layout.persist_failed', { code: persistError.code, widgetCount: layout.widgets.length });
        return throwError(() => persistError);
      }),
    );
  }

  readLocal(): DashboardLayout | null {
    try {
      const raw = localStorage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY);
      if (!raw) return null;
      const result = parseAndValidateLayout(raw);
      if (!result.valid) {
        this.logger.warn(MODULE, 'dashboard.layout.local_invalid', { message: result.error.message });
        return null;
      }
      return result.value;
    } catch {
      return null;
    }
  }

  writeLocal(layout: DashboardLayout): void {
    try {
      const json = JSON.stringify(layout);
      if (json.length > DASHBOARD_LAYOUT_MAX_BYTES) {
        this.logger.warn(MODULE, 'dashboard.layout.local_too_large', { bytes: json.length });
        return;
      }
      localStorage.setItem(DASHBOARD_LAYOUT_STORAGE_KEY, json);
    } catch {
      // localStorage may be unavailable in some contexts; silently ignore
    }
  }

  clearLocal(): void {
    try {
      localStorage.removeItem(DASHBOARD_LAYOUT_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}
