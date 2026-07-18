import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rdk-empty-state',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rdk-empty-state" role="status">
      <span *ngIf="icon" class="rdk-empty-state__icon pi" [ngClass]="icon" aria-hidden="true"></span>
      <h3 class="rdk-empty-state__title">{{ title }}</h3>
      <p *ngIf="message" class="rdk-empty-state__message">{{ message }}</p>
      <div class="rdk-empty-state__actions">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .rdk-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 2rem;
      text-align: center;
      color: var(--text-color-secondary);
    }
    .rdk-empty-state__icon {
      font-size: 3rem;
      opacity: 0.4;
    }
    .rdk-empty-state__title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-color);
    }
    .rdk-empty-state__message {
      margin: 0;
      font-size: 0.875rem;
    }
    .rdk-empty-state__actions {
      margin-top: 0.5rem;
    }
  `],
})
export class EmptyStateComponent {
  @Input() title = 'No results found';
  @Input() message?: string;
  @Input() icon?: string;
}
