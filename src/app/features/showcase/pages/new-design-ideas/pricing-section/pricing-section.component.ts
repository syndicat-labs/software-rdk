import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Feature {
  readonly text: string;
  readonly annotation?: string;
  readonly icon?: string;
}

@Component({
  selector: 'rdk-pricing-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pricing">

      <!-- Left copy block -->
      <div class="pricing__copy">
        <h1 class="pricing__heading">Pricing</h1>
        <p class="pricing__subtext">No hidden fees, just transparent pricing for exceptional design.</p>

        <hr class="pricing__rule" />

        <p class="pricing__tagline">This isn't a design assembly line</p>
        <p class="pricing__body">
          We maintain quality by taking on select clients who value our craft and collaborative approach
        </p>
      </div>

      <!-- White card: Custom Project -->
      <div class="pricing-card pricing-card--light">
        <div class="pricing-card__content">
          <div class="pricing-card__header">
            <span class="pricing-card__plan">Custom Project</span>
            <span class="pricing-card__subtitle">Clear scope, exceptional results</span>
          </div>

          <div class="pricing-card__price">
            <span class="pricing-card__amount">$4500+</span>
          </div>

          <ul class="pricing-card__features">
            @for (feature of lightFeatures; track feature.text) {
              <li class="pricing-card__feature">
                <span class="pricing-card__check">&#10003;</span>
                <span class="pricing-card__feature-text">
                  {{ feature.text }}
                  @if (feature.annotation) {
                    <span class="pricing-card__annotation"> {{ feature.annotation }}</span>
                  }
                </span>
              </li>
            }
          </ul>
        </div>

        <div class="pricing-card__illustration pricing-card__illustration--light" aria-hidden="true">
          <svg viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg" class="pricing-card__illustration-svg">
            <rect x="60" y="20" width="80" height="100" rx="2" stroke="#C8C8C8" stroke-width="1.5"/>
            <rect x="75" y="35" width="50" height="4" rx="1" fill="#DCDCDC"/>
            <rect x="75" y="45" width="38" height="3" rx="1" fill="#E4E4E4"/>
            <rect x="75" y="54" width="44" height="3" rx="1" fill="#E4E4E4"/>
            <circle cx="150" cy="110" r="28" stroke="#D0D0D0" stroke-width="1.5"/>
            <circle cx="150" cy="110" r="18" stroke="#DCDCDC" stroke-width="1"/>
            <line x1="30" y1="60" x2="62" y2="60" stroke="#D8D8D8" stroke-width="1.5"/>
            <line x1="30" y1="70" x2="55" y2="70" stroke="#E0E0E0" stroke-width="1"/>
            <line x1="30" y1="80" x2="58" y2="80" stroke="#E0E0E0" stroke-width="1"/>
            <polygon points="170,130 195,165 145,165" stroke="#CCCCCC" stroke-width="1.5" fill="none"/>
            <rect x="100" y="130" width="30" height="40" rx="1" stroke="#D4D4D4" stroke-width="1.5" fill="none"/>
            <line x1="60" y1="120" x2="200" y2="120" stroke="#E8E8E8" stroke-width="1"/>
          </svg>
        </div>

        <div class="pricing-card__footer">
          <button type="button" class="pricing-card__cta pricing-card__cta--frosted">
            Book a Call
          </button>
        </div>
      </div>

      <!-- Dark card: Retainer Plan -->
      <div class="pricing-card pricing-card--dark">
        <div class="pricing-card__content">
          <div class="pricing-card__header">
            <span class="pricing-card__plan">Retainer Plan</span>
            <span class="pricing-card__subtitle pricing-card__subtitle--dark">Priority service, unlimited revisions.</span>
          </div>

          <div class="pricing-card__price">
            <span class="pricing-card__amount">$3987</span>
            <span class="pricing-card__period">/mo</span>
          </div>

          <ul class="pricing-card__features">
            @for (feature of darkFeatures; track feature.text) {
              <li class="pricing-card__feature pricing-card__feature--dark">
                <span class="pricing-card__check pricing-card__check--dark">&#10003;</span>
                <span class="pricing-card__feature-text pricing-card__feature-text--dark">
                  {{ feature.text }}
                  @if (feature.icon) {
                    <img
                      class="pricing-card__brand-icon"
                      [src]="'icons/' + feature.icon + '.svg'"
                      [alt]="feature.icon"
                    />
                  }
                </span>
              </li>
            }
          </ul>

          <span class="pricing-card__badge">Limited spots</span>
        </div>

        <div class="pricing-card__illustration pricing-card__illustration--dark" aria-hidden="true">
          <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="pricing-card__illustration-svg">
            <defs>
              <linearGradient id="band1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FF4400"/>
                <stop offset="50%" stop-color="#CC1100"/>
                <stop offset="100%" stop-color="#0033CC"/>
              </linearGradient>
              <linearGradient id="band2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#0066FF"/>
                <stop offset="100%" stop-color="#FF6600"/>
              </linearGradient>
            </defs>
            <path d="M80,20 Q160,0 200,80 Q240,160 160,180 Q80,200 40,120 Q0,40 80,20 Z" fill="url(#band1)" opacity="0.85"/>
            <path d="M120,40 Q200,20 220,100 Q240,180 160,190 Q80,200 60,130 Q20,60 120,40 Z" fill="url(#band2)" opacity="0.6"/>
            <ellipse cx="160" cy="120" rx="70" ry="50" fill="url(#band1)" opacity="0.4" transform="rotate(-20 160 120)"/>
          </svg>
        </div>

        <div class="pricing-card__footer">
          <button type="button" class="pricing-card__cta pricing-card__cta--primary">
            Get started now
          </button>
        </div>
      </div>

    </section>
  `,
  styles: [`
    // ── Layout ────────────────────────────────────────────────────────────────────
    .pricing {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr) minmax(0, 1.15fr);
      gap: 1.25rem 1.5rem;
      align-items: start;
      font-family: 'Inter', sans-serif;
      padding: 3rem 2rem;
      background: #EBEBEB;
      min-height: 100%;
      box-sizing: border-box;
    }

    // ── Left copy ─────────────────────────────────────────────────────────────────
    .pricing__copy {
      padding-top: 0.5rem;
    }

    .pricing__heading {
      margin: 0 0 0.75rem;
      font-size: 3rem;
      font-weight: 800;
      color: #111111;
      line-height: 1;
      letter-spacing: -0.02em;
    }

    .pricing__subtext {
      margin: 0;
      font-size: 0.9375rem;
      color: #4A4A4A;
      line-height: 1.5;
    }

    .pricing__rule {
      border: none;
      border-top: 1px solid #CCCCCC;
      margin: 2.5rem 0 1.5rem;
    }

    .pricing__tagline {
      margin: 0 0 0.5rem;
      font-size: 0.9375rem;
      font-weight: 700;
      color: #111111;
    }

    .pricing__body {
      margin: 0;
      font-size: 0.875rem;
      color: #5A5A5A;
      line-height: 1.6;
    }

    // ── Card shared ───────────────────────────────────────────────────────────────
    .pricing-card {
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
      min-height: 500px;
    }

    .pricing-card--light {
      background: #FFFFFF;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    }

    .pricing-card--dark {
      background: #111111;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.22);
    }

    .pricing-card__content {
      padding: 2rem 2rem 0;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    // ── Card header ───────────────────────────────────────────────────────────────
    .pricing-card__header {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 1.5rem;
    }

    .pricing-card__plan {
      font-size: 1.125rem;
      font-weight: 700;
      color: #111111;
      letter-spacing: -0.01em;
    }

    .pricing-card--dark .pricing-card__plan {
      color: #FFFFFF;
    }

    .pricing-card__subtitle {
      font-size: 0.875rem;
      color: #6B6B6B;
    }

    .pricing-card__subtitle--dark {
      color: #AAAAAA;
    }

    // ── Price ─────────────────────────────────────────────────────────────────────
    .pricing-card__price {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
      margin-bottom: 1.5rem;
    }

    .pricing-card__amount {
      font-size: 2.875rem;
      font-weight: 800;
      color: #111111;
      letter-spacing: -0.03em;
      line-height: 1;
    }

    .pricing-card--dark .pricing-card__amount {
      color: #FFFFFF;
    }

    .pricing-card__period {
      font-size: 1rem;
      font-weight: 400;
      color: #AAAAAA;
    }

    // ── Feature list ──────────────────────────────────────────────────────────────
    .pricing-card__features {
      list-style: none;
      margin: 0 0 1.5rem;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }

    .pricing-card__feature {
      display: flex;
      align-items: baseline;
      gap: 0.625rem;
    }

    .pricing-card__check {
      font-size: 0.75rem;
      color: #222222;
      flex-shrink: 0;
      line-height: 1.6;
    }

    .pricing-card__check--dark {
      color: #CCCCCC;
    }

    .pricing-card__feature-text {
      font-size: 0.875rem;
      color: #2A2A2A;
      display: flex;
      align-items: center;
      gap: 0.375rem;
      flex-wrap: wrap;
      line-height: 1.5;
    }

    .pricing-card__feature-text--dark {
      color: #DDDDDD;
    }

    .pricing-card__annotation {
      font-size: 0.75rem;
      color: #888888;
    }

    .pricing-card__brand-icon {
      width: 14px;
      height: 14px;
      display: inline-block;
      vertical-align: middle;
      filter: brightness(0) invert(1);
      opacity: 0.7;
      flex-shrink: 0;
    }

    // ── Badge ─────────────────────────────────────────────────────────────────────
    .pricing-card__badge {
      display: inline-flex;
      align-items: center;
      background: #2E2E2E;
      color: #EEEEEE;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      margin-bottom: 1.25rem;
    }

    // ── Illustration ──────────────────────────────────────────────────────────────
    .pricing-card__illustration {
      flex: 1;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      overflow: hidden;
      position: relative;
    }

    .pricing-card__illustration-svg {
      width: 100%;
      max-width: 260px;
      height: auto;
      display: block;
    }

    // ── CTA footer ────────────────────────────────────────────────────────────────
    .pricing-card__footer {
      padding: 0 2rem 2rem;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .pricing-card__cta {
      width: 100%;
      height: 48px;
      border-radius: 9999px;
      border: none;
      font-family: 'Inter', sans-serif;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s ease;

      &:hover { opacity: 0.88; }
    }

    .pricing-card__cta--frosted {
      background: rgba(235, 235, 235, 0.55);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: #111111;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .pricing-card__cta--primary {
      background: #FFFFFF;
      color: #111111;
    }
  `],
})
export class PricingSectionComponent {
  protected readonly lightFeatures: Feature[] = [
    { text: 'Expert design service', annotation: '(branding, web, and product)' },
    { text: 'Fixed project scope and timeline' },
    { text: 'Dedicated Slack channel' },
    { text: 'Framer development' },
    { text: 'No meetings' },
  ];

  protected readonly darkFeatures: Feature[] = [
    { text: 'Dedicated Senior Designer' },
    { text: 'Quick delivery & Daily updates' },
    { text: 'Unlimited design revisions' },
    { text: 'Dedicated Slack channel', icon: 'slack' },
    { text: 'Framer development', icon: 'framer' },
    { text: 'Cancel/pause anytime' },
    { text: 'No meetings' },
  ];
}
