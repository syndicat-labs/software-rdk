import { AppConfig, DEFAULT_AUTH_CONFIG } from '../app/core/config/app-config.model';

export const environment: AppConfig = {
  environment: {
    production: false,
    apiBaseUrl: 'http://localhost:3000/api',
    authBaseUrl: 'http://localhost:3000',
    logLevel: 'debug',
  },
  api: {
    baseUrl: 'http://localhost:3000/api',
    timeoutMs: 30_000,
    maxRetries: 3,
  },
  auth: {
    ...DEFAULT_AUTH_CONFIG,
    baseUrl: 'http://localhost:3000',
  },
  features: {},
};
