import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardUiService {
  private readonly catalogVisibleSignal = signal(false);
  readonly catalogVisible = this.catalogVisibleSignal.asReadonly();

  private readonly configVisibleSignal = signal(false);
  readonly configVisible = this.configVisibleSignal.asReadonly();

  private readonly configWidgetIdSignal = signal<string | null>(null);
  readonly configWidgetId = this.configWidgetIdSignal.asReadonly();

  private readonly configInitialTitleSignal = signal('');
  readonly configInitialTitle = this.configInitialTitleSignal.asReadonly();

  private readonly confirmVisibleSignal = signal(false);
  readonly confirmVisible = this.confirmVisibleSignal.asReadonly();

  private readonly pendingRemoveIdSignal = signal<string | null>(null);
  readonly pendingRemoveId = this.pendingRemoveIdSignal.asReadonly();

  openCatalog(): void {
    this.catalogVisibleSignal.set(true);
  }

  closeCatalog(): void {
    this.catalogVisibleSignal.set(false);
  }

  openConfig(widgetId: string, initialTitle: string): void {
    this.configWidgetIdSignal.set(widgetId);
    this.configInitialTitleSignal.set(initialTitle);
    this.configVisibleSignal.set(true);
  }

  closeConfig(): void {
    this.configVisibleSignal.set(false);
    this.configWidgetIdSignal.set(null);
  }

  requestRemove(metricId: string): void {
    this.pendingRemoveIdSignal.set(metricId);
    this.confirmVisibleSignal.set(true);
  }

  closeConfirm(): void {
    this.confirmVisibleSignal.set(false);
    this.pendingRemoveIdSignal.set(null);
  }

  confirmRemove(): string | null {
    const id = this.pendingRemoveIdSignal();
    this.closeConfirm();
    return id;
  }
}
