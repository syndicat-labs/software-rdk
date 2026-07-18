import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../config/app-config.token';
import { LOG_LEVEL_PRIORITY, LogLevel, LogRecord, sanitizeContext } from './logging.model';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private readonly config = inject(APP_CONFIG);
  private readonly minLevel: LogLevel = this.config.environment.logLevel;

  error(module: string, message: string, context: Record<string, unknown> = {}): void {
    this.emit('error', module, message, context);
  }

  warn(module: string, message: string, context: Record<string, unknown> = {}): void {
    this.emit('warn', module, message, context);
  }

  info(module: string, message: string, context: Record<string, unknown> = {}): void {
    this.emit('info', module, message, context);
  }

  debug(module: string, message: string, context: Record<string, unknown> = {}): void {
    if (this.config.environment.production) {
      return;
    }
    this.emit('debug', module, message, context);
  }

  private emit(
    level: LogLevel,
    module: string,
    message: string,
    context: Record<string, unknown>,
  ): void {
    if (LOG_LEVEL_PRIORITY[level] > LOG_LEVEL_PRIORITY[this.minLevel]) {
      return;
    }

    const record: LogRecord = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      requestId: null,
      userIdHash: null,
      context: sanitizeContext(context),
    };

    if (this.config.environment.production) {
      console.log(JSON.stringify(record));
    } else {
      const prefix = `[${record.timestamp}] [${level.toUpperCase()}] [${module}]`;
      const logFn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
      logFn(prefix, message, record.context);
    }
  }
}
