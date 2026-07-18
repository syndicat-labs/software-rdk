import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type TxType   = 'payment' | 'refund' | 'payout' | 'fee';
type TxStatus = 'completed' | 'pending' | 'failed';

interface Transaction {
  id: string;
  date: string;
  time: string;
  description: string;
  reference: string;
  type: TxType;
  status: TxStatus;
  amount: string;
  sign: '+' | '-';
}

interface BalanceCard {
  label: string;
  value: string;
  sub?: string;
  dark?: boolean;
}

const TRANSACTIONS: Transaction[] = [
  { id: 'TXN-88201', date: '01 Jun 2026', time: '14:32', description: 'Meridian Supply Co.',   reference: 'INV-4821', type: 'payment', status: 'completed', amount: '$28,500.00', sign: '+' },
  { id: 'TXN-88200', date: '01 Jun 2026', time: '11:05', description: 'Stripe processing fee', reference: 'FEE-1201', type: 'fee',     status: 'completed', amount: '$285.00',    sign: '-' },
  { id: 'TXN-88199', date: '31 May 2026', time: '16:48', description: 'Vela Logistics Ltd.',   reference: 'INV-4820', type: 'payment', status: 'completed', amount: '$7,100.00',  sign: '+' },
  { id: 'TXN-88198', date: '31 May 2026', time: '09:14', description: 'Payout to bank ····4521', reference: 'PAY-0310', type: 'payout', status: 'completed', amount: '$42,000.00', sign: '-' },
  { id: 'TXN-88197', date: '30 May 2026', time: '17:22', description: 'Axiom Parts & Co.',     reference: 'INV-4819', type: 'payment', status: 'completed', amount: '$940.00',    sign: '+' },
  { id: 'TXN-88196', date: '30 May 2026', time: '13:55', description: 'Folio Brands — refund', reference: 'REF-0088', type: 'refund',  status: 'completed', amount: '$5,320.00',  sign: '-' },
  { id: 'TXN-88195', date: '29 May 2026', time: '10:30', description: 'Kurai Solutions',       reference: 'INV-4818', type: 'payment', status: 'completed', amount: '$11,750.00', sign: '+' },
  { id: 'TXN-88194', date: '29 May 2026', time: '08:02', description: 'Stripe processing fee', reference: 'FEE-1200', type: 'fee',     status: 'completed', amount: '$117.50',    sign: '-' },
  { id: 'TXN-88193', date: '28 May 2026', time: '15:11', description: 'Stratum Industries',    reference: 'INV-4817', type: 'payment', status: 'pending',   amount: '$6,480.00',  sign: '+' },
  { id: 'TXN-88192', date: '28 May 2026', time: '11:44', description: 'Halcyon Retail — refund', reference: 'REF-0087', type: 'refund', status: 'failed',   amount: '$1,200.00',  sign: '-' },
];

@Component({
  selector: 'rdk-payment-transactions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tx-page">

      <!-- Balance strip -->
      <div class="tx-page__balances">
        @for (card of balanceCards; track card.label) {
          <div class="bal-card" [class.bal-card--dark]="card.dark">
            <span class="bal-card__label">{{ card.label }}</span>
            <span class="bal-card__value">{{ card.value }}</span>
            @if (card.sub) {
              <span class="bal-card__sub">{{ card.sub }}</span>
            }
          </div>
        }
      </div>

      <!-- Toolbar -->
      <div class="tx-page__toolbar">
        <div class="tx-search">
          <span class="tx-search__icon pi pi-search"></span>
          <input
            class="tx-search__input"
            type="text"
            placeholder="Search transactions…"
            [value]="search()"
            (input)="search.set($any($event.target).value)"
          />
        </div>

        <div class="tx-filters">
          @for (f of typeFilters; track f.value) {
            <button
              class="tx-filter"
              [class.tx-filter--active]="activeType() === f.value"
              type="button"
              (click)="activeType.set(f.value)"
            >
              {{ f.label }}
            </button>
          }
        </div>
      </div>

      <!-- Grouped transaction table -->
      <div class="tx-table-wrap">
        @for (group of groupedTx(); track group.date) {
          <div class="tx-group">
            <div class="tx-group__header">
              <span class="tx-group__date">{{ group.date }}</span>
              <span class="tx-group__net" [class.tx-group__net--pos]="group.netPositive">
                {{ group.netPositive ? '+' : '' }}{{ group.net }}
              </span>
            </div>

            <table class="tx-table">
              <tbody>
                @for (tx of group.items; track tx.id) {
                  <tr class="tx-table__row">
                    <td class="tx-table__td tx-table__td--id">
                      <span class="tx-id">{{ tx.id }}</span>
                    </td>
                    <td class="tx-table__td tx-table__td--time">{{ tx.time }}</td>
                    <td class="tx-table__td tx-table__td--desc">
                      <span class="tx-desc">{{ tx.description }}</span>
                      <span class="tx-ref">{{ tx.reference }}</span>
                    </td>
                    <td class="tx-table__td">
                      <span class="tx-type-badge tx-type-badge--{{ tx.type }}">{{ tx.type }}</span>
                    </td>
                    <td class="tx-table__td">
                      <span class="tx-status tx-status--{{ tx.status }}">{{ tx.status }}</span>
                    </td>
                    <td class="tx-table__td tx-table__td--amount">
                      <span
                        class="tx-amount"
                        [class.tx-amount--credit]="tx.sign === '+'"
                        [class.tx-amount--debit]="tx.sign === '-'"
                      >
                        {{ tx.sign === '+' ? '+' : '−' }}{{ tx.amount }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        @if (groupedTx().length === 0) {
          <div class="tx-empty">No transactions match your filters.</div>
        }
      </div>

    </div>
  `,
  styles: [`
    .tx-page {
      font-family: 'Inter', sans-serif;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    // ── Balance strip ─────────────────────────────────────────────────────────
    .tx-page__balances {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .bal-card {
      background: #FFFFFF;
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      display: flex;
      flex-direction: column;
      gap: 0.375rem;

      &--dark {
        background: #111111;

        .bal-card__label { color: #555555; }
        .bal-card__value { color: #FFFFFF; }
        .bal-card__sub   { color: #555555; }
      }
    }

    .bal-card__label {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: #AAAAAA;
    }

    .bal-card__value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.625rem;
      font-weight: 700;
      color: #111111;
      letter-spacing: -0.03em;
      line-height: 1;
    }

    .bal-card__sub {
      font-size: 0.75rem;
      color: #AAAAAA;
      margin-top: 0.125rem;
    }

    // ── Toolbar ───────────────────────────────────────────────────────────────
    .tx-page__toolbar {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .tx-search {
      position: relative;
      flex: 1;
      min-width: 14rem;
    }

    .tx-search__icon {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.8125rem;
      color: #AAAAAA;
      pointer-events: none;
    }

    .tx-search__input {
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
        box-shadow: 0 0 0 3px rgba(17,17,17,0.06);
      }
    }

    .tx-filters {
      display: flex;
      gap: 0.375rem;
    }

    .tx-filter {
      font-family: 'Inter', sans-serif;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #6B6B6B;
      background: #FFFFFF;
      border: 1px solid #E0E0E0;
      border-radius: 9999px;
      padding: 0.375rem 0.875rem;
      cursor: pointer;
      text-transform: capitalize;
      transition: all 0.15s ease;

      &:hover:not(&--active) { border-color: #AAAAAA; color: #111111; }

      &--active {
        background: #111111;
        color: #FFFFFF;
        border-color: #111111;
      }
    }

    // ── Grouped transactions ──────────────────────────────────────────────────
    .tx-table-wrap {
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.07);
      overflow: hidden;
    }

    .tx-group {
      & + & { border-top: 1px solid #F0F0F0; }
    }

    .tx-group__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.625rem 1.25rem;
      background: #FAFAFA;
      border-bottom: 1px solid #F0F0F0;
    }

    .tx-group__date {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: #AAAAAA;
    }

    .tx-group__net {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      font-weight: 700;
      color: #AAAAAA;

      &--pos { color: #15803d; }
    }

    // ── Table ─────────────────────────────────────────────────────────────────
    .tx-table {
      width: 100%;
      border-collapse: collapse;
    }

    .tx-table__row {
      border-bottom: 1px solid #F8F8F8;
      transition: background 0.1s ease;

      &:last-child { border-bottom: none; }
      &:hover { background: #FAFAFA; }
    }

    .tx-table__td {
      padding: 0.875rem 1.25rem;
      vertical-align: middle;

      &--id   { width: 8rem; }
      &--time { width: 4rem; white-space: nowrap; }
      &--desc { }
      &--amount { text-align: right; white-space: nowrap; }
    }

    .tx-id {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #AAAAAA;
    }

    .tx-table__td--time {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #CCCCCC;
    }

    .tx-desc {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #111111;
    }

    .tx-ref {
      display: block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      color: #CCCCCC;
      margin-top: 0.125rem;
    }

    // ── Type badge ────────────────────────────────────────────────────────────
    .tx-type-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.1875rem 0.5625rem;
      border-radius: 9999px;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: capitalize;

      &--payment { background: #EBEBEB; color: #111111; }
      &--refund  { background: #fee2e2; color: #b91c1c; }
      &--payout  { background: #eff6ff; color: #1d4ed8; }
      &--fee     { background: #fef9c3; color: #a16207; }
    }

    // ── Status ────────────────────────────────────────────────────────────────
    .tx-status {
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;

      &--completed { color: #AAAAAA; }
      &--pending   { color: #a16207; }
      &--failed    { color: #b91c1c; }
    }

    // ── Amount ────────────────────────────────────────────────────────────────
    .tx-amount {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9375rem;
      font-weight: 700;
      letter-spacing: -0.01em;

      &--credit { color: #111111; }
      &--debit  { color: #AAAAAA; }
    }

    // ── Empty ─────────────────────────────────────────────────────────────────
    .tx-empty {
      padding: 3rem;
      text-align: center;
      font-size: 0.875rem;
      color: #AAAAAA;
    }
  `],
})
export class PaymentTransactionsComponent {
  protected readonly search     = signal('');
  protected readonly activeType = signal<TxType | 'all'>('all');

  protected readonly typeFilters: { label: string; value: TxType | 'all' }[] = [
    { label: 'All',      value: 'all'     },
    { label: 'Payments', value: 'payment' },
    { label: 'Refunds',  value: 'refund'  },
    { label: 'Payouts',  value: 'payout'  },
    { label: 'Fees',     value: 'fee'     },
  ];

  protected readonly balanceCards: BalanceCard[] = [
    { label: 'Available balance', value: '$84,390.00', sub: 'Ready to pay out',       dark: true },
    { label: 'Pending',           value: '$6,480.00',  sub: '1 transaction clearing'              },
    { label: 'Processed MTD',     value: '$54,770.00', sub: 'June 2026'                           },
    { label: 'Refunded MTD',      value: '$6,520.00',  sub: '2 refunds this month'                },
  ];

  protected readonly groupedTx = computed(() => {
    const q = this.search().toLowerCase();
    const t = this.activeType();

    const filtered = TRANSACTIONS.filter((tx) => {
      const matchSearch = !q || tx.description.toLowerCase().includes(q) || tx.reference.toLowerCase().includes(q) || tx.id.toLowerCase().includes(q);
      const matchType   = t === 'all' || tx.type === t;
      return matchSearch && matchType;
    });

    const byDate = new Map<string, Transaction[]>();
    for (const tx of filtered) {
      const list = byDate.get(tx.date) ?? [];
      list.push(tx);
      byDate.set(tx.date, list);
    }

    return Array.from(byDate.entries()).map(([date, items]) => {
      const net = items.reduce((sum, tx) => {
        const v = parseFloat(tx.amount.replace(/[$,]/g, ''));
        return sum + (tx.sign === '+' ? v : -v);
      }, 0);
      return {
        date,
        items,
        net: '$' + Math.abs(net).toLocaleString('en-US', { minimumFractionDigits: 2 }),
        netPositive: net >= 0,
      };
    });
  });
}
