import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TabsComponent, TabItem } from '../../../../../shared/components/organisms/tabs/tabs.component';

@Component({
  selector: 'app-tabs-showcase',
  standalone: true,
  imports: [TabsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .showcase-page { max-width: 900px; margin: 0 auto; }
    h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-4); color: var(--color-text-primary); }
    .showcase-page__intro { font-size: var(--text-lg); color: var(--color-text-secondary); margin: 0 0 var(--space-8); }
    .showcase-section { margin-bottom: var(--space-8); h2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); margin: 0 0 var(--space-4); color: var(--color-text-primary); } }
    .note { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-2); }
  `],
  template: `
    <div class="showcase-page">
      <h1>Tabs</h1>
      <p class="showcase-page__intro">Tab navigation wrapping PrimeNG p-tabView with styled active indicators.</p>

      <section class="showcase-section">
        <h2>Basic</h2>
        <rdk-tabs [tabs]="basicTabs" />
      </section>

      <section class="showcase-section">
        <h2>Controlled (tracks active tab)</h2>
        <rdk-tabs
          [tabs]="basicTabs"
          [activeIndex]="activeTab()"
          (tabChange)="activeTab.set($event)"
        />
        <p class="note">Active tab index: {{ activeTab() }}</p>
      </section>

      <section class="showcase-section">
        <h2>With Disabled Tab</h2>
        <rdk-tabs [tabs]="tabsWithDisabled" />
      </section>
    </div>
  `,
})
export class TabsShowcaseComponent {
  readonly activeTab = signal(0);

  readonly basicTabs: TabItem[] = [
    { header: 'Overview',   content: 'This is the overview tab. It shows a summary of the content.' },
    { header: 'Details',    content: 'Detailed information about the item goes here.' },
    { header: 'Activity',   content: 'Recent activity and audit log entries.' },
    { header: 'Settings',   content: 'Configuration options for this item.' },
  ];

  readonly tabsWithDisabled: TabItem[] = [
    { header: 'Available',    content: 'This tab is accessible.' },
    { header: 'Also Available', content: 'This one too.' },
    { header: 'Disabled',     content: '', disabled: true },
  ];
}
