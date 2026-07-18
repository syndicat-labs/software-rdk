import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';

type OrderStatus = 'fulfilled' | 'pending' | 'processing' | 'cancelled';

interface Order {
  id: string;
  customer: string;
  date: string;
  items: number;
  amount: string;
  status: OrderStatus;
  channel: string;
}

const ALL_ORDERS: Order[] = [
  { id: '#ORD-9041', customer: 'Meridian Supply Co.',   date: '01 Jun 2026', items: 12, amount: '$14,200.00', status: 'fulfilled',  channel: 'Direct' },
  { id: '#ORD-9040', customer: 'Halcyon Retail Group',  date: '01 Jun 2026', items:  3, amount: '$3,850.00',  status: 'processing', channel: 'Online' },
  { id: '#ORD-9039', customer: 'Stratum Industries',    date: '31 May 2026', items: 28, amount: '$28,500.00', status: 'pending',    channel: 'Direct' },
  { id: '#ORD-9038', customer: 'Vela Logistics Ltd.',   date: '31 May 2026', items:  7, amount: '$7,100.00',  status: 'fulfilled',  channel: 'Partner' },
  { id: '#ORD-9037', customer: 'Axiom Parts & Co.',     date: '30 May 2026', items:  2, amount: '$940.00',    status: 'fulfilled',  channel: 'Online' },
  { id: '#ORD-9036', customer: 'Folio Brands Inc.',     date: '30 May 2026', items:  9, amount: '$5,320.00',  status: 'cancelled',  channel: 'Direct' },
  { id: '#ORD-9035', customer: 'Vela Logistics Ltd.',   date: '29 May 2026', items:  4, amount: '$2,200.00',  status: 'fulfilled',  channel: 'Partner' },
  { id: '#ORD-9034', customer: 'Kurai Solutions',       date: '29 May 2026', items: 15, amount: '$11,750.00', status: 'fulfilled',  channel: 'Direct' },
  { id: '#ORD-9033', customer: 'Meridian Supply Co.',   date: '28 May 2026', items:  6, amount: '$6,480.00',  status: 'pending',    channel: 'Direct' },
  { id: '#ORD-9032', customer: 'Axiom Parts & Co.',     date: '28 May 2026', items:  1, amount: '$320.00',    status: 'cancelled',  channel: 'Online' },
];

@Component({
  selector: 'rdk-erp-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="orders">

      <!-- Toolbar -->
      <div class="orders__toolbar">
        <div class="orders__search">
          <span class="orders__search-icon pi pi-search"></span>
          <input
            class="orders__search-input"
            type="text"
            placeholder="Search orders, customers…"
            [value]="search()"
            (input)="search.set($any($event.target).value)"
          />
        </div>

        <div class="orders__filters">
          @for (s of statuses; track s.value) {
            <button
              class="orders__filter-btn"
              [class.orders__filter-btn--active]="activeStatus() === s.value"
              type="button"
              (click)="activeStatus.set(s.value)"
            >
              {{ s.label }}
            </button>
          }
        </div>
      </div>

      <!-- Summary strip -->
      <div class="orders__summary">
        <span class="orders__summary-count">
          <span class="orders__summary-num">{{ filtered().length }}</span> orders
        </span>
        <span class="orders__summary-sep">·</span>
        <span class="orders__summary-label">Total: <span class="orders__summary-num">{{ totalAmount() }}</span></span>
      </div>

      <!-- Table -->
      <div class="orders__table-wrap">
        <table class="ord-table">
          <thead>
            <tr>
              <th class="ord-table__th">Order ID</th>
              <th class="ord-table__th">Customer</th>
              <th class="ord-table__th">Date</th>
              <th class="ord-table__th ord-table__th--center">Items</th>
              <th class="ord-table__th ord-table__th--right">Amount</th>
              <th class="ord-table__th">Channel</th>
              <th class="ord-table__th">Status</th>
            </tr>
          </thead>
          <tbody>
            @if (filtered().length === 0) {
              <tr>
                <td class="ord-table__empty" colspan="7">No orders match your filters.</td>
              </tr>
            }
            @for (order of filtered(); track order.id) {
              <tr class="ord-table__row">
                <td class="ord-table__td ord-table__td--mono ord-table__td--bold">{{ order.id }}</td>
                <td class="ord-table__td">{{ order.customer }}</td>
                <td class="ord-table__td ord-table__td--muted">{{ order.date }}</td>
                <td class="ord-table__td ord-table__td--center ord-table__td--mono">{{ order.items }}</td>
                <td class="ord-table__td ord-table__td--right ord-table__td--mono ord-table__td--bold">{{ order.amount }}</td>
                <td class="ord-table__td ord-table__td--muted">{{ order.channel }}</td>
                <td class="ord-table__td">
                  <span class="status-badge status-badge--{{ order.status }}">{{ order.status }}</span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination stub -->
      <div class="orders__pagination">
        <span class="orders__pagination-info">Showing {{ filtered().length }} of {{ allOrders.length }}</span>
        <div class="orders__pagination-controls">
          <button class="orders__page-btn" type="button" disabled>← Prev</button>
          <span class="orders__page-current">1</span>
          <button class="orders__page-btn" type="button" disabled>Next →</button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .orders {
      font-family: 'Inter', sans-serif;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    // ── Toolbar ───────────────────────────────────────────────────────────────
    .orders__toolbar {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .orders__search {
      position: relative;
      flex: 1;
      min-width: 16rem;
    }

    .orders__search-icon {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.8125rem;
      color: #AAAAAA;
      pointer-events: none;
    }

    .orders__search-input {
      width: 100%;
      height: 2.5rem;
      padding: 0 1rem 0 2.375rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      color: #111111;
      background: #FFFFFF;
      border: 1px solid #E0E0E0;
      border-radius: 9999px;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;

      &::placeholder { color: #AAAAAA; }
      &:focus {
        border-color: #111111;
        box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.06);
      }
    }

    .orders__filters {
      display: flex;
      gap: 0.375rem;
    }

    .orders__filter-btn {
      font-family: 'Inter', sans-serif;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #6B6B6B;
      background: #FFFFFF;
      border: 1px solid #E0E0E0;
      border-radius: 9999px;
      padding: 0.375rem 0.875rem;
      cursor: pointer;
      transition: all 0.15s ease;
      text-transform: capitalize;

      &:hover { border-color: #AAAAAA; color: #111111; }

      &--active {
        background: #111111;
        color: #FFFFFF;
        border-color: #111111;
      }
    }

    // ── Summary strip ─────────────────────────────────────────────────────────
    .orders__summary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: #6B6B6B;
    }

    .orders__summary-sep { color: #CCCCCC; }

    .orders__summary-num {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      color: #111111;
    }

    // ── Table ─────────────────────────────────────────────────────────────────
    .orders__table-wrap {
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.07);
      overflow: hidden;
    }

    .ord-table {
      width: 100%;
      border-collapse: collapse;
    }

    .ord-table__th {
      padding: 0.75rem 1.25rem;
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #AAAAAA;
      text-align: left;
      background: #FAFAFA;
      border-bottom: 1px solid #EBEBEB;
      white-space: nowrap;

      &--right  { text-align: right; }
      &--center { text-align: center; }
    }

    .ord-table__row {
      border-bottom: 1px solid #F5F5F5;
      transition: background 0.1s ease;

      &:last-child { border-bottom: none; }
      &:hover { background: #FAFAFA; }
    }

    .ord-table__td {
      padding: 0.875rem 1.25rem;
      font-size: 0.875rem;
      color: #2A2A2A;

      &--mono   { font-family: 'JetBrains Mono', monospace; font-size: 0.8125rem; }
      &--bold   { font-weight: 600; color: #111111; }
      &--muted  { color: #AAAAAA; }
      &--right  { text-align: right; }
      &--center { text-align: center; }
    }

    .ord-table__empty {
      padding: 3rem;
      text-align: center;
      font-size: 0.875rem;
      color: #AAAAAA;
    }

    // ── Status badges ─────────────────────────────────────────────────────────
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.1875rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: capitalize;
      letter-spacing: 0.02em;
      white-space: nowrap;

      &--fulfilled  { background: #dcfce7; color: #15803d; }
      &--pending    { background: #fef9c3; color: #a16207; }
      &--processing { background: #EBEBEB; color: #4A4A4A; }
      &--cancelled  { background: #fee2e2; color: #b91c1c; }
    }

    // ── Pagination ────────────────────────────────────────────────────────────
    .orders__pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.25rem 0;
    }

    .orders__pagination-info {
      font-size: 0.8125rem;
      color: #AAAAAA;
    }

    .orders__pagination-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .orders__page-btn {
      font-family: 'Inter', sans-serif;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #6B6B6B;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem 0;

      &:disabled { opacity: 0.35; cursor: default; }
      &:not(:disabled):hover { color: #111111; }
    }

    .orders__page-current {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      font-weight: 600;
      color: #111111;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #111111;
      color: #FFFFFF;
      border-radius: 50%;
    }
  `],
})
export class ErpOrdersComponent {
  protected readonly allOrders = ALL_ORDERS;
  protected readonly search = signal('');
  protected readonly activeStatus = signal<OrderStatus | 'all'>('all');

  protected readonly statuses: { label: string; value: OrderStatus | 'all' }[] = [
    { label: 'All',        value: 'all' },
    { label: 'Fulfilled',  value: 'fulfilled' },
    { label: 'Processing', value: 'processing' },
    { label: 'Pending',    value: 'pending' },
    { label: 'Cancelled',  value: 'cancelled' },
  ];

  protected readonly filtered = computed(() => {
    const q = this.search().toLowerCase();
    const s = this.activeStatus();
    return this.allOrders.filter((o) => {
      const matchSearch = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
      const matchStatus = s === 'all' || o.status === s;
      return matchSearch && matchStatus;
    });
  });

  protected readonly totalAmount = computed(() => {
    const sum = this.filtered().reduce((acc, o) => {
      return acc + parseFloat(o.amount.replace(/[$,]/g, ''));
    }, 0);
    return '$' + sum.toLocaleString('en-US', { minimumFractionDigits: 2 });
  });
}
