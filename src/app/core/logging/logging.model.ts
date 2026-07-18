export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export const LOG_LEVEL_PRIORITY: Readonly<Record<LogLevel, number>> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

export interface LogRecord {
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly module: string;
  readonly message: string;
  readonly requestId: string | null;
  readonly userIdHash: string | null;
  readonly context: Record<string, unknown>;
}

const PII_KEY_PATTERNS: ReadonlyArray<RegExp> = [
  /password/i,
  /token/i,
  /secret/i,
  /key/i,
  /email/i,
  /phone/i,
  /ssn/i,
  /credit/i,
  /card/i,
];

export function sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context)) {
    if (PII_KEY_PATTERNS.some((pattern) => pattern.test(key))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeContext(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}
