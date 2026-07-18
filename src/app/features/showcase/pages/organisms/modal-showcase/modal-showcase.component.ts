import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '../../../../../shared/components/organisms/modal/modal.component';
import { ButtonComponent } from '../../../../../shared/components/atoms/button/button.component';

@Component({
  selector: 'app-modal-showcase',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .showcase-page { max-width: 900px; margin: 0 auto; }
    h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-4); color: var(--color-text-primary); }
    .showcase-page__intro { font-size: var(--text-lg); color: var(--color-text-secondary); margin: 0 0 var(--space-8); }
    .showcase-section { margin-bottom: var(--space-8); h2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); margin: 0 0 var(--space-4); color: var(--color-text-primary); } }
    .showcase-grid { display: flex; flex-wrap: wrap; gap: var(--space-3); }
  `],
  template: `
    <div class="showcase-page">
      <h1>Modal</h1>
      <p class="showcase-page__intro">Dialog overlays wrapping PrimeNG p-dialog with size variants and content slots.</p>

      <section class="showcase-section">
        <h2>Sizes</h2>
        <div class="showcase-grid">
          <rdk-button (clicked)="openModal('sm')">Open Small</rdk-button>
          <rdk-button (clicked)="openModal('md')">Open Medium</rdk-button>
          <rdk-button (clicked)="openModal('lg')">Open Large</rdk-button>
          <rdk-button variant="secondary" (clicked)="openModal('xl')">Open XL</rdk-button>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Without backdrop dismiss</h2>
        <div class="showcase-grid">
          <rdk-button variant="danger" (clicked)="confirmVisible.set(true)">Open Confirm</rdk-button>
        </div>
      </section>
    </div>

    <!-- Size modal -->
    <rdk-modal
      [visible]="sizeModal() !== null"
      [title]="'Modal — ' + (sizeModal() ?? 'md')"
      [size]="sizeModal() ?? 'md'"
      (visibleChange)="$event ? null : sizeModal.set(null)"
    >
      <div slot="body">
        <p>This is a {{ sizeModal() }} modal. Content goes here.</p>
      </div>
      <div slot="footer">
        <rdk-button variant="ghost" size="sm" (clicked)="sizeModal.set(null)">Cancel</rdk-button>
        <rdk-button variant="primary" size="sm" (clicked)="sizeModal.set(null)">Confirm</rdk-button>
      </div>
    </rdk-modal>

    <!-- Confirm modal -->
    <rdk-modal
      [visible]="confirmVisible()"
      title="Confirm deletion"
      [dismissOnBackdrop]="false"
      (visibleChange)="confirmVisible.set($event)"
    >
      <div slot="body">
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
      </div>
      <div slot="footer">
        <rdk-button variant="ghost" size="sm" (clicked)="confirmVisible.set(false)">Cancel</rdk-button>
        <rdk-button variant="danger" size="sm" (clicked)="confirmVisible.set(false)">Delete</rdk-button>
      </div>
    </rdk-modal>
  `,
})
export class ModalShowcaseComponent {
  readonly sizeModal = signal<'sm' | 'md' | 'lg' | 'xl' | null>(null);
  readonly confirmVisible = signal(false);

  openModal(size: 'sm' | 'md' | 'lg' | 'xl'): void {
    this.sizeModal.set(size);
  }
}
