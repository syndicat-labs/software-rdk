import { NavItem } from '../../layout/sidebar/sidebar.component';

export const AUTH_PORTAL_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/app/dashboard', exact: true },
  { label: 'Profile',   icon: 'pi pi-user', routerLink: '/app/profile',   exact: false },
];
