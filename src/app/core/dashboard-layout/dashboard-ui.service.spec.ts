import { TestBed } from '@angular/core/testing';
import { DashboardUiService } from './dashboard-ui.service';

describe('DashboardUiService', () => {
  let service: DashboardUiService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    service = TestBed.inject(DashboardUiService);
  });

  it('toggles catalog visibility', () => {
    expect(service.catalogVisible()).toBe(false);
    service.openCatalog();
    expect(service.catalogVisible()).toBe(true);
    service.closeCatalog();
    expect(service.catalogVisible()).toBe(false);
  });

  it('opens and closes config with widget id and title', () => {
    service.openConfig('revenue', 'Revenue');
    expect(service.configVisible()).toBe(true);
    expect(service.configWidgetId()).toBe('revenue');
    expect(service.configInitialTitle()).toBe('Revenue');
    service.closeConfig();
    expect(service.configVisible()).toBe(false);
    expect(service.configWidgetId()).toBeNull();
  });

  it('requests and confirms remove', () => {
    expect(service.confirmVisible()).toBe(false);
    service.requestRemove('revenue');
    expect(service.confirmVisible()).toBe(true);
    expect(service.pendingRemoveId()).toBe('revenue');
    const id = service.confirmRemove();
    expect(id).toBe('revenue');
    expect(service.confirmVisible()).toBe(false);
    expect(service.pendingRemoveId()).toBeNull();
  });

  it('closeConfirm clears pending', () => {
    service.requestRemove('orders');
    service.closeConfirm();
    expect(service.confirmVisible()).toBe(false);
    expect(service.pendingRemoveId()).toBeNull();
  });
});
