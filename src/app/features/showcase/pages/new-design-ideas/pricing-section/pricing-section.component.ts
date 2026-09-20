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
            <rect x="60" y="20" width="80" height="100" rx="2" stroke="var(--color-border-default)" stroke-width="1.5"/>
            <rect x="75" y="35" width="50" height="4" rx="1" fill="var(--color-border-muted)"/>
            <rect x="75" y="45" width="38" height="3" rx="1" fill="var(--color-border-muted)"/>
            <rect x="75" y="54" width="44" height="3" rx="1" fill="var(--color-border-muted)"/>
            <circle cx="150" cy="110" r="28" stroke="var(--color-border-default)" stroke-width="1.5"/>
            <circle cx="150" cy="110" r="18" stroke="var(--color-border-muted)" stroke-width="1"/>
            <line x1="30" y1="60" x2="62" y2="60" stroke="var(--color-border-default)" stroke-width="1.5"/>
            <line x1="30" y1="70" x2="55" y2="70" stroke="var(--color-border-default)" stroke-width="1"/>
            <line x1="30" y1="80" x2="58" y2="80" stroke="var(--color-border-default)" stroke-width="1"/>
            <polygon points="170,130 195,165 145,165" stroke="var(--color-border-default)" stroke-width="1.5" fill="none"/>
            <rect x="100" y="130" width="30" height="40" rx="1" stroke="var(--color-border-default)" stroke-width="1.5" fill="none"/>
            <line x1="60" y1="120" x2="200" y2="120" stroke="var(--color-border-muted)" stroke-width="1"/>
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
                <stop offset="0%" stop-color="var(--color-bg-danger)"/>
                <stop offset="50%" stop-color="var(--color-text-danger)"/>
                <stop offset="100%" stop-color="var(--color-text-brand)"/>
              </linearGradient>
              <linearGradient id="band2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="var(--color-text-brand)"/>
                <stop offset="100%" stop-color="var(--color-bg-warning)"/>
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
    .pricing {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr) minmax(0, 1.15fr);
      gap: var(--space-component-lg) var(--space-layout-sm);
      align-items: start;
      font-family: var(--font-body);
      padding: var(--space-layout-md) var(--space-layout-sm);
      background: var(--color-bg-base);
      min-height: 100%;
      box-sizing: border-box;
    }

    .pricing__copy {
      padding-top: var(--space-component-sm);
    }

    .pricing__heading {
      margin: 0 0 var(--space-component-md);
      font-size: 3rem;
      font-weight: 800;
      color: var(--color-text-primary);
      line-height: 1;
      letter-spacing: -0.02em;
      font-family: var(--font-heading);
    }

    .pricing__subtext {
      margin: 0;
      font-size: 0.9375rem;
      color: var(--color-text-secondary);
      line-height: 1.5;
    }

    .pricing__rule {
      border: none;
      border-top: 1px solid var(--color-border-default);
      margin: var(--space-layout-sm) 0 var(--space-layout-sm);
    }

    .pricing__tagline {
      margin: 0 0 var(--space-component-sm);
      font-size: 0.9375rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .pricing__body {
      margin: 0;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
    }

    .pricing-card {
      border-radius: var(--radius-surface);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
      min-height: 500px;
    }

    .pricing-card--light {
      background: var(--color-bg-surface);
      box-shadow: var(--elevation-raised);
    }

    .pricing-card--dark {
      background: var(--color-surface-featured);
      box-shadow: var(--elevation-float);
    }

    .pricing-card__content {
      padding: var(--space-layout-sm) var(--space-layout-sm) 0;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .pricing-card__header {
      display: flex;
      flex-direction: column;
      gap: var(--space-component-xs);
      margin-bottom: var(--space-layout-sm);
    }

    .pricing-card__plan {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-text-primary);
      letter-spacing: -0.01em;
    }

    .pricing-card--dark .pricing-card__plan {
      color: var(--color-surface-featured-text);
    }

    .pricing-card__subtitle {
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }

    .pricing-card__subtitle--dark {
      color: var(--color-surface-featured-muted);
    }

    .pricing-card__price {
      display: flex;
      align-items: baseline;
      gap: var(--space-component-xs);
      margin-bottom: var(--space-layout-sm);
    }

    .pricing-card__amount {
      font-size: 2.875rem;
      font-weight: 800;
      color: var(--color-text-primary);
      letter-spacing: -0.03em;
      line-height: 1;
      font-family: var(--font-data);
    }

    .pricing-card--dark .pricing-card__amount {
      color: var(--color-surface-featured-text);
    }

    .pricing-card__period {
      font-size: 1rem;
      font-weight: 400;
      color: var(--color-surface-featured-muted);
    }

    .pricing-card__features {
      list-style: none;
      margin: 0 0 var(--space-layout-sm);
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-component-md);
    }

    .pricing-card__feature {
      display: flex;
      align-items: baseline;
      gap: var(--space-component-md);
    }

    .pricing-card__check {
      font-size: 0.75rem;
      color: var(--color-text-primary);
      flex-shrink: 0;
      line-height: 1.6;
    }

    .pricing-card__check--dark {
      color: var(--color-surface-featured-muted);
    }

    .pricing-card__feature-text {
      font-size: 0.875rem;
      color: var(--color-text-primary);
      display: flex;
      align-items: center;
      gap: var(--space-component-xs);
      flex-wrap: wrap;
      line-height: 1.5;
    }

    .pricing-card__feature-text--dark {
      color: var(--color-surface-featured-text);
    }

    .pricing-card__annotation {
      font-size: 0.75rem;
      color: var(--color-text-muted);
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

    .pricing-card__badge {
      display: inline-flex;
      align-items: center;
      background: var(--color-surface-featured);
      color: var(--color-surface-featured-text);
      border: 1px solid var(--color-surface-featured-border);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      padding: var(--space-component-xs) var(--space-component-md);
      border-radius: var(--radius-pill);
      margin-bottom: var(--space-component-lg);
    }

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

    .pricing-card__footer {
      padding: 0 var(--space-layout-sm) var(--space-layout-sm);
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .pricing-card__cta {
      width: 100%;
      height: 48px;
      border-radius: var(--radius-pill);
      border: none;
      font-family: var(--font-body);
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s ease;
      &:hover { opacity: 0.88; }
    }

    .pricing-card__cta--frosted {
      background: color-mix(in srgb, var(--color-bg-base) 55%, transparent);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border-muted);
    }

    .pricing-card__cta--primary {
      background: var(--color-bg-surface);
      color: var(--color-text-primary);
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
