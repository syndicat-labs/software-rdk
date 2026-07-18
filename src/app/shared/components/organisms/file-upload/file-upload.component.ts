import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { FileSizePipe } from '../../../pipes/file-size.pipe';
import { ButtonComponent } from '../../atoms/button/button.component';

export interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
  error?: string;
}

@Component({
  selector: 'rdk-file-upload',
  standalone: true,
  imports: [FileSizePipe, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rdk-upload" [class.rdk-upload--drag-over]="dragOver()">
      <!-- Drop zone -->
      <div
        class="rdk-upload__zone"
        [attr.role]="'button'"
        [attr.tabindex]="0"
        [attr.aria-label]="'Upload files. ' + (accept ? 'Accepted: ' + accept : '')"
        (click)="fileInput.click()"
        (keydown.enter)="fileInput.click()"
        (keydown.space)="fileInput.click()"
        (dragover)="onDragOver($event)"
        (dragleave)="dragOver.set(false)"
        (drop)="onDrop($event)"
      >
        <span class="pi pi-cloud-upload rdk-upload__icon" aria-hidden="true"></span>
        <p class="rdk-upload__label">
          <strong>Click to upload</strong> or drag and drop
        </p>
        @if (accept) {
          <p class="rdk-upload__hint">{{ accept }}</p>
        }
        @if (maxSizeBytes) {
          <p class="rdk-upload__hint">Max {{ maxSizeBytes | fileSize }}</p>
        }
      </div>

      <input
        #fileInput
        type="file"
        class="rdk-upload__input"
        [accept]="accept"
        [multiple]="multiple"
        (change)="onFileChange($event)"
        aria-hidden="true"
        tabindex="-1"
      />

      <!-- File list -->
      @if (files().length) {
        <ul class="rdk-upload__list">
          @for (f of files(); track f.name) {
            <li class="rdk-upload__item" [class.rdk-upload__item--error]="!!f.error">
              <span class="pi pi-file rdk-upload__item-icon" aria-hidden="true"></span>
              <div class="rdk-upload__item-info">
                <span class="rdk-upload__item-name">{{ f.name }}</span>
                <span class="rdk-upload__item-size">{{ f.size | fileSize }}</span>
                @if (f.error) {
                  <span class="rdk-upload__item-error">{{ f.error }}</span>
                }
              </div>
              <rdk-button
                variant="ghost"
                size="sm"
                icon="pi-times"
                [iconOnly]="true"
                (clicked)="removeFile(f)"
                [attr.aria-label]="'Remove ' + f.name"
              />
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .rdk-upload { display: flex; flex-direction: column; gap: var(--space-3); }

    .rdk-upload__zone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-10) var(--space-6);
      border: 2px dashed var(--color-border-default);
      border-radius: var(--radius-surface);
      background: var(--color-bg-sunken);
      cursor: pointer;
      transition:
        border-color var(--duration-150) var(--ease-out),
        background var(--duration-150) var(--ease-out);

      &:hover, &:focus-visible {
        border-color: var(--color-border-brand);
        background: var(--color-bg-brand-subtle);
        outline: none;
      }
    }

    .rdk-upload--drag-over .rdk-upload__zone {
      border-color: var(--color-brand-500);
      background: var(--color-bg-brand-subtle);
    }

    .rdk-upload__icon {
      font-size: 2rem;
      color: var(--color-text-muted);
    }

    .rdk-upload__label {
      margin: 0;
      font-size: var(--text-base);
      color: var(--color-text-secondary);
      text-align: center;

      strong { color: var(--color-text-brand); }
    }

    .rdk-upload__hint {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--color-text-muted);
    }

    .rdk-upload__input { display: none; }

    .rdk-upload__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .rdk-upload__item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-component);
      background: var(--color-bg-surface);

      &--error {
        border-color: var(--color-border-danger);
        background: var(--color-status-danger-bg);
      }
    }

    .rdk-upload__item-icon {
      font-size: 1.25rem;
      color: var(--color-text-muted);
      flex-shrink: 0;
    }

    .rdk-upload__item-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-0-5);
    }

    .rdk-upload__item-name {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--color-text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .rdk-upload__item-size {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .rdk-upload__item-error {
      font-size: var(--text-xs);
      color: var(--color-text-danger);
    }
  `],
})
export class FileUploadComponent {
  @Input() accept = '';
  @Input() maxSizeBytes?: number;
  @Input() multiple = false;

  @Output() fileSelected = new EventEmitter<UploadedFile[]>();
  @Output() fileRemoved = new EventEmitter<UploadedFile>();

  protected readonly files = signal<UploadedFile[]>([]);
  protected readonly dragOver = signal(false);

  protected onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
      input.value = '';
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(true);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    const dropped = event.dataTransfer?.files;
    if (dropped) this.addFiles(Array.from(dropped));
  }

  protected removeFile(f: UploadedFile): void {
    this.files.update((list) => list.filter((item) => item !== f));
    this.fileRemoved.emit(f);
  }

  private addFiles(rawFiles: File[]): void {
    const uploaded: UploadedFile[] = rawFiles.map((file) => {
      const entry: UploadedFile = {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      };
      if (this.maxSizeBytes && file.size > this.maxSizeBytes) {
        entry.error = `File exceeds maximum size of ${this.maxSizeBytes / (1024 * 1024)} MB`;
      }
      return entry;
    });

    this.files.update((list) =>
      this.multiple ? [...list, ...uploaded] : uploaded,
    );
    this.fileSelected.emit(this.files());
  }
}
