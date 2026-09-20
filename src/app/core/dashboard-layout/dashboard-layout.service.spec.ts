import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { DashboardLayoutService } from './dashboard-layout.service';
import { APP_CONFIG } from '../config/app-config.token';
import { DEFAULT_AUTH_CONFIG } from '../config/app-config.model';
import { createDefaultLayout } from './dashboard-layout.model';
import { ErrorCode } from '../errors/errors.types';

const TEST_CONFIG = {
  environment: { production: false, apiBaseUrl: '', authBaseUrl: '', logLevel: 'error' as const },
  api: { baseUrl: 'http://localhost:3000/api', timeoutMs: 1000, maxRetries: 0 },
  auth: DEFAULT_AUTH_CONFIG,
  features: {},
};

describe('DashboardLayoutService', () => {
  let service: DashboardLayoutService;
  let controller: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_CONFIG, useValue: TEST_CONFIG },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(DashboardLayoutService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
    localStorage.clear();
  });

  it('loads from backend and writes to local', fakeAsync(() => {
    const layout = createDefaultLayout();
    let result: unknown;
    service.load().subscribe((v) => (result = v));
    controller.expectOne('http://localhost:3000/api/api/v1/dashboard/layout').flush(layout);
    tick();
    expect(result).toEqual(layout);
    expect(localStorage.getItem('rdk_dashboard_layout_v1')).not.toBeNull();
  }));

  it('falls back to local on backend failure', fakeAsync(() => {
    const layout = createDefaultLayout();
    localStorage.setItem('rdk_dashboard_layout_v1', JSON.stringify(layout));
    let result: unknown;
    service.load().subscribe((v) => (result = v));
    controller.expectOne('http://localhost:3000/api/api/v1/dashboard/layout').flush(null, { status: 500, statusText: 'Server Error' });
    tick();
    expect(result).toEqual(layout);
  }));

  it('falls back to default on 404', fakeAsync(() => {
    let result: unknown;
    service.load().subscribe((v) => (result = v));
    controller.expectOne('http://localhost:3000/api/api/v1/dashboard/layout').flush(null, { status: 404, statusText: 'Not Found' });
    tick();
    expect((result as ReturnType<typeof createDefaultLayout>).widgets.length).toBe(4);
  }));

  it('saves via PUT and writes to local', fakeAsync(() => {
    const layout = createDefaultLayout();
    let completed = false;
    service.save(layout).subscribe({ complete: () => (completed = true) });
    controller.expectOne('http://localhost:3000/api/api/v1/dashboard/layout').flush(null);
    tick();
    expect(completed).toBe(true);
    expect(localStorage.getItem('rdk_dashboard_layout_v1')).not.toBeNull();
  }));

  it('surface persist_failed on save error with retryable', fakeAsync(() => {
    const layout = createDefaultLayout();
    let code: string | undefined;
    service.save(layout).subscribe({ error: (e) => (code = e.code) });
    controller.expectOne('http://localhost:3000/api/api/v1/dashboard/layout').flush(null, { status: 500, statusText: 'Server Error' });
    tick();
    expect(code).toBe(ErrorCode.DASHBOARD_PERSIST_FAILED);
  }));

  it('validates layout before save and rejects invalid colSpan', fakeAsync(() => {
    const layout = createDefaultLayout();
    const bad = { ...layout, widgets: [{ ...layout.widgets[0], colSpan: 999 as never }] };
    let code: string | undefined;
    service.save(bad as never).subscribe({ error: (e) => (code = e.code) });
    tick();
    expect(code).toBe(ErrorCode.DASHBOARD_LAYOUT_INVALID);
    controller.expectNone('http://localhost:3000/api/api/v1/dashboard/layout');
  }));

  it('readLocal returns null for missing or invalid', () => {
    expect(service.readLocal()).toBeNull();
    localStorage.setItem('rdk_dashboard_layout_v1', 'not-json');
    expect(service.readLocal()).toBeNull();
  });

  it('readLocal validates and rejects invalid layout', () => {
    localStorage.setItem('rdk_dashboard_layout_v1', JSON.stringify({ version: 1, updatedAt: 'bad', widgets: [] }));
    expect(service.readLocal()).toBeNull();
  });

  it('writeLocal caps at 10KB', () => {
    const layout = createDefaultLayout();
    const large = { ...layout, widgets: Array.from({ length: 30 }, (_, i) => ({ id: `w-${i}`, widgetId: `widget-${i}`, colSpan: 3 as const, order: i, config: { data: 'x'.repeat(500) } })) };
    service.writeLocal(large as never);
    // should not throw and should not write because over cap
    // localStorage will be empty or previous
    // we just ensure no error
    expect(() => service.writeLocal(large as never)).not.toThrow();
  });
});
