import { Injectable, isDevMode, signal } from '@angular/core';
import {
  THEME_REGISTRY,
  ThemeDefinition,
  ThemeId,
  validateTheme,
} from './token-contract';

export type { ThemeId };
export type { ThemeDefinition };

const STORAGE_KEY = 'rdk_theme';
const DEFAULT_THEME: ThemeId = 'rdk-default';

function readStoredTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    return THEME_REGISTRY.some(t => t.id === stored) ? (stored as ThemeId) : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly current = signal<ThemeId>(readStoredTheme());
  readonly registry: readonly ThemeDefinition[] = THEME_REGISTRY;

  constructor() {
    this.applyToDocument(this.current());
    if (isDevMode()) {
      // Defer until styles are applied so getComputedStyle sees token values.
      requestAnimationFrame(() => this.validateCurrentTheme());
    }
  }

  set(themeId: ThemeId): void {
    this.current.set(themeId);
    this.applyToDocument(themeId);
    this.persist(themeId);
  }

  toggle(): void {
    const ids = THEME_REGISTRY.map(t => t.id);
    const next = ids[(ids.indexOf(this.current()) + 1) % ids.length] as ThemeId;
    this.set(next);
  }

  validateCurrentTheme(): void {
    const result = validateTheme(document.documentElement, this.current());
    if (!result.valid) {
      console.warn(
        `[ThemeService] Theme "${result.themeId}" is missing ${result.missing.length} contract token(s). ` +
        `Contract v${result.contractVersion}.\nMissing:`,
        result.missing
      );
    }
  }

  private applyToDocument(themeId: ThemeId): void {
    // Always set — never remove. Removing falls back to unthemed :root, which is an error state.
    document.documentElement.setAttribute('data-theme', themeId);
  }

  private persist(themeId: ThemeId): void {
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
    } catch {
      // Private browsing or quota exceeded — ignore.
    }
  }
}
