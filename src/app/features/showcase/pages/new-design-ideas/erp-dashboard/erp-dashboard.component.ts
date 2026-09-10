import { ChangeDetectionStrategy, Component } from '@angular/core';

interface KpiCard {
  label: string;
  value: string;
  unit?: string;
  delta: string;
  deltaUp: boolean;
  dark?: boolean;
}

interface ActivityItem {
  action: string;
  subject: string;
  time: string;
  type: 'order' | 'invoice' | 'customer' | 'stock';
}

interface RecentOrder {
  id: string;
  customer: string;
  amount: string;
  status: 'fulfilled' | 'pending' | 'processing';
  date: string;
}

@Component({
  selector: 'rdk-erp-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="erp-dash">

      <!-- Page intro -->
      <div class="erp-dash__intro">
        <div>
          <h2 class="erp-dash__greeting">Good morning, Alex.</h2>
          <p class="erp-dash__date">Monday, 2 June 2026 &nbsp;·&nbsp; Q2 Week 10</p>
        </div>
        <button class="erp-dash__report-btn" type="button">Export report</button>
      </div>

      <!-- KPI row -->
      <div class="erp-dash__kpis">
        @for (kpi of kpis; track kpi.label) {
          <div class="kpi-card" [class.kpi-card--dark]="kpi.dark">
            <span class="kpi-card__label">{{ kpi.label }}</span>
            <div class="kpi-card__value-row">
              <span class="kpi-card__value">{{ kpi.value }}</span>
              @if (kpi.unit) { <span class="kpi-card__unit">{{ kpi.unit }}</span> }
            </div>
            <span class="kpi-card__delta" [class.kpi-card__delta--up]="kpi.deltaUp" [class.kpi-card__delta--down]="!kpi.deltaUp">
              {{ kpi.deltaUp ? '↑' : '↓' }} {{ kpi.delta }} vs last month
            </span>
          </div>
        }
      </div>

      <!-- Body: orders + activity -->
      <div class="erp-dash__body">

        <!-- Recent orders -->
        <div class="erp-dash__panel">
          <div class="erp-dash__panel-header">
            <span class="erp-dash__panel-title">Recent Orders</span>
            <a class="erp-dash__panel-link" href="#">View all</a>
          </div>
          <table class="erp-table">
            <thead>
              <tr>
                <th class="erp-table__th">Order</th>
                <th class="erp-table__th">Customer</th>
                <th class="erp-table__th">Date</th>
                <th class="erp-table__th erp-table__th--right">Amount</th>
                <th class="erp-table__th">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (order of recentOrders; track order.id) {
                <tr class="erp-table__row">
                  <td class="erp-table__td erp-table__td--mono">{{ order.id }}</td>
                  <td class="erp-table__td">{{ order.customer }}</td>
                  <td class="erp-table__td erp-table__td--muted">{{ order.date }}</td>
                  <td class="erp-table__td erp-table__td--right erp-table__td--mono">{{ order.amount }}</td>
                  <td class="erp-table__td">
                    <span class="status-badge status-badge--{{ order.status }}">{{ order.status }}</span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Activity feed -->
        <div class="erp-dash__panel erp-dash__panel--narrow">
          <div class="erp-dash__panel-header">
            <span class="erp-dash__panel-title">Activity</span>
          </div>
          <div class="activity-feed">
            @for (item of activity; track item.time) {
              <div class="activity-item">
                <div class="activity-item__dot activity-item__dot--{{ item.type }}"></div>
                <div class="activity-item__body">
                  <span class="activity-item__action">{{ item.action }}</span>
                  <span class="activity-item__subject">{{ item.subject }}</span>
                  <span class="activity-item__time">{{ item.time }}</span>
                </div>
              </div>
            }
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .erp-dash {
      font-family: var(--font-body);
      display: flex;
      flex-direction: column;
      gap: var(--space-layout-sm);
    }

    .erp-dash__intro {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }

    .erp-dash__greeting {
      margin: 0 0 var(--space-component-xs);
      font-family: var(--font-heading);
      font-weight: 800;
      font-size: 1.75rem;
      letter-spacing: -0.03em;
      font-stretch: condensed;
      color: var(--color-text-primary);
      line-height: 1;
    }

    .erp-dash__date {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--color-text-muted);
    }

    .erp-dash__report-btn {
      font-family: var(--font-body);
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-primary);
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border-muted);
      border-radius: var(--radius-pill);
      padding: var(--space-component-sm) var(--space-component-lg);
      cursor: pointer;
      transition: background 0.15s ease, box-shadow 0.15s ease;
      box-shadow: var(--elevation-raised);
      &:hover {
        background: var(--color-bg-sunken);
        box-shadow: var(--elevation-float);
      }
    }

    .erp-dash__kpis {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-layout-xs);
    }

    .kpi-card {
      background: var(--color-bg-surface);
      border-radius: var(--radius-surface);
      padding: var(--space-layout-sm);
      box-shadow: var(--elevation-raised);
      display: flex;
      flex-direction: column;
      gap: var(--space-component-sm);
    }

    .kpi-card--dark {
      background: var(--color-surface-featured);
      .kpi-card__label  { color: var(--color-surface-featured-muted); }
      .kpi-card__value  { color: var(--color-surface-featured-text); }
      .kpi-card__unit   { color: var(--color-surface-featured-muted); }
    }

    .kpi-card__label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--color-text-muted);
    }

    .kpi-card__value-row {
      display: flex;
      align-items: baseline;
      gap: var(--space-component-xs);
    }

    .kpi-card__value {
      font-family: var(--font-data);
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-text-primary);
      letter-spacing: -0.03em;
      line-height: 1;
    }

    .kpi-card__unit {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-muted);
    }

    .kpi-card__delta {
      font-size: 0.75rem;
      font-weight: 500;
      &--up   { color: var(--color-text-success); }
      &--down { color: var(--color-text-danger); }
    }

    .erp-dash__body {
      display: grid;
      grid-template-columns: 1fr 18rem;
      gap: var(--space-layout-xs);
      align-items: start;
    }

    .erp-dash__panel {
      background: var(--color-bg-surface);
      border-radius: var(--radius-surface);
      box-shadow: var(--elevation-raised);
      overflow: hidden;
    }

    .erp-dash__panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-component-lg) var(--space-layout-sm);
      border-bottom: 1px solid var(--color-border-muted);
    }

    .erp-dash__panel-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--color-text-primary);
      letter-spacing: -0.01em;
    }

    .erp-dash__panel-link {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--color-text-muted);
      text-decoration: none;
      &:hover { color: var(--color-text-primary); }
    }

    .erp-table {
      width: 100%;
      border-collapse: collapse;
    }

    .erp-table__th {
      padding: var(--space-component-sm) var(--space-layout-sm);
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--color-text-muted);
      text-align: left;
      background: var(--color-bg-sunken);
      border-bottom: 1px solid var(--color-border-muted);
      &--right { text-align: right; }
    }

    .erp-table__row {
      border-bottom: 1px solid var(--color-border-muted);
      &:last-child { border-bottom: none; }
      &:hover { background: var(--color-bg-sunken); }
    }

    .erp-table__td {
      padding: var(--space-component-md) var(--space-layout-sm);
      font-size: 0.875rem;
      color: var(--color-text-primary);
      &--mono  { font-family: var(--font-data); font-size: 0.8125rem; color: var(--color-text-primary); }
      &--muted { color: var(--color-text-muted); }
      &--right { text-align: right; }
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: var(--space-component-xs) var(--space-component-md);
      border-radius: var(--radius-pill);
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: capitalize;
      letter-spacing: 0.02em;
      &--fulfilled  { background: var(--color-status-success-bg); color: var(--color-status-success-text); border: 1px solid var(--color-status-success-border); }
      &--pending    { background: var(--color-status-warning-bg); color: var(--color-status-warning-text); border: 1px solid var(--color-status-warning-border); }
      &--processing { background: var(--color-bg-sunken); color: var(--color-text-secondary); }
      &--cancelled  { background: var(--color-status-danger-bg); color: var(--color-status-danger-text); border: 1px solid var(--color-status-danger-border); }
    }

    .activity-feed {
      padding: var(--space-component-md) var(--space-component-lg);
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .activity-item {
      display: flex;
      gap: var(--space-component-md);
      padding: var(--space-component-md) 0;
      border-bottom: 1px solid var(--color-border-muted);
      align-items: flex-start;
      &:last-child { border-bottom: none; }
    }

    .activity-item__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: var(--space-component-xs);
      &--order    { background: var(--color-text-primary); }
      &--invoice  { background: var(--color-text-success); }
      &--customer { background: var(--color-text-muted); }
      &--stock    { background: var(--color-text-danger); }
    }

    .activity-item__body {
      display: flex;
      flex-direction: column;
      gap: var(--space-component-xs);
      min-width: 0;
    }

    .activity-item__action {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .activity-item__subject {
      font-size: 0.8125rem;
      color: var(--color-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .activity-item__time {
      font-size: 0.6875rem;
      color: var(--color-text-muted);
      margin-top: var(--space-component-xs);
    }
  `],
})
export class ErpDashboardComponent {
  protected readonly kpis: KpiCard[] = [
    { label: 'Revenue MTD',      value: '$2.41M',  deltaUp: true,  delta: '12.4%' },
    { label: 'Orders',           value: '1,247',   deltaUp: true,  delta: '8.1%',  dark: true },
    { label: 'Active Customers', value: '8,432',   deltaUp: true,  delta: '3.2%' },
    { label: 'Low Stock Items',  value: '23',      deltaUp: false, delta: '5 items' },
  ];

  protected readonly recentOrders: RecentOrder[] = [
    { id: '#ORD-9041', customer: 'Meridian Supply Co.',  amount: '$14,200.00', status: 'fulfilled',  date: '01 Jun 2026' },
    { id: '#ORD-9040', customer: 'Halcyon Retail Group', amount: '$3,850.00',  status: 'processing', date: '01 Jun 2026' },
    { id: '#ORD-9039', customer: 'Stratum Industries',   amount: '$28,500.00', status: 'pending',    date: '31 May 2026' },
    { id: '#ORD-9038', customer: 'Vela Logistics Ltd.',  amount: '$7,100.00',  status: 'fulfilled',  date: '31 May 2026' },
    { id: '#ORD-9037', customer: 'Axiom Parts & Co.',    amount: '$940.00',    status: 'fulfilled',  date: '30 May 2026' },
  ];

  protected readonly activity: ActivityItem[] = [
    { action: 'Order placed',    subject: '#ORD-9041 · Meridian Supply Co.',  time: '2 min ago',  type: 'order' },
    { action: 'Invoice paid',    subject: 'INV-4821 · $14,200.00',             time: '18 min ago', type: 'invoice' },
    { action: 'New customer',    subject: 'Halcyon Retail Group',              time: '1 hr ago',   type: 'customer' },
    { action: 'Stock alert',     subject: 'SKU-0042 below reorder point',      time: '2 hr ago',   type: 'stock' },
    { action: 'Order shipped',   subject: '#ORD-9035 · Vela Logistics Ltd.',   time: '3 hr ago',   type: 'order' },
    { action: 'Invoice sent',    subject: 'INV-4820 · Axiom Parts & Co.',      time: '5 hr ago',   type: 'invoice' },
  ];
}
