import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CommandPaletteService } from './command-palette.service';
import { CommandRecentsService } from './command-recents.service';
import { NAV_ITEMS } from '../../layout/nav-items.token';
import { APP_CONFIG } from '../config/app-config.token';
import { DEFAULT_AUTH_CONFIG } from '../config/app-config.model';

const TEST_CONFIG = {
  environment: { production: false, apiBaseUrl: '', authBaseUrl: '', logLevel: 'error' as const },
  api: { baseUrl: 'http://localhost:3000/api', timeoutMs: 1000, maxRetries: 0 },
  auth: DEFAULT_AUTH_CONFIG,
  features: {},
};

describe('CommandPaletteService', () => {
  let service: CommandPaletteService;
  let recents: CommandRecentsService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_CONFIG, useValue: TEST_CONFIG },
        { provide: NAV_ITEMS, useValue: [
          { label: 'Home', icon: 'pi pi-home', routerLink: '/app/dashboard' },
          {
            label: 'Components',
            items: [{ label: 'Button', routerLink: '/showcase/atoms/button' }],
          },
        ], multi: true },
        provideRouter([{ path: 'app/dashboard', component: class {} }]),
        provideHttpClient(),
      ],
    });
    service = TestBed.inject(CommandPaletteService);
    recents = TestBed.inject(CommandRecentsService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('is closed by default and opens/closes', () => {
    expect(service.visible()).toBe(false);
    service.open();
    expect(service.visible()).toBe(true);
    service.close();
    expect(service.visible()).toBe(false);
  });

  it('open() resets the query', () => {
    service.open();
    service.query.set('oops');
    service.close();
    service.open();
    expect(service.query()).toBe('');
  });

  it('builds navigation entries from the multi NAV_ITEMS token, flattening groups', () => {
    const labels = service
      .buildEntries()
      .filter((e) => e.section === 'navigation')
      .map((e) => e.label);
    expect(labels).toEqual(expect.arrayContaining(['Home', 'Button']));
  });

  it('builds Create recipes and at least one action', () => {
    const entries = service.buildEntries();
    expect(entries.some((e) => e.section === 'create' && e.routerLink?.includes('pricing-section'))).toBe(true);
    expect(entries.some((e) => e.section === 'actions')).toBe(true);
  });

  it('reflects recorded recents in the Recents section', () => {
    recents.record('Invoice', '/showcase/new-design-ideas/erp-invoice');
    const recentsSection = service.buildEntries().filter((e) => e.section === 'recents');
    expect(recentsSection).toHaveLength(1);
    expect(recentsSection[0].label).toBe('Invoice');
  });

  it('navigates and records a recent when run() executes a router entry', fakeAsync(() => {
    const navSpy = jest.spyOn(router, 'navigateByUrl');
    const entries = service.buildEntries();
    const home = entries.find((e) => e.id === 'nav-/app/dashboard');
    expect(home).toBeDefined();

    service.run(home!);
    tick();
    expect(navSpy).toHaveBeenCalledWith('/app/dashboard');
    expect(recents.list()).toHaveLength(1);
    expect(recents.list()[0].url).toBe('/app/dashboard');
    expect(service.visible()).toBe(false);
  }));

  it('executes action run() without navigating or recording', () => {
    const navSpy = jest.spyOn(router, 'navigateByUrl');
    service.open();
    const action = service.buildEntries().find((e) => e.section === 'actions')!;
    service.run(action);
    expect(navSpy).not.toHaveBeenCalled();
    expect(recents.list()).toHaveLength(0);
    expect(service.visible()).toBe(false);
  });

  it('toggles visibility', () => {
    service.toggle();
    expect(service.visible()).toBe(true);
    service.toggle();
    expect(service.visible()).toBe(false);
  });
});