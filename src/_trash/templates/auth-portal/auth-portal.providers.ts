import { Provider } from '@angular/core';
import { provideTemplate } from '../../core/templates/provide-template';
import { AUTH_PORTAL_NAV_ITEMS } from './auth-portal.nav';

export function provideAuthPortal(): Provider[] {
  return provideTemplate({
    id: 'auth-portal',
    navItems: AUTH_PORTAL_NAV_ITEMS,
  });
}
