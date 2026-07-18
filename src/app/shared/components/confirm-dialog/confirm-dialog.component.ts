import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'rdk-confirm-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-dialog
      [header]="title"
      [visible]="visible"
      [modal]="true"
      [closable]="true"
      [style]="{ width: '28rem' }"
      (onHide)="cancelled.emit()"
    >
      <p class="rdk-confirm-dialog__message">{{ message }}</p>
      <ng-template pTemplate="footer">
        <button
          pButton
          type="button"
          [label]="cancelLabel"
          class="p-button-text"
          (click)="cancelled.emit()"
        ></button>
        <button
          pButton
          type="button"
          [label]="confirmLabel"
          [class]="confirmButtonClass"
          (click)="confirmed.emit()"
        ></button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .rdk-confirm-dialog__message {
      margin: 0;
      line-height: 1.5;
    }
  `],
})
export class ConfirmDialogComponent implements OnDestroy {
  @Input() visible = false;
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel = 'Cancel';
  @Input() confirmButtonClass = 'p-button-danger';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  ngOnDestroy(): void {
    this.confirmed.complete();
    this.cancelled.complete();
  }
}
