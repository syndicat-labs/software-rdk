import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { provideRouter, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
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

function syncSuccess(): Observable<never> {
  return new Observable((subscriber) => {
    subscriber.next({} as never);
    subscriber.complete();
  });
}

function inputById(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing input #${id}`);
  return el;
}

async function fillValidRegistration(_fixture: unknown): Promise<void> {
  fireEvent.input(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } });
  fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
  fireEvent.input(inputById('register-password'), { target: { value: 'StrongPass1!' } });
  fireEvent.input(inputById('register-confirm'), { target: { value: 'StrongPass1!' } });
}

describe('RegisterComponent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    TestBed.resetTestingModule();
  });
  afterEach(() => {
    document.body.innerHTML = '';
    TestBed.resetTestingModule();
  });

  const baseProviders = [{ provide: APP_CONFIG, useValue: TEST_CONFIG }, provideRouter([])];

  it('renders the account creation form', async () => {
    await render(RegisterComponent, { providers: baseProviders });
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(document.getElementById('register-password')).not.toBeNull();
    expect(document.getElementById('register-confirm')).not.toBeNull();
  });

  it('does not submit while the form is invalid', async () => {
    const { fixture } = await render(RegisterComponent, { providers: baseProviders });
    const spy = jest
      .spyOn(fixture.componentRef.injector.get(AuthService), 'register')
      .mockReturnValue(syncSuccess());
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(spy).not.toHaveBeenCalled();
  });

  it('rejects a weak password with a validation message', async () => {
    const { fixture } = await render(RegisterComponent, { providers: baseProviders });
    fireEvent.input(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } });
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    const pwd = inputById('register-password');
    const confirm = inputById('register-confirm');
    fireEvent.input(pwd, { target: { value: 'short' } });
    fireEvent.blur(pwd);
    fireEvent.input(confirm, { target: { value: 'short' } });
    fireEvent.blur(confirm);
    fixture.detectChanges();

    const button = screen.getByRole<HTMLButtonElement>('button', {
      name: /create account/i,
    });
    expect(button.disabled).toBe(true);
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it('rejects mismatched confirm password', async () => {
    const { fixture } = await render(RegisterComponent, { providers: baseProviders });
    fireEvent.input(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } });
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    const pwd = inputById('register-password');
    const confirm = inputById('register-confirm');
    fireEvent.input(pwd, { target: { value: 'StrongPass1!' } });
    fireEvent.blur(pwd);
    fireEvent.input(confirm, { target: { value: 'Different1!' } });
    fireEvent.blur(confirm);
    fixture.detectChanges();

    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: /create account/i }).disabled,
    ).toBe(true);
    expect(screen.getByText(/does not match/i)).toBeInTheDocument();
  });

  it('registers on a valid submit and navigates to the post-login route', async () => {
    const { fixture } = await render(RegisterComponent, { providers: baseProviders });
    const auth = fixture.componentRef.injector.get(AuthService);
    const router = fixture.componentRef.injector.get(Router);
    jest.spyOn(auth, 'register').mockReturnValue(syncSuccess());
    const navSpy = jest
      .spyOn(router, 'navigateByUrl')
      .mockImplementation(() => Promise.resolve(true));

    await fillValidRegistration(fixture);
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(auth.register).toHaveBeenCalledWith({
      name: 'Jane Doe',
      username: 'jane@example.com',
      password: 'StrongPass1!',
    });
    expect(navSpy).toHaveBeenCalledWith('/app/dashboard');
  });

  it('maps server field errors onto their controls', async () => {
    const { fixture } = await render(RegisterComponent, { providers: baseProviders });
    jest
      .spyOn(fixture.componentRef.injector.get(AuthService), 'register')
      .mockReturnValue(
        throwError(() => makeError({ fieldErrors: { email: 'That email is already in use.' } })),
      );

    await fillValidRegistration(fixture);
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    fixture.detectChanges();

    expect(screen.getByText('That email is already in use.')).toBeInTheDocument();
  });

  it('shows a banner for non-field server errors', async () => {
    const { fixture } = await render(RegisterComponent, { providers: baseProviders });
    jest
      .spyOn(fixture.componentRef.injector.get(AuthService), 'register')
      .mockReturnValue(throwError(() => makeError({ message: 'Registration unavailable.' })));

    await fillValidRegistration(fixture);
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    fixture.detectChanges();

    expect(screen.getByText('Registration unavailable.')).toBeInTheDocument();
  });
});
