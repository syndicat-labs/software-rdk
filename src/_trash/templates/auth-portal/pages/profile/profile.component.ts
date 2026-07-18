import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AuthStore } from '../../../../core/auth/auth.store';
import { FormFieldComponent } from '../../../../shared/components/molecules/form-field/form-field.component';
import { InputComponent } from '../../../../shared/components/molecules/input/input.component';
import { ButtonComponent } from '../../../../shared/components/atoms/button/button.component';
import { AvatarComponent } from '../../../../shared/components/atoms/avatar/avatar.component';
import { ToggleComponent } from '../../../../shared/components/molecules/toggle/toggle.component';
import { DividerComponent } from '../../../../shared/components/atoms/divider/divider.component';
import { strongPasswordValidator } from '../../../../shared/forms/validators/strong-password.validator';
import { matchFieldsValidator } from '../../../../shared/forms/validators/match-fields.validator';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FormFieldComponent,
    InputComponent,
    ButtonComponent,
    AvatarComponent,
    ToggleComponent,
    DividerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .profile { max-width: 600px; }
    .section { margin-bottom: 2rem; }
    .section-title { font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; color: var(--color-text-primary); }
    .account-header { display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 2rem; }
    .avatar-col { flex-shrink: 0; }
    .info-col { flex: 1; }
    .email-text { font-size: 0.875rem; color: var(--color-text-muted); margin-top: 0.25rem; }
    .form-group { margin-bottom: 1rem; }
    .toggle-group { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; }
    .toggle-label { font-size: 0.875rem; color: var(--color-text-primary); }
  `],
  template: `
    <div class="profile">
      <!-- Account Info -->
      <div class="section">
        <div class="section-title">Account</div>

        <div class="account-header">
          <div class="avatar-col">
            <rdk-avatar [name]="user()?.id || 'User'" size="lg" shape="circle" />
          </div>
          <div class="info-col">
            <form [formGroup]="accountForm" class="form-group">
              <rdk-form-field label="Display name">
                <rdk-input formControlName="displayName" />
              </rdk-form-field>
            </form>
            <p class="email-text">{{ currentEmail }}</p>
          </div>
        </div>

        <div>
          <rdk-form-field label="Email address" hint="Contact email (read-only)">
            <rdk-input [(ngModel)]="currentEmail" [disabled]="true" />
          </rdk-form-field>
        </div>
      </div>

      <rdk-divider />

      <!-- Security -->
      <div class="section">
        <div class="section-title">Security</div>

        <form [formGroup]="securityForm">
          <div class="form-group">
            <rdk-form-field label="Current password">
              <rdk-input formControlName="currentPassword" type="password" />
            </rdk-form-field>
          </div>

          <div class="form-group">
            <rdk-form-field label="New password" hint="Must be at least 8 characters with mixed case and numbers">
              <rdk-input formControlName="newPassword" type="password" />
            </rdk-form-field>
          </div>

          <div class="form-group">
            <rdk-form-field label="Confirm password">
              <rdk-input formControlName="confirmPassword" type="password" />
            </rdk-form-field>
          </div>

          <rdk-button variant="primary" (clicked)="onChangePassword()" [disabled]="securityForm.invalid">
            Change password
          </rdk-button>
        </form>
      </div>

      <rdk-divider />

      <!-- Preferences -->
      <div class="section">
        <div class="section-title">Preferences</div>

        <form [formGroup]="preferencesForm">
          <div class="toggle-group">
            <rdk-toggle formControlName="emailNotifications" />
            <label class="toggle-label">Send me email notifications</label>
          </div>

          <div class="toggle-group">
            <rdk-toggle formControlName="marketingEmails" />
            <label class="toggle-label">Send me marketing updates</label>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private readonly store = inject(AuthStore);
  private readonly fb = inject(FormBuilder);

  protected readonly user = this.store.user;
  protected currentEmail = 'user@example.com';

  protected readonly accountForm = this.fb.group({
    displayName: [''],
  });

  protected readonly securityForm = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: matchFieldsValidator('newPassword', 'confirmPassword') },
  );

  protected readonly preferencesForm = this.fb.group({
    emailNotifications: [true],
    marketingEmails: [false],
  });

  ngOnInit(): void {
    const user = this.store.user();
    if (user?.id) {
      this.accountForm.patchValue({ displayName: user.id });
    }
  }

  protected onChangePassword(): void {
    if (this.securityForm.invalid) return;
    // TODO: Wire to AuthService.changePassword() when backend ready
    this.securityForm.reset();
  }
}
