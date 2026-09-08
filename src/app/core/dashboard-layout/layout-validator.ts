import { AppError, ErrorCode } from '../errors/errors.types';
import { fromUnknown } from '../errors/errors.factory';
import {
  COL_SPANS,
  ColSpan,
  DASHBOARD_LAYOUT_MAX_BYTES,
  DashboardLayout,
  WidgetInstance,
} from './dashboard-layout.model';

const MAX_WIDGETS = 100;
const WIDGET_ID_RE = /^[a-z0-9][a-z0-9_-]{1,48}$/i;
const INSTANCE_ID_RE = /^[a-z0-9][a-z0-9_-]{1,64}$/i;

function fail(message: string, fieldErrors?: Record<string, string>): AppError {
  const base: AppError = {
    code: ErrorCode.DASHBOARD_LAYOUT_INVALID,
    message,
    context: { fieldErrors: fieldErrors ?? null },
    retryable: false,
    httpStatus: 400,
    fieldErrors: fieldErrors ?? null,
    originalError: null,
  };
  return base;
}

function isColSpan(value: unknown): value is ColSpan {
  return typeof value === 'number' && (COL_SPANS as readonly number[]).includes(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Zero-trust validator for persisted dashboard layout. Every boundary that
 * accepts a layout — network or localStorage — must pass through here.
 */
export function validateLayout(input: unknown): { valid: true; value: DashboardLayout } | { valid: false; error: AppError } {
  try {
    if (!isRecord(input)) {
      return { valid: false, error: fail('Layout must be an object.') };
    }

    const version = input['version'];
    const updatedAt = input['updatedAt'];
    const widgets = input['widgets'];

    if (typeof version !== 'number' || !Number.isInteger(version) || version < 1) {
      return { valid: false, error: fail('Layout version must be a positive integer.', { version: 'Invalid version' }) };
    }

    if (typeof updatedAt !== 'string' || Number.isNaN(Date.parse(updatedAt))) {
      return { valid: false, error: fail('Layout updatedAt must be an ISO timestamp.', { updatedAt: 'Invalid date' }) };
    }

    if (!Array.isArray(widgets)) {
      return { valid: false, error: fail('Layout widgets must be an array.', { widgets: 'Must be an array' }) };
    }

    if (widgets.length > MAX_WIDGETS) {
      return { valid: false, error: fail(`Layout exceeds maximum of ${MAX_WIDGETS} widgets.`, { widgets: 'Too many widgets' }) };
    }

    const seenIds = new Set<string>();
    const validated: WidgetInstance[] = [];

    for (let index = 0; index < widgets.length; index++) {
      const raw = widgets[index];
      if (!isRecord(raw)) {
        return { valid: false, error: fail(`Widget at index ${index} must be an object.`, { [`widgets[${index}]`]: 'Invalid widget' }) };
      }

      const id = raw['id'];
      const widgetId = raw['widgetId'];
      const colSpan = raw['colSpan'];
      const order = raw['order'];
      const config = raw['config'];

      if (typeof id !== 'string' || !INSTANCE_ID_RE.test(id)) {
        return { valid: false, error: fail(`Widget id at index ${index} is invalid.`, { [`widgets[${index}].id`]: 'Invalid id' }) };
      }
      if (seenIds.has(id)) {
        return { valid: false, error: fail(`Duplicate widget id "${id}".`, { [`widgets[${index}].id`]: 'Duplicate id' }) };
      }
      seenIds.add(id);

      if (typeof widgetId !== 'string' || !WIDGET_ID_RE.test(widgetId)) {
        return { valid: false, error: fail(`Widget widgetId at index ${index} is invalid.`, { [`widgets[${index}].widgetId`]: 'Invalid widgetId' }) };
      }

      if (!isColSpan(colSpan)) {
        return { valid: false, error: fail(`Widget colSpan at index ${index} must be one of 3, 4, 6, 12.`, { [`widgets[${index}].colSpan`]: 'Invalid colSpan' }) };
      }

      if (typeof order !== 'number' || !Number.isInteger(order) || order < 0) {
        return { valid: false, error: fail(`Widget order at index ${index} must be a non-negative integer.`, { [`widgets[${index}].order`]: 'Invalid order' }) };
      }

      if (config !== undefined && !isRecord(config)) {
        return { valid: false, error: fail(`Widget config at index ${index} must be an object.`, { [`widgets[${index}].config`]: 'Invalid config' }) };
      }

      // Reject config containing script-like values to surface XSS attempt early.
      if (config && isRecord(config)) {
        for (const [key, value] of Object.entries(config)) {
          if (typeof value === 'string' && /<script/i.test(value)) {
            return { valid: false, error: fail(`Widget config at index ${index} contains forbidden content.`, { [`widgets[${index}].config.${key}`]: 'Forbidden content' }) };
          }
          if (typeof key === 'string' && /<script/i.test(key)) {
            return { valid: false, error: fail(`Widget config key at index ${index} contains forbidden content.`, { [`widgets[${index}].config`]: 'Forbidden key' }) };
          }
        }
      }

      // Detect widgetId script injection at boundary, not just via regex.
      if (typeof widgetId === 'string' && /<script/i.test(widgetId)) {
        return { valid: false, error: fail(`Widget widgetId at index ${index} contains forbidden content.`, { [`widgets[${index}].widgetId`]: 'Forbidden content' }) };
      }

      validated.push({
        id,
        widgetId: widgetId as unknown as import('./dashboard-layout.model').WidgetId,
        colSpan,
        order,
        config: config as Record<string, unknown> | undefined,
      });
    }

    const bytes = JSON.stringify(input).length;
    if (bytes > DASHBOARD_LAYOUT_MAX_BYTES) {
      return { valid: false, error: fail(`Layout exceeds ${DASHBOARD_LAYOUT_MAX_BYTES} bytes cap.`, { layout: 'Layout too large' }) };
    }

    const value: DashboardLayout = {
      version: version as number,
      updatedAt: updatedAt as string,
      widgets: validated,
    };

    return { valid: true, value };
  } catch (error: unknown) {
    const appError = fromUnknown(error);
    return {
      valid: false,
      error: {
        ...appError,
        code: ErrorCode.DASHBOARD_LAYOUT_INVALID,
        message: 'Layout validation failed due to malformed JSON.',
        httpStatus: 400,
        retryable: false,
      },
    };
  }
}

export function parseAndValidateLayout(json: string): { valid: true; value: DashboardLayout } | { valid: false; error: AppError } {
  try {
    const parsed: unknown = JSON.parse(json);
    return validateLayout(parsed);
  } catch (error: unknown) {
    return {
      valid: false,
      error: {
        code: ErrorCode.DASHBOARD_LAYOUT_INVALID,
        message: 'Layout JSON is malformed.',
        context: { originalMessage: error instanceof Error ? error.message : String(error) },
        retryable: false,
        httpStatus: 400,
        fieldErrors: null,
        originalError: error,
      },
    };
  }
}
