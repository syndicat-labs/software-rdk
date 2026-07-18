import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';

export const LOGIN_ROUTE: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent), data: { public: true }, canActivate: [authGuard] },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent), data: { public: true }, canActivate: [authGuard] },
];

export const AUTH_PORTAL_ROUTES: Routes = [
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard-home.component').then(m => m.DashboardHomeComponent), data: { title: 'Dashboard' } },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), data: { title: 'Profile' } },
];
