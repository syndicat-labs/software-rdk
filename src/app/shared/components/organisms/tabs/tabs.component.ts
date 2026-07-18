import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TabsModule } from 'primeng/tabs';

export interface TabItem {
  header: string;
  content?: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'rdk-tabs',
  standalone: true,
  imports: [TabsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-tabs
      class="rdk-tabs"
      [value]="activeIndex"
      (valueChange)="onValueChange($event)"
    >
      <p-tablist>
        @for (tab of tabs; track tab.header; let i = $index) {
          <p-tab [value]="i" [disabled]="tab.disabled ?? false">{{ tab.header }}</p-tab>
        }
      </p-tablist>
      <p-tabpanels>
        @for (tab of tabs; track tab.header; let i = $index) {
          <p-tabpanel [value]="i">
            @if (tab.content) {
              <p>{{ tab.content }}</p>
            }
            <ng-content />
          </p-tabpanel>
        }
      </p-tabpanels>
    </p-tabs>
  `,
  styles: [`
    :host { display: block; }

    ::ng-deep .rdk-tabs {
      .p-tablist {
        border-bottom: 1px solid var(--color-border-default);
        gap: 0;
        padding: 0;
        background: transparent;
      }

      .p-tab {
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

        &[data-p-active='true'] {
          color: var(--color-text-brand);
          border-bottom-color: var(--color-brand-500);
          font-weight: var(--font-semibold);
        }
      }

      .p-tabpanels {
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

  onValueChange(value: string | number | undefined): void {
    if (value === undefined) {
      return;
    }
    const index = typeof value === 'number' ? value : Number(value);
    this.activeIndex = index;
    this.tabChange.emit(index);
  }
}
