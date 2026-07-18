import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';
import { APP_CONFIG } from '../config/app-config.token';
import { LoggingService } from '../logging/logging.service';
import { TokenService } from './token.service';
import { AuthStore, AuthUser } from './auth.store';
import { fromHttpError, fromUnknown } from '../errors/errors.factory';
import { AppError } from '../errors/errors.types';
import { HttpErrorResponse } from '@angular/common/http';

const MODULE = 'core/auth';

export interface LoginCredentials {
  readonly username: string;
  readonly password: string;
}

export interface RegisterCredentials {
  readonly name: string;
  readonly username: string;
  readonly password: string;
}

export interface AuthTokenResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly store = inject(AuthStore);
  private readonly tokenService = inject(TokenService);
  private readonly logger = inject(LoggingService);
  private readonly router = inject(Router);

  login(credentials: LoginCredentials): Observable<AuthTokenResponse> {
    this.store.setLoading(true);
    const url = `${this.config.auth.baseUrl}${this.config.auth.loginPath}`;

    return this.http.post<AuthTokenResponse>(url, credentials).pipe(
      tap((response) => {
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
        this.store.setUser(response.user);
        this.logger.info(MODULE, 'Login successful', { userId: response.user.id });
      }),
      catchError((err: unknown) => {
        const appError = err instanceof HttpErrorResponse ? fromHttpError(err) : fromUnknown(err);
        this.store.setError(appError);
        this.logger.warn(MODULE, 'Login failed', { code: appError.code });
        return throwError(() => appError);
      }),
      finalize(() => this.store.setLoading(false)),
    );
  }

  register(credentials: RegisterCredentials): Observable<AuthTokenResponse> {
    this.store.setLoading(true);
    const url = `${this.config.auth.baseUrl}${this.config.auth.registerPath}`;

    return this.http.post<AuthTokenResponse>(url, credentials).pipe(
      tap((response) => {
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
        this.store.setUser(response.user);
        this.logger.info(MODULE, 'Registration successful', { userId: response.user.id });
      }),
      catchError((err: unknown) => {
        const appError = err instanceof HttpErrorResponse ? fromHttpError(err) : fromUnknown(err);
        this.store.setError(appError);
        this.logger.warn(MODULE, 'Registration failed', { code: appError.code });
        return throwError(() => appError);
      }),
      finalize(() => this.store.setLoading(false)),
    );
  }

  logout(): void {
    const url = `${this.config.auth.baseUrl}${this.config.auth.logoutPath}`;
    this.http.post(url, {}).subscribe({ error: () => undefined });
    this.tokenService.clearTokens();
    this.store.reset();
    this.logger.info(MODULE, 'User logged out');
    this.router.navigate([this.config.auth.postLogoutRoute]);
  }

  refreshToken(): Observable<AuthTokenResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      const error = fromUnknown(new Error('No refresh token available'));
      return throwError(() => error);
    }

    const url = `${this.config.auth.baseUrl}${this.config.auth.refreshPath}`;

    return this.http.post<AuthTokenResponse>(url, { refreshToken }).pipe(
      tap((response) => {
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
        this.store.setUser(response.user);
        this.logger.info(MODULE, 'Token refreshed');
      }),
      catchError((err: unknown) => {
        const appError: AppError = err instanceof HttpErrorResponse ? fromHttpError(err) : fromUnknown(err);
        this.logger.error(MODULE, 'Token refresh failed', { code: appError.code });
        this.logout();
        return throwError(() => appError);
      }),
    );
  }

  restoreSession(): void {
    const token = this.tokenService.getAccessToken();
    if (!token || this.tokenService.isTokenExpired(token)) {
      return;
    }
    const payload = this.tokenService.parsePayload(token);
    if (!payload) {
      return;
    }
    this.store.setUser({ id: payload['sub'], roles: (payload['roles'] as string[]) ?? [] });
  }
}
