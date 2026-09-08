import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { AppShellComponent } from './layout/app-shell/app-shell.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then((m) => m.LandingComponent),
    data: { public: true },
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    data: { public: true },
    canActivate: [authGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    data: { public: true },
    canActivate: [authGuard],
  },
  {
    path: 'password-reset',
    loadComponent: () =>
      import('./features/auth/password-reset/password-reset.component').then((m) => m.PasswordResetComponent),
    data: { public: true },
    canActivate: [authGuard],
  },
  {
    path: 'app',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        data: { title: 'Dashboard' },
      },
    ],
  },
  {
    path: 'showcase',
    component: AppShellComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/showcase/showcase.routes').then((m) => m.SHOWCASE_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
