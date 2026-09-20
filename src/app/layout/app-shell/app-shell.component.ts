import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent, NavItem } from '../sidebar/sidebar.component';
import { NAV_ITEMS } from '../nav-items.token';
import { CommandPaletteComponent } from '../../core/command-palette/command-palette.component';
import { CommandPaletteService } from '../../core/command-palette/command-palette.service';
import { CommandRecentsService } from '../../core/command-palette/command-recents.service';

@Component({
  selector: 'rdk-app-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, CommandPaletteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rdk-app-shell">
      <rdk-sidebar [navItems]="navItems" [collapsed]="sidebarCollapsed()" />
      <button
        type="button"
        class="rdk-app-shell__sidebar-toggle"
        [class.rdk-app-shell__sidebar-toggle--collapsed]="sidebarCollapsed()"
        (click)="toggleSidebar()"
        [attr.aria-label]="sidebarCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <span class="pi" [class.pi-chevron-left]="!sidebarCollapsed()" [class.pi-chevron-right]="sidebarCollapsed()"></span>
      </button>
      <div class="rdk-app-shell__body">
        <rdk-header>
          <button
            type="button"
            class="rdk-palette-trigger"
            (click)="palette.open()"
            data-testid="palette-trigger"
          >
            <span class="pi pi-search rdk-palette-trigger__icon" aria-hidden="true"></span>
            <span class="rdk-palette-trigger__label">Search the toolkit</span>
            <kbd class="rdk-palette-trigger__kbd">⌘K</kbd>
          </button>
        </rdk-header>
        <main class="rdk-app-shell__content" role="main">
          @if (pageTitle()) {
            <div class="rdk-app-shell__breadcrumb" aria-hidden="true">
              <span class="rdk-app-shell__breadcrumb-root">RDK</span>
              <span class="rdk-app-shell__breadcrumb-sep"></span>
              <span class="rdk-app-shell__breadcrumb-current">{{ pageTitle() }}</span>
            </div>
          }
          <router-outlet />
        </main>
      </div>
      <rdk-command-palette />
    </div>
  `,
  styles: [`
    .rdk-app-shell {
      display: flex;
      flex-direction: row;
      height: 100vh;
      overflow: hidden;
      position: relative;
    }
    .rdk-app-shell__sidebar-toggle {
      position: absolute;
      left: 15rem;
      top: 1.75rem;
      transform: translate(-50%, -50%);
      z-index: 50;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      border: 1px solid var(--color-border-default);
      background: var(--color-bg-surface);
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: left var(--duration-200) var(--ease-in-out), background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
      box-shadow: var(--elevation-raised);
      padding: 0;
      font-size: 0.625rem;
      font-family: 'JetBrains Mono', monospace;

      &:hover {
        background: var(--color-bg-sunken);
        color: var(--color-text-primary);
        box-shadow: var(--elevation-float);
      }
    }
    .rdk-app-shell__sidebar-toggle--collapsed {
      left: 4rem;
    }
    .rdk-app-shell__body {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      min-width: 0;
    }
    .rdk-app-shell__content {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-layout-sm);
      min-width: 0;
      box-sizing: border-box;
    }
    .rdk-app-shell__breadcrumb {
      display: flex;
      align-items: center;
      gap: var(--space-component-xs);
      margin: 0 0 1.25rem;
      font-family: var(--font-data);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-muted);
    }
    .rdk-app-shell__breadcrumb-root {
      color: var(--color-text-secondary);
    }
    .rdk-app-shell__breadcrumb-sep {
      width: 0.375rem;
      height: 0.375rem;
      border-top: 1px solid var(--color-border-strong);
      border-right: 1px solid var(--color-border-strong);
      transform: rotate(45deg);
    }
    .rdk-app-shell__breadcrumb-current {
      color: var(--color-text-primary);
    }

    .rdk-palette-trigger {
      display: inline-flex;
      align-items: center;
      gap: var(--space-component-sm);
      height: 1.875rem;
      padding: 0 0.625rem;
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-pill);
      background: var(--color-bg-sunken);
      cursor: pointer;
      font: inherit;
      transition: border-color var(--duration-200) var(--ease-in-out),
                  background var(--duration-200) var(--ease-in-out);

      &:hover,
      &:focus-visible {
        border-color: var(--color-border-strong);
        background: var(--color-bg-surface);
      }

      &:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }
    }

    .rdk-palette-trigger__icon {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .rdk-palette-trigger__label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--color-text-secondary);
    }

    .rdk-palette-trigger__kbd {
      font-family: var(--font-data);
      font-size: 0.625rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--color-text-muted);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-component);
      padding: 0 0.3125rem;
      background: var(--color-bg-surface);
    }
  `],
})
export class AppShellComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly palette = inject(CommandPaletteService);
  private readonly recents = inject(CommandRecentsService);

  protected readonly sidebarCollapsed = signal(false);
  protected readonly pageTitle = signal('Dashboard');
  protected readonly navItems: NavItem[] = (inject(NAV_ITEMS, { optional: true }) ?? []).flat();

  ngOnInit(): void {
    this.pageTitle.set(this.resolveTitle());

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.pageTitle.set(this.resolveTitle());
        this.recordRecent();
      });

    fromEvent<KeyboardEvent>(window, 'keydown')
      .pipe(
        filter((event) => (event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        event.preventDefault();
        this.palette.toggle();
      });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  private recordRecent(): void {
    const title = this.resolveTitle();
    if (title === 'Dashboard') return;
    this.recents.record(title, this.router.routerState.snapshot.url);
  }

  private resolveTitle(): string {
    let r = this.route.firstChild;
    while (r?.firstChild) {
      r = r.firstChild;
    }
    return (r?.snapshot.data?.['title'] as string | undefined) ?? 'Dashboard';
  }
}
