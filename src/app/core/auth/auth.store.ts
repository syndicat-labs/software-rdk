import { computed, Injectable, signal } from '@angular/core';
import { AppError } from '../errors/errors.types';

export interface AuthUser {
  readonly id: string;
  readonly roles: ReadonlyArray<string>;
  readonly [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _user = signal<AuthUser | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<AppError | null>(null);

  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly roles = computed(() => this._user()?.roles ?? []);

  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }

  hasAnyRole(...roles: string[]): boolean {
    return roles.some((r) => this.hasRole(r));
  }

  setUser(user: AuthUser): void {
    this._user.set(user);
    this._error.set(null);
  }

  clearUser(): void {
    this._user.set(null);
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  setError(error: AppError): void {
    this._error.set(error);
  }

  reset(): void {
    this._user.set(null);
    this._isLoading.set(false);
    this._error.set(null);
  }
}
