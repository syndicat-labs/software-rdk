import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthStore } from '../../../../core/auth/auth.store';
import { APP_CONFIG } from '../../../../core/config/app-config.token';
import { AppError } from '../../../../core/errors/errors.types';
import { requiredTrimValidator } from '../../../../shared/forms/validators/required-trim.validator';
import { emailValidator } from '../../../../shared/forms/validators/email.validator';
import { strongPasswordValidator } from '../../../../shared/forms/validators/strong-password.validator';
import { matchFieldsValidator } from '../../../../shared/forms/validators/match-fields.validator';
import { getErrorMessage, applyServerErrors } from '../../../../shared/forms/form-error-handler';
import { markAllAsTouched } from '../../../../shared/forms/form.utils';

@Component({
  selector: 'rdk-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('cardEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px) scale(0.97)' }),
        animate('600ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
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
    <div class="reg-page" @bgEnter>

      <div class="reg-page__bg" aria-hidden="true">
        <div class="reg-page__orb reg-page__orb--1"></div>
        <div class="reg-page__orb reg-page__orb--2"></div>
        <div class="reg-page__orb reg-page__orb--3"></div>
        <div class="reg-page__grid"></div>
      </div>

      <a href="/" routerLink="/" class="reg-page__brand">
        <span class="reg-page__brand-mark">⬡</span>
        <span class="reg-page__brand-text">RDK</span>
      </a>

      <div class="reg-card" @cardEnter>
        <div class="reg-card__stripe" aria-hidden="true"></div>

        <div class="reg-card__body">

          <div class="reg-card__header">
            <div class="reg-card__icon-wrap" aria-hidden="true">
              <span class="pi pi-user-plus reg-card__icon"></span>
            </div>
            <h1 class="reg-card__title">Create account</h1>
            <p class="reg-card__subtitle">Get started — it only takes a minute</p>
          </div>

          @if (error()) {
            <div class="reg-error" role="alert" aria-live="assertive">
              <span class="pi pi-exclamation-triangle reg-error__icon"></span>
              <span class="reg-error__text">{{ error()!.message }}</span>
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="reg-card__form" novalidate>

            <div class="reg-field">
              <label for="reg-name" class="reg-field__label">Display name</label>
              <div class="reg-field__input-wrap"
                   [class.reg-field__input-wrap--error]="isInvalid('name')"
                   [class.reg-field__input-wrap--focus]="focus.name">
                <span class="pi pi-id-card reg-field__icon"></span>
                <input
                  id="reg-name"
                  type="text"
                  formControlName="name"
                  autocomplete="name"
                  placeholder="Jane Doe"
                  class="reg-field__input"
                  (focus)="focus.name = true"
                  (blur)="focus.name = false"
                  autofocus
                />
              </div>
              @if (isInvalid('name')) {
                <span class="reg-field__error">{{ errorFor('name') }}</span>
              }
            </div>

            <div class="reg-field">
              <label for="reg-email" class="reg-field__label">Email address</label>
              <div class="reg-field__input-wrap"
                   [class.reg-field__input-wrap--error]="isInvalid('username')"
                   [class.reg-field__input-wrap--focus]="focus.email">
                <span class="pi pi-envelope reg-field__icon"></span>
                <input
                  id="reg-email"
                  type="email"
                  formControlName="username"
                  autocomplete="email"
                  placeholder="you@example.com"
                  class="reg-field__input"
                  (focus)="focus.email = true"
                  (blur)="focus.email = false"
                />
              </div>
              @if (isInvalid('username')) {
                <span class="reg-field__error">{{ errorFor('username') }}</span>
              }
            </div>

            <div class="reg-field">
              <label for="reg-password" class="reg-field__label">Password</label>
              <div class="reg-field__input-wrap"
                   [class.reg-field__input-wrap--error]="isInvalid('password')"
                   [class.reg-field__input-wrap--focus]="focus.password">
                <span class="pi pi-key reg-field__icon"></span>
                <input
                  id="reg-password"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  autocomplete="new-password"
                  placeholder="8+ chars, mixed case, number, symbol"
                  class="reg-field__input"
                  (focus)="focus.password = true"
                  (blur)="focus.password = false"
                />
                <button
                  type="button"
                  class="reg-field__toggle"
                  (click)="showPassword = !showPassword"
                  [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
                >
                  <span class="pi" [ngClass]="showPassword ? 'pi-eye-slash' : 'pi-eye'"></span>
                </button>
              </div>
              @if (isInvalid('password')) {
                <span class="reg-field__error">{{ errorFor('password') }}</span>
              }
            </div>

            <div class="reg-field">
              <label for="reg-confirm" class="reg-field__label">Confirm password</label>
              <div class="reg-field__input-wrap"
                   [class.reg-field__input-wrap--error]="isInvalid('confirmPassword') || hasFormError('mismatch')"
                   [class.reg-field__input-wrap--focus]="focus.confirm">
                <span class="pi pi-key reg-field__icon"></span>
                <input
                  id="reg-confirm"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="confirmPassword"
                  autocomplete="new-password"
                  placeholder="Repeat your password"
                  class="reg-field__input"
                  (focus)="focus.confirm = true"
                  (blur)="focus.confirm = false"
                />
              </div>
              @if (isInvalid('confirmPassword') || hasFormError('mismatch')) {
                <span class="reg-field__error">Passwords do not match</span>
              }
            </div>

            <button
              type="submit"
              class="reg-submit"
              [class.reg-submit--loading]="store.isLoading()"
              [disabled]="store.isLoading()"
            >
              @if (store.isLoading()) {
                <span class="pi pi-spin pi-spinner reg-submit__spinner"></span>
                <span>Creating account…</span>
              } @else {
                <span>Create account</span>
                <span class="pi pi-arrow-right reg-submit__arrow"></span>
              }
            </button>

          </form>

          <div class="reg-card__footer">
            <span class="reg-card__signin-text">Already have an account?</span>
            <a routerLink="/login" class="reg-card__signin-link">Sign in</a>
          </div>

        </div>
      </div>

    </div>
  `,
  styles: [`
    .reg-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: var(--dark-bg);
      position: relative;
      overflow: hidden;
    }

    .reg-page__bg {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .reg-page__orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
    }

    .reg-page__orb--1 {
      width: 500px; height: 500px;
      background: radial-gradient(circle at center, rgba(99, 102, 241, 0.45), transparent 70%);
      top: -100px; right: -100px;
      animation: orbFloat 10s ease-in-out infinite;
    }

    .reg-page__orb--2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle at center, rgba(139, 92, 246, 0.35), transparent 70%);
      bottom: -80px; left: -80px;
      animation: orbFloat 13s ease-in-out infinite;
      animation-delay: -5s;
    }

    .reg-page__orb--3 {
      width: 250px; height: 250px;
      background: radial-gradient(circle at center, rgba(236, 72, 153, 0.25), transparent 70%);
      top: 60%; left: 55%;
      animation: orbFloat 9s ease-in-out infinite;
      animation-delay: -3s;
    }

    .reg-page__grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
      background-size: 56px 56px;
    }

    .reg-page__brand {
      position: fixed;
      top: 1.5rem; left: 1.75rem;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
    }

    .reg-page__brand-mark { font-size: 1.375rem; color: #6366f1; }

    .reg-page__brand-text {
      font-size: 1.125rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: var(--brand-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .reg-card {
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

    .reg-card__stripe {
      width: 4px;
      flex-shrink: 0;
      background: var(--brand-gradient);
    }

    .reg-card__body {
      flex: 1;
      padding: 2.5rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .reg-card__header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.375rem;
    }

    .reg-card__icon-wrap {
      width: 2.75rem; height: 2.75rem;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
    }

    .reg-card__icon { color: #fff; font-size: 1.125rem; }

    .reg-card__title {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      color: #0f172a;
      margin: 0;
    }

    .reg-card__subtitle { font-size: 0.9rem; color: #64748b; margin: 0; }

    .reg-error {
      display: flex;
      align-items: flex-start;
      gap: 0.625rem;
      padding: 0.875rem 1rem;
      border-radius: 0.625rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
    }

    .reg-error__icon { color: #ef4444; font-size: 0.875rem; flex-shrink: 0; margin-top: 2px; }
    .reg-error__text { font-size: 0.875rem; color: #dc2626; line-height: 1.5; }

    .reg-card__form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .reg-field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .reg-field__label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #374151;
      letter-spacing: 0.01em;
    }

    .reg-field__input-wrap {
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
      }
    }

    .reg-field__icon {
      padding: 0 0 0 0.875rem;
      color: #94a3b8;
      font-size: 0.875rem;
      flex-shrink: 0;
      pointer-events: none;
    }

    .reg-field__input {
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

    .reg-field__toggle {
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

    .reg-field__error {
      font-size: 0.8125rem;
      color: #dc2626;
    }

    .reg-submit {
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

      &:active:not(:disabled) { transform: translateY(0); }

      &:disabled { cursor: not-allowed; opacity: 0.75; }

      &--loading { background: linear-gradient(135deg, #4f52c9, #7c3aed); }
    }

    .reg-submit__arrow { font-size: 0.875rem; transition: transform 0.2s ease; }

    .reg-submit:hover:not(:disabled) .reg-submit__arrow { transform: translateX(3px); }

    .reg-submit__spinner { font-size: 1rem; }

    .reg-card__footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
      padding-top: 0.25rem;
    }

    .reg-card__signin-text { font-size: 0.8125rem; color: #94a3b8; }

    .reg-card__signin-link {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #6366f1;
      text-decoration: none;
      transition: color 0.15s;

      &:hover { color: #4f46e5; text-decoration: underline; }
    }
  `],
})
export class RegisterComponent implements OnInit {
  protected readonly store = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly config = inject(APP_CONFIG);

  protected readonly error = signal<AppError | null>(null);
  protected showPassword = false;
  protected readonly focus = { name: false, email: false, password: false, confirm: false };

  protected readonly form = this.fb.group(
    {
      name: ['', [requiredTrimValidator, Validators.maxLength(64)]],
      username: ['', [requiredTrimValidator, emailValidator, Validators.maxLength(254)]],
      password: ['', [requiredTrimValidator, strongPasswordValidator]],
      confirmPassword: ['', [requiredTrimValidator]],
    },
    { validators: matchFieldsValidator('password', 'confirmPassword') },
  );

  ngOnInit(): void {
    if (this.store.isAuthenticated()) {
      this.router.navigate([this.config.auth.postLoginRoute]);
    }
  }

  protected isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c.touched);
  }

  protected hasFormError(key: string): boolean {
    return !!(this.form.touched && this.form.errors?.[key]);
  }

  protected errorFor(field: string): string | null {
    return getErrorMessage(this.form, field, {
      name: 'Display name',
      username: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      markAllAsTouched(this.form);
      return;
    }
    this.error.set(null);
    const { name, username, password } = this.form.value;

    this.authService
      .register({ name: name!.trim(), username: username!.trim(), password: password! })
      .subscribe({
        next: () => this.router.navigate([this.config.auth.postLoginRoute]),
        error: (err: AppError) => {
          this.error.set(err);
          applyServerErrors(this.form, err);
        },
      });
  }
}
