import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../../../shared/components/molecules/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-breadcrumb-showcase',
  standalone: true,
  imports: [BreadcrumbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host{display:block}.showcase-page{max-width:700px;margin:0 auto}h1{font-size:var(--text-4xl);font-weight:var(--font-bold);margin:0 0 var(--space-4);color:var(--color-text-primary)}.showcase-page__intro{font-size:var(--text-lg);color:var(--color-text-secondary);margin:0 0 var(--space-8)}.showcase-section{margin-bottom:var(--space-8);h2{font-size:var(--text-2xl);font-weight:var(--font-semibold);margin:0 0 var(--space-4);color:var(--color-text-primary)}}.showcase-box{padding:var(--space-4);border:1px solid var(--color-border-default);border-radius:var(--radius-component);background:var(--color-bg-elevated)}`],
  template: `
    <div class="showcase-page">
      <h1>Breadcrumb</h1>
      <p class="showcase-page__intro">Accessible navigation trail with aria-label and aria-current=page on the last item.</p>

      <section class="showcase-section">
        <h2>Basic</h2>
        <div class="showcase-box">
          <rdk-breadcrumb [items]="basicItems" />
        </div>
      </section>

      <section class="showcase-section">
        <h2>With Icons</h2>
        <div class="showcase-box">
          <rdk-breadcrumb [items]="iconItems" />
        </div>
      </section>

      <section class="showcase-section">
        <h2>Deep hierarchy</h2>
        <div class="showcase-box">
          <rdk-breadcrumb [items]="deepItems" />
        </div>
      </section>
    </div>
  `,
})
export class BreadcrumbShowcaseComponent {
  readonly basicItems = [
    { label: 'Home', path: '/dashboard' },
    { label: 'Settings', path: '/dashboard' },
    { label: 'Profile' },
  ];

  readonly iconItems = [
    { label: 'Home', path: '/dashboard', icon: 'pi-home' },
    { label: 'Users', path: '/dashboard', icon: 'pi-users' },
    { label: 'John Doe' },
  ];

  readonly deepItems = [
    { label: 'Home', path: '/dashboard' },
    { label: 'Products', path: '/dashboard' },
    { label: 'Electronics', path: '/dashboard' },
    { label: 'Laptops', path: '/dashboard' },
    { label: 'MacBook Pro 16"' },
  ];
}
