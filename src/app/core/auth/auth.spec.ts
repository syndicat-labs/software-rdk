import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';
import { AuthStore } from './auth.store';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { APP_CONFIG } from '../config/app-config.token';
import { AppConfig, DEFAULT_AUTH_CONFIG } from '../config/app-config.model';
import { authGuard } from './auth.guard';
import { ErrorCode } from '../errors/errors.types';

const BASE_URL = 'http://localhost:3000';

const TEST_CONFIG: AppConfig = {
  environment: { production: false, apiBaseUrl: `${BASE_URL}/api`, authBaseUrl: BASE_URL, logLevel: 'error' },
  api: { baseUrl: `${BASE_URL}/api`, timeoutMs: 30000, maxRetries: 0 },
  auth: {
    ...DEFAULT_AUTH_CONFIG,
    baseUrl: BASE_URL,
    loginPath: '/auth/login',
    logoutPath: '/auth/logout',
    refreshPath: '/auth/refresh',
  },
  features: {},
};

const MOCK_USER = { id: 'user-1', roles: ['user'] };
const MOCK_TOKENS = { accessToken: 'access.tok.en', refreshToken: 'refresh.tok.en', user: MOCK_USER };

function buildJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

describe('AuthStore', () => {
  let store: AuthStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: APP_CONFIG, useValue: TEST_CONFIG }] });
    store = TestBed.inject(AuthStore);
  });

  it('starts unauthenticated', () => {
    expect(store.isAuthenticated()).toBe(false);
    expect(store.user()).toBeNull();
  });

  it('becomes authenticated after setUser', () => {
    store.setUser(MOCK_USER);
    expect(store.isAuthenticated()).toBe(true);
    expect(store.user()).toEqual(MOCK_USER);
  });

  it('exposes roles signal', () => {
    store.setUser({ id: '1', roles: ['admin', 'user'] });
    expect(store.roles()).toEqual(['admin', 'user']);
  });

  it('hasRole returns true when role exists', () => {
    store.setUser({ id: '1', roles: ['admin'] });
    expect(store.hasRole('admin')).toBe(true);
  });

  it('hasRole returns false for absent role', () => {
    store.setUser({ id: '1', roles: ['user'] });
    expect(store.hasRole('admin')).toBe(false);
  });

  it('hasAnyRole returns true if at least one role matches', () => {
    store.setUser({ id: '1', roles: ['user'] });
    expect(store.hasAnyRole('admin', 'user')).toBe(true);
  });

  it('clears user on clearUser', () => {
    store.setUser(MOCK_USER);
    store.clearUser();
    expect(store.isAuthenticated()).toBe(false);
  });

  it('resets all state on reset', () => {
    store.setUser(MOCK_USER);
    store.setLoading(true);
    store.reset();
    expect(store.isAuthenticated()).toBe(false);
    expect(store.isLoading()).toBe(false);
  });
});

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: APP_CONFIG, useValue: TEST_CONFIG }] });
    service = TestBed.inject(TokenService);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('stores and retrieves access token', () => {
    service.setTokens('at', 'rt');
    expect(service.getAccessToken()).toBe('at');
  });

  it('stores and retrieves refresh token', () => {
    service.setTokens('at', 'rt');
    expect(service.getRefreshToken()).toBe('rt');
  });

  it('clears tokens on clearTokens', () => {
    service.setTokens('at', 'rt');
    service.clearTokens();
    expect(service.getAccessToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
  });

  it('isTokenExpired returns true for expired token', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 100;
    const token = buildJwt({ sub: 'u1', exp: pastExp, iat: pastExp - 3600 });
    expect(service.isTokenExpired(token)).toBe(true);
  });

  it('isTokenExpired returns false for valid token', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const token = buildJwt({ sub: 'u1', exp: futureExp, iat: futureExp - 3600 });
    expect(service.isTokenExpired(token)).toBe(false);
  });

  it('isTokenExpired returns true for malformed token', () => {
    expect(service.isTokenExpired('not.a.jwt')).toBe(true);
  });

  it('isTokenExpired returns true for token with non-JSON payload', () => {
    const token = 'header.!!!.sig';
    expect(service.isTokenExpired(token)).toBe(true);
  });

  it('isTokenExpiringSoon returns true when within threshold', () => {
    const soonExp = Math.floor(Date.now() / 1000) + 30;
    const token = buildJwt({ sub: 'u1', exp: soonExp, iat: soonExp - 3600 });
    expect(service.isTokenExpiringSoon(token)).toBe(true);
  });

  it('isTokenExpiringSoon returns false when well outside threshold', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const token = buildJwt({ sub: 'u1', exp: futureExp, iat: futureExp - 7200 });
    expect(service.isTokenExpiringSoon(token)).toBe(false);
  });

  it('parsePayload returns null for non-three-part token', () => {
    expect(service.parsePayload('only.two')).toBeNull();
  });

  it('parsePayload extracts sub and exp', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const token = buildJwt({ sub: 'u1', exp, iat: exp - 3600 });
    const payload = service.parsePayload(token);
    expect(payload?.['sub']).toBe('u1');
  });
});

describe('AuthService', () => {
  let service: AuthService;
  let store: AuthStore;
  let controller: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_CONFIG, useValue: TEST_CONFIG },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'login', component: {} as never }]),
      ],
    });
    service = TestBed.inject(AuthService);
    store = TestBed.inject(AuthStore);
    controller = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    controller.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('stores tokens on success', fakeAsync(() => {
      service.login({ username: 'a', password: 'b' }).subscribe();
      controller.expectOne(`${BASE_URL}/auth/login`).flush(MOCK_TOKENS);
      tick();
      expect(tokenService.getAccessToken()).toBe('access.tok.en');
    }));

    it('sets user in store on success', fakeAsync(() => {
      service.login({ username: 'a', password: 'b' }).subscribe();
      controller.expectOne(`${BASE_URL}/auth/login`).flush(MOCK_TOKENS);
      tick();
      expect(store.isAuthenticated()).toBe(true);
      expect(store.user()?.['id']).toBe('user-1');
    }));

    it('sets error in store on failure', fakeAsync(() => {
      service.login({ username: 'a', password: 'wrong' }).subscribe({ error: () => undefined });
      controller.expectOne(`${BASE_URL}/auth/login`).flush(null, { status: 401, statusText: 'Unauthorized' });
      tick();
      expect(store.error()?.code).toBe(ErrorCode.AUTH_TOKEN_INVALID);
    }));

    it('clears loading state after success', fakeAsync(() => {
      service.login({ username: 'a', password: 'b' }).subscribe();
      controller.expectOne(`${BASE_URL}/auth/login`).flush(MOCK_TOKENS);
      tick();
      expect(store.isLoading()).toBe(false);
    }));

    it('clears loading state after failure', fakeAsync(() => {
      service.login({ username: 'a', password: 'wrong' }).subscribe({ error: () => undefined });
      controller.expectOne(`${BASE_URL}/auth/login`).flush(null, { status: 401, statusText: 'Unauthorized' });
      tick();
      expect(store.isLoading()).toBe(false);
    }));
  });

  describe('logout', () => {
    it('clears tokens', () => {
      tokenService.setTokens('at', 'rt');
      store.setUser(MOCK_USER);
      service.logout();
      controller.expectOne(`${BASE_URL}/auth/logout`).flush(null);
      expect(tokenService.getAccessToken()).toBeNull();
    });

    it('resets store', () => {
      store.setUser(MOCK_USER);
      service.logout();
      controller.expectOne(`${BASE_URL}/auth/logout`).flush(null);
      expect(store.isAuthenticated()).toBe(false);
    });
  });

  describe('restoreSession', () => {
    it('restores user from valid non-expired token', () => {
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const token = buildJwt({ sub: 'u1', exp, iat: exp - 3600, roles: ['admin'] });
      tokenService.setTokens(token, 'rt');
      service.restoreSession();
      expect(store.isAuthenticated()).toBe(true);
      expect(store.hasRole('admin')).toBe(true);
    });

    it('does not restore session for expired token', () => {
      const exp = Math.floor(Date.now() / 1000) - 100;
      const token = buildJwt({ sub: 'u1', exp, iat: exp - 3600 });
      tokenService.setTokens(token, 'rt');
      service.restoreSession();
      expect(store.isAuthenticated()).toBe(false);
    });

    it('does nothing when no token stored', () => {
      service.restoreSession();
      expect(store.isAuthenticated()).toBe(false);
    });
  });
});

describe('authGuard', () => {
  let store: AuthStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_CONFIG, useValue: TEST_CONFIG },
        provideRouter([
          { path: 'login', component: {} as never },
          { path: 'protected', component: {} as never, canActivate: [authGuard] },
          { path: 'public', component: {} as never, canActivate: [authGuard], data: { public: true } },
        ]),
      ],
    });
    store = TestBed.inject(AuthStore);
    router = TestBed.inject(Router);
  });

  it('allows access when authenticated', fakeAsync(() => {
    store.setUser(MOCK_USER);
    let canActivate: boolean | unknown = false;
    TestBed.runInInjectionContext(() => {
      canActivate = authGuard(
        { data: {} } as never,
        { url: '/protected' } as never,
      );
    });
    expect(canActivate).toBe(true);
  }));

  it('redirects to /login when unauthenticated', fakeAsync(() => {
    let result: unknown;
    TestBed.runInInjectionContext(() => {
      result = authGuard(
        { data: {} } as never,
        { url: '/protected' } as never,
      );
    });
    expect(result).not.toBe(true);
    expect(result).toBeTruthy();
  }));

  it('allows access to public routes without authentication', fakeAsync(() => {
    let canActivate: boolean | unknown = false;
    TestBed.runInInjectionContext(() => {
      canActivate = authGuard(
        { data: { public: true } } as never,
        { url: '/public' } as never,
      );
    });
    expect(canActivate).toBe(true);
  }));
});
