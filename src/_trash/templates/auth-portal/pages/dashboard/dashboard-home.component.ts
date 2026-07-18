import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthStore } from '../../../../core/auth/auth.store';

interface StatCard {
  readonly id: string;
  readonly label: string;
  readonly target: number;
  readonly format: (n: number) => string;
  readonly trend: number;
  readonly trendLabel: string;
  readonly icon: string;
}

interface Activity {
  readonly id: string;
  readonly icon: string;
  readonly text: string;
  readonly time: string;
}

interface QuickAction {
  readonly label: string;
  readonly icon: string;
  readonly route: string;
}

const STAT_CARDS: StatCard[] = [
  {
    id: 'users',
    label: 'Total users',
    target: 24521,
    format: (n) => n.toLocaleString(),
    trend: 12.5,
    trendLabel: 'vs last month',
    icon: 'pi-users',
  },
  {
    id: 'revenue',
    label: 'Revenue',
    target: 48200,
    format: (n) => '$' + (n / 1000).toFixed(1) + 'k',
    trend: 8.3,
    trendLabel: 'vs last month',
    icon: 'pi-dollar',
  },
  {
    id: 'orders',
    label: 'Orders',
    target: 1429,
    format: (n) => n.toLocaleString(),
    trend: -2.1,
    trendLabel: 'vs last month',
    icon: 'pi-shopping-bag',
  },
  {
    id: 'conversion',
    label: 'Conversion',
    target: 32,
    format: (n) => (n / 10).toFixed(1) + '%',
    trend: 0.4,
    trendLabel: 'vs last month',
    icon: 'pi-chart-line',
  },
];

const ACTIVITIES: Activity[] = [
  { id: '1', icon: 'pi-plus',     text: 'New item created',    time: '2 minutes ago' },
  { id: '2', icon: 'pi-sign-in',  text: 'User signed in',      time: '5 minutes ago' },
  { id: '3', icon: 'pi-file',     text: 'Report generated',    time: '1 hour ago'    },
  { id: '4', icon: 'pi-trash',    text: 'Item archived',       time: '3 hours ago'   },
  { id: '5', icon: 'pi-refresh',  text: 'Data sync completed', time: '6 hours ago'   },
];

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'New resource',      icon: 'pi-plus-circle', route: '/app/resources/new' },
  { label: 'Browse resources',  icon: 'pi-list',        route: '/app/resources'     },
  { label: 'Profile settings',  icon: 'pi-user',        route: '/app/profile'       },
];

@Component({
  selector: 'rdk-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dash">

      <!-- Welcome banner — single dark card anchor -->
      <div class="dash__welcome anim-card-entrance">
        <div class="dash__welcome-content">
          <div class="dash__welcome-text">
            <h1 class="dash__welcome-title">
              Welcome back{{ userName ? ', ' + userName : '' }}
              <span class="dash__welcome-wave" aria-hidden="true">👋</span>
            </h1>
            <p class="dash__welcome-sub">
              Here's what's happening across your workspace today.
            </p>
          </div>
          <a routerLink="/app/resources/new" class="dash__new-btn">
            <span class="pi pi-plus"></span>
            New resource
          </a>
        </div>
        <!-- Illustration zone — top-right radial, contained -->
        <div class="dash__welcome-orb" aria-hidden="true"></div>
      </div>

      <!-- Stats grid -->
      <div class="dash__stats">
        @for (card of statCards; track card.id; let i = $index) {
          <div class="dash__stat-card anim-card-entrance"
               [style.animation-delay]="(i * 80 + 200) + 'ms'">
            <div class="dash__stat-top">
              <div class="dash__stat-icon-wrap">
                <span class="pi dash__stat-icon" [ngClass]="card.icon"></span>
              </div>
              <div class="dash__stat-trend"
                   [class.dash__stat-trend--up]="card.trend > 0"
                   [class.dash__stat-trend--down]="card.trend < 0">
                <span class="pi" [ngClass]="card.trend >= 0 ? 'pi-arrow-up' : 'pi-arrow-down'"></span>
                {{ card.trend >= 0 ? '+' : '' }}{{ card.trend }}%
              </div>
            </div>
            <div class="dash__stat-value">
              {{ card.format(displayStats()[card.id]) }}
            </div>
            <div class="dash__stat-label">{{ card.label }}</div>
            <div class="dash__stat-meta">{{ card.trendLabel }}</div>
          </div>
        }
      </div>

      <!-- Lower grid -->
      <div class="dash__lower">

        <div class="dash__panel anim-card-entrance" style="animation-delay:500ms">
          <h2 class="dash__panel-title">Quick actions</h2>
          <div class="dash__actions">
            @for (action of quickActions; track action.label) {
              <a [routerLink]="action.route" class="dash__action">
                <div class="dash__action-icon">
                  <span class="pi" [ngClass]="action.icon"></span>
                </div>
                <span class="dash__action-label">{{ action.label }}</span>
                <span class="pi pi-arrow-right dash__action-arrow"></span>
              </a>
            }
          </div>
        </div>

        <div class="dash__panel anim-card-entrance" style="animation-delay:600ms">
          <h2 class="dash__panel-title">Recent activity</h2>
          <ul class="dash__activity" role="list">
            @for (item of activities; track item.id) {
              <li class="dash__activity-item">
                <div class="dash__activity-icon">
                  <span class="pi" [ngClass]="item.icon"></span>
                </div>
                <div class="dash__activity-body">
                  <span class="dash__activity-text">{{ item.text }}</span>
                  <span class="dash__activity-time">{{ item.time }}</span>
                </div>
              </li>
            }
          </ul>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }

    .dash {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      width: 100%;
      min-width: 0;
    }

    // ── Welcome banner ────────────────────────────────────────────────────────────
    .dash__welcome {
      position: relative;
      border-radius: var(--obs-radius-card);
      background: var(--obs-surface-card-dark);
      overflow: hidden;
      padding: 2rem 2.5rem;
    }

    .dash__welcome-content {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .dash__welcome-title {
      font-family: var(--obs-font-heading);
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--obs-text-on-dark);
      margin: 0 0 0.375rem;
      letter-spacing: -0.025em;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dash__welcome-wave {
      display: inline-block;
      animation: wave 2.5s ease-in-out infinite;
      transform-origin: 70% 70%;
    }

    @keyframes wave {
      0%, 60%, 100% { transform: rotate(0deg); }
      10%, 30%      { transform: rotate(14deg); }
      20%           { transform: rotate(-8deg); }
      40%           { transform: rotate(-4deg); }
      50%           { transform: rotate(10deg); }
    }

    .dash__welcome-sub {
      font-size: var(--obs-size-body);
      color: var(--obs-text-on-dark-muted);
      margin: 0;
      line-height: 1.6;
    }

    // Illustration zone — contained radial, top-right quadrant
    .dash__welcome-orb {
      position: absolute;
      width: 280px;
      height: 280px;
      right: -40px;
      top: -60px;
      border-radius: 50%;
      background: radial-gradient(circle at center, rgba(255, 255, 255, 0.04), transparent 70%);
      pointer-events: none;
    }

    .dash__new-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.125rem;
      border-radius: var(--obs-radius-pill);
      background: var(--obs-surface-glass);
      border: 1px solid var(--obs-border-glass);
      color: var(--obs-text-on-dark);
      font-size: var(--obs-size-body);
      font-weight: 600;
      text-decoration: none;
      transition: background var(--obs-duration-productive) var(--obs-ease-standard);
      white-space: nowrap;
      position: relative;
      z-index: 1;
      backdrop-filter: blur(var(--obs-blur-glass));

      &:hover { background: rgba(255, 255, 255, 0.16); }
    }

    // ── Stats grid ────────────────────────────────────────────────────────────────
    .dash__stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;

      @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
      @media (max-width: 600px)  { grid-template-columns: 1fr; }
    }

    .dash__stat-card {
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border-default);
      border-radius: var(--obs-radius-card);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      box-shadow: var(--obs-shadow-card-light);
      transition: transform var(--obs-duration-productive) var(--obs-ease-standard),
                  box-shadow var(--obs-duration-productive) var(--obs-ease-standard);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }
    }

    .dash__stat-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .dash__stat-icon-wrap {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.5rem;
      background: var(--color-bg-sunken);
      border: 1px solid var(--color-border-muted);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dash__stat-icon {
      font-size: 0.9375rem;
      color: var(--color-text-muted);
    }

    .dash__stat-trend {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: var(--obs-size-caption);
      font-weight: 700;
      padding: 0.25rem 0.5rem;
      border-radius: var(--obs-radius-pill);

      &--up {
        color: var(--color-text-success);
        background: var(--color-bg-success-subtle);
      }

      &--down {
        color: var(--color-text-danger);
        background: var(--color-bg-danger-subtle);
      }

      .pi { font-size: 0.6rem; }
    }

    .dash__stat-value {
      font-family: var(--obs-font-heading);
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
      color: var(--color-text-primary);
    }

    .dash__stat-label {
      font-size: var(--obs-size-body);
      color: var(--color-text-primary);
      font-weight: 600;
      margin-top: 0.125rem;
    }

    .dash__stat-meta {
      font-size: var(--obs-size-caption);
      color: var(--color-text-muted);
    }

    // ── Lower grid ────────────────────────────────────────────────────────────────
    .dash__lower {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 1rem;

      @media (max-width: 768px) { grid-template-columns: 1fr; }
    }

    .dash__panel {
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border-default);
      border-radius: var(--obs-radius-card);
      padding: 1.5rem;
      box-shadow: var(--obs-shadow-card-light);
    }

    .dash__panel-title {
      font-size: var(--obs-size-heading-sm);
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 1.25rem;
    }

    // ── Quick actions ─────────────────────────────────────────────────────────────
    .dash__actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .dash__action {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0.875rem;
      border-radius: 0.625rem;
      border: 1px solid var(--color-border-default);
      text-decoration: none;
      color: var(--color-text-primary);
      background: var(--color-bg-base);
      transition: border-color var(--obs-duration-productive) var(--obs-ease-standard),
                  background var(--obs-duration-productive) var(--obs-ease-standard),
                  transform var(--obs-duration-productive) var(--obs-ease-standard);

      &:hover {
        border-color: var(--color-border-strong);
        background: var(--color-bg-sunken);
        transform: translateX(2px);

        .dash__action-arrow {
          transform: translateX(3px);
          opacity: 1;
        }
      }
    }

    .dash__action-icon {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.5rem;
      background: var(--color-bg-sunken);
      border: 1px solid var(--color-border-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      flex-shrink: 0;
    }

    .dash__action-label {
      flex: 1;
      font-size: var(--obs-size-body);
      font-weight: 600;
    }

    .dash__action-arrow {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      opacity: 0.4;
      transition: transform var(--obs-duration-productive) var(--obs-ease-standard),
                  opacity var(--obs-duration-productive) var(--obs-ease-standard);
    }

    // ── Activity feed ─────────────────────────────────────────────────────────────
    .dash__activity {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .dash__activity-item {
      display: flex;
      align-items: flex-start;
      gap: 0.875rem;
      padding: 0.875rem 0;
      position: relative;

      &:not(:last-child) {
        border-bottom: 1px solid var(--color-border-muted);

        &::after {
          content: '';
          position: absolute;
          left: 1.1rem;
          top: 3.5rem;
          bottom: -0.875rem;
          width: 1px;
          background: var(--color-border-muted);
        }
      }
    }

    .dash__activity-icon {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      background: var(--color-bg-sunken);
      border: 1px solid var(--color-border-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      color: var(--color-text-muted);
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .dash__activity-body {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      padding-top: 0.25rem;
    }

    .dash__activity-text {
      font-size: var(--obs-size-body);
      color: var(--color-text-primary);
      font-weight: 500;
    }

    .dash__activity-time {
      font-size: var(--obs-size-caption);
      color: var(--color-text-muted);
      font-family: var(--obs-font-data);
    }
  `],
})
export class DashboardHomeComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly store = inject(AuthStore);

  protected readonly statCards = STAT_CARDS;
  protected readonly activities = ACTIVITIES;
  protected readonly quickActions = QUICK_ACTIONS;

  protected readonly displayStats = signal<Record<string, number>>({
    users: 0, revenue: 0, orders: 0, conversion: 0,
  });

  protected get userName(): string {
    const id = this.store.user()?.id;
    return id ? String(id) : '';
  }

  ngOnInit(): void {
    this.runCountUp();
  }

  private runCountUp(): void {
    const targets: Record<string, number> = {
      users: 24521, revenue: 48200, orders: 1429, conversion: 32,
    };
    const durationMs = 1400;
    const stepMs = 16;
    const totalSteps = Math.ceil(durationMs / stepMs);
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const t = step / totalSteps;
      const ease = 1 - Math.pow(1 - t, 3);

      this.displayStats.set(
        Object.fromEntries(
          Object.entries(targets).map(([k, v]) => [k, Math.round(v * ease)]),
        ),
      );

      if (step >= totalSteps) {
        clearInterval(timer);
        this.displayStats.set(targets);
      }
    }, stepMs);

    this.destroyRef.onDestroy(() => clearInterval(timer));
  }
}
