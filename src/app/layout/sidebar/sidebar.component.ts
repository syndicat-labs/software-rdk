import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';
import { AuthService } from '../../core/auth/auth.service';

export interface NavItem {
  readonly label: string;
  readonly icon?: string;
  readonly routerLink?: string;
  readonly roles?: string[];
  readonly exact?: boolean;
  readonly items?: NavItem[];
}

interface ResolvedItem {
  readonly label: string;
  readonly icon: string;
  readonly routerLink: string;
  readonly exact: boolean;
}

interface ResolvedGroup {
  readonly label: string;
  readonly icon: string;
  readonly items: ResolvedItem[];
}

@Component({
  selector: 'rdk-sidebar',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="sidebar" [class.sidebar--collapsed]="collapsed" aria-label="Main navigation">

      <!-- Brand -->
      <div class="sidebar__brand">
        <div class="sidebar__brand-mark">⬡</div>
        @if (!collapsed) {
          <span class="sidebar__brand-name">RDK</span>
        }
      </div>

      <!-- Nav -->
      <nav class="sidebar__nav" role="navigation">

        @if (resolvedItems.length) {
          @if (!collapsed) {
            <span class="sidebar__section-label">Menu</span>
          }
          @for (item of resolvedItems; track item.routerLink) {
            <ng-container *ngTemplateOutlet="navLink; context: { item, collapsed }"></ng-container>
          }
        }

        @for (group of resolvedGroups; track group.label) {
          @if (!collapsed) {
            <span class="sidebar__section-label sidebar__section-label--group">
              <span class="pi sidebar__section-icon" [ngClass]="group.icon"></span>
              {{ group.label }}
            </span>
          }
          @for (item of group.items; track item.routerLink) {
            <ng-container *ngTemplateOutlet="navLink; context: { item, collapsed, indented: !collapsed }"></ng-container>
          }
        }
      </nav>

      <ng-template #navLink let-item="item" let-collapsed="collapsed" let-indented="indented">
        <a
          [routerLink]="item.routerLink"
          routerLinkActive="sidebar__item--active"
          [routerLinkActiveOptions]="{ exact: item.exact }"
          class="sidebar__item"
          [class.sidebar__item--icon-only]="collapsed"
          [class.sidebar__item--indented]="indented"
          [attr.title]="collapsed ? item.label : null"
          [attr.aria-label]="item.label"
        >
          <span class="sidebar__item-indicator" aria-hidden="true"></span>
          <div class="sidebar__item-icon-wrap">
            <span class="pi sidebar__item-icon" [ngClass]="item.icon"></span>
          </div>
          @if (!collapsed) {
            <span class="sidebar__item-label">{{ item.label }}</span>
          }
        </a>
      </ng-template>

      <!-- Footer -->
      <div class="sidebar__footer">
        <div class="sidebar__divider"></div>
        @if (store.isAuthenticated()) {
          <div class="sidebar__user" [class.sidebar__user--collapsed]="collapsed">
            <div class="sidebar__avatar">
              <span class="pi pi-user"></span>
            </div>
            @if (!collapsed) {
              <div class="sidebar__user-info">
                <span class="sidebar__user-name">{{ userName }}</span>
                <span class="sidebar__user-role">{{ primaryRole }}</span>
              </div>
              <button
                type="button"
                class="sidebar__signout"
                (click)="signOut()"
                aria-label="Sign out"
                title="Sign out"
              >
                <span class="pi pi-sign-out"></span>
              </button>
            }
          </div>
        }
      </div>

    </aside>
  `,
  styles: [`
    .sidebar {
      display: flex;
      flex-direction: column;
      width: 15rem;
      height: 100%;
      background-color: var(--color-nav-bg);
      background-image: var(--color-nav-texture, none);
      background-size: 200px 200px;
      background-repeat: repeat;
      border-right: 1px solid rgba(255, 255, 255, 0.06);
      transition: width var(--duration-200) var(--ease-in-out);
      overflow: hidden;
      flex-shrink: 0;
      position: relative;
      z-index: 10;
    }

    .sidebar--collapsed { width: 4rem; }

    // ── Brand ─────────────────────────────────────────────────────────────────────
    .sidebar__brand {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      height: 3.5rem;
      padding: 0 1.125rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      flex-shrink: 0;
      box-sizing: border-box;
    }

    .sidebar__brand-mark {
      font-size: 1.375rem;
      color: var(--color-nav-text);
      line-height: 1;
      flex-shrink: 0;
      width: 1.75rem;
      text-align: center;
    }

    .sidebar__brand-name {
      font-size: 1rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--color-nav-text-active);
      white-space: nowrap;
    }

    // ── Nav ───────────────────────────────────────────────────────────────────────
    .sidebar__nav {
      flex: 1;
      padding: 1rem 0.625rem;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .sidebar__section-label {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-nav-text-subtle);
      padding: 0 0.625rem 0.5rem;
      white-space: nowrap;

      &--group {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        margin-top: 0.75rem;
      }
    }

    .sidebar__section-icon {
      font-size: 0.625rem;
      opacity: 0.5;
    }

    // ── Nav item ──────────────────────────────────────────────────────────────────
    .sidebar__item {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: 0.625rem;
      text-decoration: none;
      color: var(--color-nav-text);
      transition: color var(--duration-200) var(--ease-in-out),
                  background var(--duration-200) var(--ease-in-out);
      white-space: nowrap;
      min-width: 0;

      &:hover {
        color: var(--color-nav-text-active);
        background: rgba(255, 255, 255, 0.05);

        .sidebar__item-icon-wrap {
          background: var(--color-nav-icon-hover-bg);
        }
      }

      &--icon-only {
        justify-content: center;
        padding: 0.625rem;
      }

      &--indented {
        padding-left: 1.25rem;

        .sidebar__item-icon-wrap {
          width: 1.5rem;
          height: 1.5rem;
        }

        .sidebar__item-icon { font-size: 0.75rem; }
        .sidebar__item-label { font-size: 0.8125rem; }
      }
    }

    .sidebar__item-indicator {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%) scaleY(0);
      width: 3px;
      height: 60%;
      background: var(--color-nav-active-indicator);
      border-radius: 0 2px 2px 0;
      transition: transform var(--duration-200) var(--ease-in-out);
    }

    .sidebar__item--active {
      color: var(--color-nav-text-active);
      background: var(--color-nav-active-bg);

      .sidebar__item-indicator {
        transform: translateY(-50%) scaleY(1);
      }

      .sidebar__item-icon-wrap {
        background: var(--color-nav-icon-active-bg);
      }

      .sidebar__item-icon {
        color: var(--color-nav-icon-active);
      }
    }

    .sidebar__item-icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.875rem;
      height: 1.875rem;
      border-radius: 0.5rem;
      flex-shrink: 0;
      transition: background var(--duration-200) var(--ease-in-out);
    }

    .sidebar__item-icon {
      font-size: 0.875rem;
      color: var(--color-nav-text);
      transition: color var(--duration-200) var(--ease-in-out);
    }

    .sidebar__item-label {
      font-size: 0.875rem;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    // ── Footer ────────────────────────────────────────────────────────────────────
    .sidebar__footer {
      flex-shrink: 0;
      padding: 0 0.625rem 0.875rem;
    }

    .sidebar__divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.06);
      margin: 0 0 0.75rem;
    }

    .sidebar__user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.5rem;
      border-radius: 0.625rem;
      transition: background var(--duration-200) var(--ease-in-out);

      &:hover { background: rgba(255, 255, 255, 0.04); }
      &--collapsed { justify-content: center; padding: 0.625rem; }
    }

    .sidebar__avatar {
      width: 2rem;
      height: 2rem;
      border-radius: var(--radius-pill);
      background: var(--color-nav-avatar-bg);
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .pi {
        color: var(--color-nav-text);
        font-size: 0.8125rem;
      }
    }

    .sidebar__user-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.0625rem;
    }

    .sidebar__user-name {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-nav-text-active);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .sidebar__user-role {
      font-size: 0.6875rem;
      color: var(--color-nav-text-subtle);
      text-transform: capitalize;
    }

    .sidebar__signout {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-nav-text-subtle);
      padding: 0.375rem;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color var(--duration-200) var(--ease-in-out),
                  background var(--duration-200) var(--ease-in-out);
      flex-shrink: 0;

      &:hover {
        color: var(--color-text-danger);
        background: var(--color-bg-danger-subtle);
      }

      .pi { font-size: 0.875rem; }
    }
  `],
})
export class SidebarComponent implements OnChanges {
  protected readonly store = inject(AuthStore);
  private readonly authService = inject(AuthService);

  @Input() collapsed = false;
  @Input() set navItems(items: NavItem[]) {
    this._navItems = items;
  }

  protected resolvedItems: ResolvedItem[] = [];
  protected resolvedGroups: ResolvedGroup[] = [];
  private _navItems: NavItem[] = [];

  protected get userName(): string {
    const id = this.store.user()?.id;
    return id ? String(id) : 'User';
  }

  protected get primaryRole(): string {
    return this.store.roles()[0] ?? 'member';
  }

  ngOnChanges(): void {
    const permitted = this.filterPermitted(this._navItems);
    this.resolvedItems = permitted
      .filter((item) => !!item.routerLink && !item.items?.length)
      .map((item) => this.toResolved(item));
    this.resolvedGroups = permitted
      .filter((item) => !item.routerLink && !!item.items?.length)
      .map((item) => ({
        label: item.label,
        icon: item.icon ?? 'pi-folder',
        items: item.items!
          .filter((child) => this.hasPermission(child) && !!child.routerLink)
          .map((child) => this.toResolved(child)),
      }))
      .filter((group) => group.items.length > 0);
  }

  protected signOut(): void {
    this.authService.logout();
  }

  private filterPermitted(items: NavItem[]): NavItem[] {
    return items.filter((item) => this.hasPermission(item));
  }

  private hasPermission(item: NavItem): boolean {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.some((role) => this.store.hasRole(role));
  }

  private toResolved(item: NavItem): ResolvedItem {
    return {
      label: item.label,
      icon: item.icon ?? 'pi-circle',
      routerLink: item.routerLink!,
      exact: item.exact ?? false,
    };
  }
}
