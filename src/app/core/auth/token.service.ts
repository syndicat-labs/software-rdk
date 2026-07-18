import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../config/app-config.token';

export interface JwtPayload {
  readonly sub: string;
  readonly exp: number;
  readonly iat: number;
  readonly roles?: string[];
  readonly [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly config = inject(APP_CONFIG);

  getAccessToken(): string | null {
    return localStorage.getItem(this.config.auth.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.config.auth.refreshTokenKey);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.config.auth.accessTokenKey, accessToken);
    localStorage.setItem(this.config.auth.refreshTokenKey, refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem(this.config.auth.accessTokenKey);
    localStorage.removeItem(this.config.auth.refreshTokenKey);
  }

  isTokenExpired(token: string): boolean {
    const payload = this.parsePayload(token);
    if (!payload) {
      return true;
    }
    const nowSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowSeconds;
  }

  isTokenExpiringSoon(token: string): boolean {
    const payload = this.parsePayload(token);
    if (!payload) {
      return true;
    }
    const nowSeconds = Math.floor(Date.now() / 1000);
    const threshold = this.config.auth.proactiveRefreshThresholdSeconds;
    return payload.exp - nowSeconds <= threshold;
  }

  parsePayload(token: string): JwtPayload | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(base64);
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }
}
