import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

const SEVERITY_ICONS: Record<AlertSeverity, string> = {
  info:    'pi-info-circle',
  success: 'pi-check-circle',
  warning: 'pi-exclamation-triangle',
  error:   'pi-times-circle',
};

@Component({
  selector: 'rdk-alert',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!hidden()) {
      <div
        class="rdk-alert"
        [ngClass]="'rdk-alert--' + severity"
        role="alert"
        [attr.aria-live]="severity === 'error' ? 'assertive' : 'polite'"
      >
        @if (showIcon) {
          <span
            class="pi rdk-alert__icon"
            [ngClass]="iconClass"
            aria-hidden="true"
          ></span>
        }

        <div class="rdk-alert__body">
          @if (title) {
            <p class="rdk-alert__title">{{ title }}</p>
          }
          @if (message) {
            <p class="rdk-alert__message">{{ message }}</p>
          }
          <ng-content />
        </div>

        @if (dismissible) {
          <button
            type="button"
            class="rdk-alert__close"
            (click)="dismiss()"
            aria-label="Dismiss alert"
          >
            <span class="pi pi-times" aria-hidden="true"></span>
          </button>
        }
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .rdk-alert {
      display: flex;
      align-items: flex-start;
      gap: var(--alert-gap);
      padding: var(--alert-padding);
      border-radius: var(--alert-radius);
      border: var(--alert-border-width) solid transparent;
    }

    .rdk-alert--info {
      background: var(--color-status-info-bg);
      border-color: var(--color-status-info-border);
      color: var(--color-status-info-text);
      .rdk-alert__icon { color: var(--color-status-info-icon); }
    }

    .rdk-alert--success {
      background: var(--color-status-success-bg);
      border-color: var(--color-status-success-border);
      color: var(--color-status-success-text);
      .rdk-alert__icon { color: var(--color-status-success-icon); }
    }

    .rdk-alert--warning {
      background: var(--color-status-warning-bg);
      border-color: var(--color-status-warning-border);
      color: var(--color-status-warning-text);
      .rdk-alert__icon { color: var(--color-status-warning-icon); }
    }

    .rdk-alert--error {
      background: var(--color-status-danger-bg);
      border-color: var(--color-status-danger-border);
      color: var(--color-status-danger-text);
      .rdk-alert__icon { color: var(--color-status-danger-icon); }
    }

    .rdk-alert__icon {
      font-size: var(--alert-icon-size);
      flex-shrink: 0;
      margin-top: 1px;
    }

    .rdk-alert__body {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .rdk-alert__title {
      margin: 0;
      font-weight: var(--alert-title-weight);
      font-size: var(--text-base);
    }

    .rdk-alert__message {
      margin: 0;
      font-size: var(--text-sm);
      opacity: 0.9;
    }

    .rdk-alert__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      padding: 0;
      background: none;
      border: none;
      cursor: pointer;
      color: currentColor;
      opacity: 0.6;
      border-radius: var(--radius-sm);
      flex-shrink: 0;
      margin-left: auto;

      &:hover { opacity: 1; }
      .pi { font-size: 0.75rem; }
    }
  `],
})
export class AlertComponent {
  @Input() severity: AlertSeverity = 'info';
  @Input() title?: string;
  @Input() message?: string;
  @Input() dismissible = false;
  @Input() showIcon = true;
  @Input() icon?: string;

  @Output() dismissed = new EventEmitter<void>();

  protected readonly hidden = signal(false);

  protected get iconClass(): string {
    return this.icon ?? SEVERITY_ICONS[this.severity];
  }

  protected dismiss(): void {
    this.hidden.set(true);
    this.dismissed.emit();
  }
}
