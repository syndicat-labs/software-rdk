import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthStore } from '../../../../core/auth/auth.store';
import { APP_CONFIG } from '../../../../core/config/app-config.token';
import { AppError } from '../../../../core/errors/errors.types';
import { ThemeToggleComponent } from '../../../../shared/components/atoms/theme-toggle/theme-toggle.component';
import { requiredTrimValidator } from '../../../../shared/forms/validators/required-trim.validator';
import { emailValidator } from '../../../../shared/forms/validators/email.validator';
import { getErrorMessage, applyServerErrors } from '../../../../shared/forms/form-error-handler';
import { markAllAsTouched } from '../../../../shared/forms/form.utils';

const SAFE_RETURN_URL_PATTERN = /^\/[^/].*/;

function sanitizeReturnUrl(raw: string | null, fallback: string): string {
  if (!raw || !SAFE_RETURN_URL_PATTERN.test(raw)) {
    return fallback;
  }
  return raw;
}

@Component({
  selector: 'rdk-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    PasswordModule,
    ThemeToggleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('cardEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px) scale(0.97)' }),
        animate(
          '600ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' }),
        ),
      ]),
    ]),
    trigger('bgEnter', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease', style({ opacity: 1 })),
      ]),
    ]),
  ],
  template: `
    <div class="login-page" @bgEnter>

      <!-- Animated background -->
      <div class="login-page__bg" aria-hidden="true">
        <div class="login-page__orb login-page__orb--1"></div>
        <div class="login-page__orb login-page__orb--2"></div>
        <div class="login-page__orb login-page__orb--3"></div>
        <div class="login-page__grid"></div>
      </div>

      <!-- Brand mark (top-left) -->
      <a href="/" routerLink="/" class="login-page__brand">
        <span class="login-page__brand-mark">⬡</span>
        <span class="login-page__brand-text">RDK</span>
      </a>

      <!-- Theme toggle (top-right) -->
      <div class="login-page__theme-toggle">
        <rdk-theme-toggle [dark]="true" />
      </div>

      <!-- Card -->
      <div class="login-card" @cardEnter>

        <!-- Card left accent stripe -->
        <div class="login-card__stripe" aria-hidden="true"></div>

        <!-- Card content -->
        <div class="login-card__body">

          <div class="login-card__header">
            <div class="login-card__icon-wrap" aria-hidden="true">
              <span class="pi pi-lock login-card__icon"></span>
            </div>
            <h1 class="login-card__title">Welcome back</h1>
            <p class="login-card__subtitle">Sign in to your account to continue</p>
          </div>

          <!-- API error -->
          @if (error()) {
            <div class="login-error" role="alert" aria-live="assertive">
              <span class="pi pi-exclamation-triangle login-error__icon"></span>
              <span class="login-error__text">{{ error()!.message }}</span>
            </div>
          }

          <form
            [formGroup]="loginForm"
            (ngSubmit)="onSubmit()"
            class="login-card__form"
            novalidate
          >
            <!-- Email -->
            <div class="login-field">
              <label for="login-email" class="login-field__label">Email address</label>
              <div class="login-field__input-wrap"
                   [class.login-field__input-wrap--error]="usernameInvalid"
                   [class.login-field__input-wrap--focus]="emailFocused">
                <span class="pi pi-envelope login-field__icon"></span>
                <input
                  id="login-email"
                  type="email"
                  formControlName="username"
                  autocomplete="username"
                  placeholder="you@example.com"
                  class="login-field__input"
                  (focus)="emailFocused = true"
                  (blur)="emailFocused = false"
                  autofocus
                />
              </div>
              @if (usernameInvalid) {
                <span class="login-field__error">{{ errorFor('username') }}</span>
              }
            </div>

            <!-- Password -->
            <div class="login-field">
              <label for="login-password" class="login-field__label">Password</label>
              <div class="login-field__input-wrap"
                   [class.login-field__input-wrap--error]="passwordInvalid"
                   [class.login-field__input-wrap--focus]="passwordFocused">
                <span class="pi pi-key login-field__icon"></span>
                <input
                  id="login-password"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  class="login-field__input"
                  (focus)="passwordFocused = true"
                  (blur)="passwordFocused = false"
                />
                <button
                  type="button"
                  class="login-field__toggle"
                  (click)="showPassword = !showPassword"
                  [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
                >
                  <span class="pi" [ngClass]="showPassword ? 'pi-eye-slash' : 'pi-eye'"></span>
                </button>
              </div>
              @if (passwordInvalid) {
                <span class="login-field__error">{{ errorFor('password') }}</span>
              }
            </div>

            <!-- Submit -->
            <button
              type="submit"
              class="login-submit"
              [class.login-submit--loading]="store.isLoading()"
              [disabled]="store.isLoading()"
            >
              @if (store.isLoading()) {
                <span class="pi pi-spin pi-spinner login-submit__spinner"></span>
                <span>Signing in…</span>
              } @else {
                <span>Sign in</span>
                <span class="pi pi-arrow-right login-submit__arrow"></span>
              }
            </button>
          </form>

          @if (!isProd) {
            <div class="login-dev-hint" role="note">
              <span class="pi pi-info-circle login-dev-hint__icon"></span>
              <span class="login-dev-hint__text">
                Dev credentials: <strong>test&#64;rdk.dev</strong> / <strong>Rdk1234!</strong>
              </span>
            </div>
          }

          <div class="login-card__footer">
            <div class="login-card__footer-row">
              <span class="login-card__register-text">No account?</span>
              <a routerLink="/register" class="login-card__register-link">Create one</a>
            </div>
            <a href="/" routerLink="/" class="login-card__back">
              <span class="pi pi-arrow-left"></span>
              Back to home
            </a>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    // ── Page ────────────────────────────────────────────────────────────────────
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: var(--dark-bg);
      position: relative;
      overflow: hidden;
    }

    // ── Background ──────────────────────────────────────────────────────────────
    .login-page__bg {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .login-page__orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
    }

    .login-page__orb--1 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle at center, rgba(99, 102, 241, 0.45), transparent 70%);
      top: -100px;
      right: -100px;
      animation: orbFloat 10s ease-in-out infinite;
    }

    .login-page__orb--2 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle at center, rgba(139, 92, 246, 0.35), transparent 70%);
      bottom: -80px;
      left: -80px;
      animation: orbFloat 13s ease-in-out infinite;
      animation-delay: -5s;
    }

    .login-page__orb--3 {
      width: 250px;
      height: 250px;
      background: radial-gradient(circle at center, rgba(236, 72, 153, 0.25), transparent 70%);
      top: 60%;
      left: 55%;
      animation: orbFloat 9s ease-in-out infinite;
      animation-delay: -3s;
    }

    .login-page__grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
      background-size: 56px 56px;
    }

    // ── Brand ───────────────────────────────────────────────────────────────────
    .login-page__brand {
      position: fixed;
      top: 1.5rem;
      left: 1.75rem;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
    }

    .login-page__theme-toggle {
      position: fixed;
      top: 1.5rem;
      right: 1.75rem;
      z-index: 10;
    }

    .login-page__brand-mark {
      font-size: 1.375rem;
      color: #6366f1;
    }

    .login-page__brand-text {
      font-size: 1.125rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: var(--brand-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    // ── Card ────────────────────────────────────────────────────────────────────
    .login-card {
      position: relative;
      z-index: 1;
      display: flex;
      width: 100%;
      max-width: 26rem;
      background: rgba(255, 255, 255, 0.96);
      border-radius: 1.25rem;
      box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.1),
        0 24px 80px rgba(0, 0, 0, 0.5),
        0 0 60px rgba(99, 102, 241, 0.15);
      overflow: hidden;
    }

    .login-card__stripe {
      width: 4px;
      flex-shrink: 0;
      background: var(--brand-gradient);
    }

    .login-card__body {
      flex: 1;
      padding: 2.5rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .login-card__header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.375rem;
    }

    .login-card__icon-wrap {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
    }

    .login-card__icon {
      color: #fff;
      font-size: 1.125rem;
    }

    .login-card__title {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      color: #0f172a;
      margin: 0;
    }

    .login-card__subtitle {
      font-size: 0.9rem;
      color: #64748b;
      margin: 0;
    }

    // ── Error banner ────────────────────────────────────────────────────────────
    .login-error {
      display: flex;
      align-items: flex-start;
      gap: 0.625rem;
      padding: 0.875rem 1rem;
      border-radius: 0.625rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
    }

    .login-error__icon {
      color: #ef4444;
      font-size: 0.875rem;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .login-error__text {
      font-size: 0.875rem;
      color: #dc2626;
      line-height: 1.5;
    }

    // ── Form ────────────────────────────────────────────────────────────────────
    .login-card__form {
      display: flex;
      flex-direction: column;
      gap: 1.125rem;
    }

    .login-field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .login-field__label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #374151;
      letter-spacing: 0.01em;
    }

    .login-field__input-wrap {
      display: flex;
      align-items: center;
      border: 1.5px solid #e2e8f0;
      border-radius: 0.625rem;
      background: #f8fafc;
      transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;

      &--focus {
        border-color: #6366f1;
        background: #fff;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
      }

      &--error {
        border-color: #f87171;
        background: #fff;

        &.login-field__input-wrap--focus {
          box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.15);
        }
      }
    }

    .login-field__icon {
      padding: 0 0 0 0.875rem;
      color: #94a3b8;
      font-size: 0.875rem;
      flex-shrink: 0;
      pointer-events: none;
    }

    .login-field__input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 0.75rem 0.875rem;
      font-size: 0.9375rem;
      color: #0f172a;
      outline: none;
      font-family: var(--font-family);
      min-width: 0;

      &::placeholder { color: #cbd5e1; }

      &[type="password"] {
        letter-spacing: 0.1em;
        font-size: 1rem;
      }
    }

    .login-field__toggle {
      padding: 0 0.875rem;
      background: none;
      border: none;
      cursor: pointer;
      color: #94a3b8;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      transition: color 0.15s;

      &:hover { color: #6366f1; }
    }

    .login-field__error {
      font-size: 0.8125rem;
      color: #dc2626;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    // ── Submit button ───────────────────────────────────────────────────────────
    .login-submit {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.625rem;
      width: 100%;
      padding: 0.875rem;
      border: none;
      border-radius: 0.625rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      font-size: 0.9375rem;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.45);
      margin-top: 0.375rem;
      font-family: var(--font-family);
      position: relative;
      overflow: hidden;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
        pointer-events: none;
      }

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.55);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.75;
      }

      &--loading {
        background: linear-gradient(135deg, #4f52c9, #7c3aed);
      }
    }

    .login-submit__arrow {
      font-size: 0.875rem;
      transition: transform 0.2s ease;
    }

    .login-submit:hover:not(:disabled) .login-submit__arrow {
      transform: translateX(3px);
    }

    .login-submit__spinner {
      font-size: 1rem;
    }

    // ── Dev hint ─────────────────────────────────────────────────────────────────
    .login-dev-hint {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 0.875rem;
      border-radius: 0.5rem;
      background: #fffbeb;
      border: 1px solid #fde68a;
      font-size: 0.8rem;
    }

    .login-dev-hint__icon { color: #d97706; font-size: 0.8rem; flex-shrink: 0; }
    .login-dev-hint__text { color: #92400e; line-height: 1.4; }

    // ── Card footer ─────────────────────────────────────────────────────────────
    .login-card__footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding-top: 0.25rem;
    }

    .login-card__footer-row {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .login-card__register-text { font-size: 0.8125rem; color: #94a3b8; }

    .login-card__register-link {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #6366f1;
      text-decoration: none;
      transition: color 0.15s;

      &:hover { color: #4f46e5; text-decoration: underline; }
    }

    .login-card__back {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.15s;
      padding: 0.5rem;
      border-radius: 0.375rem;

      &:hover { color: #6366f1; }

      .pi { font-size: 0.75rem; }
    }
  `],
})
export class LoginComponent implements OnInit {
  protected readonly store = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly config = inject(APP_CONFIG);

  protected readonly isProd = this.config.environment.production;

  protected readonly error = signal<AppError | null>(null);
  protected showPassword = false;
  protected emailFocused = false;
  protected passwordFocused = false;

  private returnUrl = '';

  protected readonly loginForm = this.fb.group({
    username: ['', [requiredTrimValidator, emailValidator, Validators.maxLength(254)]],
    password: ['', [requiredTrimValidator, Validators.maxLength(128)]],
  });

  ngOnInit(): void {
    this.returnUrl = sanitizeReturnUrl(
      this.route.snapshot.queryParamMap.get('returnUrl'),
      this.config.auth.postLoginRoute,
    );
    if (this.store.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  protected get usernameInvalid(): boolean {
    const c = this.loginForm.get('username');
    return !!(c?.invalid && c.touched);
  }

  protected get passwordInvalid(): boolean {
    const c = this.loginForm.get('password');
    return !!(c?.invalid && c.touched);
  }

  protected errorFor(field: string): string | null {
    return getErrorMessage(this.loginForm, field, {
      username: 'Email',
      password: 'Password',
    });
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      markAllAsTouched(this.loginForm);
      return;
    }
    this.error.set(null);
    const { username, password } = this.loginForm.value;

    this.authService
      .login({ username: username!.trim(), password: password! })
      .subscribe({
        next: () => this.router.navigate([this.returnUrl]),
        error: (err: AppError) => {
          this.error.set(err);
          applyServerErrors(this.loginForm, err);
        },
      });
  }
}
