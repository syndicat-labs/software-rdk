import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { APP_CONFIG } from '../../../core/config/app-config.token';

@Component({
  selector: 'rdk-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-stub">
      <h1>Sign in</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input formControlName="email"    type="email"    placeholder="Email" />
        <input formControlName="password" type="password" placeholder="Password" />
        @if (error()) { <p class="error">{{ error() }}</p> }
        <button type="submit" [disabled]="loading()">
          {{ loading() ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
      <p class="hint">Dev: test&#64;rdk.dev / Rdk1234!</p>
    </div>
  `,
  styles: [`
    .login-stub {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      gap: 1rem;
      background: var(--color-bg-base);
      font-family: var(--font-family);
    }
    h1 { margin: 0; font-family: var(--display-font); color: var(--color-text-primary); }
    form { display: flex; flex-direction: column; gap: 0.5rem; width: 20rem; }
    input {
      padding: 0.625rem 0.75rem;
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-component);
      background: var(--color-bg-surface);
      color: var(--color-text-primary);
      font-family: var(--font-family);
      font-size: 0.875rem;
    }
    button {
      padding: 0.625rem;
      border: none;
      border-radius: var(--radius-component);
      background: var(--color-bg-brand);
      color: var(--color-text-inverse);
      font-weight: 600;
      cursor: pointer;
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
    .error { margin: 0; color: var(--color-text-danger); font-size: 0.875rem; }
    .hint  { margin: 0; color: var(--color-text-muted);  font-size: 0.75rem;  }
  `],
})
export class LoginComponent {
  private readonly fb       = inject(FormBuilder);
  private readonly auth     = inject(AuthService);
  private readonly router   = inject(Router);
  private readonly config   = inject(APP_CONFIG);

  protected readonly loading = signal(false);
  protected readonly error   = signal('');

  protected readonly form = this.fb.nonNullable.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    const { email: username, password } = this.form.getRawValue();
    this.auth.login({ username, password }).subscribe({
      next: () => this.router.navigateByUrl(this.config.auth.postLoginRoute),
      error: (e) => { this.error.set(e?.message ?? 'Sign in failed'); this.loading.set(false); },
    });
  }
}
