import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SearchInputComponent } from '../../../../../shared/components/molecules/search-input/search-input.component';

@Component({
  selector: 'app-search-input-showcase',
  standalone: true,
  imports: [SearchInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host{display:block}.showcase-page{max-width:600px;margin:0 auto}h1{font-size:var(--text-4xl);font-weight:var(--font-bold);margin:0 0 var(--space-4);color:var(--color-text-primary)}.showcase-page__intro{font-size:var(--text-lg);color:var(--color-text-secondary);margin:0 0 var(--space-8)}.showcase-section{margin-bottom:var(--space-8);h2{font-size:var(--text-2xl);font-weight:var(--font-semibold);margin:0 0 var(--space-4);color:var(--color-text-primary)}}.showcase-stack{display:flex;flex-direction:column;gap:var(--space-4)}.result{font-size:var(--text-sm);color:var(--color-text-secondary);margin-top:var(--space-2)}`],
  template: `
    <div class="showcase-page">
      <h1>Search Input</h1>
      <p class="showcase-page__intro">Debounced search field with clear button and loading state.</p>

      <section class="showcase-section">
        <h2>Basic</h2>
        <div class="showcase-stack">
          <rdk-search-input placeholder="Search items…" (search)="lastQuery.set($event)" />
          @if (lastQuery()) {
            <p class="result">Last search: "{{ lastQuery() }}"</p>
          }
        </div>
      </section>

      <section class="showcase-section">
        <h2>Loading state</h2>
        <div class="showcase-stack">
          <rdk-search-input placeholder="Fetching results…" [loading]="true" />
        </div>
      </section>

      <section class="showcase-section">
        <h2>Disabled</h2>
        <div class="showcase-stack">
          <rdk-search-input placeholder="Search disabled" [disabled]="true" />
        </div>
      </section>
    </div>
  `,
})
export class SearchInputShowcaseComponent {
  readonly lastQuery = signal('');
}
