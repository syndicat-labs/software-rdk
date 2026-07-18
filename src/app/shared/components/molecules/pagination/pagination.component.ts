import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

@Component({
  selector: 'rdk-pagination',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="rdk-pagination" aria-label="Pagination">
      <div class="rdk-pagination__info">
        <span>{{ rangeStart }}–{{ rangeEnd }} of {{ total }}</span>
      </div>

      <div class="rdk-pagination__controls">
        <button
          type="button"
          class="rdk-pagination__btn"
          (click)="goTo(1)"
          [disabled]="currentPage() === 1"
          aria-label="First page"
        >
          <span class="pi pi-angle-double-left" aria-hidden="true"></span>
        </button>

        <button
          type="button"
          class="rdk-pagination__btn"
          (click)="prev()"
          [disabled]="currentPage() === 1"
          aria-label="Previous page"
        >
          <span class="pi pi-angle-left" aria-hidden="true"></span>
        </button>

        @for (p of pageNumbers(); track p) {
          <button
            type="button"
            class="rdk-pagination__btn"
            [class.rdk-pagination__btn--active]="p === currentPage()"
            [attr.aria-current]="p === currentPage() ? 'page' : null"
            [attr.aria-label]="'Page ' + p"
            (click)="goTo(p)"
          >
            {{ p }}
          </button>
        }

        <button
          type="button"
          class="rdk-pagination__btn"
          (click)="next()"
          [disabled]="currentPage() === totalPages()"
          aria-label="Next page"
        >
          <span class="pi pi-angle-right" aria-hidden="true"></span>
        </button>

        <button
          type="button"
          class="rdk-pagination__btn"
          (click)="goTo(totalPages())"
          [disabled]="currentPage() === totalPages()"
          aria-label="Last page"
        >
          <span class="pi pi-angle-double-right" aria-hidden="true"></span>
        </button>
      </div>

      @if (showPageSize) {
        <div class="rdk-pagination__sizer">
          <label class="rdk-pagination__sizer-label" [attr.for]="sizerId">Rows per page:</label>
          <select
            class="rdk-pagination__sizer-select"
            [id]="sizerId"
            [value]="currentPageSize()"
            (change)="onPageSizeChange($event)"
          >
            @for (size of pageSizes; track size) {
              <option [value]="size">{{ size }}</option>
            }
          </select>
        </div>
      }
    </nav>
  `,
  styles: [`
    :host { display: block; }

    .rdk-pagination {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .rdk-pagination__info {
      font-size: var(--pagination-font-size);
      color: var(--color-text-secondary);
      white-space: nowrap;
    }

    .rdk-pagination__controls {
      display: flex;
      align-items: center;
      gap: var(--pagination-gap);
    }

    .rdk-pagination__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: var(--pagination-item-size);
      height: var(--pagination-item-size);
      padding: 0 var(--space-2);
      font-size: var(--pagination-font-size);
      font-family: var(--font-family);
      font-weight: var(--font-medium);
      border: 1px solid var(--color-border-default);
      border-radius: var(--pagination-radius);
      background: var(--color-bg-surface);
      color: var(--color-text-secondary);
      cursor: pointer;
      transition:
        background var(--duration-150) var(--ease-out),
        border-color var(--duration-150) var(--ease-out),
        color var(--duration-150) var(--ease-out);

      &:hover:not(:disabled) {
        background: var(--color-bg-sunken);
        border-color: var(--color-border-strong);
        color: var(--color-text-primary);
      }

      &:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      &--active {
        background: var(--color-brand-500);
        border-color: var(--color-brand-500);
        color: var(--color-neutral-0);
        font-weight: var(--font-semibold);

        &:hover { background: var(--color-brand-600); }
      }

      .pi { font-size: 0.75rem; }
    }

    .rdk-pagination__sizer {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-left: auto;
    }

    .rdk-pagination__sizer-label {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
      white-space: nowrap;
    }

    .rdk-pagination__sizer-select {
      height: var(--pagination-item-size);
      padding: 0 var(--space-2);
      font-size: var(--text-sm);
      font-family: var(--font-family);
      border: 1px solid var(--color-border-default);
      border-radius: var(--pagination-radius);
      background: var(--color-bg-surface);
      color: var(--color-text-primary);
      cursor: pointer;
      outline: none;

      &:focus {
        border-color: var(--color-border-focus);
        box-shadow: var(--input-focus-shadow);
      }
    }
  `],
})
export class PaginationComponent {
  @Input() total = 0;
  @Input() set page(v: number) { this.currentPage.set(v); }
  @Input() set pageSize(v: number) { this.currentPageSize.set(v); }
  @Input() pageSizes: number[] = DEFAULT_PAGE_SIZES;
  @Input() showPageSize = true;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  protected readonly currentPage = signal(1);
  protected readonly currentPageSize = signal(DEFAULT_PAGE_SIZES[0]);
  protected readonly sizerId = `rdk-pg-sizer-${Math.random().toString(36).slice(2, 7)}`;

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.total / this.currentPageSize())),
  );

  protected readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const WINDOW = 2;

    const pages: number[] = [];
    for (let i = Math.max(1, current - WINDOW); i <= Math.min(total, current + WINDOW); i++) {
      pages.push(i);
    }
    return pages;
  });

  protected get rangeStart(): number {
    return (this.currentPage() - 1) * this.currentPageSize() + 1;
  }

  protected get rangeEnd(): number {
    return Math.min(this.currentPage() * this.currentPageSize(), this.total);
  }

  protected goTo(page: number): void {
    const clamped = Math.max(1, Math.min(page, this.totalPages()));
    this.currentPage.set(clamped);
    this.pageChange.emit(clamped);
  }

  protected prev(): void { this.goTo(this.currentPage() - 1); }
  protected next(): void { this.goTo(this.currentPage() + 1); }

  protected onPageSizeChange(event: Event): void {
    const size = Number((event.target as HTMLSelectElement).value);
    this.currentPageSize.set(size);
    this.currentPage.set(1);
    this.pageSizeChange.emit(size);
    this.pageChange.emit(1);
  }
}
