import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../theme/theme.service';
import { LoggingService } from '../logging/logging.service';
import { NAV_ITEMS } from '../../layout/nav-items.token';
import type { NavItem } from '../../layout/sidebar/sidebar.component';
import { CommandEntry } from './command-palette.model';
import { CommandRecentsService } from './command-recents.service';

const CREATE_RECIPES: ReadonlyArray<Omit<CommandEntry, 'section' | 'id' | 'keywords'>> = [
  {
    label: 'Pricing section',
    hint: '7-language pricing block',
    icon: 'pi pi-tag',
    routerLink: '/showcase/new-design-ideas/pricing-section',
  },
  {
    label: 'ERP dashboard',
    hint: 'Operations grid + KPIs',
    icon: 'pi pi-chart-bar',
    routerLink: '/showcase/new-design-ideas/erp-dashboard',
  },
  {
    label: 'Payment checkout',
    hint: 'Checkout + card flow',
    icon: 'pi pi-credit-card',
    routerLink: '/showcase/new-design-ideas/payment-checkout',
  },
  {
    label: 'Invoice',
    hint: 'Invoice + transactions',
    icon: 'pi pi-file',
    routerLink: '/showcase/new-design-ideas/erp-invoice',
  },
];

@Injectable({ providedIn: 'root' })
export class CommandPaletteService {
  private readonly router = inject(Router);
  private readonly theme = inject(ThemeService);
  private readonly recents = inject(CommandRecentsService);
  private readonly logger = inject(LoggingService);
  private readonly navToken = inject(NAV_ITEMS, { optional: true });

  readonly visible = signal(false);
  readonly query = signal('');

  open(): void {
    this.query.set('');
    this.visible.set(true);
    this.logger.debug('core/command-palette', 'palette.open');
  }

  close(): void {
    this.visible.set(false);
  }

  toggle(): void {
    this.visible.update((v) => !v);
  }

  buildEntries(): CommandEntry[] {
    const navigation: CommandEntry[] = this.flatNav().map((item) => ({
      id: `nav-${item.routerLink}`,
      section: 'navigation',
      label: item.label,
      icon: item.icon,
      keywords: item.keywords,
      routerLink: item.routerLink,
    }));

    const create: CommandEntry[] = CREATE_RECIPES.map((recipe) => ({
      ...recipe,
      id: `create-${recipe.label}`,
      section: 'create',
      keywords: [recipe.label, recipe.hint ?? ''],
      routerLink: recipe.routerLink ?? '',
    }));

    const actions: CommandEntry[] = [
      {
        id: 'action-theme',
        section: 'actions',
        label: 'Toggle design language',
        hint: `Active: ${this.theme.current()}`,
        icon: 'pi pi-palette',
        keywords: ['language', 'theme', 'toggle', 'switch'],
        run: () => this.theme.toggle(),
      },
    ];

    const recents: CommandEntry[] = this.recents.list().map((recent) => ({
      id: `recent-${recent.url}`,
      section: 'recents',
      label: recent.label,
      hint: 'Continue where you left off',
      icon: 'pi pi-history',
      keywords: [recent.label],
      routerLink: recent.url,
    }));

    return [...recents, ...navigation, ...create, ...actions];
  }

  run(entry: CommandEntry): void {
    if (!entry.routerLink) {
      entry.run?.();
      this.close();
      return;
    }
    this.recents.record(entry.label, entry.routerLink);
    this.router.navigateByUrl(entry.routerLink);
    this.close();
    this.logger.info('core/command-palette', 'palette.run', { section: entry.section, label: entry.label });
  }

  private flatNav(): ReadonlyArray<{
    label: string;
    icon?: string;
    routerLink: string;
    keywords: string[];
  }> {
    const source: NavItem[] = (this.navToken ?? []).flat();
    const out: { label: string; icon?: string; routerLink: string; keywords: string[] }[] = [];
    for (const item of source) {
      if (item.routerLink) {
        out.push({
          label: item.label,
          icon: item.icon,
          routerLink: item.routerLink,
          keywords: [item.label],
        });
      }
      for (const child of item.items ?? []) {
        if (child.routerLink) {
          out.push({
            label: child.label,
            icon: child.icon,
            routerLink: child.routerLink,
            keywords: [item.label, child.label],
          });
        }
      }
    }
    return out;
  }
}