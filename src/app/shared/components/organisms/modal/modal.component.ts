import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const MODAL_WIDTHS: Record<ModalSize, string> = {
  sm:   '24rem',
  md:   '32rem',
  lg:   '44rem',
  xl:   '60rem',
  full: '100vw',
};

@Component({
  selector: 'rdk-modal',
  standalone: true,
  imports: [DialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-dialog
      [visible]="visible"
      [header]="title || ''"
      [closable]="closable"
      [dismissableMask]="dismissOnBackdrop"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: modalWidth, maxHeight: size === 'full' ? '100vh' : '90vh' }"
      [styleClass]="'rdk-modal rdk-modal--' + size"
      (onHide)="visibleChange.emit(false); closed.emit()"
    >
      <ng-template pTemplate="header">
        <ng-content select="[slot=header]" />
        @if (!hasHeaderSlot && title) {
          <span class="rdk-modal__title">{{ title }}</span>
        }
      </ng-template>

      <div class="rdk-modal__body">
        <ng-content select="[slot=body]" />
        <ng-content />
      </div>

      <ng-template pTemplate="footer">
        <ng-content select="[slot=footer]" />
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    ::ng-deep {
      .rdk-modal {
        .p-dialog-header {
          padding: var(--modal-padding) var(--modal-padding) var(--space-4);
          border-bottom: 1px solid var(--color-border-default);
        }

        .p-dialog-content {
          padding: 0;
        }

        .p-dialog-footer {
          padding: var(--space-4) var(--modal-padding);
          border-top: 1px solid var(--color-border-default);
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
        }
      }

      .rdk-modal--full {
        .p-dialog {
          border-radius: 0;
          height: 100vh;
        }
      }
    }

    .rdk-modal__title {
      font-size: var(--modal-header-size);
      font-weight: var(--font-semibold);
      color: var(--color-text-primary);
    }

    .rdk-modal__body {
      padding: var(--modal-padding);
    }
  `],
})
export class ModalComponent {
  @Input() visible = false;
  @Input() title?: string;
  @Input() size: ModalSize = 'md';
  @Input() closable = true;
  @Input() dismissOnBackdrop = true;
  @Input() hasHeaderSlot = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  protected get modalWidth(): string {
    return MODAL_WIDTHS[this.size];
  }
}
