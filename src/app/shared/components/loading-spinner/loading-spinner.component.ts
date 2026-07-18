import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'rdk-loading-spinner',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rdk-loading-spinner"
      [class.rdk-loading-spinner--overlay]="overlay"
      role="status"
      [attr.aria-label]="label"
      aria-live="polite"
    >
      <p-progressSpinner
        [style]="{ width: size + 'px', height: size + 'px' }"
        strokeWidth="4"
        animationDuration="0.8s"
      />
      <span class="rdk-loading-spinner__label" *ngIf="label && showLabel">{{ label }}</span>
    </div>
  `,
  styles: [`
    .rdk-loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .rdk-loading-spinner--overlay {
      position: fixed;
      inset: 0;
      background: rgba(255 255 255 / 0.8);
      z-index: 1000;
    }
    .rdk-loading-spinner__label {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
    }
  `],
})
export class LoadingSpinnerComponent {
  @Input() size = 40;
  @Input() label = 'Loading…';
  @Input() showLabel = false;
  @Input() overlay = false;
}
