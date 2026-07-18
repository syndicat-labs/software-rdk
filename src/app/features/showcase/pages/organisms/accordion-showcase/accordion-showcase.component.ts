import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccordionComponent, AccordionItem } from '../../../../../shared/components/organisms/accordion/accordion.component';

@Component({
  selector: 'app-accordion-showcase',
  standalone: true,
  imports: [AccordionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .showcase-page { max-width: 700px; margin: 0 auto; }
    h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-4); color: var(--color-text-primary); }
    .showcase-page__intro { font-size: var(--text-lg); color: var(--color-text-secondary); margin: 0 0 var(--space-8); }
    .showcase-section { margin-bottom: var(--space-8); h2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); margin: 0 0 var(--space-4); color: var(--color-text-primary); } }
  `],
  template: `
    <div class="showcase-page">
      <h1>Accordion</h1>
      <p class="showcase-page__intro">Collapsible content panels wrapping PrimeNG p-accordion.</p>

      <section class="showcase-section">
        <h2>Single open (default)</h2>
        <rdk-accordion [items]="faqItems" />
      </section>

      <section class="showcase-section">
        <h2>Multiple open</h2>
        <rdk-accordion [items]="faqItems" [multiple]="true" />
      </section>

      <section class="showcase-section">
        <h2>With Disabled Panel</h2>
        <rdk-accordion [items]="itemsWithDisabled" />
      </section>
    </div>
  `,
})
export class AccordionShowcaseComponent {
  readonly faqItems: AccordionItem[] = [
    {
      header: 'What is the RDK?',
      content: 'The RDK (Rapid Development Kit) is a cloneable Angular 19 template that provides a production-ready foundation including auth, HTTP interceptors, error handling, and a full component library.',
    },
    {
      header: 'How do I add a new feature module?',
      content: 'Create a directory under src/app/features/, add a routes file, and lazy-load it from app.routes.ts. Feature modules may import from core/ and shared/ but must never import from other feature modules.',
    },
    {
      header: 'How is authentication handled?',
      content: 'JWT access + refresh tokens are managed by AuthService and TokenService. The authGuard protects routes. Proactive refresh fires 60 seconds before expiry. Tokens are stored in localStorage under the keys defined in AppConfig.',
    },
    {
      header: 'Can I use a different UI library?',
      content: 'Yes. PrimeNG is only used for complex organisms (DataTable, Calendar, Dialog, FileUpload). All atoms and most molecules are built from scratch against the design token system.',
    },
  ];

  readonly itemsWithDisabled: AccordionItem[] = [
    { header: 'Active panel', content: 'This panel can be opened and closed.' },
    { header: 'Disabled panel', content: '', disabled: true },
    { header: 'Another active panel', content: 'This one works too.' },
  ];
}
