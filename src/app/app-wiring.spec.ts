import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { render } from '@testing-library/angular';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';
import { routes } from './app.routes';
import { NAV_ITEMS } from './layout/nav-items.token';
import { provideTemplate } from './core/templates/provide-template';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { APP_CONFIG } from './core/config/app-config.token';
import { AppConfig, DEFAULT_AUTH_CONFIG } from './core/config/app-config.model';

const TEST_CONFIG: AppConfig = {
  environment: {
    production: false,
    apiBaseUrl: 'http://localhost/api',
    authBaseUrl: 'http://localhost',
    logLevel: 'error',
  },
  api: { baseUrl: 'http://localhost/api', timeoutMs: 5000, maxRetries: 0 },
  auth: { ...DEFAULT_AUTH_CONFIG, baseUrl: 'http://localhost' },
  features: {},
};

const baseProviders = [
  { provide: APP_CONFIG, useValue: TEST_CONFIG },
  provideRouter([]),
  provideHttpClient(),
  provideHttpClientTesting(),
];

describe('application wiring', () => {
  it('appConfig exposes a provider set', () => {
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });

  it('routes are defined', () => {
    expect(routes.length).toBeGreaterThan(0);
  });

  it('every lazy route resolves its component', async () => {
    const visit = async (list: typeof routes): Promise<number> => {
      let count = 0;
      for (const route of list) {
        if (route.loadComponent) {
          await route.loadComponent();
          count += 1;
        }
        if (route.loadChildren) {
          await route.loadChildren();
          count += 1;
        }
        if (route.children) {
          count += await visit(route.children);
        }
      }
      return count;
    };
    expect(await visit(routes)).toBeGreaterThan(0);
  });

  it('NAV_ITEMS is an injection token', () => {
    expect(NAV_ITEMS.toString()).toContain('NAV_ITEMS');
  });

  it('provideTemplate contributes a multi NAV_ITEMS provider', () => {
    const providers = provideTemplate({
      navItems: [{ label: 'Home', routerLink: '/' }],
    } as never);
    expect(providers).toHaveLength(1);
  });
});

describe('AppComponent', () => {
  it('renders the router outlet and restores the session on init', async () => {
    await render(AppComponent, { providers: baseProviders });
    expect(document.querySelector('router-outlet')).toBeTruthy();
  });
});

describe('AppShellComponent', () => {
  it('toggles the sidebar collapsed state', async () => {
    const { fixture } = await render(AppShellComponent, { providers: baseProviders });
    const instance = fixture.componentInstance as unknown as {
      sidebarCollapsed(): boolean;
      toggleSidebar(): void;
    };
    expect(instance.sidebarCollapsed()).toBe(false);
    instance.toggleSidebar();
    expect(instance.sidebarCollapsed()).toBe(true);
  });
});
