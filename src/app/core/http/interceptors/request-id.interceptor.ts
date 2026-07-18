import { HttpInterceptorFn } from '@angular/common/http';

function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export const requestIdInterceptor: HttpInterceptorFn = (req, next) => {
  const requestId = generateRequestId();
  const cloned = req.clone({ setHeaders: { 'X-Request-ID': requestId } });
  return next(cloned);
};
