import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FileUploadComponent, UploadedFile } from '../../../../../shared/components/organisms/file-upload/file-upload.component';

@Component({
  selector: 'app-file-upload-showcase',
  standalone: true,
  imports: [FileUploadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .showcase-page { max-width: 600px; margin: 0 auto; }
    h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-4); color: var(--color-text-primary); }
    .showcase-page__intro { font-size: var(--text-lg); color: var(--color-text-secondary); margin: 0 0 var(--space-8); }
    .showcase-section { margin-bottom: var(--space-8); h2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); margin: 0 0 var(--space-4); color: var(--color-text-primary); } }
  `],
  template: `
    <div class="showcase-page">
      <h1>File Upload</h1>
      <p class="showcase-page__intro">Drag-and-drop file upload with type filtering, size validation, and file list.</p>

      <section class="showcase-section">
        <h2>Single file</h2>
        <rdk-file-upload
          accept=".pdf,.doc,.docx"
          (fileSelected)="onSelect($event)"
        />
      </section>

      <section class="showcase-section">
        <h2>Multiple files with size limit</h2>
        <rdk-file-upload
          accept="image/*"
          [multiple]="true"
          [maxSizeBytes]="5242880"
        />
      </section>

      <section class="showcase-section">
        <h2>Any file type</h2>
        <rdk-file-upload [multiple]="true" />
      </section>
    </div>
  `,
})
export class FileUploadShowcaseComponent {
  readonly lastFiles = signal<UploadedFile[]>([]);

  onSelect(files: UploadedFile[]): void {
    this.lastFiles.set(files);
  }
}
