import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApiClient } from './api-client.service';
import { APP_CONFIG } from '../config/app-config.token';
import { AppConfig, DEFAULT_AUTH_CONFIG } from '../config/app-config.model';
import { errorInterceptor } from './interceptors/error.interceptor';
import { requestIdInterceptor } from './interceptors/request-id.interceptor';
import { ErrorCode } from '../errors/errors.types';

const BASE_URL = 'http://localhost:3000/api';

const TEST_CONFIG: AppConfig = {
  environment: { production: false, apiBaseUrl: BASE_URL, authBaseUrl: 'http://localhost:3000', logLevel: 'error' },
  api: { baseUrl: BASE_URL, timeoutMs: 30000, maxRetries: 0 },
  auth: { ...DEFAULT_AUTH_CONFIG, baseUrl: 'http://localhost:3000' },
  features: {},
};

describe('ApiClient (URL construction and HTTP methods)', () => {
  let client: ApiClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_CONFIG, useValue: TEST_CONFIG },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    client = TestBed.inject(ApiClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  describe('URL construction', () => {
    it('prepends base URL to path', () => {
      client.get('/users').subscribe();
      const req = controller.expectOne(`${BASE_URL}/users`);
      expect(req.request.url).toBe(`${BASE_URL}/users`);
      req.flush([]);
    });

    it('normalises path that does not start with /', () => {
      client.get('users').subscribe();
      const req = controller.expectOne(`${BASE_URL}/users`);
      req.flush([]);
    });
  });

  describe('GET', () => {
    it('returns the response body', (done) => {
      client.get<{ id: number }>('/item/1').subscribe((res) => {
        expect(res).toEqual({ id: 1 });
        done();
      });
      controller.expectOne(`${BASE_URL}/item/1`).flush({ id: 1 });
    });

    it('attaches query params', () => {
      client.get('/items', { params: { page: 1, limit: 10 } }).subscribe();
      const req = controller.expectOne((r) => r.url === `${BASE_URL}/items`);
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('limit')).toBe('10');
      req.flush([]);
    });

    it('supports array query params', () => {
      client.get('/items', { params: { ids: ['1', '2'] } }).subscribe();
      const req = controller.expectOne((r) => r.url === `${BASE_URL}/items`);
      expect(req.request.params.getAll('ids')).toEqual(['1', '2']);
      req.flush([]);
    });

    it('attaches custom headers', () => {
      client.get('/items', { headers: { 'X-Custom': 'yes' } }).subscribe();
      const req = controller.expectOne(`${BASE_URL}/items`);
      expect(req.request.headers.get('X-Custom')).toBe('yes');
      req.flush([]);
    });
  });

  describe('POST', () => {
    it('sends body and returns response', (done) => {
      const body = { name: 'Alice' };
      client.post<{ id: number }>('/users', body).subscribe((res) => {
        expect(res).toEqual({ id: 42 });
        done();
      });
      const req = controller.expectOne(`${BASE_URL}/users`);
      expect(req.request.body).toEqual(body);
      req.flush({ id: 42 });
    });
  });

  describe('PUT', () => {
    it('sends body', () => {
      client.put('/users/1', { name: 'Bob' }).subscribe();
      const req = controller.expectOne(`${BASE_URL}/users/1`);
      expect(req.request.method).toBe('PUT');
      req.flush({});
    });
  });

  describe('PATCH', () => {
    it('sends patch body', () => {
      client.patch('/users/1', { active: false }).subscribe();
      const req = controller.expectOne(`${BASE_URL}/users/1`);
      expect(req.request.method).toBe('PATCH');
      req.flush({});
    });
  });

  describe('DELETE', () => {
    it('sends delete request', () => {
      client.delete('/users/1').subscribe();
      const req = controller.expectOne(`${BASE_URL}/users/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});

describe('requestIdInterceptor', () => {
  let client: ApiClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_CONFIG, useValue: TEST_CONFIG },
        provideHttpClient(withInterceptors([requestIdInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    client = TestBed.inject(ApiClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('attaches X-Request-ID header', () => {
    client.get('/ping').subscribe();
    const req = controller.expectOne(`${BASE_URL}/ping`);
    expect(req.request.headers.get('X-Request-ID')).toBeTruthy();
    req.flush({});
  });

  it('generates unique IDs per request', () => {
    client.get('/a').subscribe();
    client.get('/b').subscribe();
    const requests = controller.match(() => true);
    const ids = requests.map((r) => r.request.headers.get('X-Request-ID'));
    expect(ids[0]).not.toBe(ids[1]);
    requests.forEach((r) => r.flush({}));
  });
});

describe('errorInterceptor', () => {
  let client: ApiClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_CONFIG, useValue: TEST_CONFIG },
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    client = TestBed.inject(ApiClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('maps 404 to AppError with RESOURCE_NOT_FOUND code', (done) => {
    client.get('/missing').subscribe({
      error: (err) => {
        expect(err.code).toBe(ErrorCode.RESOURCE_NOT_FOUND);
        done();
      },
    });
    controller.expectOne(`${BASE_URL}/missing`).flush(null, { status: 404, statusText: 'Not Found' });
  });

  it('maps 401 to AppError with AUTH_TOKEN_INVALID code', (done) => {
    client.get('/protected').subscribe({
      error: (err) => {
        expect(err.code).toBe(ErrorCode.AUTH_TOKEN_INVALID);
        done();
      },
    });
    controller.expectOne(`${BASE_URL}/protected`).flush(null, { status: 401, statusText: 'Unauthorized' });
  });

  it('uses server error envelope code when present', (done) => {
    const body = { error: { code: 'AUTH_ACCOUNT_LOCKED', message: 'Account locked' } };
    client.get('/me').subscribe({
      error: (err) => {
        expect(err.code).toBe('AUTH_ACCOUNT_LOCKED');
        expect(err.message).toBe('Account locked');
        done();
      },
    });
    controller.expectOne(`${BASE_URL}/me`).flush(body, { status: 423, statusText: 'Locked' });
  });

  it('maps network error (status 0) to INFRASTRUCTURE_NETWORK_ERROR', (done) => {
    client.get('/unreachable').subscribe({
      error: (err) => {
        expect(err.code).toBe(ErrorCode.INFRASTRUCTURE_NETWORK_ERROR);
        expect(err.retryable).toBe(true);
        done();
      },
    });
    const req = controller.expectOne(`${BASE_URL}/unreachable`);
    req.error(new ProgressEvent('error'));
  });
});
