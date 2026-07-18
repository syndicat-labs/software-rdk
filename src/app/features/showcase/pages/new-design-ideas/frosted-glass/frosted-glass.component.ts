import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-frosted-glass',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fg-page">

      <!-- Token reference strip -->
      <div class="fg-tokens">
        @for (token of tokens; track token.name) {
          <div class="fg-token">
            <span class="fg-token__name">{{ token.name }}</span>
            <span class="fg-token__val">{{ token.value }}</span>
          </div>
        }
      </div>

      <div class="fg-intro">
        <p>Glass is a restrained third surface type. It requires painted content behind it — the blur needs something to blur. Use it in three contexts only: modal overlays, contextual panels over illustration zones, and CTA buttons over card art.</p>
      </div>

      <div class="fg-section-label">On dark surfaces</div>

      <div class="fg-row">

        <!-- ── Demo 1: Glass Panel on Dark Card ──────────────────────────── -->
        <div class="fg-demo">
          <div class="fg-demo__card fg-demo__card--dark">
            <div class="fg-demo__illus"></div>
            <div class="fg-demo__body">
              <div class="fg-demo__header">
                <span class="fg-demo__eyebrow">NET BALANCE</span>
                <span class="fg-demo__badge">Live</span>
              </div>
              <div class="fg-panel fg-panel--dark">
                <span class="fg-panel__label">AVAILABLE</span>
                <span class="fg-panel__value">$42,500.00</span>
                <span class="fg-panel__sub">Updated 2m ago</span>
              </div>
              <div class="fg-demo__actions">
                <button class="fg-btn fg-btn--glass-dark">Withdraw</button>
                <button class="fg-btn fg-btn--ghost-dark">History</button>
              </div>
            </div>
          </div>
          <div class="fg-demo__caption">
            <span class="fg-demo__token">--obs-surface-glass</span>
            Glass panel on dark card — the illustration behind blurs through the panel surface. Used for a contained data readout over card art.
          </div>
        </div>

        <!-- ── Demo 2: Glass Badge on Dark Surface ────────────────────────── -->
        <div class="fg-demo">
          <div class="fg-demo__card fg-demo__card--dark fg-demo__card--badges">
            <div class="fg-demo__illus fg-demo__illus--warm"></div>
            <div class="fg-demo__body fg-demo__body--center">
              <div class="fg-badge-stack">
                <div class="fg-badge fg-badge--glass-dark">
                  <span class="fg-badge__dot fg-badge__dot--live"></span>
                  <span>Processing</span>
                </div>
                <div class="fg-badge fg-badge--glass-dark">
                  <span class="fg-badge__icon pi pi-lock"></span>
                  <span>Verified</span>
                </div>
                <div class="fg-badge fg-badge--glass-dark">
                  <span class="fg-badge__icon pi pi-shield"></span>
                  <span>Secured</span>
                </div>
              </div>
            </div>
          </div>
          <div class="fg-demo__caption">
            <span class="fg-demo__token">--obs-surface-glass (pill)</span>
            Glass pill badges float over illustration. The blur softens the background behind the label without breaking the surface hierarchy of the card itself.
          </div>
        </div>

        <!-- ── Demo 3: Without vs With (Dark) ────────────────────────────── -->
        <div class="fg-demo fg-demo--compare">
          <div class="fg-compare">
            <!-- No glass -->
            <div class="fg-compare__half">
              <div class="fg-compare__card fg-compare__card--dark">
                <div class="fg-compare__illus"></div>
                <div class="fg-compare__content">
                  <span class="fg-compare__eyebrow">Without glass</span>
                  <div class="fg-compare__panel fg-compare__panel--flat-dark">
                    <span class="fg-compare__val">$12,400</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Glass -->
            <div class="fg-compare__half">
              <div class="fg-compare__card fg-compare__card--dark">
                <div class="fg-compare__illus"></div>
                <div class="fg-compare__content">
                  <span class="fg-compare__eyebrow">With glass</span>
                  <div class="fg-compare__panel fg-compare__panel--glass-dark">
                    <span class="fg-compare__val">$12,400</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fg-demo__caption">
            <span class="fg-demo__token">Comparison: flat vs glass (dark)</span>
            The flat panel is a hard boundary. The glass panel inherits the illustration's warmth while maintaining legibility — it belongs to the card instead of sitting on top of it.
          </div>
        </div>

      </div>

      <div class="fg-section-label">On light / neutral surfaces</div>

      <div class="fg-row fg-row--light">

        <!-- ── Demo 4: Glass CTA Button on Light Card ─────────────────────── -->
        <div class="fg-demo">
          <div class="fg-demo__card fg-demo__card--light">
            <div class="fg-demo__light-illus"></div>
            <div class="fg-demo__body fg-demo__body--light">
              <div class="fg-light-header">
                <span class="fg-light-eyebrow">STARTER PLAN</span>
                <span class="fg-light-price">$29<span class="fg-light-per">/mo</span></span>
              </div>
              <p class="fg-light-desc">Everything you need to get started with a small team.</p>
              <div class="fg-light-actions">
                <button class="fg-btn fg-btn--glass-light">Get started</button>
                <button class="fg-btn fg-btn--link-light">See all plans</button>
              </div>
            </div>
          </div>
          <div class="fg-demo__caption">
            <span class="fg-demo__token">--obs-surface-glass-light</span>
            On a light card with a decorative background zone, the frosted glass CTA button inherits the background color while the blur creates a subtle depth separation from the card art.
          </div>
        </div>

        <!-- ── Demo 5: Glass Modal Overlay ────────────────────────────────── -->
        <div class="fg-demo">
          <div class="fg-modal-host">
            <!-- Simulated background content -->
            <div class="fg-modal-bg">
              <div class="fg-modal-bg__card"></div>
              <div class="fg-modal-bg__card fg-modal-bg__card--sm"></div>
            </div>
            <!-- Dim overlay + glass modal -->
            <div class="fg-modal-overlay">
              <div class="fg-modal">
                <div class="fg-modal__header">
                  <span class="fg-modal__title">Confirm payment</span>
                  <button class="fg-modal__close pi pi-times"></button>
                </div>
                <div class="fg-modal__body">
                  <div class="fg-modal__row">
                    <span class="fg-modal__label">Amount</span>
                    <span class="fg-modal__val">$9,775.00</span>
                  </div>
                  <div class="fg-modal__row">
                    <span class="fg-modal__label">To</span>
                    <span class="fg-modal__val">Acme Corp</span>
                  </div>
                  <div class="fg-modal__row">
                    <span class="fg-modal__label">Ref</span>
                    <span class="fg-modal__val fg-modal__val--mono">INV-2024-0094</span>
                  </div>
                </div>
                <div class="fg-modal__footer">
                  <button class="fg-btn fg-btn--dark-solid">Confirm</button>
                  <button class="fg-btn fg-btn--ghost-light">Cancel</button>
                </div>
              </div>
            </div>
          </div>
          <div class="fg-demo__caption">
            <span class="fg-demo__token">--obs-blur-glass-heavy (modal overlay)</span>
            The modal background uses a heavy blur (16px) on the dim overlay, creating depth separation from the page content without a hard border. The modal itself is a flat light card — the glass is the overlay, not the modal surface.
          </div>
        </div>

        <!-- ── Demo 6: Without vs With (Light) ───────────────────────────── -->
        <div class="fg-demo fg-demo--compare">
          <div class="fg-compare">
            <div class="fg-compare__half">
              <div class="fg-compare__card fg-compare__card--light">
                <div class="fg-compare__light-illus"></div>
                <div class="fg-compare__content fg-compare__content--light">
                  <span class="fg-compare__eyebrow fg-compare__eyebrow--light">Without glass</span>
                  <div class="fg-compare__panel fg-compare__panel--flat-light">
                    <span class="fg-compare__val fg-compare__val--light">Get started</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="fg-compare__half">
              <div class="fg-compare__card fg-compare__card--light">
                <div class="fg-compare__light-illus"></div>
                <div class="fg-compare__content fg-compare__content--light">
                  <span class="fg-compare__eyebrow fg-compare__eyebrow--light">With glass</span>
                  <div class="fg-compare__panel fg-compare__panel--glass-light">
                    <span class="fg-compare__val fg-compare__val--light">Get started</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fg-demo__caption">
            <span class="fg-demo__token">Comparison: flat vs glass (light)</span>
            The flat button is a white rectangle. The glass button carries the card background's color — it integrates with the card surface rather than sitting as a foreign element on it.
          </div>
        </div>

      </div>

      <!-- Usage rules -->
      <div class="fg-rules">
        <div class="fg-rules__title">Glass surface rules</div>
        <div class="fg-rules__grid">
          @for (rule of rules; track rule.label) {
            <div class="fg-rule" [class.fg-rule--no]="!rule.allowed">
              <span class="fg-rule__icon">{{ rule.allowed ? '✓' : '✗' }}</span>
              <div>
                <div class="fg-rule__label">{{ rule.label }}</div>
                <div class="fg-rule__desc">{{ rule.desc }}</div>
              </div>
            </div>
          }
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }

    .fg-page {
      padding: 2rem;
      max-width: 1040px;
      margin: 0 auto;
      font-family: 'Inter', sans-serif;
    }

    /* ── Token strip ──────────────────────────────────────────────────── */
    .fg-tokens {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 1.75rem;
    }
    .fg-token {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      background: #FFFFFF;
      border: 1px solid #E0E0E0;
      border-radius: 10px;
      padding: 0.625rem 1rem;
    }
    .fg-token__name {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      color: #111111;
      font-weight: 600;
    }
    .fg-token__val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.625rem;
      color: #AAAAAA;
    }

    /* ── Intro ────────────────────────────────────────────────────────── */
    .fg-intro {
      margin-bottom: 2.5rem;
    }
    .fg-intro p {
      font-size: 0.875rem;
      color: #6B6B6B;
      line-height: 1.6;
      margin: 0;
      max-width: 640px;
    }

    .fg-section-label {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #AAAAAA;
      margin-bottom: 1.25rem;
    }

    /* ── Row layout ───────────────────────────────────────────────────── */
    .fg-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.75rem;
      margin-bottom: 3rem;
    }

    .fg-demo {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }
    .fg-demo__caption {
      font-size: 0.75rem;
      color: #6B6B6B;
      line-height: 1.55;
    }
    .fg-demo__token {
      display: block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.625rem;
      color: #111111;
      font-weight: 600;
      margin-bottom: 0.375rem;
    }

    /* ── Dark card demos ──────────────────────────────────────────────── */
    .fg-demo__card {
      border-radius: 16px;
      overflow: hidden;
      position: relative;
    }
    .fg-demo__card--dark {
      background: #111111;
      box-shadow: 0 8px 32px rgba(0,0,0,0.22);
      min-height: 220px;
    }

    .fg-demo__illus {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(ellipse 70% 60% at 85% 70%, rgba(99,102,241,0.45) 0%, transparent 65%),
        radial-gradient(ellipse 50% 50% at 15% 80%, rgba(168,85,247,0.35) 0%, transparent 60%);
    }
    .fg-demo__illus--warm {
      background:
        radial-gradient(ellipse 70% 60% at 80% 60%, rgba(234,88,12,0.4) 0%, transparent 65%),
        radial-gradient(ellipse 50% 50% at 20% 90%, rgba(220,38,38,0.3) 0%, transparent 60%);
    }

    .fg-demo__body {
      position: relative;
      z-index: 1;
      padding: 1.375rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }
    .fg-demo__body--center {
      align-items: center;
      justify-content: center;
      min-height: 220px;
    }

    .fg-demo__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .fg-demo__eyebrow {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: rgba(255,255,255,0.4);
    }
    .fg-demo__badge {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      background: rgba(255,255,255,0.10);
      border: 1px solid rgba(255,255,255,0.15);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: rgba(255,255,255,0.7);
    }

    /* THE glass panel — core pattern */
    .fg-panel--dark {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      background: rgba(255,255,255,0.10);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 12px;
      padding: 1rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .fg-panel__label {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: rgba(255,255,255,0.45);
    }
    .fg-panel__value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.5rem;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }
    .fg-panel__sub {
      font-size: 0.6875rem;
      color: rgba(255,255,255,0.3);
    }

    .fg-demo__actions {
      display: flex;
      gap: 0.5rem;
    }

    /* ── Glass badge pills on dark ────────────────────────────────────── */
    .fg-badge-stack {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }
    .fg-badge--glass-dark {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.875rem;
      border-radius: 9999px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      background: rgba(255,255,255,0.10);
      border: 1px solid rgba(255,255,255,0.15);
      font-size: 0.75rem;
      font-weight: 600;
      color: rgba(255,255,255,0.85);
      letter-spacing: 0.01em;
    }
    .fg-badge__dot--live {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255,255,255,0.6);
      flex-shrink: 0;
    }
    .fg-badge__icon {
      font-size: 0.6875rem;
      color: rgba(255,255,255,0.5);
    }

    /* ── Comparison (dark) ────────────────────────────────────────────── */
    .fg-compare {
      display: flex;
      gap: 0.5rem;
    }
    .fg-compare__half {
      flex: 1;
    }
    .fg-compare__card--dark {
      background: #111111;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      height: 120px;
    }
    .fg-compare__illus {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 70% at 80% 80%, rgba(99,102,241,0.5) 0%, transparent 70%),
        radial-gradient(ellipse 50% 50% at 10% 90%, rgba(168,85,247,0.4) 0%, transparent 55%);
    }
    .fg-compare__content {
      position: relative;
      z-index: 1;
      padding: 0.875rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .fg-compare__eyebrow {
      font-size: 0.5rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: rgba(255,255,255,0.4);
    }
    .fg-compare__panel--flat-dark {
      background: rgba(30,30,30,0.95);
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
    }
    .fg-compare__panel--glass-dark {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      background: rgba(255,255,255,0.10);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
    }
    .fg-compare__val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      font-weight: 700;
      color: #FFFFFF;
    }

    /* ── Light card demos ─────────────────────────────────────────────── */
    .fg-demo__card--light {
      background: #FFFFFF;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      min-height: 220px;
    }
    .fg-demo__light-illus {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(ellipse 80% 70% at 90% 90%, rgba(235,235,235,1) 0%, transparent 60%),
        radial-gradient(ellipse 60% 60% at 0% 100%, rgba(215,215,215,0.8) 0%, transparent 50%),
        linear-gradient(135deg, rgba(245,245,245,1) 0%, rgba(225,225,225,0.6) 100%);
    }

    .fg-demo__body--light {
      position: relative;
      z-index: 1;
      padding: 1.375rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }

    .fg-light-header {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .fg-light-eyebrow {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #AAAAAA;
    }
    .fg-light-price {
      font-family: 'JetBrains Mono', monospace;
      font-size: 2rem;
      font-weight: 700;
      color: #111111;
      letter-spacing: -0.03em;
    }
    .fg-light-per {
      font-size: 0.875rem;
      font-weight: 400;
      color: #AAAAAA;
    }

    .fg-light-desc {
      font-size: 0.8125rem;
      color: #6B6B6B;
      line-height: 1.5;
      margin: 0;
    }

    .fg-light-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    /* ── Buttons ──────────────────────────────────────────────────────── */
    .fg-btn {
      border: none;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      border-radius: 9999px;
      transition: opacity 200ms;
    }
    .fg-btn:hover { opacity: 0.8; }

    .fg-btn--glass-dark {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      background: rgba(255,255,255,0.10);
      border: 1px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.9);
      font-size: 0.8125rem;
      padding: 0.5rem 1.125rem;
    }
    .fg-btn--ghost-dark {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.45);
      font-size: 0.8125rem;
      padding: 0.5rem 1.125rem;
    }
    .fg-btn--glass-light {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      background: rgba(235,235,235,0.55);
      border: 1px solid rgba(0,0,0,0.08);
      color: #111111;
      font-size: 0.9375rem;
      padding: 0.75rem 1.5rem;
      width: 100%;
    }
    .fg-btn--link-light {
      background: transparent;
      border: none;
      color: #6B6B6B;
      font-size: 0.8125rem;
      padding: 0.5rem 0;
      text-decoration: underline;
      text-underline-offset: 3px;
      width: 100%;
      text-align: center;
    }
    .fg-btn--dark-solid {
      background: #111111;
      color: #FFFFFF;
      font-size: 0.875rem;
      padding: 0.625rem 1.375rem;
      border-radius: 9999px;
      border: none;
    }
    .fg-btn--ghost-light {
      background: transparent;
      border: 1px solid #CCCCCC;
      color: #6B6B6B;
      font-size: 0.875rem;
      padding: 0.625rem 1.375rem;
      border-radius: 9999px;
    }

    /* ── Modal demo ───────────────────────────────────────────────────── */
    .fg-modal-host {
      position: relative;
      height: 280px;
      border-radius: 16px;
      overflow: hidden;
      background: #EBEBEB;
    }
    .fg-modal-bg {
      position: absolute;
      inset: 0;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .fg-modal-bg__card {
      background: #FFFFFF;
      border-radius: 12px;
      height: 60px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .fg-modal-bg__card--sm { height: 40px; }

    .fg-modal-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      background: rgba(235,235,235,0.6);
    }
    .fg-modal {
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.14);
      width: calc(100% - 2rem);
      overflow: hidden;
    }
    .fg-modal__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.125rem 0.75rem;
      border-bottom: 1px solid #EBEBEB;
    }
    .fg-modal__title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #111111;
    }
    .fg-modal__close {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.75rem;
      color: #AAAAAA;
      padding: 0;
    }
    .fg-modal__body {
      padding: 0.875rem 1.125rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .fg-modal__row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .fg-modal__label {
      font-size: 0.75rem;
      color: #AAAAAA;
    }
    .fg-modal__val {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #111111;
    }
    .fg-modal__val--mono {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
    }
    .fg-modal__footer {
      display: flex;
      gap: 0.5rem;
      padding: 0.875rem 1.125rem;
      border-top: 1px solid #EBEBEB;
    }

    /* ── Light comparison ─────────────────────────────────────────────── */
    .fg-compare__card--light {
      background: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      height: 120px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .fg-compare__light-illus {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 70% at 90% 90%, rgba(220,220,220,1) 0%, transparent 60%),
        radial-gradient(ellipse 50% 50% at 10% 100%, rgba(200,200,200,0.8) 0%, transparent 55%);
    }
    .fg-compare__content--light {
      position: relative;
      z-index: 1;
      padding: 0.875rem;
    }
    .fg-compare__eyebrow--light {
      font-size: 0.5rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #AAAAAA;
      display: block;
      margin-bottom: 0.5rem;
    }
    .fg-compare__panel--flat-light {
      background: #FFFFFF;
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 8px;
      padding: 0.5rem 0.875rem;
      display: inline-block;
    }
    .fg-compare__panel--glass-light {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      background: rgba(235,235,235,0.55);
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 8px;
      padding: 0.5rem 0.875rem;
      display: inline-block;
    }
    .fg-compare__val--light {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #111111;
    }

    /* ── Usage rules ──────────────────────────────────────────────────── */
    .fg-rules {
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
      padding: 1.5rem;
    }
    .fg-rules__title {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #AAAAAA;
      margin-bottom: 1rem;
    }
    .fg-rules__grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
    .fg-rule {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      padding: 0.875rem;
      border-radius: 10px;
      background: rgba(0,0,0,0.02);
    }
    .fg-rule--no { background: rgba(0,0,0,0.03); }
    .fg-rule__icon {
      font-size: 0.75rem;
      font-weight: 700;
      color: #111111;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .fg-rule--no .fg-rule__icon { color: #AAAAAA; }
    .fg-rule__label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #111111;
      margin-bottom: 0.2rem;
    }
    .fg-rule--no .fg-rule__label { color: #AAAAAA; text-decoration: line-through; }
    .fg-rule__desc {
      font-size: 0.75rem;
      color: #6B6B6B;
      line-height: 1.5;
    }
  `],
})
export class FrostedGlassComponent {
  protected readonly tokens = [
    { name: '--obs-surface-glass',       value: 'rgba(255,255,255,0.10)' },
    { name: '--obs-surface-glass-light', value: 'rgba(235,235,235,0.55)' },
    { name: '--obs-border-glass',        value: 'rgba(255,255,255,0.15)' },
    { name: '--obs-border-glass-light',  value: 'rgba(0,0,0,0.08)' },
    { name: '--obs-blur-glass',          value: '8px' },
    { name: '--obs-blur-glass-heavy',    value: '16px' },
  ];

  protected readonly rules = [
    {
      allowed: true,
      label: 'Modal / overlay background',
      desc: 'A heavy glass blur on the overlay layer. The modal itself is a flat white card — glass is on the overlay, not the surface.',
    },
    {
      allowed: true,
      label: 'CTA button over illustration',
      desc: 'A glass button anchored in a card\'s illustration zone, inheriting the background. Blur must have painted content behind it.',
    },
    {
      allowed: true,
      label: 'Contextual panel over card art',
      desc: 'A data panel positioned over an illustration within a dark card. The blur reveals the illustration\'s warmth through the panel.',
    },
    {
      allowed: true,
      label: 'Status badge over illustration',
      desc: 'A pill badge floating over a dark card\'s illustration zone. Light glass, thin border, monospace text.',
    },
    {
      allowed: false,
      label: 'General card surface',
      desc: 'Glass must not replace --obs-surface-card-light or --obs-surface-card-dark. If there\'s nothing to blur behind it, use a flat surface.',
    },
    {
      allowed: false,
      label: 'Sidebar or nav background',
      desc: 'Navigation surfaces require flat, predictable rendering. Glass in structural nav chrome is decorative noise.',
    },
    {
      allowed: false,
      label: 'Row or table backgrounds',
      desc: 'Glass on data rows breaks legibility at density. Data tables use flat alternating surfaces only.',
    },
    {
      allowed: false,
      label: 'Two competing glass surfaces',
      desc: 'Glass surfaces should not overlap — a glass panel inside a glass modal creates undefined blur artifacts.',
    },
  ];
}
