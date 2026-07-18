import { Provider } from '@angular/core';
import { provideTemplate } from '../../core/templates/provide-template';
import { RESOURCE_NAV_ITEMS } from './resource.nav';

export function provideResource(): Provider[] {
  return provideTemplate({
    id: 'resource',
    navItems: RESOURCE_NAV_ITEMS,
  });
}
