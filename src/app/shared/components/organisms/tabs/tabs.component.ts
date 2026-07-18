import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TabViewModule } from 'primeng/tabview';

export interface TabItem {
  header: string;
  content?: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'rdk-tabs',
  standalone: true,
  imports: [TabViewModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-tabView
      class="rdk-tabs"
      [activeIndex]="activeIndex"
      (activeIndexChange)="activeIndex = $event; tabChange.emit($event)"
    >
      @for (tab of tabs; track tab.header) {
        <p-tabPanel [header]="tab.header" [disabled]="tab.disabled ?? false">
          @if (tab.content) {
            <p>{{ tab.content }}</p>
          }
          <ng-content />
        </p-tabPanel>
      }
    </p-tabView>
  `,
  styles: [`
    :host { display: block; }

    ::ng-deep .rdk-tabs {
      .p-tabview-nav {
        border-bottom: 1px solid var(--color-border-default);
        gap: 0;
        padding: 0;
        background: transparent;
      }

      .p-tabview-nav li {
        .p-tabview-nav-link {
          padding: var(--space-3) var(--space-4);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          color: var(--color-text-secondary);
          border: none;
          border-bottom: 2px solid transparent;
          border-radius: 0;
          background: transparent;
          transition:
            color var(--duration-150) var(--ease-out),
            border-color var(--duration-150) var(--ease-out);

          &:hover { color: var(--color-text-primary); }
          &:focus { box-shadow: none; }
        }

        &.p-highlight .p-tabview-nav-link {
          color: var(--color-text-brand);
          border-bottom-color: var(--color-brand-500);
          font-weight: var(--font-semibold);
        }
      }

      .p-tabview-panels {
        padding: var(--space-6) 0;
        background: transparent;
      }
    }
  `],
})
export class TabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activeIndex = 0;

  @Output() tabChange = new EventEmitter<number>();
}
