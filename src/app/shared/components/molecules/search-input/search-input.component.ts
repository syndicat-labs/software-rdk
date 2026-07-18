import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  signal,
} from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { SpinnerComponent } from '../../atoms/spinner/spinner.component';

@Component({
  selector: 'rdk-search-input',
  standalone: true,
  imports: [SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rdk-search" [class.rdk-search--loading]="loading">
      <span class="pi pi-search rdk-search__icon" aria-hidden="true"></span>

      <input
        class="rdk-search__control"
        type="search"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value()"
        (input)="onInput($event)"
        (keydown.escape)="onClear()"
        [attr.aria-label]="ariaLabel || placeholder"
        autocomplete="off"
      />

      @if (loading) {
        <rdk-spinner size="sm" color="muted" />
      } @else if (value()) {
        <button
          type="button"
          class="rdk-search__clear"
          (click)="onClear()"
          aria-label="Clear search"
        >
          <span class="pi pi-times" aria-hidden="true"></span>
        </button>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .rdk-search {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      height: var(--input-height-md);
      padding: 0 var(--input-padding-x);
      border: var(--input-border-width) solid var(--input-border-color);
      border-radius: var(--input-border-radius);
      background: var(--input-bg);
      transition: var(--input-transition);

      &:focus-within {
        border-color: var(--color-border-focus);
        box-shadow: var(--input-focus-shadow);
      }
    }

    .rdk-search__icon {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      flex-shrink: 0;
    }

    .rdk-search__control {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      font-family: var(--font-family);
      font-size: var(--input-font-size);
      color: var(--color-text-primary);

      &::placeholder { color: var(--color-text-muted); }
      &::-webkit-search-decoration,
      &::-webkit-search-cancel-button { display: none; }
    }

    .rdk-search__clear {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      padding: 0;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-muted);
      border-radius: var(--radius-sm);
      flex-shrink: 0;

      &:hover { color: var(--color-text-secondary); }
      .pi { font-size: 0.625rem; }
    }
  `],
})
export class SearchInputComponent implements OnDestroy {
  @Input() placeholder = 'Search…';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() debounceMs = 300;
  @Input() ariaLabel?: string;

  @Output() searched = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();

  protected readonly value = signal('');
  private readonly input$ = new Subject<string>();
  private readonly sub = this.input$.pipe(
    debounceTime(this.debounceMs),
    distinctUntilChanged(),
  ).subscribe((v) => this.searched.emit(v));

  protected onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value.set(v);
    this.input$.next(v);
  }

  protected onClear(): void {
    this.value.set('');
    this.input$.next('');
    this.cleared.emit();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
