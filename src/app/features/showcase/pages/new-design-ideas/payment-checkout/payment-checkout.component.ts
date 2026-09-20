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

          <div class="order-card__illustration" aria-hidden="true">
            <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="pay-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="var(--color-bg-brand)"/>
                  <stop offset="100%" stop-color="var(--color-text-brand)"/>
                </linearGradient>
                <linearGradient id="pay-g2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="var(--color-bg-info)"/>
                  <stop offset="100%" stop-color="var(--color-bg-brand)"/>
                </linearGradient>
              </defs>
              <ellipse cx="200" cy="100" rx="120" ry="80" fill="url(#pay-g1)" opacity="0.25" transform="rotate(-15 200 100)"/>
              <ellipse cx="230" cy="80" rx="90" ry="60" fill="url(#pay-g2)" opacity="0.2" transform="rotate(10 230 80)"/>
              <rect x="100" y="50" width="140" height="90" rx="10" fill="none" stroke="var(--color-surface-featured-text)" stroke-opacity="0.08" stroke-width="1.5"/>
              <rect x="100" y="50" width="140" height="28" rx="10" fill="var(--color-surface-featured-text)" fill-opacity="0.05"/>
              <rect x="114" y="96" width="40" height="6" rx="3" fill="var(--color-surface-featured-text)" fill-opacity="0.15"/>
              <rect x="114" y="108" width="60" height="4" rx="2" fill="var(--color-surface-featured-text)" fill-opacity="0.08"/>
              <circle cx="210" cy="99" r="10" fill="var(--color-surface-featured-text)" fill-opacity="0.06" stroke="var(--color-surface-featured-text)" stroke-opacity="0.12" stroke-width="1"/>
              <circle cx="222" cy="99" r="10" fill="var(--color-surface-featured-text)" fill-opacity="0.06" stroke="var(--color-surface-featured-text)" stroke-opacity="0.12" stroke-width="1"/>
            </svg>
          </div>

        </div>
      </div>

    </div>
  `,
  styles: [`
    .checkout {
      font-family: var(--font-body);
      display: grid;
      grid-template-columns: 1fr 22rem;
      gap: var(--space-layout-sm);
      align-items: start;
      max-width: 860px;
    }

    .checkout__form-col {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .checkout__section {
      padding: var(--space-layout-sm) 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-layout-xs);
    }

    .checkout__section-title {
      margin: 0;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-text-muted);
    }

    .checkout__divider {
      height: 1px;
      background: var(--color-border-muted);
    }

    .card-tabs {
      display: flex;
      gap: var(--space-component-sm);
    }

    .card-tab {
      font-family: var(--font-body);
      font-size: 0.875rem;
      font-weight: 500;
      padding: var(--space-component-sm) var(--space-component-lg);
      border-radius: var(--radius-pill);
      border: 1px solid var(--color-border-default);
      background: var(--color-bg-surface);
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
      &--active {
        background: var(--color-surface-featured);
        color: var(--color-surface-featured-text);
        border-color: var(--color-surface-featured);
      }
      &:not(&--active):hover {
        border-color: var(--color-border-strong);
        color: var(--color-text-primary);
      }
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: var(--space-component-xs);
      flex: 1;
      &--narrow { max-width: 9rem; }
    }

    .field-row {
      display: flex;
      gap: var(--space-component-md);
    }

    .field__label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .field__input-wrap {
      position: relative;
    }

    .field__input {
      width: 100%;
      height: 2.75rem;
      padding: 0 var(--space-component-md);
      font-family: var(--font-body);
      font-size: 0.9375rem;
      color: var(--color-text-primary);
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-component);
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      &::placeholder { color: var(--color-text-muted); }
      &:focus {
        border-color: var(--color-border-focus);
        box-shadow: 0 0 0 var(--color-focus-ring-width) var(--color-focus-ring-glow);
      }
      &--mono {
        font-family: var(--font-data);
        font-size: 0.875rem;
        letter-spacing: 0.04em;
      }
      &--select {
        appearance: none;
        cursor: pointer;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23AAAAAA' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right var(--space-component-md) center;
        padding-right: var(--space-layout-sm);
      }
    }

    .field__input-wrap .field__input {
      padding-right: var(--space-layout-md);
    }

    .field__card-icons {
      position: absolute;
      right: var(--space-component-md);
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      gap: var(--space-component-xs);
      pointer-events: none;
    }

    .field__card-icon {
      font-size: 0.5625rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      padding: var(--space-component-xs) var(--space-component-sm);
      border-radius: 3px;
      &--visa { background: var(--color-surface-featured); color: var(--color-surface-featured-text); }
      &--mc   { background: var(--color-text-danger); color: var(--color-text-inverse); }
    }

    .field__cvc-hint {
      position: absolute;
      right: var(--space-component-md);
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.875rem;
      color: var(--color-border-default);
      pointer-events: none;
    }

    .checkout__pay-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-component-md);
      width: 100%;
      height: 3.25rem;
      margin-top: var(--space-layout-sm);
      background: var(--color-surface-featured);
      color: var(--color-surface-featured-text);
      font-family: var(--font-body);
      font-size: 1rem;
      font-weight: 700;
      border: none;
      border-radius: var(--radius-pill);
      cursor: pointer;
      letter-spacing: -0.01em;
      transition: background 0.15s ease, box-shadow 0.15s ease;
      box-shadow: var(--elevation-raised);
      .pi { font-size: 0.875rem; opacity: 0.7; }
      &:hover {
        background: var(--color-text-primary);
        box-shadow: var(--elevation-float);
      }
    }

    .checkout__trust {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-component-md);
      margin-top: var(--space-layout-xs);
      flex-wrap: wrap;
    }

    .checkout__trust-item {
      display: flex;
      align-items: center;
      gap: var(--space-component-xs);
      font-size: 0.75rem;
      color: var(--color-text-muted);
      .pi { font-size: 0.6875rem; }
    }

    .checkout__trust-sep {
      color: var(--color-border-muted);
      font-size: 0.75rem;
    }

    .checkout__summary-col {
      position: sticky;
      top: var(--space-layout-sm);
    }

    .order-card {
      background: var(--color-surface-featured);
      border-radius: var(--radius-surface);
      box-shadow: var(--elevation-float);
      overflow: hidden;
    }

    .order-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-layout-sm) var(--space-layout-sm) var(--space-layout-xs);
    }

    .order-card__title {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--color-surface-featured-text);
    }

    .order-card__ref {
      font-family: var(--font-data);
      font-size: 0.75rem;
      color: var(--color-surface-featured-muted);
    }

    .order-card__lines {
      padding: 0 var(--space-layout-sm);
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .order-line {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-layout-xs);
      padding: var(--space-component-md) 0;
      border-bottom: 1px solid var(--color-border-muted);
      &:last-child { border-bottom: none; }
    }

    .order-line__info {
      display: flex;
      flex-direction: column;
      gap: var(--space-component-xs);
      min-width: 0;
    }

    .order-line__name {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-surface-featured-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .order-line__desc {
      font-size: 0.6875rem;
      color: var(--color-surface-featured-muted);
    }

    .order-line__right {
      display: flex;
      align-items: center;
      gap: var(--space-component-sm);
      flex-shrink: 0;
    }

    .order-line__qty {
      font-family: var(--font-data);
      font-size: 0.6875rem;
      color: var(--color-surface-featured-muted);
    }

    .order-line__total {
      font-family: var(--font-data);
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-surface-featured-text);
    }

    .order-card__divider {
      height: 1px;
      background: var(--color-border-muted);
      opacity: 0.08;
      margin: 0 var(--space-layout-sm);
    }

    .order-totals {
      padding: var(--space-layout-xs) var(--space-layout-sm) 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-component-sm);
    }

    .order-totals__row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &--total {
        padding-top: var(--space-component-md);
        border-top: 1px solid var(--color-border-muted);
        margin-top: var(--space-component-xs);
      }
    }

    .order-totals__label {
      font-size: 0.8125rem;
      color: var(--color-surface-featured-muted);
    }

    .order-totals__value {
      font-family: var(--font-data);
      font-size: 0.8125rem;
      color: var(--color-surface-featured-muted);
    }

    .order-totals__total-label {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--color-surface-featured-text);
    }

    .order-totals__total-value {
      font-family: var(--font-data);
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--color-surface-featured-text);
      letter-spacing: -0.02em;
    }

    .order-card__illustration {
      display: flex;
      justify-content: flex-end;
      overflow: hidden;
      margin-top: var(--space-component-sm);
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
