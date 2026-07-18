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
import { filter } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent, NavItem } from '../sidebar/sidebar.component';
import { NAV_ITEMS } from '../nav-items.token';

@Component({
  selector: 'rdk-app-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
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
        <rdk-header />
        <main class="rdk-app-shell__content" role="main">
          @if (pageTitle()) {
            <h1 class="rdk-app-shell__page-title">{{ pageTitle() }}</h1>
          }
          <router-outlet />
        </main>
      </div>
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
      background: #fff;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1), background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
      padding: 0;
      font-size: 0.625rem;
      font-family: 'JetBrains Mono', monospace;

      &:hover {
        background: #f8fafc;
        color: #1e293b;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
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
      padding: 1.5rem;
      min-width: 0;
      box-sizing: border-box;
    }
    .rdk-app-shell__page-title {
      margin: 0 0 1.25rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      font-size: 2rem;
      letter-spacing: -0.04em;
      font-stretch: condensed;
      color: #1e293b;
      line-height: 1.1;
    }
  `],
})
export class AppShellComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

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
      .subscribe(() => this.pageTitle.set(this.resolveTitle()));
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  private resolveTitle(): string {
    let r = this.route.firstChild;
    while (r?.firstChild) {
      r = r.firstChild;
    }
    return (r?.snapshot.data?.['title'] as string | undefined) ?? 'Dashboard';
  }
}
