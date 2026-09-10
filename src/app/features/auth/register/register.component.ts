import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { APP_CONFIG } from '../../../core/config/app-config.token';
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
const NAME_MAX = 80;

/**
 * Account creation surface. Registration is a real surface (not deferred):
 * it submits to `AuthService.register`, which signs the user in on success.
 * Client-side validation uses the strong-password contract and a confirm
 * field that must match.
 */
@Component({
  selector: 'rdk-register',
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
        <header class="auth__header">
          <h1 class="auth__title">Create account</h1>
          <p class="auth__sub">Enter your details to get started.</p>
        </header>

        @if (banner(); as message) {
          <rdk-alert severity="error" message="{{ message }}" class="auth__banner" />
        }

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <rdk-form-field
            label="Full name"
            [error]="getErrorMessage(form, 'name', labels)"
            [required]="true"
            [id]="'register-name'"
          >
            <rdk-input
              formControlName="name"
              inputId="register-name"
              type="text"
              autocomplete="name"
              placeholder="Jane Doe"
              [maxLength]="NAME_MAX"
            />
          </rdk-form-field>

          <rdk-form-field
            label="Email"
            [error]="getErrorMessage(form, 'email', labels)"
            [required]="true"
            [id]="'register-email'"
          >
            <rdk-input
              formControlName="email"
              inputId="register-email"
              type="email"
              inputmode="email"
              autocomplete="email"
              placeholder="you&#64;example.com"
              [maxLength]="EMAIL_MAX"
            />
          </rdk-form-field>

          <rdk-form-field
            label="Password"
            [error]="getErrorMessage(form, 'password', labels)"
            [required]="true"
            [id]="'register-password'"
          >
            <rdk-input
              formControlName="password"
              inputId="register-password"
              type="password"
              autocomplete="new-password"
              placeholder="At least 8 characters"
            />
          </rdk-form-field>

          <rdk-form-field
            label="Confirm password"
            [error]="getErrorMessage(form, 'confirm', labels)"
            [required]="true"
            [id]="'register-confirm'"
          >
            <rdk-input
              formControlName="confirm"
              inputId="register-confirm"
              type="password"
              autocomplete="new-password"
              placeholder="Repeat your password"
            />
          </rdk-form-field>

          <rdk-button
            type="submit"
            variant="primary"
            [fullWidth]="true"
            [loading]="loading()"
            [disabled]="form.invalid"
          >
            {{ loading() ? 'Creating account…' : 'Create account' }}
          </rdk-button>
        </form>

        <p class="auth__foot">
          Already have an account?
          <a class="auth__link" routerLink="/login">Sign in</a>
        </p>
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
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly config = inject(APP_CONFIG);

  protected readonly EMAIL_MAX = EMAIL_MAX;
  protected readonly NAME_MAX = NAME_MAX;

  protected readonly loading = signal(false);
  protected readonly banner = signal('');
  protected readonly labels: Record<string, string> = {
    name: 'Full name',
    email: 'Email',
    password: 'Password',
    confirm: 'Confirm password',
  };

  protected readonly form = this.fb.nonNullable.group(
    {
      name: ['', [requiredTrimValidator, Validators.maxLength(NAME_MAX)]],
      email: ['', [requiredTrimValidator, emailValidator, Validators.maxLength(EMAIL_MAX)]],
      password: ['', [requiredTrimValidator, strongPasswordValidator]],
      confirm: ['', requiredTrimValidator],
    },
    { validators: matchFieldsValidator('password', 'confirm') },
  );

  protected readonly getErrorMessage = getErrorMessage;

  protected submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.banner.set('');
    const { name, email: username, password } = this.form.getRawValue();

    this.auth.register({ name, username, password }).subscribe({
      next: () => {
        void this.router.navigateByUrl(this.config.auth.postLoginRoute);
        this.loading.set(false);
      },
      error: (e: AppError) => {
        if (e.fieldErrors) {
          applyServerErrors(this.form, e);
        } else {
          this.banner.set(e.message);
        }
        this.loading.set(false);
      },
    });
  }
}
