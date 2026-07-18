import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-variants',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="iv-page">

      <div class="iv-intro">
        <p class="iv-intro__text">Six structural patterns for invoice cards, each derived from a distinct reference model. All variants are built on <code>--obs-*</code> tokens. Study them together — each solves the same data in a different register.</p>
      </div>

      <div class="iv-grid">

        <!-- ── V1: Document Split ───────────────────────────────────────────── -->
        <div class="iv-cell">
          <div class="iv-card v1">
            <!-- Light body zone -->
            <div class="v1__body">
              <div class="v1__header">
                <span class="v1__label">INVOICE</span>
                <span class="v1__badge v1__badge--paid">Paid</span>
              </div>
              <div class="v1__ref">INV-2024-0094</div>
              <div class="v1__client">Billed to <span class="v1__client-name">Acme Corporation</span></div>
              <div class="v1__divider"></div>
              <div class="v1__items">
                <div class="v1__item">
                  <span class="v1__item-desc">Product Design Services</span>
                  <span class="v1__item-amt">$8,500.00</span>
                </div>
                <div class="v1__item">
                  <span class="v1__item-desc">VAT (15%)</span>
                  <span class="v1__item-amt">$1,275.00</span>
                </div>
              </div>
              <div class="v1__total-row">
                <span class="v1__total-label">TOTAL DUE</span>
                <span class="v1__total-amt">$9,775.00</span>
              </div>
            </div>
            <!-- Perforated separator -->
            <div class="v1__perf">
              <div class="v1__perf-notch v1__perf-notch--left"></div>
              <div class="v1__perf-line"></div>
              <div class="v1__perf-notch v1__perf-notch--right"></div>
            </div>
            <!-- Dark stub zone -->
            <div class="v1__stub">
              <div class="v1__qr">
                <svg viewBox="0 0 50 50" class="v1__qr-svg" aria-label="QR code">
                  <rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"/>
                  <rect x="4" y="4" width="8" height="8" fill="currentColor"/>
                  <rect x="35" y="1" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"/>
                  <rect x="38" y="4" width="8" height="8" fill="currentColor"/>
                  <rect x="1" y="35" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"/>
                  <rect x="4" y="38" width="8" height="8" fill="currentColor"/>
                  <rect x="17" y="1" width="3" height="3" fill="currentColor"/>
                  <rect x="22" y="1" width="3" height="3" fill="currentColor"/>
                  <rect x="27" y="1" width="3" height="3" fill="currentColor"/>
                  <rect x="17" y="6" width="3" height="3" fill="currentColor"/>
                  <rect x="22" y="6" width="3" height="3" fill="currentColor"/>
                  <rect x="27" y="6" width="3" height="3" fill="currentColor"/>
                  <rect x="17" y="11" width="3" height="3" fill="currentColor"/>
                  <rect x="27" y="11" width="3" height="3" fill="currentColor"/>
                  <rect x="1" y="17" width="3" height="3" fill="currentColor"/>
                  <rect x="6" y="17" width="3" height="3" fill="currentColor"/>
                  <rect x="11" y="17" width="3" height="3" fill="currentColor"/>
                  <rect x="17" y="17" width="3" height="3" fill="currentColor"/>
                  <rect x="22" y="17" width="3" height="3" fill="currentColor"/>
                  <rect x="27" y="17" width="3" height="3" fill="currentColor"/>
                  <rect x="33" y="17" width="3" height="3" fill="currentColor"/>
                  <rect x="38" y="17" width="3" height="3" fill="currentColor"/>
                  <rect x="43" y="17" width="3" height="3" fill="currentColor"/>
                  <rect x="6" y="22" width="3" height="3" fill="currentColor"/>
                  <rect x="17" y="22" width="3" height="3" fill="currentColor"/>
                  <rect x="27" y="22" width="3" height="3" fill="currentColor"/>
                  <rect x="33" y="22" width="3" height="3" fill="currentColor"/>
                  <rect x="43" y="22" width="3" height="3" fill="currentColor"/>
                  <rect x="1" y="27" width="3" height="3" fill="currentColor"/>
                  <rect x="11" y="27" width="3" height="3" fill="currentColor"/>
                  <rect x="22" y="27" width="3" height="3" fill="currentColor"/>
                  <rect x="38" y="27" width="3" height="3" fill="currentColor"/>
                  <rect x="17" y="33" width="3" height="3" fill="currentColor"/>
                  <rect x="22" y="33" width="3" height="3" fill="currentColor"/>
                  <rect x="33" y="33" width="3" height="3" fill="currentColor"/>
                  <rect x="43" y="33" width="3" height="3" fill="currentColor"/>
                  <rect x="17" y="38" width="3" height="3" fill="currentColor"/>
                  <rect x="27" y="38" width="3" height="3" fill="currentColor"/>
                  <rect x="38" y="38" width="3" height="3" fill="currentColor"/>
                  <rect x="22" y="43" width="3" height="3" fill="currentColor"/>
                  <rect x="33" y="43" width="3" height="3" fill="currentColor"/>
                  <rect x="43" y="43" width="3" height="3" fill="currentColor"/>
                </svg>
              </div>
              <div class="v1__stub-data">
                <div class="v1__stub-ref">INV-2024-0094</div>
                <div class="v1__stub-due">Due · 31 Dec 2024</div>
                <div class="v1__stub-action">SCAN TO PAY</div>
              </div>
            </div>
          </div>
          <div class="iv-cell__label">
            <span class="iv-cell__num">/01</span>
            <span class="iv-cell__name">Document Split</span>
            <span class="iv-cell__desc">Physical ticket metaphor — light body zone above a perforated separator, dark machine-readable stub below. Light = human data. Dark = machine reference.</span>
          </div>
        </div>

        <!-- ── V2: Status Tracker ──────────────────────────────────────────── -->
        <div class="iv-cell">
          <div class="iv-card v2">
            <div class="v2__axis">
              <div class="v2__axis-date">
                <span class="v2__axis-label">ISSUED</span>
                <span class="v2__axis-val">15 Nov 2024</span>
              </div>
              <span class="v2__status-pill v2__status-pill--overdue">Overdue</span>
              <div class="v2__axis-date v2__axis-date--right">
                <span class="v2__axis-label">DUE</span>
                <span class="v2__axis-val">30 Nov 2024</span>
              </div>
            </div>
            <div class="v2__line"></div>
            <div class="v2__meta">
              <div>
                <div class="v2__inv-label">INVOICE</div>
                <div class="v2__inv-ref">INV-2024-0094</div>
                <div class="v2__inv-client">Acme Corporation</div>
              </div>
              <div class="v2__inv-amt">$9,775.00</div>
            </div>
            <div class="v2__divider"></div>
            <div class="v2__timeline">
              @for (step of timelineSteps; track step.label) {
                <div class="v2__step" [class.v2__step--done]="step.done" [class.v2__step--current]="step.current">
                  <div class="v2__step-node"></div>
                  @if (!$last) {
                    <div class="v2__step-connector"></div>
                  }
                  <div class="v2__step-info">
                    <span class="v2__step-label">{{ step.label }}</span>
                    <span class="v2__step-date">{{ step.date }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
          <div class="iv-cell__label">
            <span class="iv-cell__num">/02</span>
            <span class="iv-cell__name">Status Tracker</span>
            <span class="iv-cell__desc">Departure/arrival axis for issued↔due dates. Vertical dashed timeline shows lifecycle stages. Node state (filled/ring/empty) encodes progress without color.</span>
          </div>
        </div>

        <!-- ── V3: Dark Financial Anchor ──────────────────────────────────── -->
        <div class="iv-cell">
          <div class="iv-card v3">
            <div class="v3__label">TOTAL DUE</div>
            <div class="v3__amount">$9,775.00</div>
            <div class="v3__sep"></div>
            <div class="v3__metrics">
              @for (m of darkMetrics; track m.label) {
                <div class="v3__metric">
                  <span class="v3__metric-label">{{ m.label }}</span>
                  <span class="v3__metric-val">{{ m.value }}</span>
                </div>
              }
            </div>
            <div class="v3__progress-track">
              @for (i of range(20); track i) {
                <div class="v3__seg" [class.v3__seg--filled]="i < 9"></div>
              }
            </div>
            <div class="v3__progress-meta">
              <span class="v3__progress-pct">46% paid</span>
              <span class="v3__progress-rem">$5,275.00 remaining</span>
            </div>
            <div class="v3__ref">INV-2024-0094</div>
          </div>
          <div class="iv-cell__label">
            <span class="iv-cell__num">/03</span>
            <span class="iv-cell__name">Dark Financial Anchor</span>
            <span class="iv-cell__desc">The dark card holds the total — the single most decision-critical number. Secondary metrics below. Segmented progress bar (light/dark segments) shows paid ratio with no color fill.</span>
          </div>
        </div>

        <!-- ── V4: Extreme Minimalist ──────────────────────────────────────── -->
        <div class="iv-cell">
          <div class="iv-card v4">
            <span class="v4__label">OUTSTANDING BALANCE</span>
            <div class="v4__amount">$9,775<span class="v4__cents">.00</span></div>
            <div class="v4__comparison">
              <div class="v4__period">
                <span class="v4__period-label">NOV 2024</span>
                <span class="v4__period-val">$0.00</span>
                <div class="v4__chart">
                  @for (h of novHeights; track $index) {
                    <div class="v4__bar" [style.height.px]="h"></div>
                  }
                </div>
              </div>
              <div class="v4__period-arrow">→</div>
              <div class="v4__period">
                <span class="v4__period-label">DEC 2024</span>
                <span class="v4__period-val">$9,775.00</span>
                <div class="v4__chart">
                  @for (h of decHeights; track $index) {
                    <div class="v4__bar v4__bar--active" [style.height.px]="h"></div>
                  }
                </div>
              </div>
            </div>
            <div class="v4__footer">
              <span class="v4__inv-ref">INV-2024-0094</span>
              <span class="v4__due">Due 31 Dec 2024</span>
            </div>
          </div>
          <div class="iv-cell__label">
            <span class="iv-cell__num">/04</span>
            <span class="iv-cell__name">Extreme Minimalist</span>
            <span class="iv-cell__desc">Zero decoration. One enormous number. Two-period comparison with dotted column charts. Hierarchy is size alone — tests the outer limit of restraint.</span>
          </div>
        </div>

        <!-- ── V5: Industrial Spec Sheet ──────────────────────────────────── -->
        <div class="iv-cell">
          <div class="iv-card v5">
            <div class="v5__header">
              <span class="v5__title">INVOICE RECORD</span>
              <span class="v5__ver">VER 01</span>
            </div>
            <div class="v5__rule"></div>
            <div class="v5__grid">
              <div class="v5__field">
                <span class="v5__field-label">FROM</span>
                <span class="v5__field-val">Syndicat Labs</span>
              </div>
              <div class="v5__field">
                <span class="v5__field-label">TO</span>
                <span class="v5__field-val">Acme Corporation</span>
              </div>
              <div class="v5__rule"></div>
              <div class="v5__rule"></div>
              <div class="v5__field">
                <span class="v5__field-label">REF NO.</span>
                <span class="v5__field-val v5__field-val--mono">INV-2024-0094</span>
              </div>
              <div class="v5__field">
                <span class="v5__field-label">ISSUED</span>
                <span class="v5__field-val">15 NOV 2024</span>
              </div>
              <div class="v5__rule"></div>
              <div class="v5__rule"></div>
              <div class="v5__field">
                <span class="v5__field-label">AMOUNT DUE</span>
                <span class="v5__field-val v5__field-val--mono v5__field-val--lg">$9,775.00</span>
              </div>
              <div class="v5__field">
                <span class="v5__field-label">STATUS</span>
                <span class="v5__field-val v5__field-val--overdue">OVERDUE</span>
              </div>
            </div>
            <div class="v5__rule"></div>
            <div class="v5__caution">
              <span class="v5__caution-icon">⚠</span>
              <span class="v5__caution-text">PAYMENT 15 DAYS OVERDUE · ACCOUNT MAY BE SUSPENDED</span>
            </div>
          </div>
          <div class="iv-cell__label">
            <span class="iv-cell__num">/05</span>
            <span class="iv-cell__name">Industrial Spec Sheet</span>
            <span class="iv-cell__desc">Invoice as technical document record. Ruled grid separates fields. All-caps label above each value. Reference number in monospace. Warning band signals overdue status.</span>
          </div>
        </div>

        <!-- ── V6: Payment Progress ────────────────────────────────────────── -->
        <div class="iv-cell">
          <div class="iv-card v6">
            <div class="v6__tags">
              @for (tag of tags; track tag) {
                <span class="v6__tag">{{ tag }}</span>
              }
            </div>
            <div class="v6__title">Acme Corporation · Invoice Progress</div>
            <div class="v6__pct-row">
              <span class="v6__pct">46%</span>
              <span class="v6__delta">↑ $4,500 this month</span>
            </div>
            <div class="v6__progress-track">
              @for (i of range(24); track i) {
                <div class="v6__seg" [class.v6__seg--filled]="i < 11"></div>
              }
            </div>
            <div class="v6__status-row">
              <span class="v6__status">On track</span>
              <span class="v6__rem">$5,275.00 remaining</span>
            </div>
            <div class="v6__footer">
              <span class="v6__ref">INV-2024-0094</span>
              <span class="v6__due">Due 31 Dec 2024</span>
            </div>
          </div>
          <div class="iv-cell__label">
            <span class="iv-cell__num">/06</span>
            <span class="iv-cell__name">Payment Progress</span>
            <span class="iv-cell__desc">Dark card anchors the percentage paid. Segmented bar without color fill. Delta badge shows momentum. Tags as bordered pills — no fill, no color. Status and remaining amount resolve the picture.</span>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .iv-page {
      padding: 2rem;
      max-width: 1040px;
      margin: 0 auto;
      font-family: 'Inter', sans-serif;
    }

    .iv-intro {
      margin-bottom: 2.5rem;
    }
    .iv-intro__text {
      font-size: 0.875rem;
      color: #6B6B6B;
      line-height: 1.6;
      margin: 0;
      max-width: 640px;
    }
    .iv-intro__text code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      background: rgba(0,0,0,0.06);
      padding: 0.1em 0.35em;
      border-radius: 4px;
    }

    /* ── Grid ────────────────────────────────────────────────────────────── */
    .iv-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 3rem 2.5rem;
    }

    .iv-cell {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .iv-card {
      border-radius: 16px;
      overflow: hidden;
    }

    .iv-cell__label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .iv-cell__num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      color: #AAAAAA;
      letter-spacing: 0.04em;
    }
    .iv-cell__name {
      font-size: 0.875rem;
      font-weight: 700;
      color: #111111;
      letter-spacing: -0.01em;
    }
    .iv-cell__desc {
      font-size: 0.75rem;
      color: #6B6B6B;
      line-height: 1.55;
      max-width: 380px;
    }

    /* ══════════════════════════════════════════════════════════════════════
       V1 — Document Split
    ══════════════════════════════════════════════════════════════════════ */
    .v1 {
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }

    .v1__body {
      background: #FFFFFF;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }

    .v1__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .v1__label {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #AAAAAA;
    }
    .v1__badge {
      font-size: 0.625rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
    }
    .v1__badge--paid {
      background: rgba(0,0,0,0.07);
      color: #111111;
    }

    .v1__ref {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111111;
      letter-spacing: -0.01em;
    }

    .v1__client {
      font-size: 0.75rem;
      color: #6B6B6B;
    }
    .v1__client-name { font-weight: 600; color: #111111; }

    .v1__divider {
      height: 1px;
      background: #EBEBEB;
    }

    .v1__items {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .v1__item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .v1__item-desc {
      font-size: 0.8125rem;
      color: #6B6B6B;
    }
    .v1__item-amt {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8125rem;
      color: #111111;
    }

    .v1__total-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-top: 0.5rem;
      border-top: 2px solid #111111;
    }
    .v1__total-label {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #111111;
    }
    .v1__total-amt {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.25rem;
      font-weight: 700;
      color: #111111;
    }

    /* Perforated separator */
    .v1__perf {
      display: flex;
      align-items: center;
      background: #EBEBEB;
      position: relative;
    }
    .v1__perf-notch {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #EBEBEB;
      flex-shrink: 0;
    }
    .v1__perf-notch--left { margin-left: -7px; }
    .v1__perf-notch--right { margin-right: -7px; }
    .v1__perf-line {
      flex: 1;
      height: 1px;
      border-top: 2px dashed #CCCCCC;
      margin: 0 0.25rem;
    }

    .v1__stub {
      background: #111111;
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .v1__qr {
      flex-shrink: 0;
      width: 68px;
      height: 68px;
    }
    .v1__qr-svg {
      width: 100%;
      height: 100%;
      color: rgba(255,255,255,0.85);
    }
    .v1__stub-data {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .v1__stub-ref {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      font-weight: 600;
      color: #FFFFFF;
      letter-spacing: 0.02em;
    }
    .v1__stub-due {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.55);
    }
    .v1__stub-action {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: rgba(255,255,255,0.35);
      margin-top: 0.25rem;
    }

    /* ══════════════════════════════════════════════════════════════════════
       V2 — Status Tracker
    ══════════════════════════════════════════════════════════════════════ */
    .v2 {
      background: #FFFFFF;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .v2__axis {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .v2__axis-date {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }
    .v2__axis-date--right { text-align: right; }
    .v2__axis-label {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #AAAAAA;
    }
    .v2__axis-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #111111;
    }

    .v2__status-pill {
      font-size: 0.625rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
    }
    .v2__status-pill--overdue {
      background: #2E2E2E;
      color: #EEEEEE;
    }

    .v2__line {
      height: 1px;
      background: linear-gradient(to right, #CCCCCC, #CCCCCC);
      margin: 0;
    }

    .v2__meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .v2__inv-label {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #AAAAAA;
      margin-bottom: 0.25rem;
    }
    .v2__inv-ref {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9375rem;
      font-weight: 600;
      color: #111111;
    }
    .v2__inv-client {
      font-size: 0.75rem;
      color: #6B6B6B;
      margin-top: 0.25rem;
    }
    .v2__inv-amt {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.25rem;
      font-weight: 700;
      color: #111111;
    }

    .v2__divider { height: 1px; background: #EBEBEB; }

    .v2__timeline {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .v2__step {
      display: grid;
      grid-template-columns: 12px 1fr;
      grid-template-rows: auto 1fr;
      column-gap: 0.875rem;
      align-items: start;
    }
    .v2__step-node {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid #CCCCCC;
      background: #FFFFFF;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .v2__step--done .v2__step-node {
      background: #111111;
      border-color: #111111;
    }
    .v2__step--current .v2__step-node {
      background: #FFFFFF;
      border-color: #111111;
      border-width: 3px;
    }

    .v2__step-connector {
      width: 1px;
      min-height: 20px;
      border-left: 2px dashed #CCCCCC;
      margin: 2px auto 2px;
      grid-column: 1;
    }
    .v2__step--done .v2__step-connector { border-color: #111111; border-style: solid; }

    .v2__step-info {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-bottom: 0.75rem;
      grid-column: 2;
      grid-row: 1;
    }
    .v2__step-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: #AAAAAA;
    }
    .v2__step--done .v2__step-label,
    .v2__step--current .v2__step-label { color: #111111; }
    .v2__step-date {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      color: #AAAAAA;
    }
    .v2__step--done .v2__step-date { color: #6B6B6B; }

    /* ══════════════════════════════════════════════════════════════════════
       V3 — Dark Financial Anchor
    ══════════════════════════════════════════════════════════════════════ */
    .v3 {
      background: #111111;
      box-shadow: 0 8px 32px rgba(0,0,0,0.22);
      padding: 1.75rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .v3__label {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: rgba(255,255,255,0.4);
    }
    .v3__amount {
      font-family: 'JetBrains Mono', monospace;
      font-size: 2.5rem;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .v3__sep {
      height: 1px;
      background: rgba(255,255,255,0.12);
    }

    .v3__metrics {
      display: flex;
      gap: 0;
    }
    .v3__metric {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding-right: 1rem;
      border-right: 1px solid rgba(255,255,255,0.08);
    }
    .v3__metric:last-child { border-right: none; padding-right: 0; }
    .v3__metric:not(:first-child) { padding-left: 1rem; }

    .v3__metric-label {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: rgba(255,255,255,0.4);
    }
    .v3__metric-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      font-weight: 600;
      color: rgba(255,255,255,0.9);
    }

    /* Segmented progress bar */
    .v3__progress-track {
      display: flex;
      gap: 3px;
      margin-top: 0.5rem;
    }
    .v3__seg {
      flex: 1;
      height: 4px;
      border-radius: 2px;
      background: rgba(255,255,255,0.12);
    }
    .v3__seg--filled { background: rgba(255,255,255,0.85); }

    .v3__progress-meta {
      display: flex;
      justify-content: space-between;
    }
    .v3__progress-pct {
      font-size: 0.6875rem;
      font-weight: 700;
      color: rgba(255,255,255,0.6);
      letter-spacing: 0.02em;
    }
    .v3__progress-rem {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      color: rgba(255,255,255,0.4);
    }

    .v3__ref {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      color: rgba(255,255,255,0.25);
      letter-spacing: 0.04em;
      margin-top: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255,255,255,0.08);
    }

    /* ══════════════════════════════════════════════════════════════════════
       V4 — Extreme Minimalist
    ══════════════════════════════════════════════════════════════════════ */
    .v4 {
      background: #FFFFFF;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      padding: 2rem 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .v4__label {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: #AAAAAA;
    }

    .v4__amount {
      font-family: 'JetBrains Mono', monospace;
      font-size: 3.5rem;
      font-weight: 700;
      color: #111111;
      letter-spacing: -0.03em;
      line-height: 1;
    }
    .v4__cents {
      font-size: 1.75rem;
      opacity: 0.5;
    }

    .v4__comparison {
      display: flex;
      align-items: flex-end;
      gap: 1rem;
      margin-top: 0.5rem;
    }
    .v4__period {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      flex: 1;
    }
    .v4__period-label {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #AAAAAA;
    }
    .v4__period-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #111111;
    }
    .v4__chart {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      height: 32px;
    }
    .v4__bar {
      flex: 1;
      background: #E0E0E0;
      border-radius: 2px 2px 0 0;
      min-height: 2px;
    }
    .v4__bar--active { background: #111111; }
    .v4__period-arrow {
      font-size: 0.875rem;
      color: #CCCCCC;
      padding-bottom: 8px;
      flex-shrink: 0;
    }

    .v4__footer {
      display: flex;
      justify-content: space-between;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid #EBEBEB;
    }
    .v4__inv-ref {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      color: #AAAAAA;
    }
    .v4__due {
      font-size: 0.6875rem;
      color: #AAAAAA;
    }

    /* ══════════════════════════════════════════════════════════════════════
       V5 — Industrial Spec Sheet
    ══════════════════════════════════════════════════════════════════════ */
    .v5 {
      background: #FAFAFA;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .v5__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem 0.875rem;
    }
    .v5__title {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #111111;
    }
    .v5__ver {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.625rem;
      color: #AAAAAA;
      letter-spacing: 0.06em;
    }

    .v5__rule {
      height: 1px;
      background: #DCDCDC;
    }

    .v5__grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    .v5__field {
      padding: 0.875rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .v5__field:nth-child(odd) {
      border-right: 1px solid #DCDCDC;
    }

    .v5__field-label {
      font-size: 0.5rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: #AAAAAA;
    }
    .v5__field-val {
      font-size: 0.8125rem;
      font-weight: 500;
      color: #111111;
    }
    .v5__field-val--mono {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8125rem;
    }
    .v5__field-val--lg {
      font-size: 1.125rem;
      font-weight: 700;
    }
    .v5__field-val--overdue {
      font-weight: 700;
      font-size: 0.75rem;
      letter-spacing: 0.06em;
    }

    .v5__caution {
      background: #111111;
      padding: 0.625rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }
    .v5__caution-icon {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.7);
    }
    .v5__caution-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: rgba(255,255,255,0.7);
    }

    /* ══════════════════════════════════════════════════════════════════════
       V6 — Payment Progress
    ══════════════════════════════════════════════════════════════════════ */
    .v6 {
      background: #111111;
      box-shadow: 0 8px 32px rgba(0,0,0,0.22);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }

    .v6__tags {
      display: flex;
      gap: 0.375rem;
      flex-wrap: wrap;
    }
    .v6__tag {
      font-size: 0.5625rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      border: 1px solid rgba(255,255,255,0.2);
      color: rgba(255,255,255,0.5);
    }

    .v6__title {
      font-size: 0.8125rem;
      color: rgba(255,255,255,0.5);
      font-weight: 400;
    }

    .v6__pct-row {
      display: flex;
      align-items: baseline;
      gap: 0.875rem;
    }
    .v6__pct {
      font-family: 'JetBrains Mono', monospace;
      font-size: 3rem;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.03em;
      line-height: 1;
    }
    .v6__delta {
      font-size: 0.6875rem;
      font-weight: 600;
      color: rgba(255,255,255,0.5);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 6px;
      padding: 0.2rem 0.5rem;
    }

    /* Segmented bar */
    .v6__progress-track {
      display: flex;
      gap: 2px;
    }
    .v6__seg {
      flex: 1;
      height: 4px;
      border-radius: 2px;
      background: rgba(255,255,255,0.1);
    }
    .v6__seg--filled { background: rgba(255,255,255,0.8); }

    .v6__status-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .v6__status {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: rgba(255,255,255,0.55);
    }
    .v6__rem {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      color: rgba(255,255,255,0.35);
    }
    .v6__rem::before {
      content: '·';
      margin-right: 0.5rem;
      color: rgba(255,255,255,0.2);
    }

    .v6__footer {
      display: flex;
      justify-content: space-between;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    .v6__ref {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      color: rgba(255,255,255,0.2);
      letter-spacing: 0.04em;
    }
    .v6__due {
      font-size: 0.6875rem;
      color: rgba(255,255,255,0.2);
    }
  `],
})
export class InvoiceVariantsComponent {
  protected readonly timelineSteps = [
    { label: 'Draft',  date: '15 Nov', done: true,  current: false },
    { label: 'Sent',   date: '16 Nov', done: true,  current: false },
    { label: 'Viewed', date: '18 Nov', done: true,  current: false },
    { label: 'Paid',   date: '—',      done: false, current: false },
  ];

  protected readonly darkMetrics = [
    { label: 'PAID',        value: '$4,500.00' },
    { label: 'OUTSTANDING', value: '$5,275.00' },
    { label: 'DUE DATE',    value: '31 Dec 24' },
  ];

  protected readonly tags = ['dev', 'invoicing', 'q4-2024'];

  // Dotted column chart heights (Nov: near-zero, Dec: growing trend)
  protected readonly novHeights = [2, 2, 2, 3, 2, 2, 2, 3];
  protected readonly decHeights = [4, 8, 14, 20, 24, 28, 30, 32];

  protected range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
