import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { AppError } from '../../../core/errors/errors.types';
import { requiredTrimValidator } from '../../../shared/forms/validators/required-trim.validator';
import { emailValidator } from '../../../shared/forms/validators/email.validator';
import { strongPasswordValidator } from '../../../shared/forms/validators/strong-password.validator';
import { matchFieldsValidator } from '../../../shared/forms/validators/match-fields.validator';
import { applyServerErrors, getErrorMessage } from '../../../shared/forms/form-error-handler';
import { FormFieldComponent } from '../../../shared/components/molecules/form-field/form-field.component';
import { InputComponent } from '../../../shared/components/molecules/input/input.component';
import { ButtonComponent } from '../../../shared/components/atoms/button/button.component';
import { AlertComponent } from '../../../shared/components/molecules/alert/alert.component';

const EMAIL_MAX = 254;

/**
 * Password reset surface with two modes, selected by the presence of a reset
 * `token` in the query string:
 *   - request mode: submit an email to `AuthService.requestReset`.
 *   - confirm mode: submit the token plus a new (strong) password to
 *     `AuthService.resetPassword`.
 */
@Component({
  selector: 'rdk-password-reset',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormFieldComponent,
    InputComponent,
    ButtonComponent,
    AlertComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="auth">
      <section class="auth__card">
        @if (isConfirm() && resetDone()) {
          <header class="auth__header">
            <h1 class="auth__title">Password updated</h1>
            <p class="auth__sub">Your password has been changed successfully.</p>
          </header>
          <rdk-alert
            severity="success"
            title="All set"
            message="You can now sign in with your new password."
          />
          <p class="auth__foot">
            Go to
            <a class="auth__link" routerLink="/login">sign in</a>
          </p>
        } @else if (isConfirm()) {
          <header class="auth__header">
            <h1 class="auth__title">Set a new password</h1>
            <p class="auth__sub">Choose a new password for your account.</p>
          </header>

          @if (banner(); as message) {
            <rdk-alert severity="error" message="{{ message }}" class="auth__banner" />
          }

          <form [formGroup]="confirmForm" (ngSubmit)="submitConfirm()" novalidate>
            <rdk-form-field
              label="New password"
              [error]="getErrorMessage(confirmForm, 'password', labels)"
              [required]="true"
              [id]="'reset-new-password'"
            >
              <rdk-input
                formControlName="password"
                inputId="reset-new-password"
                type="password"
                autocomplete="new-password"
                placeholder="At least 8 characters"
              />
            </rdk-form-field>

            <rdk-form-field
              label="Confirm new password"
              [error]="getErrorMessage(confirmForm, 'confirm', labels)"
              [required]="true"
              [id]="'reset-confirm'"
            >
              <rdk-input
                formControlName="confirm"
                inputId="reset-confirm"
                type="password"
                autocomplete="new-password"
                placeholder="Repeat your new password"
              />
            </rdk-form-field>

            <rdk-button
              type="submit"
              variant="primary"
              [fullWidth]="true"
              [loading]="loading()"
              [disabled]="confirmForm.invalid"
            >
              {{ loading() ? 'Resetting…' : 'Reset password' }}
            </rdk-button>
          </form>

          <p class="auth__foot">
            Remembered it?
            <a class="auth__link" routerLink="/login">Sign in</a>
          </p>
        } @else if (requestDone()) {
          <header class="auth__header">
            <h1 class="auth__title">Check your email</h1>
            <p class="auth__sub">
              If an account exists for that email, a reset link is on its way.
            </p>
          </header>
          <rdk-alert
            severity="success"
            title="Reset link sent"
            message="Follow the link in the email to set a new password."
          />
          <p class="auth__foot">
            Back to
            <a class="auth__link" routerLink="/login">sign in</a>
          </p>
        } @else {
          <header class="auth__header">
            <h1 class="auth__title">Reset your password</h1>
            <p class="auth__sub">
              Enter your account email and we’ll send a reset link.
            </p>
          </header>

          @if (banner(); as message) {
            <rdk-alert severity="error" message="{{ message }}" class="auth__banner" />
          }

          <form [formGroup]="requestForm" (ngSubmit)="submitRequest()" novalidate>
            <rdk-form-field
              label="Email"
              [error]="getErrorMessage(requestForm, 'email', labels)"
              [required]="true"
              [id]="'reset-email'"
            >
              <rdk-input
                formControlName="email"
                inputId="reset-email"
                type="email"
                inputmode="email"
                autocomplete="email"
                placeholder="you&#64;example.com"
                [maxLength]="EMAIL_MAX"
              />
            </rdk-form-field>

            <rdk-button
              type="submit"
              variant="primary"
              [fullWidth]="true"
              [loading]="loading()"
              [disabled]="requestForm.invalid"
            >
              {{ loading() ? 'Sending…' : 'Send reset link' }}
            </rdk-button>
          </form>

          <p class="auth__foot">
            Remembered it?
            <a class="auth__link" routerLink="/login">Sign in</a>
          </p>
        }
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100%;
        background: var(--color-bg-base);
      }

      .auth {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-layout-lg);
        min-height: 100%;
        box-sizing: border-box;
      }

      .auth__card {
        width: 100%;
        max-width: 26rem;
        display: flex;
        flex-direction: column;
        gap: var(--space-layout-md);
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        box-shadow: var(--elevation-raised);
        padding: var(--space-layout-lg);
      }

      .auth__title {
        margin: 0;
        color: var(--color-text-primary);
        font-family: var(--font-heading);
        font-size: 1.5rem;
      }
      .auth__sub {
        margin: var(--space-component-sm) 0 0;
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        line-height: 1.5;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: var(--space-layout-sm);
      }

      .auth__banner {
        margin-bottom: var(--space-component-sm);
      }

      .auth__link {
        color: var(--color-text-brand);
        font-size: 0.8125rem;
        text-decoration: none;
      }
      .auth__link:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
        border-radius: var(--radius-component);
      }

      .auth__foot {
        margin: 0;
        color: var(--color-text-secondary);
        font-size: 0.8125rem;
        text-align: center;
      }
    `,
  ],
})
export class PasswordResetComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  protected readonly EMAIL_MAX = EMAIL_MAX;

  protected readonly loading = signal(false);
  protected readonly banner = signal('');
  protected readonly requestDone = signal(false);
  protected readonly resetDone = signal(false);
  protected readonly labels: Record<string, string> = {
    email: 'Email',
    password: 'New password',
    confirm: 'Confirm new password',
  };

  protected readonly isConfirm = computed(() => !!this.route.snapshot.queryParamMap.get('token'));

  protected readonly requestForm = this.fb.nonNullable.group({
    email: ['', [requiredTrimValidator, emailValidator, Validators.maxLength(EMAIL_MAX)]],
  });

  protected readonly confirmForm = this.fb.nonNullable.group(
    {
      password: ['', [requiredTrimValidator, strongPasswordValidator]],
      confirm: ['', requiredTrimValidator],
    },
    { validators: matchFieldsValidator('password', 'confirm') },
  );

  protected readonly getErrorMessage = getErrorMessage;

  protected submitRequest(): void {
    if (this.requestForm.invalid) return;
    this.loading.set(true);
    this.banner.set('');
    const { email } = this.requestForm.getRawValue();

    this.auth.requestReset(email).subscribe({
      next: () => {
        this.requestDone.set(true);
        this.loading.set(false);
      },
      error: (e: AppError) => {
        this.banner.set(e.message);
        this.loading.set(false);
      },
    });
  }

  protected submitConfirm(): void {
    if (this.confirmForm.invalid) return;
    this.loading.set(true);
    this.banner.set('');
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';
    const { password } = this.confirmForm.getRawValue();

    this.auth.resetPassword({ token, password }).subscribe({
      next: () => {
        this.resetDone.set(true);
        this.banner.set('');
        this.loading.set(false);
      },
      error: (e: AppError) => {
        if (e.fieldErrors) {
          applyServerErrors(this.confirmForm, e);
          this.banner.set('');
        } else {
          this.banner.set(e.message);
        }
        this.loading.set(false);
      },
    });
  }
}
