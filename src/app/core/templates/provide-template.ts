import { Provider } from '@angular/core';
import { NAV_ITEMS } from '../../layout/nav-items.token';
import { RdkTemplate } from './template.types';

export function provideTemplate(template: RdkTemplate): Provider[] {
  return [
    { provide: NAV_ITEMS, useValue: template.navItems, multi: true },
  ];
}
