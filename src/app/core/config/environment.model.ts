export interface Environment {
  readonly production: boolean;
  readonly apiBaseUrl: string;
  readonly authBaseUrl: string;
  readonly logLevel: 'error' | 'warn' | 'info' | 'debug';
}
