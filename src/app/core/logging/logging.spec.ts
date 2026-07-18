import { TestBed } from '@angular/core/testing';
import { LoggingService } from './logging.service';
import { APP_CONFIG } from '../config/app-config.token';
import { AppConfig, DEFAULT_AUTH_CONFIG } from '../config/app-config.model';
import { sanitizeContext } from './logging.model';

function makeConfig(overrides: Partial<AppConfig['environment']> = {}): AppConfig {
  return {
    environment: {
      production: false,
      apiBaseUrl: 'http://localhost:3000',
      authBaseUrl: 'http://localhost:3000',
      logLevel: 'debug',
      ...overrides,
    },
    api: { baseUrl: 'http://localhost:3000', timeoutMs: 30000, maxRetries: 3 },
    auth: { ...DEFAULT_AUTH_CONFIG, baseUrl: 'http://localhost:3000' },
    features: {},
  };
}

describe('sanitizeContext', () => {
  it('redacts password fields', () => {
    const result = sanitizeContext({ password: 'secret123' });
    expect(result['password']).toBe('[REDACTED]');
  });

  it('redacts token fields', () => {
    const result = sanitizeContext({ accessToken: 'eyJ...' });
    expect(result['accessToken']).toBe('[REDACTED]');
  });

  it('redacts email fields', () => {
    const result = sanitizeContext({ email: 'user@example.com' });
    expect(result['email']).toBe('[REDACTED]');
  });

  it('preserves safe fields', () => {
    const result = sanitizeContext({ userId: '123', status: 'ok' });
    expect(result['userId']).toBe('123');
    expect(result['status']).toBe('ok');
  });

  it('recursively sanitizes nested objects', () => {
    const result = sanitizeContext({ user: { password: 'oops', name: 'Alice' } });
    expect((result['user'] as Record<string, unknown>)['password']).toBe('[REDACTED]');
    expect((result['user'] as Record<string, unknown>)['name']).toBe('Alice');
  });

  it('preserves arrays without sanitizing them recursively', () => {
    const result = sanitizeContext({ tags: ['a', 'b'] });
    expect(result['tags']).toEqual(['a', 'b']);
  });

  it('does not mutate the original context', () => {
    const original = { password: 'secret' };
    sanitizeContext(original);
    expect(original['password']).toBe('secret');
  });
});

describe('LoggingService', () => {
  let service: LoggingService;
  let consoleSpy: {
    log: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
  };

  beforeEach(() => {
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(() => undefined),
      warn: jest.spyOn(console, 'warn').mockImplementation(() => undefined),
      error: jest.spyOn(console, 'error').mockImplementation(() => undefined),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('debug level disabled in production', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: APP_CONFIG, useValue: makeConfig({ production: true, logLevel: 'debug' }) }],
      });
      service = TestBed.inject(LoggingService);
    });

    it('does not emit debug logs in production', () => {
      service.debug('test', 'debug message');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('still emits error logs in production', () => {
      service.error('test', 'error message');
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
    });

    it('outputs structured JSON in production', () => {
      service.info('core/auth', 'Login success');
      const output = consoleSpy.log.mock.calls[0][0] as string;
      const parsed = JSON.parse(output) as Record<string, unknown>;
      expect(parsed['level']).toBe('info');
      expect(parsed['module']).toBe('core/auth');
      expect(parsed['message']).toBe('Login success');
    });
  });

  describe('development logging', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: APP_CONFIG, useValue: makeConfig({ production: false, logLevel: 'debug' }) }],
      });
      service = TestBed.inject(LoggingService);
    });

    it('emits debug logs in development', () => {
      service.debug('test', 'debug msg');
      expect(consoleSpy.log).toHaveBeenCalled();
    });

    it('uses console.error for error level', () => {
      service.error('test', 'error msg');
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('uses console.warn for warn level', () => {
      service.warn('test', 'warn msg');
      expect(consoleSpy.warn).toHaveBeenCalled();
    });
  });

  describe('log level filtering', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: APP_CONFIG, useValue: makeConfig({ production: false, logLevel: 'warn' }) }],
      });
      service = TestBed.inject(LoggingService);
    });

    it('suppresses info when minLevel is warn', () => {
      service.info('test', 'info message');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('emits warn when minLevel is warn', () => {
      service.warn('test', 'warn message');
      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('emits error when minLevel is warn', () => {
      service.error('test', 'error message');
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('PII exclusion', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: APP_CONFIG, useValue: makeConfig() }],
      });
      service = TestBed.inject(LoggingService);
    });

    it('does not log email in context', () => {
      service.info('test', 'login', { email: 'user@test.com' });
      const call = consoleSpy.log.mock.calls[0];
      expect(JSON.stringify(call)).not.toContain('user@test.com');
    });

    it('does not log token in context', () => {
      service.info('test', 'refresh', { accessToken: 'eyJsecret' });
      const call = consoleSpy.log.mock.calls[0];
      expect(JSON.stringify(call)).not.toContain('eyJsecret');
    });
  });

  describe('default context', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: APP_CONFIG, useValue: makeConfig() }],
      });
      service = TestBed.inject(LoggingService);
    });

    it('accepts calls without context argument', () => {
      expect(() => service.info('test', 'message')).not.toThrow();
    });
  });
});
