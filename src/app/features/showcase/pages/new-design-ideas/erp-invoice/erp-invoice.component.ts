import { ChangeDetectionStrategy, Component } from '@angular/core';

interface LineItem {
  description: string;
  sku: string;
  qty: number;
  unit: string;
  unitPrice: string;
  total: string;
}

@Component({
  selector: 'rdk-erp-invoice',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="inv-page">

      <!-- Actions bar -->
      <div class="inv-page__actions">
        <span class="inv-page__back">← All Invoices</span>
        <div class="inv-page__btns">
          <button class="inv-btn inv-btn--ghost" type="button">Download PDF</button>
          <button class="inv-btn inv-btn--ghost" type="button">Send by email</button>
          <button class="inv-btn inv-btn--primary" type="button">Mark as Paid</button>
        </div>
      </div>

      <!-- Invoice document -->
      <div class="inv">

        <!-- Header -->
        <div class="inv__header">
          <div class="inv__brand">
            <div class="inv__brand-mark">⬡</div>
            <span class="inv__brand-name">Stratum Industries</span>
          </div>
          <div class="inv__meta">
            <div class="inv__meta-row">
              <span class="inv__meta-label">Invoice</span>
              <span class="inv__meta-value inv__meta-value--mono">INV-4821</span>
            </div>
            <div class="inv__meta-row">
              <span class="inv__meta-label">Issued</span>
              <span class="inv__meta-value">01 Jun 2026</span>
            </div>
            <div class="inv__meta-row">
              <span class="inv__meta-label">Due</span>
              <span class="inv__meta-value">30 Jun 2026</span>
            </div>
            <div class="inv__meta-row">
              <span class="inv__meta-label">Status</span>
              <span class="status-badge status-badge--pending">Unpaid</span>
            </div>
          </div>
        </div>

        <div class="inv__divider"></div>

        <!-- Parties -->
        <div class="inv__parties">
          <div class="inv__party">
            <span class="inv__party-label">From</span>
            <span class="inv__party-name">Stratum Industries Ltd.</span>
            <span class="inv__party-detail">14 Forge Road, Unit 3</span>
            <span class="inv__party-detail">London, EC1A 2BB</span>
            <span class="inv__party-detail">VAT: GB 123 4567 89</span>
          </div>
          <div class="inv__party inv__party--right">
            <span class="inv__party-label">Bill To</span>
            <span class="inv__party-name">Meridian Supply Co.</span>
            <span class="inv__party-detail">220 Meridian Avenue</span>
            <span class="inv__party-detail">Manchester, M1 4BT</span>
            <span class="inv__party-detail">accounts&#64;meridiansupply.co.uk</span>
          </div>
        </div>

        <div class="inv__divider"></div>

        <!-- Line items -->
        <table class="inv-table">
          <thead>
            <tr>
              <th class="inv-table__th inv-table__th--desc">Description</th>
              <th class="inv-table__th">SKU</th>
              <th class="inv-table__th inv-table__th--center">Qty</th>
              <th class="inv-table__th inv-table__th--center">Unit</th>
              <th class="inv-table__th inv-table__th--right">Unit Price</th>
              <th class="inv-table__th inv-table__th--right">Total</th>
            </tr>
          </thead>
          <tbody>
            @for (item of lineItems; track item.sku) {
              <tr class="inv-table__row">
                <td class="inv-table__td inv-table__td--desc">{{ item.description }}</td>
                <td class="inv-table__td inv-table__td--mono">{{ item.sku }}</td>
                <td class="inv-table__td inv-table__td--center inv-table__td--mono">{{ item.qty }}</td>
                <td class="inv-table__td inv-table__td--center inv-table__td--muted">{{ item.unit }}</td>
                <td class="inv-table__td inv-table__td--right inv-table__td--mono">{{ item.unitPrice }}</td>
                <td class="inv-table__td inv-table__td--right inv-table__td--mono inv-table__td--bold">{{ item.total }}</td>
              </tr>
            }
          </tbody>
        </table>

        <div class="inv__divider"></div>

        <!-- Totals + dark summary card -->
        <div class="inv__footer">
          <div class="inv__notes">
            <span class="inv__notes-label">Notes</span>
            <p class="inv__notes-body">
              Payment due within 30 days. Late payments are subject to 2% monthly interest per our standard terms.
              Bank details on file — reference invoice number on transfer.
            </p>
          </div>

          <div class="inv__totals-card">
            <div class="inv__total-row">
              <span class="inv__total-label">Subtotal</span>
              <span class="inv__total-value inv__total-value--mono">$26,388.89</span>
            </div>
            <div class="inv__total-row">
              <span class="inv__total-label">VAT (8%)</span>
              <span class="inv__total-value inv__total-value--mono">$2,111.11</span>
            </div>
            <div class="inv__total-divider"></div>
            <div class="inv__total-row inv__total-row--grand">
              <span class="inv__total-grand-label">Total Due</span>
              <span class="inv__total-grand-value">$28,500.00</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .inv-page {
      font-family: 'Inter', sans-serif;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    // ── Actions bar ───────────────────────────────────────────────────────────
    .inv-page__actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .inv-page__back {
      font-size: 0.875rem;
      font-weight: 500;
      color: #6B6B6B;
      cursor: pointer;

      &:hover { color: #111111; }
    }

    .inv-page__btns {
      display: flex;
      gap: 0.625rem;
    }

    .inv-btn {
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.5rem 1.25rem;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.15s ease;

      &--ghost {
        background: #FFFFFF;
        color: #111111;
        border: 1px solid #E0E0E0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);

        &:hover { border-color: #AAAAAA; }
      }

      &--primary {
        background: #111111;
        color: #FFFFFF;
        border: 1px solid #111111;

        &:hover { background: #2A2A2A; }
      }
    }

    // ── Invoice document ──────────────────────────────────────────────────────
    .inv {
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      padding: 2.5rem;
    }

    .inv__divider {
      height: 1px;
      background: #EBEBEB;
      margin: 1.75rem 0;
    }

    // ── Header ────────────────────────────────────────────────────────────────
    .inv__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .inv__brand {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }

    .inv__brand-mark {
      font-size: 1.5rem;
      color: #111111;
      line-height: 1;
    }

    .inv__brand-name {
      font-size: 1.125rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #111111;
    }

    .inv__meta {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      align-items: flex-end;
    }

    .inv__meta-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .inv__meta-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #AAAAAA;
      width: 4rem;
      text-align: right;
    }

    .inv__meta-value {
      font-size: 0.875rem;
      color: #111111;
      font-weight: 500;
      min-width: 7rem;
      text-align: right;

      &--mono { font-family: 'JetBrains Mono', monospace; font-weight: 700; }
    }

    // ── Parties ───────────────────────────────────────────────────────────────
    .inv__parties {
      display: flex;
      justify-content: space-between;
    }

    .inv__party {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      &--right { align-items: flex-end; }
    }

    .inv__party-label {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #AAAAAA;
      margin-bottom: 0.25rem;
    }

    .inv__party-name {
      font-size: 1rem;
      font-weight: 700;
      color: #111111;
      letter-spacing: -0.01em;
    }

    .inv__party-detail {
      font-size: 0.875rem;
      color: #6B6B6B;
      line-height: 1.6;
    }

    // ── Status badge ──────────────────────────────────────────────────────────
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.1875rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.02em;

      &--fulfilled { background: #dcfce7; color: #15803d; }
      &--pending   { background: #fef9c3; color: #a16207; }
      &--overdue   { background: #fee2e2; color: #b91c1c; }
    }

    // ── Line items table ──────────────────────────────────────────────────────
    .inv-table {
      width: 100%;
      border-collapse: collapse;
    }

    .inv-table__th {
      padding: 0.625rem 0.875rem;
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #AAAAAA;
      text-align: left;
      background: #FAFAFA;
      border-bottom: 1px solid #EBEBEB;

      &--desc   { width: 40%; }
      &--right  { text-align: right; }
      &--center { text-align: center; }
    }

    .inv-table__row {
      border-bottom: 1px solid #F5F5F5;

      &:last-child { border-bottom: none; }
    }

    .inv-table__td {
      padding: 0.875rem 0.875rem;
      font-size: 0.875rem;
      color: #2A2A2A;

      &--desc   { font-weight: 500; color: #111111; }
      &--mono   { font-family: 'JetBrains Mono', monospace; font-size: 0.8125rem; }
      &--bold   { font-weight: 700; color: #111111; }
      &--muted  { color: #AAAAAA; }
      &--right  { text-align: right; }
      &--center { text-align: center; }
    }

    // ── Footer ────────────────────────────────────────────────────────────────
    .inv__footer {
      display: grid;
      grid-template-columns: 1fr 22rem;
      gap: 2rem;
      align-items: start;
    }

    .inv__notes-label {
      display: block;
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #AAAAAA;
      margin-bottom: 0.625rem;
    }

    .inv__notes-body {
      margin: 0;
      font-size: 0.8125rem;
      color: #6B6B6B;
      line-height: 1.7;
    }

    // ── Totals card (dark) ────────────────────────────────────────────────────
    .inv__totals-card {
      background: #111111;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }

    .inv__total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &--grand { margin-top: 0.25rem; }
    }

    .inv__total-label {
      font-size: 0.875rem;
      color: #AAAAAA;
    }

    .inv__total-value {
      font-size: 0.875rem;
      color: #DDDDDD;

      &--mono { font-family: 'JetBrains Mono', monospace; }
    }

    .inv__total-divider {
      height: 1px;
      background: rgba(255,255,255,0.1);
      margin: 0.375rem 0;
    }

    .inv__total-grand-label {
      font-size: 0.875rem;
      font-weight: 700;
      color: #FFFFFF;
    }

    .inv__total-grand-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.5rem;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }
  `],
})
export class ErpInvoiceComponent {
  protected readonly lineItems: LineItem[] = [
    { description: 'Industrial Grade Steel Pipe (50mm)',      sku: 'SKU-0042', qty: 200, unit: 'pcs', unitPrice: '$48.50',   total: '$9,700.00'  },
    { description: 'Stainless Flanged Coupling Assembly',     sku: 'SKU-0078', qty:  80, unit: 'pcs', unitPrice: '$124.00',  total: '$9,920.00'  },
    { description: 'High-Pressure Valve (DN50, PN40)',        sku: 'SKU-0103', qty:  15, unit: 'pcs', unitPrice: '$318.00',  total: '$4,770.00'  },
    { description: 'Pipe Insulation Wrap — 10m Roll',         sku: 'SKU-0211', qty:  50, unit: 'rolls', unitPrice: '$19.89', total: '$994.50'   },
    { description: 'Site Survey & Installation Consultation', sku: 'SVC-0014', qty:   1, unit: 'day',  unitPrice: '$1,004.39',total: '$1,004.39' },
  ];
}
