import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
}

interface NavSection {
  label: string;
  badge?: string;
  items: NavItem[];
}

interface NavGroup {
  label: string;
  sections: NavSection[];
}

@Component({
  selector: 'app-showcase-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="showcase-layout">
      <nav class="showcase-sidebar">
        <div class="showcase-sidebar__content">
          @for (group of navGroups; track group.label) {
            <div class="showcase-group">
              <h2 class="showcase-group__label">{{ group.label }}</h2>
              @for (section of group.sections; track section.label) {
                <div class="showcase-nav-section">
                  <h3 class="showcase-nav-section__title">
                    {{ section.label }}
                    @if (section.badge) {
                      <span class="showcase-nav-section__badge">{{ section.badge }}</span>
                    }
                  </h3>
                  <ul class="showcase-nav-section__list">
                    @for (item of section.items; track item.path) {
                      <li>
                        <a
                          class="showcase-nav-item"
                          [routerLink]="item.path"
                          routerLinkActive="showcase-nav-item--active"
                          [routerLinkActiveOptions]="{ exact: true }"
                        >
                          {{ item.label }}
                        </a>
                      </li>
                    }
                  </ul>
                </div>
              }
            </div>
          }
        </div>
      </nav>

      <main class="showcase-canvas">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }

    .showcase-layout {
      display: flex;
      height: 100%;
      background: var(--color-bg-base);
      overflow: hidden;
    }

    // ── Sidebar ────────────────────────────────────────────────────────────────
    .showcase-sidebar {
      display: flex;
      flex-direction: column;
      width: 16rem;
      background: var(--color-bg-surface);
      border-right: 1px solid var(--color-border-default);
      overflow: hidden;
    }

    .showcase-sidebar__content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 0 1.5rem;
    }

    // ── Group ─────────────────────────────────────────────────────────────────
    .showcase-group {
      margin-bottom: 0.5rem;

      &:not(:first-child) {
        border-top: 1px solid var(--color-border-default);
        padding-top: 0.75rem;
        margin-top: 0.75rem;
      }
    }

    .showcase-group__label {
      margin: 0;
      padding: 0.375rem 1.5rem 0.25rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-text-primary);
    }

    // ── Nav Section ────────────────────────────────────────────────────────────
    .showcase-nav-section {
      margin-bottom: 0.25rem;
    }

    .showcase-nav-section__title {
      margin: 0;
      padding: 0.375rem 1.5rem 0.25rem;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .showcase-nav-section__badge {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 0.125rem 0.4rem;
      border-radius: var(--radius-pill);
      background: var(--color-hover-overlay);
      color: var(--color-text-muted);
    }

    .showcase-nav-section__list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    // ── Nav Item ───────────────────────────────────────────────────────────────
    .showcase-nav-item {
      display: block;
      padding: 0.3125rem 1rem 0.3125rem 1.5rem;
      color: var(--color-text-secondary);
      text-decoration: none;
      font-size: var(--text-sm);
      border-left: 3px solid transparent;
      transition: all var(--duration-150) var(--ease-out);

      &:hover {
        color: var(--color-text-primary);
        background: var(--color-bg-sunken);
      }

      &--active {
        color: var(--color-text-primary);
        border-left-color: var(--color-text-primary);
        background: var(--color-active-overlay);
        font-weight: var(--font-medium);
      }
    }

    // ── Canvas ─────────────────────────────────────────────────────────────────
    .showcase-canvas {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-8);
    }

    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb {
      background: var(--color-border-strong);
      border-radius: 3px;
      &:hover { background: var(--color-border-muted); }
    }
  `],
})
export class ShowcaseLayoutComponent {
  @HostBinding('attr.data-theme') readonly dataTheme = 'obsidian';

  protected readonly navGroups: NavGroup[] = [
    {
      label: 'Components',
      sections: [
        {
          label: 'Atoms',
          items: [
            { label: 'Button', path: 'atoms/button' },
            { label: 'Badge', path: 'atoms/badge' },
            { label: 'Avatar', path: 'atoms/avatar' },
            { label: 'Chip', path: 'atoms/chip' },
            { label: 'Spinner', path: 'atoms/spinner' },
            { label: 'Divider', path: 'atoms/divider' },
            { label: 'Icon', path: 'atoms/icon' },
          ],
        },
        {
          label: 'Molecules',
          items: [
            { label: 'Form Field', path: 'molecules/form-field' },
            { label: 'Input', path: 'molecules/input' },
            { label: 'Textarea', path: 'molecules/textarea' },
            { label: 'Select', path: 'molecules/select' },
            { label: 'Checkbox', path: 'molecules/checkbox' },
            { label: 'Radio Group', path: 'molecules/radio' },
            { label: 'Toggle', path: 'molecules/toggle' },
            { label: 'Alert', path: 'molecules/alert' },
            { label: 'Search Input', path: 'molecules/search-input' },
            { label: 'Pagination', path: 'molecules/pagination' },
            { label: 'Breadcrumb', path: 'molecules/breadcrumb' },
          ],
        },
        {
          label: 'Organisms',
          items: [
            { label: 'Card', path: 'organisms/card' },
            { label: 'Modal', path: 'organisms/modal' },
            { label: 'Data Table', path: 'organisms/data-table' },
            { label: 'Tabs', path: 'organisms/tabs' },
            { label: 'Accordion', path: 'organisms/accordion' },
            { label: 'Date Picker', path: 'organisms/date-picker' },
            { label: 'File Upload', path: 'organisms/file-upload' },
            { label: 'Combobox', path: 'organisms/combobox' },
          ],
        },
      ],
    },
    {
      label: 'New Design Ideas',
      sections: [
        {
          label: 'Prototype',
          badge: 'Prototype',
          items: [
            { label: 'Pricing Section', path: 'new-design-ideas/pricing-section' },
            { label: 'ERP Dashboard',   path: 'new-design-ideas/erp-dashboard' },
            { label: 'ERP Orders',      path: 'new-design-ideas/erp-orders' },
            { label: 'ERP Invoice',          path: 'new-design-ideas/erp-invoice' },
            { label: 'Payment Checkout',     path: 'new-design-ideas/payment-checkout' },
            { label: 'Transactions',         path: 'new-design-ideas/payment-transactions' },
            { label: 'Invoice Variants',     path: 'new-design-ideas/invoice-variants' },
            { label: 'Frosted Glass',        path: 'new-design-ideas/frosted-glass' },
          ],
        },
      ],
    },
  ];
}
