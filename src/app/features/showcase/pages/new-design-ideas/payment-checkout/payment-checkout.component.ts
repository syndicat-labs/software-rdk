import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface OrderLine {
  name: string;
  description: string;
  qty: number;
  total: string;
}

@Component({
  selector: 'rdk-payment-checkout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="checkout">

      <!-- ── Left: form ── -->
      <div class="checkout__form-col">

        <div class="checkout__section">
          <h2 class="checkout__section-title">Contact</h2>
          <div class="field">
            <label class="field__label">Email address</label>
            <input class="field__input" type="email" placeholder="you&#64;company.com" autocomplete="email" />
          </div>
        </div>

        <div class="checkout__divider"></div>

        <div class="checkout__section">
          <h2 class="checkout__section-title">Payment</h2>

          <div class="card-tabs">
            <button class="card-tab card-tab--active" type="button">Card</button>
            <button class="card-tab" type="button">Bank transfer</button>
          </div>

          <div class="field">
            <label class="field__label">Card number</label>
            <div class="field__input-wrap">
              <input
                class="field__input field__input--mono"
                type="text"
                placeholder="1234  5678  9012  3456"
                maxlength="19"
                [value]="cardNumber()"
                (input)="formatCard($any($event.target))"
              />
              <div class="field__card-icons">
                <span class="field__card-icon field__card-icon--visa">VISA</span>
                <span class="field__card-icon field__card-icon--mc">MC</span>
              </div>
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label">Expiry</label>
              <input class="field__input field__input--mono" type="text" placeholder="MM / YY" maxlength="7" />
            </div>
            <div class="field">
              <label class="field__label">CVC</label>
              <div class="field__input-wrap">
                <input class="field__input field__input--mono" type="text" placeholder="···" maxlength="4" />
                <span class="field__cvc-hint pi pi-question-circle"></span>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="field__label">Cardholder name</label>
            <input class="field__input" type="text" placeholder="As it appears on card" autocomplete="cc-name" />
          </div>
        </div>

        <div class="checkout__divider"></div>

        <div class="checkout__section">
          <h2 class="checkout__section-title">Billing address</h2>

          <div class="field">
            <label class="field__label">Country</label>
            <select class="field__input field__input--select">
              <option>United Kingdom</option>
              <option>United States</option>
              <option>Germany</option>
              <option>France</option>
            </select>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label">Address line 1</label>
              <input class="field__input" type="text" placeholder="Street address" />
            </div>
            <div class="field field--narrow">
              <label class="field__label">Postcode</label>
              <input class="field__input field__input--mono" type="text" placeholder="EC1A 2BB" />
            </div>
          </div>

          <div class="field">
            <label class="field__label">City</label>
            <input class="field__input" type="text" placeholder="City" />
          </div>
        </div>

        <button class="checkout__pay-btn" type="button">
          <span class="pi pi-lock"></span>
          Pay $28,500.00
        </button>

        <div class="checkout__trust">
          <span class="checkout__trust-item">
            <span class="pi pi-shield"></span>
            256-bit TLS encryption
          </span>
          <span class="checkout__trust-sep">·</span>
          <span class="checkout__trust-item">
            <span class="pi pi-verified"></span>
            PCI DSS compliant
          </span>
          <span class="checkout__trust-sep">·</span>
          <span class="checkout__trust-item">
            <span class="pi pi-refresh"></span>
            Cancel anytime
          </span>
        </div>

      </div>

      <!-- ── Right: order summary (dark card) ── -->
      <div class="checkout__summary-col">
        <div class="order-card">

          <div class="order-card__header">
            <span class="order-card__title">Order summary</span>
            <span class="order-card__ref">INV-4821</span>
          </div>

          <div class="order-card__lines">
            @for (line of orderLines; track line.name) {
              <div class="order-line">
                <div class="order-line__info">
                  <span class="order-line__name">{{ line.name }}</span>
                  <span class="order-line__desc">{{ line.description }}</span>
                </div>
                <div class="order-line__right">
                  @if (line.qty > 1) {
                    <span class="order-line__qty">×{{ line.qty }}</span>
                  }
                  <span class="order-line__total">{{ line.total }}</span>
                </div>
              </div>
            }
          </div>

          <div class="order-card__divider"></div>

          <div class="order-totals">
            <div class="order-totals__row">
              <span class="order-totals__label">Subtotal</span>
              <span class="order-totals__value">$26,388.89</span>
            </div>
            <div class="order-totals__row">
              <span class="order-totals__label">VAT (8%)</span>
              <span class="order-totals__value">$2,111.11</span>
            </div>
            <div class="order-totals__row order-totals__row--total">
              <span class="order-totals__total-label">Total due</span>
              <span class="order-totals__total-value">$28,500.00</span>
            </div>
          </div>

          <!-- Illustration placeholder -->
          <div class="order-card__illustration" aria-hidden="true">
            <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="pay-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#6366f1"/>
                  <stop offset="100%" stop-color="#8b5cf6"/>
                </linearGradient>
                <linearGradient id="pay-g2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#0ea5e9"/>
                  <stop offset="100%" stop-color="#6366f1"/>
                </linearGradient>
              </defs>
              <ellipse cx="200" cy="100" rx="120" ry="80" fill="url(#pay-g1)" opacity="0.25" transform="rotate(-15 200 100)"/>
              <ellipse cx="230" cy="80" rx="90" ry="60" fill="url(#pay-g2)" opacity="0.2" transform="rotate(10 230 80)"/>
              <rect x="100" y="50" width="140" height="90" rx="10" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
              <rect x="100" y="50" width="140" height="28" rx="10" fill="rgba(255,255,255,0.05)"/>
              <rect x="114" y="96" width="40" height="6" rx="3" fill="rgba(255,255,255,0.15)"/>
              <rect x="114" y="108" width="60" height="4" rx="2" fill="rgba(255,255,255,0.08)"/>
              <circle cx="210" cy="99" r="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
              <circle cx="222" cy="99" r="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
            </svg>
          </div>

        </div>
      </div>

    </div>
  `,
  styles: [`
    // ── Layout ────────────────────────────────────────────────────────────────
    .checkout {
      font-family: 'Inter', sans-serif;
      display: grid;
      grid-template-columns: 1fr 22rem;
      gap: 2rem;
      align-items: start;
      max-width: 860px;
    }

    // ── Form column ───────────────────────────────────────────────────────────
    .checkout__form-col {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .checkout__section {
      padding: 1.5rem 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .checkout__section-title {
      margin: 0;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #AAAAAA;
    }

    .checkout__divider {
      height: 1px;
      background: #E8E8E8;
    }

    // ── Card type tabs ────────────────────────────────────────────────────────
    .card-tabs {
      display: flex;
      gap: 0.5rem;
    }

    .card-tab {
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.4375rem 1rem;
      border-radius: 9999px;
      border: 1px solid #E0E0E0;
      background: #FFFFFF;
      color: #6B6B6B;
      cursor: pointer;
      transition: all 0.15s ease;

      &--active {
        background: #111111;
        color: #FFFFFF;
        border-color: #111111;
      }

      &:not(&--active):hover {
        border-color: #AAAAAA;
        color: #111111;
      }
    }

    // ── Fields ────────────────────────────────────────────────────────────────
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      flex: 1;

      &--narrow { max-width: 9rem; }
    }

    .field-row {
      display: flex;
      gap: 0.875rem;
    }

    .field__label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #2A2A2A;
    }

    .field__input-wrap {
      position: relative;
    }

    .field__input {
      width: 100%;
      height: 2.75rem;
      padding: 0 0.875rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.9375rem;
      color: #111111;
      background: #FFFFFF;
      border: 1px solid #E0E0E0;
      border-radius: 10px;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;

      &::placeholder { color: #CCCCCC; }

      &:focus {
        border-color: #111111;
        box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.07);
      }

      &--mono {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.875rem;
        letter-spacing: 0.04em;
      }

      &--select {
        appearance: none;
        cursor: pointer;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23AAAAAA' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.875rem center;
        padding-right: 2.25rem;
      }
    }

    .field__input-wrap .field__input {
      padding-right: 4rem;
    }

    .field__card-icons {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      gap: 0.375rem;
      pointer-events: none;
    }

    .field__card-icon {
      font-size: 0.5625rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      padding: 0.1875rem 0.4rem;
      border-radius: 3px;

      &--visa { background: #1a1f71; color: #FFFFFF; }
      &--mc   { background: #eb001b; color: #FFFFFF; }
    }

    .field__cvc-hint {
      position: absolute;
      right: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.875rem;
      color: #CCCCCC;
      pointer-events: none;
    }

    // ── Pay button ────────────────────────────────────────────────────────────
    .checkout__pay-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.625rem;
      width: 100%;
      height: 3.25rem;
      margin-top: 1.5rem;
      background: #111111;
      color: #FFFFFF;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      border: none;
      border-radius: 9999px;
      cursor: pointer;
      letter-spacing: -0.01em;
      transition: background 0.15s ease, box-shadow 0.15s ease;
      box-shadow: 0 4px 16px rgba(0,0,0,0.18);

      .pi { font-size: 0.875rem; opacity: 0.7; }

      &:hover {
        background: #2A2A2A;
        box-shadow: 0 6px 24px rgba(0,0,0,0.24);
      }
    }

    // ── Trust bar ─────────────────────────────────────────────────────────────
    .checkout__trust {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.625rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .checkout__trust-item {
      display: flex;
      align-items: center;
      gap: 0.3125rem;
      font-size: 0.75rem;
      color: #AAAAAA;

      .pi { font-size: 0.6875rem; }
    }

    .checkout__trust-sep {
      color: #DDDDDD;
      font-size: 0.75rem;
    }

    // ── Summary card (dark) ───────────────────────────────────────────────────
    .checkout__summary-col {
      position: sticky;
      top: 1.5rem;
    }

    .order-card {
      background: #111111;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.22);
      overflow: hidden;
    }

    .order-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 1.5rem 1rem;
    }

    .order-card__title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #FFFFFF;
    }

    .order-card__ref {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #555555;
    }

    .order-card__lines {
      padding: 0 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .order-line {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);

      &:last-child { border-bottom: none; }
    }

    .order-line__info {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      min-width: 0;
    }

    .order-line__name {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #DDDDDD;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .order-line__desc {
      font-size: 0.6875rem;
      color: #555555;
    }

    .order-line__right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .order-line__qty {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      color: #555555;
    }

    .order-line__total {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #FFFFFF;
    }

    .order-card__divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 0 1.5rem;
    }

    // ── Totals ────────────────────────────────────────────────────────────────
    .order-totals {
      padding: 1rem 1.5rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .order-totals__row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &--total {
        padding-top: 0.75rem;
        border-top: 1px solid rgba(255,255,255,0.07);
        margin-top: 0.25rem;
      }
    }

    .order-totals__label {
      font-size: 0.8125rem;
      color: #555555;
    }

    .order-totals__value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8125rem;
      color: #AAAAAA;
    }

    .order-totals__total-label {
      font-size: 0.875rem;
      font-weight: 700;
      color: #FFFFFF;
    }

    .order-totals__total-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.375rem;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }

    // ── Illustration ──────────────────────────────────────────────────────────
    .order-card__illustration {
      display: flex;
      justify-content: flex-end;
      overflow: hidden;
      margin-top: 0.5rem;

      svg {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  `],
})
export class PaymentCheckoutComponent {
  protected readonly cardNumber = signal('');

  protected formatCard(input: HTMLInputElement): void {
    const digits = input.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, '$1  ').trim();
    this.cardNumber.set(formatted);
    input.value = formatted;
  }

  protected readonly orderLines: OrderLine[] = [
    { name: 'Steel Pipe (50mm)',    description: 'SKU-0042 × 200 pcs',  qty: 200, total: '$9,700.00'  },
    { name: 'Flanged Coupling',     description: 'SKU-0078 × 80 pcs',   qty:  80, total: '$9,920.00'  },
    { name: 'High-Pressure Valve',  description: 'SKU-0103 × 15 pcs',   qty:  15, total: '$4,770.00'  },
    { name: 'Pipe Insulation Wrap', description: 'SKU-0211 × 50 rolls', qty:  50, total: '$994.50'    },
    { name: 'Installation Consult', description: 'SVC-0014 · 1 day',    qty:   1, total: '$1,004.39'  },
  ];
}
