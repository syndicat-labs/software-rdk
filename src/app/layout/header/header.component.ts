import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore, AuthUser } from '../../core/auth/auth.store';
import { ThemeToggleComponent } from '../../shared/components/atoms/theme-toggle/theme-toggle.component';

@Component({
  selector: 'rdk-header',
  standalone: true,
  imports: [RouterLink, ThemeToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="rdk-header">
      <div class="rdk-header__end">
        <ng-content select="[slot=actions]" />
        <rdk-theme-toggle />

        @if (store.isAuthenticated()) {
          <div class="rdk-header__user">
            <div class="rdk-header__meta">
              <span class="rdk-header__name">{{ userName }}</span>
              <span class="rdk-header__role">{{ primaryRole }}</span>
            </div>
            <div class="rdk-header__avatar" aria-hidden="true">
              <span class="pi pi-user"></span>
            </div>
          </div>
        } @else {
          <a href="/login" routerLink="/login" class="rdk-header__signin">Sign in</a>
        }
      </div>
    </header>
  `,
  styles: [`
    .rdk-header {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 3.5rem;
      padding: 0 1.25rem;
      background: var(--color-bg-surface);
      border-bottom: 1px solid var(--color-border-default);
      flex-shrink: 0;
      gap: 1rem;
    }

    .rdk-header__end {
      display: flex;
      align-items: center;
      gap: var(--space-component-md);
      min-width: 0;
      flex-shrink: 0;
    }

    .rdk-header__user {
      display: flex;
      align-items: center;
      gap: var(--space-component-sm);
      padding-left: var(--space-component-sm);
      border-left: 1px solid var(--color-border-muted);
    }

    .rdk-header__meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.0625rem;
      min-width: 0;
    }

    .rdk-header__name {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 12rem;
    }

    .rdk-header__role {
      font-family: var(--font-data);
      font-size: 0.6875rem;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .rdk-header__avatar {
      width: 2rem;
      height: 2rem;
      border-radius: var(--radius-pill);
      background: var(--color-nav-avatar-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .pi {
        color: var(--color-text-inverse);
        font-size: 0.8125rem;
      }
    }

    .rdk-header__signin {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-brand);
      text-decoration: none;
      padding: 0.375rem 0.875rem;
      border-radius: var(--radius-component);
      border: 1px solid var(--color-border-brand);
      transition: background 0.15s ease;

      &:hover { background: var(--color-bg-brand-subtle); }
    }
  `],
})
export class HeaderComponent {
  protected readonly store = inject(AuthStore);

  protected getUserName(user: AuthUser | null): string {
    const name = user?.['name'];
    return typeof name === 'string' && name.length > 0 ? name : String(user?.id ?? 'User');
  }

  protected get userName(): string {
    return this.getUserName(this.store.user());
  }

  protected get primaryRole(): string {
    return this.store.roles()[0] ?? 'member';
  }
}
