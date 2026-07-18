import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { APP_CONFIG } from './core/config/app-config.token';
import { environment } from '../environments/environment';
import { rdkHttpInterceptors, devMockAuthInterceptor } from './core/http/interceptors';
import { NAV_ITEMS } from './layout/nav-items.token';
import { SHOWCASE_NAV_ITEMS } from './features/showcase/showcase.nav';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideHttpClient(withInterceptors([devMockAuthInterceptor, ...rdkHttpInterceptors])),
    provideAnimations(),
    { provide: APP_CONFIG, useValue: environment },
    { provide: NAV_ITEMS, useValue: SHOWCASE_NAV_ITEMS, multi: true },
  ],
};
