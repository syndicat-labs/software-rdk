import { HttpInterceptorFn } from '@angular/common/http';
import { requestIdInterceptor } from './request-id.interceptor';
import { authInterceptor } from './auth.interceptor';
import { errorInterceptor } from './error.interceptor';
import { retryInterceptor } from './retry.interceptor';
import { devMockAuthInterceptor } from './dev-mock-auth.interceptor';

export { requestIdInterceptor, authInterceptor, errorInterceptor, retryInterceptor, devMockAuthInterceptor };

export const rdkHttpInterceptors: HttpInterceptorFn[] = [
  requestIdInterceptor,
  authInterceptor,
  errorInterceptor,
  retryInterceptor,
];
