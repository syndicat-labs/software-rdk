import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { HasPermissionDirective } from './has-permission.directive';
import { AutoFocusDirective } from './auto-focus.directive';
import { AuthStore } from '../../core/auth/auth.store';
import { APP_CONFIG } from '../../core/config/app-config.token';
import { AppConfig, DEFAULT_AUTH_CONFIG } from '../../core/config/app-config.model';

const TEST_CONFIG: AppConfig = {
  environment: { production: false, apiBaseUrl: '', authBaseUrl: '', logLevel: 'error' },
  api: { baseUrl: '', timeoutMs: 30000, maxRetries: 0 },
  auth: { ...DEFAULT_AUTH_CONFIG, baseUrl: '' },
  features: {},
};

describe('HasPermissionDirective', () => {
  @Component({
    standalone: true,
    imports: [HasPermissionDirective],
    template: `
      <span *rdkHasPermission="'admin'" id="admin-only">Admin only</span>
      <span *rdkHasPermission="'user'" id="user-content">User content</span>
    `,
  })
  class TestHostComponent {}

  beforeEach(() => TestBed.resetTestingModule());

  it('renders nothing when unauthenticated', async () => {
    await render(TestHostComponent, {
      providers: [{ provide: APP_CONFIG, useValue: TEST_CONFIG }],
    });
    expect(screen.queryByText('Admin only')).not.toBeInTheDocument();
    expect(screen.queryByText('User content')).not.toBeInTheDocument();
  });

  it('renders element when user has required role', async () => {
    const { detectChanges } = await render(TestHostComponent, {
      providers: [{ provide: APP_CONFIG, useValue: TEST_CONFIG }],
    });
    const store = TestBed.inject(AuthStore);
    store.setUser({ id: '1', roles: ['user'] });
    detectChanges();
    expect(screen.getByText('User content')).toBeInTheDocument();
  });

  it('hides element from DOM (not just CSS) when role not present', async () => {
    const { detectChanges } = await render(TestHostComponent, {
      providers: [{ provide: APP_CONFIG, useValue: TEST_CONFIG }],
    });
    const store = TestBed.inject(AuthStore);
    store.setUser({ id: '1', roles: ['user'] });
    detectChanges();
    expect(screen.queryByText('Admin only')).not.toBeInTheDocument();
    expect(screen.getByText('User content')).toBeInTheDocument();
  });

  it('removes element from DOM when user loses the role', async () => {
    const { detectChanges } = await render(TestHostComponent, {
      providers: [{ provide: APP_CONFIG, useValue: TEST_CONFIG }],
    });
    const store = TestBed.inject(AuthStore);
    store.setUser({ id: '1', roles: ['user', 'admin'] });
    detectChanges();
    expect(screen.getByText('Admin only')).toBeInTheDocument();

    store.clearUser();
    detectChanges();
    expect(screen.queryByText('Admin only')).not.toBeInTheDocument();
  });
});

describe('AutoFocusDirective', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('calls focus() on the element when rdkAutoFocus is true', async () => {
    const focusSpy = jest.spyOn(HTMLElement.prototype, 'focus');

    @Component({
      standalone: true,
      imports: [AutoFocusDirective],
      template: `<input rdkAutoFocus type="text" placeholder="First field" />`,
    })
    class HostComponent {}

    await render(HostComponent);
    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it('does not call focus() when rdkAutoFocus is false', async () => {
    const focusSpy = jest.spyOn(HTMLElement.prototype, 'focus');

    @Component({
      standalone: true,
      imports: [AutoFocusDirective],
      template: `<input [rdkAutoFocus]="false" type="text" placeholder="Skip focus" />`,
    })
    class HostComponent {}

    await render(HostComponent);
    expect(focusSpy).not.toHaveBeenCalled();
    focusSpy.mockRestore();
  });
});
