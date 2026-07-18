import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent, NavItem } from './sidebar/sidebar.component';
import { AuthStore } from '../core/auth/auth.store';
import { APP_CONFIG } from '../core/config/app-config.token';

const MOCK_CONFIG = {
  environment: 'test',
  api: { baseUrl: 'http://localhost', timeoutMs: 5000, maxRetries: 0 },
  auth: {
    baseUrl: 'http://localhost',
    loginPath: '/auth/login',
    logoutPath: '/auth/logout',
    refreshPath: '/auth/refresh',
    accessTokenKey: 'rdk_access_token',
    refreshTokenKey: 'rdk_refresh_token',
    proactiveRefreshThresholdSeconds: 60,
  },
  features: {},
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
  { label: 'Items',     icon: 'pi pi-list', routerLink: '/dashboard/items' },
];

// ─── HeaderComponent ──────────────────────────────────────────────────────────
describe('HeaderComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders the toggle button', async () => {
    await render('<rdk-header />', {
      imports: [HeaderComponent, RouterTestingModule],
    });
    expect(screen.getByRole('button', { name: 'Toggle sidebar' })).toBeInTheDocument();
  });

  it('renders title when provided', async () => {
    await render('<rdk-header title="My Page" />', {
      imports: [HeaderComponent, RouterTestingModule],
    });
    expect(screen.getByText('My Page')).toBeInTheDocument();
  });

  it('does not render title element when title is empty', async () => {
    await render('<rdk-header title="" />', {
      imports: [HeaderComponent, RouterTestingModule],
    });
    expect(document.querySelector('.rdk-header__title')).not.toBeInTheDocument();
  });

  it('emits sidebarToggle when toggle button clicked', async () => {
    const fn = jest.fn();
    await render('<rdk-header (sidebarToggle)="fn()" />', {
      imports: [HeaderComponent, RouterTestingModule],
      componentProperties: { fn },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Toggle sidebar' }));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('shows sign-in link when unauthenticated', async () => {
    await render('<rdk-header />', {
      imports: [HeaderComponent, RouterTestingModule],
    });
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('shows user avatar when authenticated', async () => {
    const { detectChanges } = await render('<rdk-header />', {
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        {
          provide: AuthStore,
          useValue: {
            isAuthenticated: signal(true),
            user: signal({ id: '1', email: 'a@b.com' }),
            roles: signal(['user']),
            hasRole: () => false,
          },
        },
      ],
    });
    detectChanges();
    expect(document.querySelector('.rdk-header__avatar')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Sign in' })).not.toBeInTheDocument();
  });

  it('projects actions slot content', async () => {
    await render(
      '<rdk-header><button slot="actions" id="custom">Action</button></rdk-header>',
      { imports: [HeaderComponent, RouterTestingModule] },
    );
    expect(document.querySelector('#custom')).toBeInTheDocument();
  });
});

// ─── SidebarComponent ─────────────────────────────────────────────────────────
describe('SidebarComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  const baseProviders = [provideHttpClient(), { provide: APP_CONFIG, useValue: MOCK_CONFIG }];
  const baseImports = [SidebarComponent, RouterTestingModule];

  it('renders nav items', async () => {
    await render('<rdk-sidebar [navItems]="items" />', {
      imports: baseImports, providers: baseProviders,
      componentProperties: { items: NAV_ITEMS },
    });
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Items' })).toBeInTheDocument();
  });

  it('renders brand mark', async () => {
    await render('<rdk-sidebar [navItems]="items" />', {
      imports: baseImports, providers: baseProviders,
      componentProperties: { items: NAV_ITEMS },
    });
    expect(screen.getByText('⬡')).toBeInTheDocument();
  });

  it('shows brand name when not collapsed', async () => {
    await render('<rdk-sidebar [navItems]="items" [collapsed]="false" />', {
      imports: baseImports, providers: baseProviders,
      componentProperties: { items: NAV_ITEMS },
    });
    expect(screen.getByText('RDK')).toBeInTheDocument();
  });

  it('hides brand name when collapsed', async () => {
    await render('<rdk-sidebar [navItems]="items" [collapsed]="true" />', {
      imports: baseImports, providers: baseProviders,
      componentProperties: { items: NAV_ITEMS },
    });
    expect(screen.queryByText('RDK')).not.toBeInTheDocument();
  });

  it('filters out items without a routerLink', async () => {
    const itemsWithMissing: NavItem[] = [
      ...NAV_ITEMS,
      { label: 'No link', icon: 'pi pi-circle' },
    ];
    await render('<rdk-sidebar [navItems]="items" />', {
      imports: baseImports, providers: baseProviders,
      componentProperties: { items: itemsWithMissing },
    });
    expect(screen.queryByText('No link')).not.toBeInTheDocument();
  });

  it('filters out items where user lacks required role', async () => {
    const adminItem: NavItem[] = [
      ...NAV_ITEMS,
      { label: 'Admin', icon: 'pi pi-shield', routerLink: '/admin', roles: ['admin'] },
    ];
    await render('<rdk-sidebar [navItems]="items" />', {
      imports: baseImports,
      providers: [
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: MOCK_CONFIG },
        {
          provide: AuthStore,
          useValue: {
            isAuthenticated: signal(false),
            user: signal(null),
            roles: signal(['user']),
            hasRole: (role: string) => role === 'user',
          },
        },
      ],
      componentProperties: { items: adminItem },
    });
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('shows admin item when user has admin role', async () => {
    const adminItem: NavItem[] = [
      ...NAV_ITEMS,
      { label: 'Admin', icon: 'pi pi-shield', routerLink: '/admin', roles: ['admin'] },
    ];
    await render('<rdk-sidebar [navItems]="items" />', {
      imports: baseImports,
      providers: [
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: MOCK_CONFIG },
        {
          provide: AuthStore,
          useValue: {
            isAuthenticated: signal(true),
            user: signal({ id: '1', email: 'a@b.com' }),
            roles: signal(['admin']),
            hasRole: (role: string) => role === 'admin',
          },
        },
      ],
      componentProperties: { items: adminItem },
    });
    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument();
  });
});
