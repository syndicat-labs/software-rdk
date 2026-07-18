import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PaginationComponent } from '../../../../../shared/components/molecules/pagination/pagination.component';

@Component({
  selector: 'app-pagination-showcase',
  standalone: true,
  imports: [PaginationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host{display:block}.showcase-page{max-width:900px;margin:0 auto}h1{font-size:var(--text-4xl);font-weight:var(--font-bold);margin:0 0 var(--space-4);color:var(--color-text-primary)}.showcase-page__intro{font-size:var(--text-lg);color:var(--color-text-secondary);margin:0 0 var(--space-8)}.showcase-section{margin-bottom:var(--space-8);h2{font-size:var(--text-2xl);font-weight:var(--font-semibold);margin:0 0 var(--space-4);color:var(--color-text-primary)}}.showcase-stack{display:flex;flex-direction:column;gap:var(--space-6)}.note{font-size:var(--text-sm);color:var(--color-text-muted);margin-top:var(--space-2)}`],
  template: `
    <div class="showcase-page">
      <h1>Pagination</h1>
      <p class="showcase-page__intro">Page navigation with range info, page buttons, and configurable page sizes.</p>

      <section class="showcase-section">
        <h2>With 100 records</h2>
        <div class="showcase-stack">
          <rdk-pagination
            [total]="100"
            [page]="page()"
            [pageSize]="pageSize()"
            (pageChange)="page.set($event)"
            (pageSizeChange)="pageSize.set($event)"
          />
          <p class="note">Current page: {{ page() }} | Page size: {{ pageSize() }}</p>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Large dataset (1000 records)</h2>
        <div class="showcase-stack">
          <rdk-pagination [total]="1000" [page]="5" [pageSize]="25" />
        </div>
      </section>

      <section class="showcase-section">
        <h2>Without page size selector</h2>
        <div class="showcase-stack">
          <rdk-pagination [total]="50" [page]="1" [pageSize]="10" [showPageSize]="false" />
        </div>
      </section>
    </div>
  `,
})
export class PaginationShowcaseComponent {
  readonly page = signal(1);
  readonly pageSize = signal(10);
}
