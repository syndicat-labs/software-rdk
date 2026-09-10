import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/theme/theme.service';
import { ButtonComponent } from '../../shared/components/atoms/button/button.component';

@Component({
  selector: 'rdk-landing',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="landing" [attr.data-variant]="variant()">
      <!-- Hero -->
      <section class="landing__hero">
        <div class="landing__hero-inner">
          <span class="landing__eyebrow">Rapid Development Kit</span>
          <h1 class="landing__title">Build enterprise Angular apps — without rebuilding the foundation</h1>
          <p class="landing__sub">
            Auth, error taxonomy, HTTP, logging, token contract and 32-component library pre-wired.
            Clone, theme, ship.
          </p>
          <div class="landing__cta-row">
            <rdk-button variant="primary" size="lg" routerLink="/login">Get started</rdk-button>
            <rdk-button variant="secondary" size="lg" routerLink="/showcase">Browse components</rdk-button>
          </div>
          <div class="landing__hero-meta">
            <span class="landing__meta-item">Angular 21 • PrimeNG 21 • Signals</span>
            <span class="landing__meta-dot" aria-hidden="true">·</span>
            <span class="landing__meta-item">MIT licensed</span>
          </div>
        </div>
      </section>

      <!-- Social proof -->
      <section class="landing__section landing__section--proof">
        <p class="landing__proof-label">Trusted as a starting point for</p>
        <div class="landing__proof-logos" aria-label="Social proof">
          <span class="landing__proof-logo">Atlas Freight</span>
          <span class="landing__proof-logo">Northwind</span>
          <span class="landing__proof-logo">Harbour &amp; Howe</span>
          <span class="landing__proof-logo">Stellar Supply</span>
        </div>
      </section>

      <!-- Feature grid -->
      <section class="landing__section">
        <h2 class="landing__section-title">Everything you re-solve every time — solved once</h2>
        <div class="landing__grid">
          <article class="landing__card">
            <h3 class="landing__card-title">Auth &amp; RBAC</h3>
            <p class="landing__card-body">JWT, refresh, guard, HasPermission — wired to a dev mock, swappable to HttpOnly cookies.</p>
          </article>
          <article class="landing__card">
            <h3 class="landing__card-title">Error taxonomy first</h3>
            <p class="landing__card-body">Typed AppError + ErrorCode; every throw, every Observable error path uses it.</p>
          </article>
          <article class="landing__card">
            <h3 class="landing__card-title">Design-token contract</h3>
            <p class="landing__card-body">90 semantic tokens, 3 themes, namespace isolation, contrast floor — enforced by lint:rules.</p>
          </article>
          <article class="landing__card">
            <h3 class="landing__card-title">32 components</h3>
            <p class="landing__card-body">Atoms → molecules → organisms, OnPush, a11y-first, showcase as living spec.</p>
          </article>
          <article class="landing__card">
            <h3 class="landing__card-title">HTTP layer</h3>
            <p class="landing__card-body">ApiClient + 4 functional interceptors (requestId, auth, error, retry with Retry-After).</p>
          </article>
          <article class="landing__card">
            <h3 class="landing__card-title">Dashboard that moves</h3>
            <p class="landing__card-body">Drag-drop KPIs, 12-col, local + backend persistence, per-language thesis.</p>
          </article>
        </div>
      </section>

      <!-- Deep dive -->
      <section class="landing__section landing__section--deep">
        <div class="landing__deep-inner">
          <div class="landing__deep-copy">
            <h2 class="landing__section-title">Design language, not just theme</h2>
            <p class="landing__body">
              Obsidian, Modern and theEvolute share the same 90-token contract but carry different philosophies —
              restraint, convention, and elevation. Swapping a language is a single <code>data-theme</code> change, no component code changes.
            </p>
            <ul class="landing__list">
              <li>Token contract v1.1.0 — every component reads only <code>--color-*</code> / <code>--space-*</code> / <code>--elevation-*</code></li>
              <li>18-slot protocol — philosophy schema, not skin</li>
              <li>Contrast floor WCAG 2.2 AA enforced</li>
            </ul>
          </div>
          <div class="landing__deep-visual" aria-hidden="true">
            <div class="landing__swatch landing__swatch--brand"></div>
            <div class="landing__swatch landing__swatch--surface"></div>
            <div class="landing__swatch landing__swatch--elevation"></div>
          </div>
        </div>
      </section>

      <!-- Pricing -->
      <section class="landing__section">
        <h2 class="landing__section-title">Clone and own — no per-seat, no per-component</h2>
        <div class="landing__pricing">
          <article class="landing__price-card">
            <h3 class="landing__price-title">RDK</h3>
            <p class="landing__price-value">MIT</p>
            <p class="landing__price-desc">Clone, theme, ship. No telemetry, no lock-in.</p>
            <rdk-button variant="primary" [fullWidth]="true" routerLink="/login">Start building</rdk-button>
            <ul class="landing__price-list">
              <li>Auth + dashboard + landing + showcase</li>
              <li>Token contract + 3 languages</li>
              <li>CI with 8 gates</li>
            </ul>
          </article>
          <article class="landing__price-card landing__price-card--featured">
            <span class="landing__price-badge">For teams</span>
            <h3 class="landing__price-title">Your product</h3>
            <p class="landing__price-value">Yours</p>
            <p class="landing__price-desc">The RDK is the starting point. Your domain is the product.</p>
            <rdk-button variant="primary" [fullWidth]="true" routerLink="/showcase">Explore the system</rdk-button>
            <ul class="landing__price-list">
              <li>Bring your API — <code>apiBaseUrl</code> in one place</li>
              <li>Per-widget layout, per-user persistence</li>
              <li>Design language protocol for your brand</li>
            </ul>
          </article>
        </div>
      </section>

      <!-- CTA -->
      <section class="landing__cta">
        <h2 class="landing__cta-title">Ready to stop rebuilding the foundation?</h2>
        <p class="landing__cta-body">One clone, 90 tokens, 32 components, 736 tests — and a dashboard that moves.</p>
        <rdk-button variant="primary" size="lg" routerLink="/login">Sign in and see the dashboard</rdk-button>
      </section>

      <!-- Footer -->
      <footer class="landing__footer">
        <span class="landing__footer-brand">RDK</span>
        <span class="landing__footer-meta">MIT • Angular 21 • PrimeNG 21 • <a routerLink="/showcase">Showcase</a></span>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background: var(--color-bg-base);
        color: var(--color-text-primary);
      }

      .landing {
        display: block;
      }

      /* Hero — per-language rhythm via data-variant */
      .landing__hero {
        padding: var(--space-layout-lg) var(--space-layout-md);
        background: var(--color-bg-base);
        border-bottom: 1px solid var(--color-border-muted);
      }

      .landing[data-variant='obsidian'] .landing__hero {
        background: var(--color-surface-featured);
        color: var(--color-surface-featured-text);
      }

      .landing[data-variant='evolute'] .landing__hero {
        background: var(--color-bg-sunken);
      }

      .landing__hero-inner {
        max-width: 64rem;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: var(--space-component-md);
      }

      .landing__eyebrow {
        font-family: var(--font-data);
        font-size: 0.6875rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--color-text-brand);
      }

      .landing[data-variant='obsidian'] .landing__eyebrow {
        color: var(--color-surface-featured-muted);
      }

      .landing__title {
        margin: 0;
        font-family: var(--font-display);
        font-size: clamp(2rem, 4vw, 3rem);
        line-height: 1.05;
        letter-spacing: -0.02em;
        max-width: 20ch;
      }

      .landing__sub {
        margin: 0;
        color: var(--color-text-secondary);
        font-size: 1.0625rem;
        line-height: 1.6;
        max-width: 40ch;
      }

      .landing[data-variant='obsidian'] .landing__sub {
        color: var(--color-surface-featured-muted);
      }

      .landing__cta-row {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-component-sm);
        margin-top: var(--space-component-sm);
      }

      .landing__hero-meta {
        display: flex;
        gap: var(--space-component-sm);
        align-items: center;
        color: var(--color-text-muted);
        font-size: 0.75rem;
        font-family: var(--font-data);
      }

      .landing__meta-dot {
        color: var(--color-text-muted);
      }

      /* Sections */
      .landing__section {
        padding: var(--space-layout-lg) var(--space-layout-md);
        max-width: 64rem;
        margin: 0 auto;
      }

      .landing__section--proof {
        text-align: center;
        padding-bottom: var(--space-layout-md);
      }

      .landing__proof-label {
        margin: 0 0 var(--space-component-md);
        color: var(--color-text-muted);
        font-size: 0.6875rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-family: var(--font-data);
      }

      .landing__proof-logos {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-layout-md);
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        font-weight: 600;
        letter-spacing: -0.01em;
      }

      .landing__section-title {
        margin: 0 0 var(--space-component-lg);
        font-family: var(--font-heading);
        font-size: 1.5rem;
        line-height: 1.15;
        letter-spacing: -0.01em;
      }

      .landing__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
        gap: var(--space-layout-sm);
      }

      .landing__card {
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        box-shadow: var(--elevation-raised);
        padding: var(--space-component-lg);
        display: flex;
        flex-direction: column;
        gap: var(--space-component-sm);
      }

      .landing[data-variant='evolute'] .landing__card {
        box-shadow: var(--elevation-float);
      }

      .landing__card-title {
        margin: 0;
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: -0.01em;
      }

      .landing__card-body {
        margin: 0;
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        line-height: 1.6;
      }

      /* Deep dive */
      .landing__section--deep {
        background: var(--color-bg-sunken);
        max-width: none;
      }

      .landing__deep-inner {
        max-width: 64rem;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: var(--space-layout-lg);
        align-items: center;
      }

      @media (max-width: 800px) {
        .landing__deep-inner {
          grid-template-columns: 1fr;
        }
      }

      .landing__body {
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin: 0 0 var(--space-component-md);
      }

      .landing__list {
        margin: 0;
        padding-left: 1.25rem;
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        line-height: 1.8;
      }

      .landing__list code {
        font-family: var(--font-data);
        font-size: 0.8125rem;
        background: var(--color-bg-surface);
        padding: 0.125rem 0.25rem;
        border-radius: var(--radius-component);
        border: 1px solid var(--color-border-muted);
      }

      .landing__deep-visual {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-component-sm);
      }

      .landing__swatch {
        height: 6rem;
        border-radius: var(--radius-surface);
        border: 1px solid var(--color-border-default);
      }

      .landing__swatch--brand {
        background: var(--color-bg-brand);
      }

      .landing__swatch--surface {
        background: var(--color-bg-surface);
        box-shadow: var(--elevation-raised);
      }

      .landing__swatch--elevation {
        background: var(--color-bg-elevated);
        box-shadow: var(--elevation-overlay);
      }

      /* Pricing */
      .landing__pricing {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
        gap: var(--space-layout-sm);
        align-items: stretch;
      }

      .landing__price-card {
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        box-shadow: var(--elevation-raised);
        padding: var(--space-layout-md);
        display: flex;
        flex-direction: column;
        gap: var(--space-component-sm);
      }

      .landing__price-card--featured {
        border-color: var(--color-border-brand);
        box-shadow: var(--elevation-float);
      }

      .landing__price-badge {
        align-self: flex-start;
        background: var(--color-bg-brand);
        color: var(--color-text-inverse);
        font-size: 0.6875rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        padding: 0.125rem 0.5rem;
        border-radius: var(--radius-pill);
      }

      .landing__price-title {
        margin: 0;
        font-size: 1rem;
        font-weight: 700;
      }

      .landing__price-value {
        margin: 0;
        font-family: var(--font-data);
        font-size: 2rem;
        line-height: 1;
        color: var(--color-text-primary);
      }

      .landing__price-desc {
        margin: 0;
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        line-height: 1.5;
      }

      .landing__price-list {
        margin: var(--space-component-sm) 0 0;
        padding-left: 1.25rem;
        color: var(--color-text-secondary);
        font-size: 0.8125rem;
        line-height: 1.8;
      }

      .landing__price-list code {
        font-family: var(--font-data);
        font-size: 0.75rem;
        background: var(--color-bg-sunken);
        padding: 0.125rem 0.25rem;
        border-radius: var(--radius-component);
      }

      /* CTA */
      .landing__cta {
        padding: var(--space-layout-lg) var(--space-layout-md);
        background: var(--color-surface-featured);
        color: var(--color-surface-featured-text);
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: var(--space-component-md);
        align-items: center;
      }

      .landing__cta-title {
        margin: 0;
        font-family: var(--font-heading);
        font-size: 1.75rem;
        max-width: 20ch;
      }

      .landing__cta-body {
        margin: 0;
        color: var(--color-surface-featured-muted);
        max-width: 40ch;
        line-height: 1.6;
      }

      /* Footer */
      .landing__footer {
        display: flex;
        justify-content: space-between;
        gap: var(--space-component-md);
        padding: var(--space-component-lg) var(--space-layout-md);
        border-top: 1px solid var(--color-border-muted);
        color: var(--color-text-muted);
        font-size: 0.75rem;
        font-family: var(--font-data);
        flex-wrap: wrap;
      }

      .landing__footer-brand {
        font-weight: 700;
        color: var(--color-text-primary);
        letter-spacing: -0.01em;
      }

      .landing__footer a {
        color: var(--color-text-brand);
        text-decoration: none;
      }

      .landing__footer a:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
      }
    `,
  ],
})
export class LandingComponent {
  private readonly theme = inject(ThemeService);
  protected readonly variant = computed(() => this.theme.current());
}
