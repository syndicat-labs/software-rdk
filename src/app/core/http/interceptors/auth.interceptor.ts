import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { APP_CONFIG } from '../../config/app-config.token';
import { TokenService } from '../../auth/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(APP_CONFIG);
  const tokenService = inject(TokenService);

  const isApiRequest =
    req.url.startsWith(config.api.baseUrl) || req.url.startsWith(config.auth.baseUrl);

  if (!isApiRequest) {
    return next(req);
  }

  const token = tokenService.getAccessToken();
  if (!token) {
    return next(req);
  }

  const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  return next(cloned);
};
