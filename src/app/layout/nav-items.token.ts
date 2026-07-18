import { InjectionToken } from '@angular/core';
import { NavItem } from './sidebar/sidebar.component';

export const NAV_ITEMS = new InjectionToken<NavItem[]>('NAV_ITEMS');
