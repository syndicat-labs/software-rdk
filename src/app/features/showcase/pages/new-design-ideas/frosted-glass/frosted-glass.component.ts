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
      padding: var(--space-layout-md);
      max-width: 1040px;
      margin: 0 auto;
      font-family: var(--font-body);
    }

    .fg-tokens {
      display: flex;
      gap: var(--space-component-md);
      flex-wrap: wrap;
      margin-bottom: var(--space-layout-sm);
    }
    .fg-token {
      display: flex;
      flex-direction: column;
      gap: var(--space-component-xs);
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-component);
      padding: var(--space-component-md) var(--space-component-lg);
    }
    .fg-token__name {
      font-family: var(--font-data);
      font-size: 0.6875rem;
      color: var(--color-text-primary);
      font-weight: 600;
    }
    .fg-token__val {
      font-family: var(--font-data);
      font-size: 0.625rem;
      color: var(--color-text-muted);
    }

    .fg-intro {
      margin-bottom: var(--space-layout-md);
    }
    .fg-intro p {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      line-height: 1.6;
      margin: 0;
      max-width: 640px;
    }

    .fg-section-label {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-text-muted);
      margin-bottom: var(--space-component-lg);
    }

    .fg-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-layout-sm);
      margin-bottom: var(--space-layout-md);
    }

    .fg-demo {
      display: flex;
      flex-direction: column;
      gap: var(--space-component-md);
    }
    .fg-demo__caption {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      line-height: 1.55;
    }
    .fg-demo__token {
      display: block;
      font-family: var(--font-data);
      font-size: 0.625rem;
      color: var(--color-text-primary);
      font-weight: 600;
      margin-bottom: var(--space-component-xs);
    }

    .fg-demo__card {
      border-radius: var(--radius-surface);
      overflow: hidden;
      position: relative;
    }
    .fg-demo__card--dark {
      background: var(--color-surface-featured);
      box-shadow: var(--elevation-float);
      min-height: 220px;
    }

    .fg-demo__illus {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(ellipse 70% 60% at 85% 70%, color-mix(in srgb, var(--color-bg-brand) 45%, transparent) 0%, transparent 65%),
        radial-gradient(ellipse 50% 50% at 15% 80%, color-mix(in srgb, var(--color-text-brand) 35%, transparent) 0%, transparent 60%);
    }
    .fg-demo__illus--warm {
      background:
        radial-gradient(ellipse 70% 60% at 80% 60%, color-mix(in srgb, var(--color-bg-warning) 40%, transparent) 0%, transparent 65%),
        radial-gradient(ellipse 50% 50% at 20% 90%, color-mix(in srgb, var(--color-bg-danger) 30%, transparent) 0%, transparent 60%);
    }

    .fg-demo__body {
      position: relative;
      z-index: 1;
      padding: var(--space-layout-xs) var(--space-component-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-component-md);
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
      color: var(--color-surface-featured-muted);
    }
    .fg-demo__badge {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: var(--space-component-xs) var(--space-component-sm);
      border-radius: var(--radius-pill);
      background: color-mix(in srgb, var(--color-text-inverse) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-text-inverse) 15%, transparent);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: var(--color-surface-featured-muted);
    }

    .fg-panel--dark {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      background: color-mix(in srgb, var(--color-text-inverse) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-text-inverse) 15%, transparent);
      border-radius: var(--radius-surface);
      padding: var(--space-layout-xs) var(--space-component-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-component-xs);
    }
    .fg-panel__label {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: var(--color-surface-featured-muted);
    }
    .fg-panel__value {
      font-family: var(--font-data);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-surface-featured-text);
      letter-spacing: -0.02em;
    }
    .fg-panel__sub {
      font-size: 0.6875rem;
      color: var(--color-surface-featured-muted);
    }

    .fg-demo__actions {
      display: flex;
      gap: var(--space-component-sm);
    }

    .fg-badge-stack {
      display: flex;
      flex-direction: column;
      gap: var(--space-component-sm);
      align-items: flex-start;
    }
    .fg-badge--glass-dark {
      display: flex;
      align-items: center;
      gap: var(--space-component-sm);
      padding: var(--space-component-xs) var(--space-component-md);
      border-radius: var(--radius-pill);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      background: color-mix(in srgb, var(--color-text-inverse) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-text-inverse) 15%, transparent);
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-surface-featured-text);
      letter-spacing: 0.01em;
    }
    .fg-badge__dot--live {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-surface-featured-muted);
      flex-shrink: 0;
    }
    .fg-badge__icon {
      font-size: 0.6875rem;
      color: var(--color-surface-featured-muted);
    }

    .fg-compare {
      display: flex;
      gap: var(--space-component-sm);
    }
    .fg-compare__half {
      flex: 1;
    }
    .fg-compare__card--dark {
      background: var(--color-surface-featured);
      border-radius: var(--radius-surface);
      overflow: hidden;
      position: relative;
      height: 120px;
    }
    .fg-compare__illus {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 70% at 80% 80%, color-mix(in srgb, var(--color-bg-brand) 50%, transparent) 0%, transparent 70%),
        radial-gradient(ellipse 50% 50% at 10% 90%, color-mix(in srgb, var(--color-text-brand) 40%, transparent) 0%, transparent 55%);
    }
    .fg-compare__content {
      position: relative;
      z-index: 1;
      padding: var(--space-component-md);
      display: flex;
      flex-direction: column;
      gap: var(--space-component-sm);
    }
    .fg-compare__eyebrow {
      font-size: 0.5rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--color-surface-featured-muted);
    }
    .fg-compare__panel--flat-dark {
      background: var(--color-surface-featured);
      border-radius: var(--radius-component);
      padding: var(--space-component-sm) var(--space-component-md);
    }
    .fg-compare__panel--glass-dark {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      background: color-mix(in srgb, var(--color-text-inverse) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-text-inverse) 15%, transparent);
      border-radius: var(--radius-component);
      padding: var(--space-component-sm) var(--space-component-md);
    }
    .fg-compare__val {
      font-family: var(--font-data);
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--color-surface-featured-text);
    }

    .fg-demo__card--light {
      background: var(--color-bg-surface);
      box-shadow: var(--elevation-raised);
      min-height: 220px;
    }
    .fg-demo__light-illus {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(ellipse 80% 70% at 90% 90%, color-mix(in srgb, var(--color-bg-base) 100%, transparent) 0%, transparent 60%),
        radial-gradient(ellipse 60% 60% at 0% 100%, color-mix(in srgb, var(--color-border-default) 80%, transparent) 0%, transparent 50%),
        linear-gradient(135deg, var(--color-bg-sunken) 0%, var(--color-border-muted) 100%);
    }

    .fg-demo__body--light {
      position: relative;
      z-index: 1;
      padding: var(--space-layout-xs) var(--space-component-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-component-md);
    }

    .fg-light-header {
      display: flex;
      flex-direction: column;
      gap: var(--space-component-xs);
    }
    .fg-light-eyebrow {
      font-size: 0.5625rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: var(--color-text-muted);
    }
    .fg-light-price {
      font-family: var(--font-data);
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-text-primary);
      letter-spacing: -0.03em;
    }
    .fg-light-per {
      font-size: 0.875rem;
      font-weight: 400;
      color: var(--color-text-muted);
    }

    .fg-light-desc {
      font-size: 0.8125rem;
      color: var(--color-text-muted);
      line-height: 1.5;
      margin: 0;
    }

    .fg-light-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-component-sm);
    }

    .fg-btn {
      border: none;
      cursor: pointer;
      font-family: var(--font-body);
      font-weight: 600;
      border-radius: var(--radius-pill);
      transition: opacity 200ms;
    }
    .fg-btn:hover { opacity: 0.8; }

    .fg-btn--glass-dark {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      background: color-mix(in srgb, var(--color-text-inverse) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-text-inverse) 15%, transparent);
      color: var(--color-surface-featured-text);
      font-size: 0.8125rem;
      padding: var(--space-component-sm) var(--space-component-lg);
    }
    .fg-btn--ghost-dark {
      background: transparent;
      border: 1px solid color-mix(in srgb, var(--color-text-inverse) 15%, transparent);
      color: var(--color-surface-featured-muted);
      font-size: 0.8125rem;
      padding: var(--space-component-sm) var(--space-component-lg);
    }
    .fg-btn--glass-light {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      background: color-mix(in srgb, var(--color-bg-base) 55%, transparent);
      border: 1px solid var(--color-border-muted);
      color: var(--color-text-primary);
      font-size: 0.9375rem;
      padding: var(--space-component-md) var(--space-layout-sm);
      width: 100%;
    }
    .fg-btn--link-light {
      background: transparent;
      border: none;
      color: var(--color-text-muted);
      font-size: 0.8125rem;
      padding: var(--space-component-sm) 0;
      text-decoration: underline;
      text-underline-offset: 3px;
      width: 100%;
      text-align: center;
    }
    .fg-btn--dark-solid {
      background: var(--color-surface-featured);
      color: var(--color-surface-featured-text);
      font-size: 0.875rem;
      padding: var(--space-component-md) var(--space-component-lg);
      border-radius: var(--radius-pill);
      border: none;
    }
    .fg-btn--ghost-light {
      background: transparent;
      border: 1px solid var(--color-border-default);
      color: var(--color-text-muted);
      font-size: 0.875rem;
      padding: var(--space-component-md) var(--space-component-lg);
      border-radius: var(--radius-pill);
    }

    .fg-modal-host {
      position: relative;
      height: 280px;
      border-radius: var(--radius-surface);
      overflow: hidden;
      background: var(--color-bg-base);
    }
    .fg-modal-bg {
      position: absolute;
      inset: 0;
      padding: var(--space-layout-xs);
      display: flex;
      flex-direction: column;
      gap: var(--space-component-sm);
    }
    .fg-modal-bg__card {
      background: var(--color-bg-surface);
      border-radius: var(--radius-surface);
      height: 60px;
      box-shadow: var(--elevation-raised);
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
      background: color-mix(in srgb, var(--color-bg-base) 60%, transparent);
    }
    .fg-modal {
      background: var(--color-bg-surface);
      border-radius: var(--radius-surface);
      box-shadow: var(--elevation-float);
      width: calc(100% - var(--space-layout-sm));
      overflow: hidden;
    }
    .fg-modal__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-layout-xs) var(--space-component-lg) var(--space-component-md);
      border-bottom: 1px solid var(--color-border-muted);
    }
    .fg-modal__title {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }
    .fg-modal__close {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.75rem;
      color: var(--color-text-muted);
      padding: 0;
    }
    .fg-modal__body {
      padding: var(--space-component-md) var(--space-component-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-component-sm);
    }
    .fg-modal__row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .fg-modal__label {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }
    .fg-modal__val {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }
    .fg-modal__val--mono {
      font-family: var(--font-data);
      font-size: 0.75rem;
    }
    .fg-modal__footer {
      display: flex;
      gap: var(--space-component-sm);
      padding: var(--space-component-md) var(--space-component-lg);
      border-top: 1px solid var(--color-border-muted);
    }

    .fg-compare__card--light {
      background: var(--color-bg-surface);
      border-radius: var(--radius-surface);
      overflow: hidden;
      position: relative;
      height: 120px;
      box-shadow: var(--elevation-raised);
    }
    .fg-compare__light-illus {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 70% at 90% 90%, var(--color-border-muted) 0%, transparent 60%),
        radial-gradient(ellipse 50% 50% at 10% 100%, var(--color-border-default) 0%, transparent 55%);
    }
    .fg-compare__content--light {
      position: relative;
      z-index: 1;
      padding: var(--space-component-md);
    }
    .fg-compare__eyebrow--light {
      font-size: 0.5rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--color-text-muted);
      display: block;
      margin-bottom: var(--space-component-sm);
    }
    .fg-compare__panel--flat-light {
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border-muted);
      border-radius: var(--radius-component);
      padding: var(--space-component-sm) var(--space-component-md);
      display: inline-block;
    }
    .fg-compare__panel--glass-light {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      background: color-mix(in srgb, var(--color-bg-base) 55%, transparent);
      border: 1px solid var(--color-border-muted);
      border-radius: var(--radius-component);
      padding: var(--space-component-sm) var(--space-component-md);
      display: inline-block;
    }
    .fg-compare__val--light {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .fg-rules {
      background: var(--color-bg-surface);
      border-radius: var(--radius-surface);
      box-shadow: var(--elevation-raised);
      padding: var(--space-layout-sm);
    }
    .fg-rules__title {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-text-muted);
      margin-bottom: var(--space-layout-xs);
    }
    .fg-rules__grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-component-md);
    }
    .fg-rule {
      display: flex;
      gap: var(--space-component-md);
      align-items: flex-start;
      padding: var(--space-component-md);
      border-radius: var(--radius-component);
      background: var(--color-bg-sunken);
    }
    .fg-rule--no { background: var(--color-bg-sunken); }
    .fg-rule__icon {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--color-text-primary);
      flex-shrink: 0;
      margin-top: 1px;
    }
    .fg-rule--no .fg-rule__icon { color: var(--color-text-muted); }
    .fg-rule__label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: var(--space-component-xs);
    }
    .fg-rule--no .fg-rule__label { color: var(--color-text-muted); text-decoration: line-through; }
    .fg-rule__desc {
      font-size: 0.75rem;
      color: var(--color-text-muted);
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
