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
      @for (item of items; track item.header; let i = $index) {
        <p-accordion-panel [value]="i" [disabled]="item.disabled ?? false">
          <p-accordion-header>{{ item.header }}</p-accordion-header>
          <p-accordion-content>
            <p>{{ item.content }}</p>
          </p-accordion-content>
        </p-accordion-panel>
      }
    </p-accordion>
  `,
  styles: [`
    :host { display: block; }

    ::ng-deep .rdk-accordion {
      .p-accordion-header {
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

        &[aria-expanded='true'] {
          background: var(--color-bg-brand-subtle);
          color: var(--color-text-brand);
          border-color: var(--color-brand-200);
        }
      }

      .p-accordion-content {
        padding: var(--space-4);
        border: 1px solid var(--color-border-default);
        border-top: none;
        border-radius: 0 0 var(--radius-component) var(--radius-component);
        background: var(--color-bg-surface);
      }

      .p-accordion-panel { margin-bottom: var(--space-2); }
    }
  `],
})
export class AccordionComponent {
  @Input() items: AccordionItem[] = [];
  @Input() multiple = false;
}
