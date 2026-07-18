import { Environment } from './environment.model';

export interface ApiConfig {
  readonly baseUrl: string;
  readonly timeoutMs: number;
  readonly maxRetries: number;
}

export interface AuthConfig {
  // API endpoint paths
  readonly baseUrl: string;
  readonly loginPath: string;
  readonly logoutPath: string;
  readonly refreshPath: string;
  readonly accessTokenKey: string;
  readonly refreshTokenKey: string;
  readonly proactiveRefreshThresholdSeconds: number;
  readonly registerPath: string;
  // UI navigation routes
  readonly loginRoute: string;
  readonly postLoginRoute: string;
  readonly postLogoutRoute: string;
}

export interface FeatureFlags {
  readonly [key: string]: boolean;
}

export interface AppConfig {
  readonly environment: Environment;
  readonly api: ApiConfig;
  readonly auth: AuthConfig;
  readonly features: FeatureFlags;
}

export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  baseUrl: '',
  loginPath: '/auth/login',
  logoutPath: '/auth/logout',
  refreshPath: '/auth/refresh',
  registerPath: '/auth/register',
  accessTokenKey: 'rdk_access_token',
  refreshTokenKey: 'rdk_refresh_token',
  proactiveRefreshThresholdSeconds: 60,
  loginRoute: '/login',
  postLoginRoute: '/app/dashboard',
  postLogoutRoute: '/login',
};
