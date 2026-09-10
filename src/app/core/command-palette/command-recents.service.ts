import { Injectable, signal } from '@angular/core';
import { RecentRoute } from './command-palette.model';

/**
 * Recently visited toolkit surfaces, surfaced as "Continue where you left off"
 * in the command palette's Recents section.
 *
 * Stored in localStorage. This is navigation metadata (route labels) — never
 * tokens, credentials, or PII — so it is outside the [ABSOLUTE] credential
 * storage rule and passes check-no-localstorage-auth.mjs.
 */
@Injectable({ providedIn: 'root' })
export class CommandRecentsService {
  private readonly KEY = 'rdk_command_recents_v1';
  private readonly MAX = 5;

  private readonly _list = signal<RecentRoute[]>([]);
  readonly list = this._list.asReadonly();

  constructor() {
    this._list.set(this.read());
  }

  record(label: string, url: string): void {
    if (!label || !url) return;
    const next = [
      { label, url, at: Date.now() },
      ...this._list().filter((r) => r.url !== url),
    ].slice(0, this.MAX);
    this._list.set(next);
    this._write(next);
  }

  clear(): void {
    this._list.set([]);
    this._write([]);
  }

  private read(): RecentRoute[] {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(
          (r): r is RecentRoute =>
            typeof r === 'object' && r !== null &&
            typeof (r as RecentRoute).label === 'string' &&
            typeof (r as RecentRoute).url === 'string' &&
            typeof (r as RecentRoute).at === 'number',
        )
        .slice(0, this.MAX);
    } catch {
      return [];
    }
  }

  private _write(list: RecentRoute[]): void {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(list));
    } catch {
      // Private browsing or quota exceeded — recents simply do not persist.
    }
  }
}