import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { AppError, ErrorCode } from '../../../core/errors/errors.types';

@Component({
  selector: 'rdk-error-display',
  standalone: true,
  imports: [CommonModule, MessageModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rdk-error-display" role="alert" aria-live="assertive" *ngIf="error">
      <p-message
        [severity]="severity"
        [text]="error.message"
      />
      <button
        *ngIf="error.retryable && showRetry"
        pButton
        type="button"
        class="p-button-text p-button-sm rdk-error-display__retry"
        label="Try again"
        icon="pi pi-refresh"
        (click)="retry.emit()"
      ></button>
    </div>
  `,
  styles: [`
    .rdk-error-display {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .rdk-error-display__retry {
      align-self: flex-start;
    }
  `],
})
export class ErrorDisplayComponent {
  @Input() error: AppError | null = null;
  @Input() showRetry = true;
  @Output() retry = new EventEmitter<void>();

  get severity(): string {
    if (!this.error) return 'error';
    const authCodes: ErrorCode[] = [
      ErrorCode.AUTH_TOKEN_EXPIRED,
      ErrorCode.AUTH_SESSION_EXPIRED,
      ErrorCode.AUTH_PERMISSION_DENIED,
    ];
    if (authCodes.includes(this.error.code)) {
      return 'warn';
    }
    if (this.error.code === ErrorCode.VALIDATION_ERROR) {
      return 'warn';
    }
    return 'error';
  }
}
