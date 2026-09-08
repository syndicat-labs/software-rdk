import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../core/auth/auth.store';
import { CardComponent } from '../../shared/components/organisms/card/card.component';
import { FormFieldComponent } from '../../shared/components/molecules/form-field/form-field.component';
import { InputComponent } from '../../shared/components/molecules/input/input.component';
import { ButtonComponent } from '../../shared/components/atoms/button/button.component';
import { strongPasswordValidator } from '../../shared/forms/validators/strong-password.validator';
import { matchFieldsValidator } from '../../shared/forms/validators/match-fields.validator';
import { getErrorMessage } from '../../shared/forms/form-error-handler';
import { ToggleComponent } from '../../shared/components/molecules/toggle/toggle.component';

@Component({
  selector: 'rdk-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CardComponent, FormFieldComponent, InputComponent, ButtonComponent, ToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="profile">
      <rdk-card variant="default" padding="lg">
        <div slot="header" class="profile__head">
          <h2 class="profile__title">Account</h2>
          <span class="profile__meta">{{ userId() }}</span>
        </div>
        <div class="profile__info">
          <p class="profile__row"><span class="profile__label">User ID</span><span class="profile__value">{{ userId() }}</span></p>
          <p class="profile__row"><span class="profile__label">Role</span><span class="profile__value">{{ role() }}</span></p>
        </div>
      </rdk-card>

      <rdk-card variant="default" padding="lg">
        <div slot="header" class="profile__head">
          <h3 class="profile__title">Change password</h3>
        </div>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="profile__form">
          <rdk-form-field label="New password" [error]="getErrorMessage(form, 'password', labels)" [required]="true" id="profile-password">
            <rdk-input formControlName="password" inputId="profile-password" type="password" autocomplete="new-password" placeholder="At least 8 characters" />
          </rdk-form-field>
          <rdk-form-field label="Confirm password" [error]="getErrorMessage(form, 'confirm', labels)" [required]="true" id="profile-confirm">
            <rdk-input formControlName="confirm" inputId="profile-confirm" type="password" autocomplete="new-password" placeholder="Repeat password" />
          </rdk-form-field>
          <rdk-button type="submit" variant="primary" [disabled]="form.invalid">Update password</rdk-button>
          @if (saved) {
            <p class="profile__saved" role="status">Password updated (dev mock — no backend).</p>
          }
        </form>
      </rdk-card>

      <rdk-card variant="default" padding="lg">
        <div slot="header" class="profile__head">
          <h3 class="profile__title">Notifications</h3>
        </div>
        <div class="profile__toggles">
          <rdk-toggle label="Email notifications" [checked]="emailNotif" (changed)="emailNotif = $event" />
          <rdk-toggle label="Push notifications" [checked]="pushNotif" (changed)="pushNotif = $event" />
        </div>
      </rdk-card>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: var(--space-layout-md);
        background: var(--color-bg-base);
      }
      .profile {
        display: flex;
        flex-direction: column;
        gap: var(--space-layout-md);
        max-width: 40rem;
      }
      .profile__head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--space-component-sm);
      }
      .profile__title {
        margin: 0;
        font-family: var(--font-heading);
        font-size: 1.125rem;
        color: var(--color-text-primary);
      }
      .profile__meta {
        color: var(--color-text-muted);
        font-family: var(--font-data);
        font-size: 0.75rem;
      }
      .profile__info {
        display: flex;
        flex-direction: column;
        gap: var(--space-component-sm);
      }
      .profile__row {
        display: flex;
        justify-content: space-between;
        margin: 0;
        padding: var(--space-component-sm) 0;
        border-bottom: 1px solid var(--color-border-muted);
        font-size: 0.875rem;
      }
      .profile__label {
        color: var(--color-text-secondary);
      }
      .profile__value {
        color: var(--color-text-primary);
        font-family: var(--font-data);
      }
      .profile__form {
        display: flex;
        flex-direction: column;
        gap: var(--space-component-md);
      }
      .profile__saved {
        color: var(--color-text-success);
        font-size: 0.875rem;
        margin: 0;
      }
      .profile__toggles {
        display: flex;
        flex-direction: column;
        gap: var(--space-component-md);
      }
    `,
  ],
})
export class ProfileComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(AuthStore);

  protected emailNotif = true;
  protected pushNotif = false;
  protected saved = false;
  protected readonly labels: Record<string, string> = { password: 'New password', confirm: 'Confirm password' };
  protected readonly getErrorMessage = getErrorMessage;

  protected readonly form = this.fb.nonNullable.group(
    {
      password: ['', [strongPasswordValidator]],
      confirm: ['', Validators.required],
    },
    { validators: matchFieldsValidator('password', 'confirm') },
  );

  protected userId(): string {
    return String(this.store.user()?.id ?? '—');
  }

  protected role(): string {
    return this.store.roles()[0] ?? '—';
  }

  protected submit(): void {
    if (this.form.invalid) return;
    this.saved = true;
    this.form.reset();
  }
}
