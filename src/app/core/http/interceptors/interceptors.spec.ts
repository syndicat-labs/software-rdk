import { fakeAsync, tick, TestBed } from '@angular/core/testing';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { APP_CONFIG } from '../../config/app-config.token';
import { AppConfig, DEFAULT_AUTH_CONFIG } from '../../config/app-config.model';
import { TokenService } from '../../auth/token.service';
import { LoggingService } from '../../logging/logging.service';
import { AppError, ErrorCode } from '../../errors/errors.types';
import { requestIdInterceptor } from './request-id.interceptor';
import { authInterceptor } from './auth.interceptor';
import { errorInterceptor } from './error.interceptor';
import { retryInterceptor } from './retry.interceptor';
import { devMockAuthInterceptor } from './dev-mock-auth.interceptor';
import { rdkHttpInterceptors } from './index';

const API_BASE = 'https://api.test';
const AUTH_BASE = 'https://auth.test';
const ERROR_MODULE = 'core/http/error-interceptor';
const RETRY_MODULE = 'core/http/retry-interceptor';
const BASE_DELAY_MS = 1000;

function makeConfig(opts: { production?: boolean; maxRetries?: number } = {}): AppConfig {
  return {
    environment: {
      production: opts.production ?? false,
      apiBaseUrl: API_BASE,
      authBaseUrl: AUTH_BASE,
      logLevel: 'error',
    },
    api: { baseUrl: API_BASE, timeoutMs: 5000, maxRetries: opts.maxRetries ?? 0 },
    auth: { ...DEFAULT_AUTH_CONFIG, baseUrl: AUTH_BASE },
    features: {},
  };
}

interface LoggerStub {
  error: jest.Mock;
  warn: jest.Mock;
  info: jest.Mock;
  debug: jest.Mock;
}

function makeLogger(): LoggerStub {
  return { error: jest.fn(), warn: jest.fn(), info: jest.fn(), debug: jest.fn() };
}

function configure(config: AppConfig, token: string | null = null): LoggerStub {
  const logger = makeLogger();
  TestBed.configureTestingModule({
    providers: [
      { provide: APP_CONFIG, useValue: config },
      { provide: TokenService, useValue: { getAccessToken: () => token } },
      { provide: LoggingService, useValue: logger },
    ],
  });
  return logger;
}

function forwardingNext() {
  return jest.fn((_req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> => of(new HttpResponse()));
}

interface Captured {
  values: HttpEvent<unknown>[];
  error: unknown;
}

function collect(obs: Observable<HttpEvent<unknown>>): Captured {
  const captured: Captured = { values: [], error: undefined };
  obs.subscribe({
    next: (v) => captured.values.push(v),
    error: (e) => (captured.error = e),
  });
  return captured;
}

beforeEach(() => TestBed.resetTestingModule());

describe('rdkHttpInterceptors barrel', () => {
  it('exposes the ordered production interceptor chain', () => {
    expect(rdkHttpInterceptors).toEqual([
      requestIdInterceptor,
      authInterceptor,
      errorInterceptor,
      retryInterceptor,
    ]);
  });
});

describe('requestIdInterceptor', () => {
  it('adds an X-Request-ID header (crypto.randomUUID path)', () => {
    const next = forwardingNext();
    const req = new HttpRequest('GET', `${API_BASE}/x`);
    requestIdInterceptor(req, next as unknown as HttpHandlerFn).subscribe();
    expect(next.mock.calls[0][0].headers.get('X-Request-ID')).toBeTruthy();
  });

  it('falls back to a generated id when crypto.randomUUID is unavailable', () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
    Object.defineProperty(globalThis, 'crypto', { value: {}, configurable: true });
    try {
      const next = forwardingNext();
      const req = new HttpRequest('GET', `${API_BASE}/x`);
      requestIdInterceptor(req, next as unknown as HttpHandlerFn).subscribe();
      expect(next.mock.calls[0][0].headers.get('X-Request-ID')).toMatch(/-/);
    } finally {
      if (original) {
        Object.defineProperty(globalThis, 'crypto', original);
      }
    }
  });
});

describe('authInterceptor', () => {
  function run(url: string, token: string | null): ReturnType<typeof forwardingNext> {
    configure(makeConfig(), token);
    const next = forwardingNext();
    const req = new HttpRequest('GET', url);
    TestBed.runInInjectionContext(() =>
      authInterceptor(req, next as unknown as HttpHandlerFn).subscribe(),
    );
    return next;
  }

  it('adds a Bearer token for API requests when a token exists', () => {
    const next = run(`${API_BASE}/users`, 'tok123');
    expect(next.mock.calls[0][0].headers.get('Authorization')).toBe('Bearer tok123');
  });

  it('adds a Bearer token for auth-base requests', () => {
    const next = run(`${AUTH_BASE}/auth/login`, 'tok123');
    expect(next.mock.calls[0][0].headers.get('Authorization')).toBe('Bearer tok123');
  });

  it('forwards without a token when none is stored', () => {
    const next = run(`${API_BASE}/users`, null);
    expect(next.mock.calls[0][0].headers.get('Authorization')).toBeNull();
  });

  it('does not attach a token to external URLs', () => {
    const next = run('https://cdn.other.com/lib.js', 'tok123');
    expect(next.mock.calls[0][0].headers.get('Authorization')).toBeNull();
  });
});

describe('errorInterceptor', () => {
  function run(error: unknown): { logger: LoggerStub; captured: Captured } {
    const logger = configure(makeConfig());
    const next = jest.fn((): Observable<HttpEvent<unknown>> => throwError(() => error));
    const req = new HttpRequest('GET', `${API_BASE}/x`);
    const captured = collect(
      TestBed.runInInjectionContext(() => errorInterceptor(req, next as unknown as HttpHandlerFn)),
    );
    return { logger, captured };
  }

  it('maps and logs a 500 as a server error', () => {
    const { logger, captured } = run(new HttpErrorResponse({ status: 500, url: `${API_BASE}/x` }));
    expect((captured.error as AppError).httpStatus).toBe(500);
    expect(logger.error).toHaveBeenCalledWith(ERROR_MODULE, 'Server error', expect.any(Object));
  });

  it('logs a 404 as a client error (warn)', () => {
    const { logger, captured } = run(new HttpErrorResponse({ status: 404, url: `${API_BASE}/x` }));
    expect((captured.error as AppError).httpStatus).toBe(404);
    expect(logger.warn).toHaveBeenCalledWith(ERROR_MODULE, 'Client error', expect.any(Object));
  });

  it('logs a status-0 network error', () => {
    const { logger, captured } = run(new HttpErrorResponse({ status: 0, url: `${API_BASE}/x` }));
    expect((captured.error as AppError).httpStatus).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(ERROR_MODULE, 'Network error', expect.any(Object));
  });

  it('wraps a non-HTTP error thrown in the pipeline', () => {
    const { logger, captured } = run(new Error('boom'));
    expect(logger.error).toHaveBeenCalledWith(
      ERROR_MODULE,
      'Non-HTTP error in HTTP pipeline',
      expect.any(Object),
    );
    expect((captured.error as AppError).code).toBe(ErrorCode.INFRASTRUCTURE_NETWORK_ERROR);
  });
});

describe('retryInterceptor', () => {
  const retryableByFlag: AppError = {
    code: ErrorCode.INFRASTRUCTURE_SERVICE_UNAVAIL,
    message: 'unavailable',
    context: {},
    retryable: true,
    httpStatus: 503,
    fieldErrors: null,
    originalError: null,
  };

  function runOnce(
    config: AppConfig,
    next: jest.Mock,
  ): { logger: LoggerStub; captured: Captured } {
    const logger = configure(config);
    const req = new HttpRequest('GET', `${API_BASE}/x`);
    const captured = collect(
      TestBed.runInInjectionContext(() => retryInterceptor(req, next as unknown as HttpHandlerFn)),
    );
    return { logger, captured };
  }

  it('does not retry a non-AppError and rethrows it', fakeAsync(() => {
    const err = new Error('nope');
    const next = jest.fn((): Observable<HttpEvent<unknown>> => throwError(() => err));
    const { captured } = runOnce(makeConfig({ maxRetries: 2 }), next);
    tick();
    expect(next).toHaveBeenCalledTimes(1);
    expect(captured.error).toBe(err);
  }));

  it('throws immediately when maxRetries is 0', fakeAsync(() => {
    const next = jest.fn((): Observable<HttpEvent<unknown>> => throwError(() => retryableByFlag));
    const { captured } = runOnce(makeConfig({ maxRetries: 0 }), next);
    tick();
    expect(next).toHaveBeenCalledTimes(1);
    expect(captured.error).toBe(retryableByFlag);
  }));

  it('retries a status-retryable error, then succeeds', fakeAsync(() => {
    const statusOnly: AppError = { ...retryableByFlag, retryable: false, httpStatus: 503 };
    let calls = 0;
    const next = jest.fn((): Observable<HttpEvent<unknown>> => {
      calls += 1;
      return calls === 1 ? throwError(() => statusOnly) : of(new HttpResponse({ status: 200 }));
    });
    const { logger, captured } = runOnce(makeConfig({ maxRetries: 2 }), next);
    tick(BASE_DELAY_MS);
    expect(next).toHaveBeenCalledTimes(2);
    expect(captured.values).toHaveLength(1);
    expect(logger.warn).toHaveBeenCalledWith(
      RETRY_MODULE,
      'Retrying request',
      expect.objectContaining({ attempt: 1, delayMs: BASE_DELAY_MS }),
    );
  }));

  it('gives up once retries are exhausted', fakeAsync(() => {
    const next = jest.fn((): Observable<HttpEvent<unknown>> => throwError(() => retryableByFlag));
    const { captured } = runOnce(makeConfig({ maxRetries: 1 }), next);
    tick(BASE_DELAY_MS);
    expect(next).toHaveBeenCalledTimes(2);
    expect(captured.error).toBe(retryableByFlag);
  }));

  it('does not retry a non-retryable AppError with no retryable status', fakeAsync(() => {
    const nonRetryable: AppError = { ...retryableByFlag, retryable: false, httpStatus: null };
    const next = jest.fn((): Observable<HttpEvent<unknown>> => throwError(() => nonRetryable));
    const { captured } = runOnce(makeConfig({ maxRetries: 2 }), next);
    tick();
    expect(next).toHaveBeenCalledTimes(1);
    expect(captured.error).toBe(nonRetryable);
  }));
});

describe('devMockAuthInterceptor', () => {
  function run(
    config: AppConfig,
    req: HttpRequest<unknown>,
  ): { next: jest.Mock; captured: Captured } {
    configure(config);
    const next = jest.fn((): Observable<HttpEvent<unknown>> => of(new HttpResponse({ status: 299 })));
    const captured = collect(
      TestBed.runInInjectionContext(() =>
        devMockAuthInterceptor(req, next as unknown as HttpHandlerFn),
      ),
    );
    return { next, captured };
  }

  it('passes through in production', () => {
    const { next } = run(
      makeConfig({ production: true }),
      new HttpRequest('POST', `${AUTH_BASE}/auth/login`, {}),
    );
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('passes through non-POST requests', () => {
    const { next } = run(makeConfig(), new HttpRequest('GET', `${AUTH_BASE}/auth/login`));
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('returns tokens and user for valid login', () => {
    const { next, captured } = run(
      makeConfig(),
      new HttpRequest('POST', `${AUTH_BASE}/auth/login`, {
        username: 'test@rdk.dev',
        password: 'Rdk1234!',
      }),
    );
    expect(next).not.toHaveBeenCalled();
    const res = captured.values[0] as HttpResponse<{
      accessToken: string;
      user: { email: string };
    }>;
    expect(res.status).toBe(200);
    expect(res.body!.accessToken.split('.')).toHaveLength(3);
    expect(res.body!.user.email).toBe('test@rdk.dev');
  });

  it('rejects invalid login with 401', () => {
    const { captured } = run(
      makeConfig(),
      new HttpRequest('POST', `${AUTH_BASE}/auth/login`, { username: 'x', password: 'y' }),
    );
    expect((captured.error as HttpErrorResponse).status).toBe(401);
  });

  it('registers a new user with 201', () => {
    const { captured } = run(
      makeConfig(),
      new HttpRequest('POST', `${AUTH_BASE}/auth/register`, {
        name: 'Jo',
        username: 'jo@rdk.dev',
      }),
    );
    const res = captured.values[0] as HttpResponse<{ user: { name: string } }>;
    expect(res.status).toBe(201);
    expect(res.body!.user.name).toBe('Jo');
  });

  it('handles logout with 204', () => {
    const { captured } = run(makeConfig(), new HttpRequest('POST', `${AUTH_BASE}/auth/logout`, {}));
    expect((captured.values[0] as HttpResponse<unknown>).status).toBe(204);
  });

  it('handles refresh with 200', () => {
    const { captured } = run(makeConfig(), new HttpRequest('POST', `${AUTH_BASE}/auth/refresh`, {}));
    expect((captured.values[0] as HttpResponse<unknown>).status).toBe(200);
  });

  it('passes through unrelated POST requests', () => {
    const { next } = run(makeConfig(), new HttpRequest('POST', `${API_BASE}/items`, {}));
    expect(next).toHaveBeenCalledTimes(1);
  });
});
