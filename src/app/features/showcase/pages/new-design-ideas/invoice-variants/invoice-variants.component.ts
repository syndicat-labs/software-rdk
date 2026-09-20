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
      padding: var(--space-layout-md);
      max-width: 1040px;
      margin: 0 auto;
      font-family: var(--font-body);
    }

    .iv-intro {
      margin-bottom: var(--space-layout-md);
    }
    .iv-intro__text {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      line-height: 1.6;
      margin: 0;
      max-width: 640px;
    }
    .iv-intro__text code {
      font-family: var(--font-data);
      font-size: 0.75rem;
      background: var(--color-bg-sunken);
      padding: 0.1em 0.35em;
      border-radius: var(--radius-component);
    }

    .iv-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-layout-md) var(--space-layout-sm);
    }

    .iv-cell {
      display: flex;
      flex-direction: column;
      gap: var(--space-component-lg);
    }

    .iv-card {
      border-radius: var(--radius-surface);
      overflow: hidden;
    }

    .iv-cell__label {
      display: flex;
      flex-direction: column;
      gap: var(--space-component-xs);
    }
    .iv-cell__num {
      font-family: var(--font-data);
      font-size: 0.6875rem;
      color: var(--color-text-muted);
      letter-spacing: 0.04em;
    }
    .iv-cell__name {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--color-text-primary);
      letter-spacing: -0.01em;
    }
    .iv-cell__desc {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      line-height: 1.55;
      max-width: 380px;
    }

    .v1 {
      box-shadow: var(--elevation-raised);
    }

    .v1__body {
      background: var(--color-bg-surface);
      padding: var(--space-layout-sm);
      display: flex;
      flex-direction: column;
      gap: var(--space-component-md);
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
      color: var(--color-text-muted);
    }
    .v1__badge {
      font-size: 0.625rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: var(--space-component-xs) var(--space-component-md);
      border-radius: var(--radius-pill);
    }
    .v1__badge--paid {
      background: var(--color-bg-sunken);
      color: var(--color-text-primary);
    }

    .v1__ref {
      font-family: var(--font-data);
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text-primary);
      letter-spacing: -0.01em;
    }

    .v1__client {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }
    .v1__client-name { font-weight: 600; color: var(--color-text-primary); }

    .v1__divider {
      height: 1px;
      background: var(--color-border-muted);
    }

    .v1__items {
      display: flex;
      flex-direction: column;
      gap: var(--space-component-sm);
    }
    .v1__item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .v1__item-desc {
      font-size: 0.8125rem;
      color: var(--color-text-muted);
    }
    .v1__item-amt {
      font-family: var(--font-data);
      font-size: 0.8125rem;
      color: var(--color-text-primary);
    }

    .v1__total-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-top: var(--space-component-sm);
      border-top: 2px solid var(--color-border-strong);
    }
    .v1__total-label {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--color-text-primary);
    }
    .v1__total-amt {
      font-family: var(--font-data);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .v1__perf {
      display: flex;
      align-items: center;
      background: var(--color-border-muted);
      position: relative;
    }
    .v1__perf-notch {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--color-bg-base);
      flex-shrink: 0;
    }
    .v1__perf-notch--left { margin-left: -7px; }
    .v1__perf-notch--right { margin-right: -7px; }
    .v1__perf-line {
      flex: 1;
      height: 1px;
      border-top: 2px dashed var(--color-border-default);
      margin: 0 var(--space-component-xs);
    }

    .v1__stub {
      background: var(--color-surface-featured);
      padding: var(--space-component-lg) var(--space-layout-sm);
      display: flex;
      align-items: center;
      gap: var(--space-component-lg);
    }
    .v1__qr {
      flex-shrink: 0;
      width: 68px;
      height: 68px;
    }
    .v1__qr-svg {
      width: 100%;
      height: 100%;
      color: var(--color-surface-featured-muted);
    }
    .v1__stub-data {
      display: flex;
      flex-direction: column;
      gap: var(--space-component-xs);
    }
    .v1__stub-ref {
      font-family: var(--font-data);
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-surface-featured-text);
      letter-spacing: 0.02em;
    }
    .v1__stub-due {
      font-size: 0.75rem;
      color: var(--color-surface-featured-muted);
    }
    .v1__stub-action {
      font-family: var(--font-data);
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: var(--color-surface-featured-muted);
      margin-top: var(--space-component-xs);
    }

    .v2 {
      background: var(--color-bg-surface);
      box-shadow: var(--elevation-raised);
      padding: var(--space-layout-sm);
      display: flex;
      flex-direction: column;
      gap: var(--space-layout-xs);
    }

    .v2__axis {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .v2__axis-date {
      display: flex;
      flex-direction: column;
      gap: var(--space-component-xs);
    }
    .v2__axis-date--right { text-align: right; }
    .v2__axis-label {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--color-text-muted);
    }
    .v2__axis-val {
      font-family: var(--font-data);
      font-size: 0.75rem;
      color: var(--color-text-primary);
    }

    .v2__status-pill {
      font-size: 0.625rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: var(--space-component-xs) var(--space-component-md);
      border-radius: var(--radius-pill);
    }
    .v2__status-pill--overdue {
      background: var(--color-surface-featured);
      color: var(--color-surface-featured-text);
    }

    .v2__line {
      height: 1px;
      background: var(--color-border-default);
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
      color: var(--color-text-muted);
      margin-bottom: var(--space-component-xs);
    }
    .v2__inv-ref {
      font-family: var(--font-data);
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }
    .v2__inv-client {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin-top: var(--space-component-xs);
    }
    .v2__inv-amt {
      font-family: var(--font-data);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .v2__divider { height: 1px; background: var(--color-border-muted); }

    .v2__timeline {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .v2__step {
      display: grid;
      grid-template-columns: 12px 1fr;
      grid-template-rows: auto 1fr;
      column-gap: var(--space-component-md);
      align-items: start;
    }
    .v2__step-node {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid var(--color-border-default);
      background: var(--color-bg-surface);
      flex-shrink: 0;
      margin-top: 2px;
    }
    .v2__step--done .v2__step-node {
      background: var(--color-text-primary);
      border-color: var(--color-text-primary);
    }
    .v2__step--current .v2__step-node {
      background: var(--color-bg-surface);
      border-color: var(--color-text-primary);
      border-width: 3px;
    }

    .v2__step-connector {
      width: 1px;
      min-height: 20px;
      border-left: 2px dashed var(--color-border-default);
      margin: 2px auto 2px;
      grid-column: 1;
    }
    .v2__step--done .v2__step-connector { border-color: var(--color-text-primary); border-style: solid; }

    .v2__step-info {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-bottom: var(--space-component-md);
      grid-column: 2;
      grid-row: 1;
    }
    .v2__step-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--color-text-muted);
    }
    .v2__step--done .v2__step-label,
    .v2__step--current .v2__step-label { color: var(--color-text-primary); }
    .v2__step-date {
      font-family: var(--font-data);
      font-size: 0.6875rem;
      color: var(--color-text-muted);
    }
    .v2__step--done .v2__step-date { color: var(--color-text-muted); }

    .v3 {
      background: var(--color-surface-featured);
      box-shadow: var(--elevation-float);
      padding: var(--space-layout-sm) var(--space-layout-sm);
      display: flex;
      flex-direction: column;
      gap: var(--space-component-md);
    }

    .v3__label {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: var(--color-surface-featured-muted);
    }
    .v3__amount {
      font-family: var(--font-data);
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--color-surface-featured-text);
      letter-spacing: -0.02em;
      line-height: 1;
      margin-bottom: var(--space-component-xs);
    }

    .v3__sep {
      height: 1px;
      background: var(--color-border-muted);
      opacity: 0.12;
    }

    .v3__metrics {
      display: flex;
      gap: 0;
    }
    .v3__metric {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-component-xs);
      padding-right: var(--space-layout-xs);
      border-right: 1px solid var(--color-border-muted);
    }
    .v3__metric:last-child { border-right: none; padding-right: 0; }
    .v3__metric:not(:first-child) { padding-left: var(--space-layout-xs); }

    .v3__metric-label {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--color-surface-featured-muted);
    }
    .v3__metric-val {
      font-family: var(--font-data);
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-surface-featured-text);
    }

    .v3__progress-track {
      display: flex;
      gap: 3px;
      margin-top: var(--space-component-sm);
    }
    .v3__seg {
      flex: 1;
      height: 4px;
      border-radius: 2px;
      background: var(--color-border-muted);
    }
    .v3__seg--filled { background: var(--color-surface-featured-text); }

    .v3__progress-meta {
      display: flex;
      justify-content: space-between;
    }
    .v3__progress-pct {
      font-size: 0.6875rem;
      font-weight: 700;
      color: var(--color-surface-featured-muted);
      letter-spacing: 0.02em;
    }
    .v3__progress-rem {
      font-family: var(--font-data);
      font-size: 0.6875rem;
      color: var(--color-surface-featured-muted);
    }

    .v3__ref {
      font-family: var(--font-data);
      font-size: 0.6875rem;
      color: var(--color-surface-featured-muted);
      letter-spacing: 0.04em;
      margin-top: var(--space-component-sm);
      padding-top: var(--space-component-md);
      border-top: 1px solid var(--color-border-muted);
    }

    .v4 {
      background: var(--color-bg-surface);
      box-shadow: var(--elevation-raised);
      padding: var(--space-layout-sm) var(--space-layout-sm);
      display: flex;
      flex-direction: column;
      gap: var(--space-component-md);
    }

    .v4__label {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: var(--color-text-muted);
    }

    .v4__amount {
      font-family: var(--font-data);
      font-size: 3.5rem;
      font-weight: 700;
      color: var(--color-text-primary);
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
      gap: var(--space-layout-xs);
      margin-top: var(--space-component-sm);
    }
    .v4__period {
      display: flex;
      flex-direction: column;
      gap: var(--space-component-xs);
      flex: 1;
    }
    .v4__period-label {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--color-text-muted);
    }
    .v4__period-val {
      font-family: var(--font-data);
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }
    .v4__chart {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      height: 32px;
    }
    .v4__bar {
      flex: 1;
      background: var(--color-border-default);
      border-radius: 2px 2px 0 0;
      min-height: 2px;
    }
    .v4__bar--active { background: var(--color-text-primary); }
    .v4__period-arrow {
      font-size: 0.875rem;
      color: var(--color-border-default);
      padding-bottom: 8px;
      flex-shrink: 0;
    }

    .v4__footer {
      display: flex;
      justify-content: space-between;
      margin-top: var(--space-component-md);
      padding-top: var(--space-component-md);
      border-top: 1px solid var(--color-border-muted);
    }
    .v4__inv-ref {
      font-family: var(--font-data);
      font-size: 0.6875rem;
      color: var(--color-text-muted);
    }
    .v4__due {
      font-size: 0.6875rem;
      color: var(--color-text-muted);
    }

    .v5 {
      background: var(--color-bg-sunken);
      box-shadow: var(--elevation-raised);
      overflow: hidden;
    }

    .v5__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-layout-xs) var(--space-component-lg) var(--space-component-md);
    }
    .v5__title {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: var(--color-text-primary);
    }
    .v5__ver {
      font-family: var(--font-data);
      font-size: 0.625rem;
      color: var(--color-text-muted);
      letter-spacing: 0.06em;
    }

    .v5__rule {
      height: 1px;
      background: var(--color-border-default);
    }

    .v5__grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    .v5__field {
      padding: var(--space-component-md) var(--space-component-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-component-xs);
    }
    .v5__field:nth-child(odd) {
      border-right: 1px solid var(--color-border-default);
    }

    .v5__field-label {
      font-size: 0.5rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: var(--color-text-muted);
    }
    .v5__field-val {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--color-text-primary);
    }
    .v5__field-val--mono {
      font-family: var(--font-data);
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
      background: var(--color-surface-featured);
      padding: var(--space-component-md) var(--space-component-lg);
      display: flex;
      align-items: center;
      gap: var(--space-component-md);
    }
    .v5__caution-icon {
      font-size: 0.75rem;
      color: var(--color-surface-featured-muted);
    }
    .v5__caution-text {
      font-family: var(--font-data);
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--color-surface-featured-muted);
    }

    .v6 {
      background: var(--color-surface-featured);
      box-shadow: var(--elevation-float);
      padding: var(--space-layout-sm);
      display: flex;
      flex-direction: column;
      gap: var(--space-component-md);
    }

    .v6__tags {
      display: flex;
      gap: var(--space-component-xs);
      flex-wrap: wrap;
    }
    .v6__tag {
      font-size: 0.5625rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      padding: var(--space-component-xs) var(--space-component-sm);
      border-radius: var(--radius-pill);
      border: 1px solid var(--color-border-muted);
      color: var(--color-surface-featured-muted);
    }

    .v6__title {
      font-size: 0.8125rem;
      color: var(--color-surface-featured-muted);
      font-weight: 400;
    }

    .v6__pct-row {
      display: flex;
      align-items: baseline;
      gap: var(--space-component-md);
    }
    .v6__pct {
      font-family: var(--font-data);
      font-size: 3rem;
      font-weight: 700;
      color: var(--color-surface-featured-text);
      letter-spacing: -0.03em;
      line-height: 1;
    }
    .v6__delta {
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--color-surface-featured-muted);
      border: 1px solid var(--color-border-muted);
      border-radius: var(--radius-component);
      padding: var(--space-component-xs) var(--space-component-sm);
    }

    .v6__progress-track {
      display: flex;
      gap: 2px;
    }
    .v6__seg {
      flex: 1;
      height: 4px;
      border-radius: 2px;
      background: var(--color-border-muted);
    }
    .v6__seg--filled { background: var(--color-surface-featured-text); }

    .v6__status-row {
      display: flex;
      align-items: center;
      gap: var(--space-component-sm);
    }
    .v6__status {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: var(--color-surface-featured-muted);
    }
    .v6__rem {
      font-family: var(--font-data);
      font-size: 0.6875rem;
      color: var(--color-surface-featured-muted);
    }
    .v6__rem::before {
      content: '·';
      margin-right: var(--space-component-sm);
      color: var(--color-border-muted);
    }

    .v6__footer {
      display: flex;
      justify-content: space-between;
      padding-top: var(--space-component-md);
      border-top: 1px solid var(--color-border-muted);
    }
    .v6__ref {
      font-family: var(--font-data);
      font-size: 0.6875rem;
      color: var(--color-surface-featured-muted);
      letter-spacing: 0.04em;
    }
    .v6__due {
      font-size: 0.6875rem;
      color: var(--color-surface-featured-muted);
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

  protected readonly novHeights = [2, 2, 2, 3, 2, 2, 2, 3];
  protected readonly decHeights = [4, 8, 14, 20, 24, 28, 30, 32];

  protected range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
