import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';

export interface AccordionItem {
  header: string;
  content: string;
  disabled?: boolean;
}

@Component({
  selector: 'rdk-accordion',
  standalone: true,
  imports: [AccordionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-accordion class="rdk-accordion" [multiple]="multiple">
      @for (item of items; track item.header) {
        <p-accordionTab
          [header]="item.header"
          [disabled]="item.disabled ?? false"
        >
          <p>{{ item.content }}</p>
        </p-accordionTab>
      }
    </p-accordion>
  `,
  styles: [`
    :host { display: block; }

    ::ng-deep .rdk-accordion {
      .p-accordion-header .p-accordion-header-link {
        padding: var(--space-4);
        font-weight: var(--font-semibold);
        font-size: var(--text-base);
        color: var(--color-text-primary);
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-component);
        transition: background var(--duration-150) var(--ease-out);

        &:hover { background: var(--color-bg-sunken); }
        &:focus { box-shadow: var(--input-focus-shadow); }
      }

      .p-accordion-header.p-highlight .p-accordion-header-link {
        background: var(--color-bg-brand-subtle);
        color: var(--color-text-brand);
        border-color: var(--color-brand-200);
      }

      .p-accordion-content {
        padding: var(--space-4);
        border: 1px solid var(--color-border-default);
        border-top: none;
        border-radius: 0 0 var(--radius-component) var(--radius-component);
        background: var(--color-bg-surface);
      }

      .p-accordion-tab { margin-bottom: var(--space-2); }
    }
  `],
})
export class AccordionComponent {
  @Input() items: AccordionItem[] = [];
  @Input() multiple = false;
}
