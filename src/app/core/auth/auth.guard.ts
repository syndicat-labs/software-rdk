import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';
import { LoggingService } from '../logging/logging.service';
import { APP_CONFIG } from '../config/app-config.token';

const MODULE = 'core/auth/guard';

export const authGuard: CanActivateFn = (route, _state) => {
  const store = inject(AuthStore);
  const router = inject(Router);
  const logger = inject(LoggingService);
  const config = inject(APP_CONFIG);

  if (route.data?.['public'] === true) {
    return true;
  }

  if (store.isAuthenticated()) {
    return true;
  }

  logger.info(MODULE, 'Unauthenticated access blocked', { url: _state.url });
  return router.createUrlTree([config.auth.loginRoute], { queryParams: { returnUrl: _state.url } });
};
