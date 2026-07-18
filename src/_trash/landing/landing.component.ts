import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';
import { ThemeToggleComponent } from '../../shared/components/atoms/theme-toggle/theme-toggle.component';

interface Feature {
  readonly icon: string;
  readonly title: string;
  readonly body: string;
  readonly accent: string;
}

interface Stat {
  readonly value: string;
  readonly label: string;
  readonly icon: string;
}

const FEATURES: Feature[] = [
  {
    icon: 'pi-bolt',
    title: 'Zero to productive',
    body: 'Auth, HTTP interceptors, error taxonomy, form utilities, and a full layout shell — all wired and tested before you write a single business-logic line.',
    accent: '#6366f1',
  },
  {
    icon: 'pi-shield',
    title: 'Security by default',
    body: 'Zero-trust interceptors, JWT lifecycle management, RBAC structural directives, XSS-safe pipes, and input sanitisation at every boundary.',
    accent: '#8b5cf6',
  },
  {
    icon: 'pi-check-circle',
    title: '214 tests, zero debt',
    body: '100% coverage on core and shared layers. Error paths tested first. Integration tests against real dependencies. Ship with confidence from day one.',
    accent: '#ec4899',
  },
];

const STATS: Stat[] = [
  { value: '214',  label: 'Tests passing', icon: 'pi-check' },
  { value: '100%', label: 'Core coverage', icon: 'pi-chart-bar' },
  { value: '154',  label: 'KB gzipped',    icon: 'pi-arrow-down' },
  { value: '4',    label: 'Interceptors',  icon: 'pi-sliders-h' },
];

@Component({
  selector: 'rdk-landing',
  standalone: true,
  imports: [RouterLink, NgClass, ThemeToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="landing">

      <!-- ── Background layer ─────────────────────────────────────────────── -->
      <div class="landing__bg" aria-hidden="true">
        <div class="landing__orb landing__orb--1"></div>
        <div class="landing__orb landing__orb--2"></div>
        <div class="landing__orb landing__orb--3"></div>
        <div class="landing__grid"></div>
      </div>

      <!-- ── Header ───────────────────────────────────────────────────────── -->
      <header class="landing__header">
        <div class="landing__header-inner">
          <div class="landing__logo">
            <span class="landing__logo-mark">⬡</span>
            <span class="landing__logo-text gradient-text">RDK</span>
          </div>
          <nav class="landing__nav" aria-label="Main navigation">
            <a href="#features" class="landing__nav-link">Features</a>
            <a href="#stats"    class="landing__nav-link">Stats</a>
          </nav>
          <div class="landing__header-cta">
            <rdk-theme-toggle [dark]="true" />
            <a href="/login" routerLink="/login" class="landing__btn landing__btn--ghost">Sign in</a>
            <a href="/login" routerLink="/login" class="landing__btn landing__btn--primary">Get started</a>
          </div>
        </div>
      </header>

      <!-- ── Hero ─────────────────────────────────────────────────────────── -->
      <section class="landing__hero">
        <div class="landing__hero-inner">
          <div class="landing__eyebrow anim-fade-up" style="animation-delay: 0ms">
            <span class="landing__badge">
              <span class="landing__badge-dot"></span>
              Angular 19 &nbsp;·&nbsp; PrimeNG 17 &nbsp;·&nbsp; Signals
            </span>
          </div>

          <h1 class="landing__headline anim-fade-up" style="animation-delay: 120ms">
            Build something<br />
            <span class="gradient-text">extraordinary.</span>
          </h1>

          <p class="landing__subheadline anim-fade-up" style="animation-delay: 240ms">
            An enterprise Angular starter that ships&nbsp;production&#8209;ready code on day&nbsp;one.
            Auth, HTTP, logging, RBAC, and a full test suite — already done.
          </p>

          <div class="landing__hero-actions anim-fade-up" style="animation-delay: 360ms">
            <a href="/login" routerLink="/login" class="landing__btn landing__btn--primary landing__btn--lg">
              Start building
              <span class="pi pi-arrow-right landing__btn-icon"></span>
            </a>
            <a href="/login?returnUrl=%2Fdashboard" routerLink="/login" [queryParams]="{ returnUrl: '/dashboard' }" class="landing__btn landing__btn--ghost landing__btn--lg">
              View dashboard
            </a>
          </div>
        </div>

        <!-- decorative floating card -->
        <div class="landing__hero-card anim-fade-up" style="animation-delay: 500ms" aria-hidden="true">
          <div class="landing__code-preview">
            <div class="landing__code-bar">
              <span class="landing__code-dot" style="background:#ff5f57"></span>
              <span class="landing__code-dot" style="background:#ffbd2e"></span>
              <span class="landing__code-dot" style="background:#28c840"></span>
              <span class="landing__code-file">auth.interceptor.ts</span>
            </div>
            <pre class="landing__code-body"><span class="token-keyword">export const</span> <span class="token-fn">authInterceptor</span><span class="token-punct">:</span> <span class="token-type">HttpInterceptorFn</span> <span class="token-punct">=</span> <span class="token-punct">(</span>req<span class="token-punct">,</span> next<span class="token-punct">) =&gt;</span> <span class="token-punct">&#123;</span>
  <span class="token-keyword">const</span> token <span class="token-punct">=</span> tokenService<span class="token-punct">.</span><span class="token-fn">getAccessToken</span><span class="token-punct">();</span>
  <span class="token-keyword">if</span> <span class="token-punct">(!</span>token<span class="token-punct">)</span> <span class="token-keyword">return</span> <span class="token-fn">next</span><span class="token-punct">(</span>req<span class="token-punct">);</span>
  <span class="token-keyword">return</span> <span class="token-fn">next</span><span class="token-punct">(</span>req<span class="token-punct">.</span><span class="token-fn">clone</span><span class="token-punct">(&#123;</span>
    setHeaders<span class="token-punct">: &#123;</span> Authorization<span class="token-punct">:</span> <span class="token-string">&#96;Bearer &#36;&#123;token&#125;&#96;</span> <span class="token-punct">&#125;</span>
  <span class="token-punct">&#125;));</span>
<span class="token-punct">&#125;;</span></pre>
          </div>
        </div>
      </section>

      <!-- ── Features ──────────────────────────────────────────────────────── -->
      <section class="landing__section landing__features" id="features">
        <div class="landing__section-inner">
          <h2 class="landing__section-title anim-fade-up" style="animation-delay: 0ms">
            Everything you need. <span class="gradient-text">Nothing you don't.</span>
          </h2>
          <p class="landing__section-sub anim-fade-up" style="animation-delay: 100ms">
            The RDK provides the mandatory scaffolding that every production Angular project requires,
            so your team can focus on building the actual product.
          </p>

          <div class="landing__feature-grid">
            @for (f of features; track f.title; let i = $index) {
              <div class="landing__feature-card anim-card-entrance"
                   [style.animation-delay]="(i * 120) + 'ms'">
                <div class="landing__feature-icon" [style.--accent]="f.accent">
                  <span class="pi" [ngClass]="f.icon"></span>
                </div>
                <h3 class="landing__feature-title">{{ f.title }}</h3>
                <p class="landing__feature-body">{{ f.body }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ── Stats ─────────────────────────────────────────────────────────── -->
      <section class="landing__section landing__stats-section" id="stats">
        <div class="landing__section-inner">
          <div class="landing__stats-grid">
            @for (s of stats; track s.label; let i = $index) {
              <div class="landing__stat anim-card-entrance"
                   [style.animation-delay]="(i * 80) + 'ms'">
                <span class="pi landing__stat-icon" [ngClass]="s.icon"></span>
                <div class="landing__stat-value gradient-text">{{ s.value }}</div>
                <div class="landing__stat-label">{{ s.label }}</div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ── CTA ───────────────────────────────────────────────────────────── -->
      <section class="landing__cta">
        <div class="landing__cta-inner">
          <div class="landing__cta-orb" aria-hidden="true"></div>
          <h2 class="landing__cta-title anim-fade-up">
            Ready to ship faster?
          </h2>
          <p class="landing__cta-sub anim-fade-up" style="animation-delay:120ms">
            Clone the template, configure your API, and start building features in minutes.
          </p>
          <div class="anim-fade-up" style="animation-delay:240ms">
            <a href="/login" routerLink="/login" class="landing__btn landing__btn--white landing__btn--lg">
              Get started now
              <span class="pi pi-arrow-right landing__btn-icon"></span>
            </a>
          </div>
        </div>
      </section>

      <!-- ── Footer ────────────────────────────────────────────────────────── -->
      <footer class="landing__footer">
        <div class="landing__footer-inner">
          <div class="landing__logo">
            <span class="landing__logo-mark">⬡</span>
            <span class="landing__logo-text gradient-text">RDK</span>
          </div>
          <p class="landing__footer-copy">
            Angular Rapid Development Kit &mdash; Enterprise template. MIT licence.
          </p>
        </div>
      </footer>

    </div>
  `,
  styles: [`
    // ── Layout ──────────────────────────────────────────────────────────────────
    .landing {
      position: relative;
      background: var(--dark-bg);
      color: var(--dark-text);
      overflow-x: hidden;
    }

    // ── Background layer ────────────────────────────────────────────────────────
    .landing__bg {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .landing__orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
    }

    .landing__orb--1 {
      width: 700px;
      height: 700px;
      background: radial-gradient(circle at center, rgba(99, 102, 241, 0.5), transparent 70%);
      top: -200px;
      right: -150px;
      animation: orbFloat 12s ease-in-out infinite;
    }

    .landing__orb--2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle at center, rgba(139, 92, 246, 0.4), transparent 70%);
      bottom: 0;
      left: -150px;
      animation: orbFloat 9s ease-in-out infinite;
      animation-delay: -4s;
    }

    .landing__orb--3 {
      width: 350px;
      height: 350px;
      background: radial-gradient(circle at center, rgba(236, 72, 153, 0.3), transparent 70%);
      top: 45%;
      left: 40%;
      animation: orbFloat 14s ease-in-out infinite;
      animation-delay: -8s;
    }

    .landing__grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(99, 102, 241, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99, 102, 241, 0.06) 1px, transparent 1px);
      background-size: 56px 56px;
    }

    // ── All content above the bg ─────────────────────────────────────────────────
    .landing__header,
    .landing__hero,
    .landing__section,
    .landing__cta,
    .landing__footer {
      position: relative;
      z-index: 1;
    }

    // ── Header ──────────────────────────────────────────────────────────────────
    .landing__header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(8, 8, 20, 0.6);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--dark-border);
    }

    .landing__header-inner {
      max-width: 72rem;
      margin: 0 auto;
      padding: 0 2rem;
      height: 4rem;
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .landing__logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      flex-shrink: 0;
    }

    .landing__logo-mark {
      font-size: 1.5rem;
      color: #6366f1;
    }

    .landing__logo-text {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .landing__nav {
      display: flex;
      gap: 1.5rem;
      flex: 1;
    }

    .landing__nav-link {
      color: var(--dark-muted);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.2s;

      &:hover { color: var(--dark-text); }
    }

    .landing__header-cta {
      display: flex;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    // ── Buttons ─────────────────────────────────────────────────────────────────
    .landing__btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
      white-space: nowrap;

      &:hover { transform: translateY(-1px); }
      &:active { transform: translateY(0); }
    }

    .landing__btn--primary {
      background: var(--brand-gradient);
      color: #fff;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);

      &:hover {
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.55);
        opacity: 0.95;
      }
    }

    .landing__btn--ghost {
      background: transparent;
      color: var(--dark-text);
      border: 1px solid var(--dark-border);

      &:hover { border-color: rgba(255, 255, 255, 0.2); background: rgba(255,255,255,0.04); }
    }

    .landing__btn--white {
      background: #fff;
      color: #1e1b4b;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);

      &:hover {
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
        opacity: 0.95;
      }
    }

    .landing__btn--lg {
      padding: 0.875rem 1.75rem;
      font-size: 1rem;
      border-radius: 0.625rem;
    }

    .landing__btn-icon {
      font-size: 0.85em;
      transition: transform 0.2s ease;
    }
    .landing__btn:hover .landing__btn-icon {
      transform: translateX(3px);
    }

    // ── Hero ────────────────────────────────────────────────────────────────────
    .landing__hero {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 4rem;
      max-width: 72rem;
      margin: 0 auto;
      padding: 6rem 2rem 4rem;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .landing__hero-inner {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .landing__eyebrow {
      display: flex;
    }

    .landing__badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.875rem;
      border-radius: 999px;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.25);
      font-size: 0.8rem;
      font-weight: 500;
      color: #a5b4fc;
    }

    .landing__badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #6366f1;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        inset: -3px;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.4);
        animation: pulseRing 2s ease-out infinite;
      }
    }

    .landing__headline {
      font-size: clamp(2.75rem, 5vw, 4.5rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin: 0;
      color: var(--dark-text);
    }

    .landing__subheadline {
      font-size: 1.125rem;
      color: var(--dark-muted);
      line-height: 1.7;
      margin: 0;
      max-width: 38rem;
    }

    .landing__hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    // ── Code preview card ────────────────────────────────────────────────────────
    .landing__hero-card {
      @media (max-width: 900px) { display: none; }
    }

    .landing__code-preview {
      background: rgba(15, 15, 30, 0.9);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 1rem;
      overflow: hidden;
      box-shadow:
        0 0 0 1px rgba(99, 102, 241, 0.1),
        0 32px 80px rgba(0, 0, 0, 0.6),
        0 0 80px rgba(99, 102, 241, 0.15);
      backdrop-filter: blur(4px);
    }

    .landing__code-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .landing__code-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      opacity: 0.8;
    }

    .landing__code-file {
      margin-left: 0.5rem;
      font-size: 0.8rem;
      color: var(--dark-muted);
      font-family: 'SFMono-Regular', 'Cascadia Code', 'Fira Code', monospace;
    }

    .landing__code-body {
      margin: 0;
      padding: 1.5rem;
      font-family: 'SFMono-Regular', 'Cascadia Code', 'Fira Code', monospace;
      font-size: 0.8rem;
      line-height: 1.8;
      white-space: pre;
      overflow: auto;
      color: #e2e8f0;
    }

    .token-keyword { color: #c084fc; }
    .token-fn      { color: #67e8f9; }
    .token-type    { color: #86efac; }
    .token-string  { color: #fde68a; }
    .token-punct   { color: #94a3b8; }

    // ── Section base ────────────────────────────────────────────────────────────
    .landing__section {
      padding: 6rem 2rem;
    }

    .landing__section-inner {
      max-width: 72rem;
      margin: 0 auto;
    }

    .landing__section-title {
      font-size: clamp(1.75rem, 3vw, 2.5rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--dark-text);
      margin: 0 0 1rem;
      text-align: center;
    }

    .landing__section-sub {
      font-size: 1.0625rem;
      color: var(--dark-muted);
      line-height: 1.7;
      text-align: center;
      max-width: 46rem;
      margin: 0 auto 3.5rem;
    }

    // ── Features ────────────────────────────────────────────────────────────────
    .landing__features {
      background: rgba(255, 255, 255, 0.015);
      border-top:    1px solid var(--dark-border);
      border-bottom: 1px solid var(--dark-border);
    }

    .landing__feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .landing__feature-card {
      background: var(--dark-card);
      border: 1px solid var(--dark-border);
      border-radius: 1rem;
      padding: 2rem;
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        border-color: rgba(99, 102, 241, 0.25);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(99, 102, 241, 0.08);
      }
    }

    .landing__feature-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 0.75rem;
      background: rgba(var(--accent-r, 99), var(--accent-g, 102), var(--accent-b, 241), 0.12);
      border: 1px solid rgba(var(--accent-r, 99), var(--accent-g, 102), var(--accent-b, 241), 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
      font-size: 1.25rem;
      color: var(--accent, #6366f1);
    }

    .landing__feature-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--dark-text);
      margin: 0 0 0.75rem;
    }

    .landing__feature-body {
      font-size: 0.9375rem;
      color: var(--dark-muted);
      line-height: 1.7;
      margin: 0;
    }

    // ── Stats ───────────────────────────────────────────────────────────────────
    .landing__stats-section {
      padding: 5rem 2rem;
    }

    .landing__stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 2rem;
      text-align: center;
    }

    .landing__stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .landing__stat-icon {
      font-size: 1.5rem;
      color: #6366f1;
      opacity: 0.7;
    }

    .landing__stat-value {
      font-size: 2.75rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
    }

    .landing__stat-label {
      font-size: 0.9rem;
      color: var(--dark-muted);
      font-weight: 500;
    }

    // ── CTA ─────────────────────────────────────────────────────────────────────
    .landing__cta {
      padding: 8rem 2rem;
      text-align: center;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg,
          rgba(99, 102, 241, 0.12) 0%,
          rgba(139, 92, 246, 0.1) 50%,
          rgba(236, 72, 153, 0.08) 100%);
        pointer-events: none;
      }
    }

    .landing__cta-inner {
      position: relative;
      max-width: 48rem;
      margin: 0 auto;
    }

    .landing__cta-orb {
      position: absolute;
      width: 400px;
      height: 400px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: radial-gradient(circle at center, rgba(99, 102, 241, 0.2), transparent 70%);
      filter: blur(60px);
      pointer-events: none;
    }

    .landing__cta-title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--dark-text);
      margin: 0 0 1rem;
    }

    .landing__cta-sub {
      font-size: 1.0625rem;
      color: var(--dark-muted);
      margin: 0 0 2.5rem;
      line-height: 1.7;
    }

    // ── Footer ──────────────────────────────────────────────────────────────────
    .landing__footer {
      border-top: 1px solid var(--dark-border);
      padding: 2rem;
    }

    .landing__footer-inner {
      max-width: 72rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .landing__footer-copy {
      font-size: 0.875rem;
      color: var(--dark-muted);
      margin: 0;
    }
  `],
})
export class LandingComponent implements OnInit {
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly features = FEATURES;
  protected readonly stats = STATS;

  ngOnInit(): void {
    if (this.store.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }
}
