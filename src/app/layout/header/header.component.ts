import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';
import { ThemeToggleComponent } from '../../shared/components/atoms/theme-toggle/theme-toggle.component';

@Component({
  selector: 'rdk-header',
  standalone: true,
  imports: [RouterLink, ThemeToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="rdk-header">
      <div class="rdk-header__start">
      </div>

      <div class="rdk-header__end">
        <ng-content select="[slot=actions]" />
        <rdk-theme-toggle />

        @if (store.isAuthenticated()) {
          <div class="rdk-header__user">
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
      justify-content: space-between;
      height: 3.5rem;
      padding: 0 1.25rem;
      background: #fff;
      border-bottom: 1px solid var(--color-border-default);
      flex-shrink: 0;
      gap: 1rem;
    }

    .rdk-header__start,
    .rdk-header__end {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 0;
    }

    .rdk-header__end {
      flex-shrink: 0;
    }

    .rdk-header__user {
      display: flex;
      align-items: center;
    }

    .rdk-header__avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;

      .pi {
        color: #fff;
        font-size: 0.8125rem;
      }
    }

    .rdk-header__signin {
      font-size: 0.875rem;
      font-weight: 600;
      color: #6366f1;
      text-decoration: none;
      padding: 0.375rem 0.875rem;
      border-radius: 0.375rem;
      border: 1px solid rgba(99, 102, 241, 0.3);
      transition: background 0.15s ease;

      &:hover { background: rgba(99, 102, 241, 0.06); }
    }
  `],
})
export class HeaderComponent {
  protected readonly store = inject(AuthStore);

}
