import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app-config.token';

export interface RequestOptions {
  readonly params?: Record<string, string | number | boolean | string[]>;
  readonly headers?: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  get<T>(path: string, options: RequestOptions = {}): Observable<T> {
    return this.http.get<T>(this.url(path), this.toHttpOptions(options));
  }

  post<T>(path: string, body: unknown, options: RequestOptions = {}): Observable<T> {
    return this.http.post<T>(this.url(path), body, this.toHttpOptions(options));
  }

  put<T>(path: string, body: unknown, options: RequestOptions = {}): Observable<T> {
    return this.http.put<T>(this.url(path), body, this.toHttpOptions(options));
  }

  patch<T>(path: string, body: unknown, options: RequestOptions = {}): Observable<T> {
    return this.http.patch<T>(this.url(path), body, this.toHttpOptions(options));
  }

  delete<T>(path: string, options: RequestOptions = {}): Observable<T> {
    return this.http.delete<T>(this.url(path), this.toHttpOptions(options));
  }

  private url(path: string): string {
    const base = this.config.api.baseUrl.replace(/\/$/, '');
    const normalised = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalised}`;
  }

  private toHttpOptions(options: RequestOptions): { params?: HttpParams; headers?: Record<string, string> } {
    const result: { params?: HttpParams; headers?: Record<string, string> } = {};

    if (options.params) {
      let params = new HttpParams();
      for (const [key, value] of Object.entries(options.params)) {
        if (Array.isArray(value)) {
          value.forEach((v) => (params = params.append(key, String(v))));
        } else {
          params = params.set(key, String(value));
        }
      }
      result.params = params;
    }

    if (options.headers) {
      result.headers = options.headers;
    }

    return result;
  }
}
