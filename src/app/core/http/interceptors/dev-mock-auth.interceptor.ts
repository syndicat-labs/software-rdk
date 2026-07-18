import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, throwError } from 'rxjs';
import { APP_CONFIG } from '../../config/app-config.token';

const TEST_EMAIL = 'test@rdk.dev';
const TEST_PASSWORD = 'Rdk1234!';
const TEST_USER_ID = 'dev-test-user';

function b64url(obj: object): string {
  return btoa(JSON.stringify(obj))
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function makeMockJwt(userId: string, email: string, ttlSeconds = 3600): string {
  const now = Math.floor(Date.now() / 1000);
  return [
    b64url({ alg: 'none', typ: 'JWT' }),
    b64url({ sub: userId, email, roles: ['user'], iat: now, exp: now + ttlSeconds }),
    'dev-mock',
  ].join('.');
}

export const devMockAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(APP_CONFIG);

  if (config.environment.production) {
    return next(req);
  }

  const base = config.auth.baseUrl;
  const loginUrl = base + config.auth.loginPath;
  const logoutUrl = base + config.auth.logoutPath;
  const refreshUrl = base + config.auth.refreshPath;
  const registerUrl = base + config.auth.registerPath;

  if (req.method !== 'POST') {
    return next(req);
  }

  if (req.url === loginUrl) {
    const { username, password } = req.body as { username: string; password: string };
    if (username === TEST_EMAIL && password === TEST_PASSWORD) {
      return of(new HttpResponse({
        status: 200,
        body: {
          accessToken: makeMockJwt(TEST_USER_ID, TEST_EMAIL),
          refreshToken: makeMockJwt(TEST_USER_ID, TEST_EMAIL, 86400),
          user: { id: TEST_USER_ID, email: TEST_EMAIL, name: 'Test User', roles: ['user'] },
        },
      }));
    }
    return throwError(() => new HttpErrorResponse({
      status: 401,
      error: { code: 'AUTH_INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      url: req.url,
    }));
  }

  if (req.url === registerUrl) {
    const { name, username } = req.body as { name: string; username: string };
    const userId = `dev-${username.split('@')[0]}-${Date.now()}`;
    return of(new HttpResponse({
      status: 201,
      body: {
        accessToken: makeMockJwt(userId, username),
        refreshToken: makeMockJwt(userId, username, 86400),
        user: { id: userId, email: username, name, roles: ['user'] },
      },
    }));
  }

  if (req.url === logoutUrl) {
    return of(new HttpResponse({ status: 204 }));
  }

  if (req.url === refreshUrl) {
    return of(new HttpResponse({
      status: 200,
      body: {
        accessToken: makeMockJwt(TEST_USER_ID, TEST_EMAIL),
        refreshToken: makeMockJwt(TEST_USER_ID, TEST_EMAIL, 86400),
        user: { id: TEST_USER_ID, email: TEST_EMAIL, name: 'Test User', roles: ['user'] },
      },
    }));
  }

  return next(req);
};
