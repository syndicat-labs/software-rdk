import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { provideRouter, ActivatedRoute, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
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
    code: ErrorCode.AUTH_TOKEN_INVALID,
    message: 'Something failed.',
    context: {},
    retryable: false,
    httpStatus: null,
    fieldErrors: null,
    originalError: null,
    ...overrides,
  };
}

/** An observable that emits `next` synchronously on subscribe, immune to zone deferral. */
function syncSuccess(): Observable<never> {
  return new Observable<never>((subscriber) => {
    subscriber.next({} as never);
    subscriber.complete();
  });
}

function returnUrlParam(value: string | null) {
  return { get: (key: string) => (key === 'returnUrl' ? value : null) };
}

function returnUrlProviders(returnUrl: string | null) {
  return [
    { provide: APP_CONFIG, useValue: TEST_CONFIG },
    provideRouter([]),
    { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: returnUrlParam(returnUrl) } } },
  ];
}

describe('LoginComponent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    TestBed.resetTestingModule();
  });
  afterEach(() => {
    document.body.innerHTML = '';
    TestBed.resetTestingModule();
  });

  const baseProviders = [{ provide: APP_CONFIG, useValue: TEST_CONFIG }, provideRouter([])];

  it('renders the sign-in form with required controls', async () => {
    await render(LoginComponent, { providers: baseProviders });
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('does not submit when the form is invalid', async () => {
    const { fixture } = await render(LoginComponent, { providers: baseProviders });
    const auth = fixture.componentRef.injector.get(AuthService);
    const spy = jest.spyOn(auth, 'login').mockReturnValue(syncSuccess());
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(spy).not.toHaveBeenCalled();
  });

  it('logs in on a valid submit and navigates to the post-login route', async () => {
    const { fixture } = await render(LoginComponent, { providers: baseProviders });
    const auth = fixture.componentRef.injector.get(AuthService);
    const router = fixture.componentRef.injector.get(Router);
    jest.spyOn(auth, 'login').mockReturnValue(syncSuccess());
    const navSpy = jest
      .spyOn(router, 'navigateByUrl')
      .mockImplementation(() => Promise.resolve(true));

    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(auth.login).toHaveBeenCalledWith({ username: 'a@b.com', password: 'secret123' });
    expect(navSpy).toHaveBeenCalledWith('/app/dashboard');
  });

  it.each([
    ['/internal', '/internal'],
    ['https://evil.example.com', '/app/dashboard'],
    ['//evil.example.com', '/app/dashboard'],
    ['javascript:alert(1)', '/app/dashboard'],
    [null, '/app/dashboard'],
  ])('redirects to %s when returnUrl is %s', async (returnUrl, expected) => {
    const { fixture } = await render(LoginComponent, { providers: returnUrlProviders(returnUrl) });
    const router = fixture.componentRef.injector.get(Router);
    jest.spyOn(fixture.componentRef.injector.get(AuthService), 'login').mockReturnValue(syncSuccess());
    const navSpy = jest
      .spyOn(router, 'navigateByUrl')
      .mockImplementation(() => Promise.resolve(true));

    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(navSpy).toHaveBeenCalledWith(expected);
  });

  it('maps server field errors onto their controls', async () => {
    const { fixture } = await render(LoginComponent, { providers: baseProviders });
    jest
      .spyOn(fixture.componentRef.injector.get(AuthService), 'login')
      .mockReturnValue(
        throwError(() => makeError({ fieldErrors: { email: 'That email is not registered.' } })),
      );

    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    fixture.detectChanges();

    expect(screen.getByText('That email is not registered.')).toBeInTheDocument();
  });

  it('shows a banner for non-field server errors', async () => {
    const { fixture } = await render(LoginComponent, { providers: baseProviders });
    jest
      .spyOn(fixture.componentRef.injector.get(AuthService), 'login')
      .mockReturnValue(throwError(() => makeError({ message: 'Invalid credentials.' })));

    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    fixture.detectChanges();

    expect(screen.getByText('Invalid credentials.')).toBeInTheDocument();
  });
});
