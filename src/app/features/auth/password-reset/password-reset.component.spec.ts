import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { PasswordResetComponent } from './password-reset.component';
import { AuthService } from '../../../core/auth/auth.service';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { AppConfig, DEFAULT_AUTH_CONFIG } from '../../../core/config/app-config.model';
import { AppError, ErrorCode } from '../../../core/errors/errors.types';

const TEST_CONFIG: AppConfig = {
  environment: { production: false, apiBaseUrl: '', authBaseUrl: '', logLevel: 'error' },
  api: { baseUrl: '', timeoutMs: 1000, maxRetries: 0 },
  auth: DEFAULT_AUTH_CONFIG,
  features: {},
};

function makeError(overrides: Partial<AppError>): AppError {
  return {
    code: ErrorCode.VALIDATION_ERROR,
    message: 'Something failed.',
    context: {},
    retryable: false,
    httpStatus: null,
    fieldErrors: null,
    originalError: null,
    ...overrides,
  };
}

function syncSuccess(): Observable<void> {
  return new Observable<void>((subscriber) => {
    subscriber.next();
    subscriber.complete();
  });
}

function queryParam(value: string | null) {
  return { get: (key: string) => (key === 'token' ? value : null) };
}

function providersWithToken(token: string | null) {
  return [
    { provide: APP_CONFIG, useValue: TEST_CONFIG },
    provideRouter([]),
    { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: queryParam(token) } } },
  ];
}

describe('PasswordResetComponent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    TestBed.resetTestingModule();
  });
  afterEach(() => {
    document.body.innerHTML = '';
    TestBed.resetTestingModule();
  });

  it('renders the request form when no token is present', async () => {
    await render(PasswordResetComponent, { providers: providersWithToken(null) });
    expect(screen.getByRole('heading', { name: /reset your password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('requests a reset link and shows a confirmation', async () => {
    const { fixture } = await render(PasswordResetComponent, { providers: providersWithToken(null) });
    const auth = fixture.componentRef.injector.get(AuthService);
    const spy = jest.spyOn(auth, 'requestReset').mockReturnValue(syncSuccess());

    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('a@b.com');
    expect(screen.getByRole('heading', { name: /check your email/i })).toBeInTheDocument();
  });

  it('does not request when the email is invalid', async () => {
    const { fixture } = await render(PasswordResetComponent, { providers: providersWithToken(null) });
    const spy = jest.spyOn(fixture.componentRef.injector.get(AuthService), 'requestReset');
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    expect(spy).not.toHaveBeenCalled();
  });

  it('shows an error banner when the request fails', async () => {
    const { fixture } = await render(PasswordResetComponent, { providers: providersWithToken(null) });
    jest
      .spyOn(fixture.componentRef.injector.get(AuthService), 'requestReset')
      .mockReturnValue(throwError(() => makeError({ message: 'Request failed.' })));

    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    fixture.detectChanges();

    expect(screen.getByText('Request failed.')).toBeInTheDocument();
  });

  it('renders the confirm form when a token is present', async () => {
    await render(PasswordResetComponent, { providers: providersWithToken('reset-tok') });
    expect(screen.getByRole('heading', { name: /set a new password/i })).toBeInTheDocument();
    expect(document.getElementById('reset-new-password')).not.toBeNull();
    expect(document.getElementById('reset-confirm')).not.toBeNull();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
  });

  it('rejects a weak or mismatching new password', async () => {
    const { fixture } = await render(PasswordResetComponent, {
      providers: providersWithToken('reset-tok'),
    });
    const spy = jest.spyOn(fixture.componentRef.injector.get(AuthService), 'resetPassword');
    const pwd = document.getElementById('reset-new-password') as HTMLElement;
    const confirm = document.getElementById('reset-confirm') as HTMLElement;
    fireEvent.input(pwd, { target: { value: 'weak' } });
    fireEvent.blur(pwd);
    fireEvent.input(confirm, { target: { value: 'weak' } });
    fireEvent.blur(confirm);
    fixture.detectChanges();
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: /reset password/i }).disabled,
    ).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    expect(spy).not.toHaveBeenCalled();
  });

  it('resets the password with the token and shows success', async () => {
    const { fixture } = await render(PasswordResetComponent, {
      providers: providersWithToken('reset-tok'),
    });
    const auth = fixture.componentRef.injector.get(AuthService);
    const spy = jest.spyOn(auth, 'resetPassword').mockReturnValue(syncSuccess());

    fireEvent.input(document.getElementById('reset-new-password') as HTMLElement, {
      target: { value: 'StrongPass1!' },
    });
    fireEvent.input(document.getElementById('reset-confirm') as HTMLElement, {
      target: { value: 'StrongPass1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({ token: 'reset-tok', password: 'StrongPass1!' });
    expect(screen.getByRole('heading', { name: /password updated/i })).toBeInTheDocument();
  });

  it('shows an error banner when the reset fails', async () => {
    const { fixture } = await render(PasswordResetComponent, {
      providers: providersWithToken('reset-tok'),
    });
    jest
      .spyOn(fixture.componentRef.injector.get(AuthService), 'resetPassword')
      .mockReturnValue(throwError(() => makeError({ message: 'Token invalid or expired.' })));

    fireEvent.input(document.getElementById('reset-new-password') as HTMLElement, {
      target: { value: 'StrongPass1!' },
    });
    fireEvent.input(document.getElementById('reset-confirm') as HTMLElement, {
      target: { value: 'StrongPass1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    fixture.detectChanges();

    expect(screen.getByText('Token invalid or expired.')).toBeInTheDocument();
  });

  it('maps field errors from the reset endpoint onto the form', async () => {
    const { fixture } = await render(PasswordResetComponent, {
      providers: providersWithToken('reset-tok'),
    });
    jest
      .spyOn(fixture.componentRef.injector.get(AuthService), 'resetPassword')
      .mockReturnValue(
        throwError(() => makeError({ fieldErrors: { password: 'That password is too common.' } })),
      );

    fireEvent.input(document.getElementById('reset-new-password') as HTMLElement, {
      target: { value: 'StrongPass1!' },
    });
    fireEvent.input(document.getElementById('reset-confirm') as HTMLElement, {
      target: { value: 'StrongPass1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    fixture.detectChanges();

    expect(screen.getByText('That password is too common.')).toBeInTheDocument();
  });
});
