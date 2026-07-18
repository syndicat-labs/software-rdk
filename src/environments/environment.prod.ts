import { AppConfig, DEFAULT_AUTH_CONFIG } from '../app/core/config/app-config.model';

export const environment: AppConfig = {
  environment: {
    production: true,
    apiBaseUrl: '',
    authBaseUrl: '',
    logLevel: 'warn',
  },
  api: {
    baseUrl: '',
    timeoutMs: 30_000,
    maxRetries: 3,
  },
  auth: {
    ...DEFAULT_AUTH_CONFIG,
    baseUrl: '',
  },
  features: {},
};
