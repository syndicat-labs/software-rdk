import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ErrorDisplayComponent } from './error-display/error-display.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AppError, ErrorCode } from '../../core/errors/errors.types';

function buildError(overrides: Partial<AppError> = {}): AppError {
  return {
    code: ErrorCode.INFRASTRUCTURE_HTTP_ERROR,
    message: 'Something went wrong',
    context: {},
    retryable: false,
    httpStatus: 500,
    fieldErrors: null,
    originalError: null,
    ...overrides,
  };
}

// ─── LoadingSpinnerComponent ──────────────────────────────────────────────────

describe('LoadingSpinnerComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders with role="status"', async () => {
    await render(LoadingSpinnerComponent);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('sets aria-label from the label input', async () => {
    await render(LoadingSpinnerComponent, { componentInputs: { label: 'Loading data' } });
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading data');
  });

  it('does not show label text by default (showLabel false)', async () => {
    await render(LoadingSpinnerComponent, { componentInputs: { label: 'Loading…', showLabel: false } });
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
  });

  it('shows label text when showLabel is true', async () => {
    await render(LoadingSpinnerComponent, {
      componentInputs: { label: 'Fetching results', showLabel: true },
    });
    expect(screen.getByText('Fetching results')).toBeInTheDocument();
  });

  it('applies overlay class when overlay is true', async () => {
    await render(LoadingSpinnerComponent, { componentInputs: { overlay: true } });
    const el = screen.getByRole('status');
    expect(el.classList).toContain('rdk-loading-spinner--overlay');
  });

  it('does not apply overlay class by default', async () => {
    await render(LoadingSpinnerComponent);
    const el = screen.getByRole('status');
    expect(el.classList).not.toContain('rdk-loading-spinner--overlay');
  });
});

// ─── ErrorDisplayComponent ────────────────────────────────────────────────────

describe('ErrorDisplayComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders nothing when error is null', async () => {
    await render(ErrorDisplayComponent, { componentInputs: { error: null } });
    expect(document.querySelector('[role="alert"]')).not.toBeInTheDocument();
  });

  it('shows alert region when error is set', async () => {
    const error = buildError({ message: 'Request failed' });
    await render(ErrorDisplayComponent, { componentInputs: { error } });
    expect(document.querySelector('[role="alert"]')).toBeInTheDocument();
  });

  it('does not show retry button when error is not retryable', async () => {
    const error = buildError({ retryable: false });
    await render(ErrorDisplayComponent, { componentInputs: { error, showRetry: true } });
    expect(screen.queryByText('Try again')).not.toBeInTheDocument();
  });

  it('does not show retry button when showRetry is false even if retryable', async () => {
    const error = buildError({ retryable: true });
    await render(ErrorDisplayComponent, { componentInputs: { error, showRetry: false } });
    expect(screen.queryByText('Try again')).not.toBeInTheDocument();
  });

  it('shows retry button when error is retryable and showRetry is true', async () => {
    const error = buildError({ retryable: true });
    await render(ErrorDisplayComponent, { componentInputs: { error, showRetry: true } });
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('emits retry event when retry button clicked', async () => {
    const error = buildError({ retryable: true });
    const retryFn = jest.fn();
    await render(ErrorDisplayComponent, {
      componentInputs: { error, showRetry: true },
      on: { retry: retryFn },
    });
    fireEvent.click(screen.getByText('Try again'));
    expect(retryFn).toHaveBeenCalledTimes(1);
  });

  it('applies warn severity for auth token expired errors', async () => {
    const error = buildError({ code: ErrorCode.AUTH_TOKEN_EXPIRED, retryable: false });
    const { fixture } = await render(ErrorDisplayComponent, { componentInputs: { error } });
    const instance = fixture.componentInstance;
    expect(instance.severity).toBe('warn');
  });

  it('applies error severity for infrastructure errors', async () => {
    const error = buildError({ code: ErrorCode.INFRASTRUCTURE_HTTP_ERROR, retryable: false });
    const { fixture } = await render(ErrorDisplayComponent, { componentInputs: { error } });
    expect(fixture.componentInstance.severity).toBe('error');
  });
});

// ─── EmptyStateComponent ──────────────────────────────────────────────────────

describe('EmptyStateComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders with role="status"', async () => {
    await render(EmptyStateComponent, { componentInputs: { title: 'Nothing here' } });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders the title', async () => {
    await render(EmptyStateComponent, { componentInputs: { title: 'No results found' } });
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders message when provided', async () => {
    await render(EmptyStateComponent, {
      componentInputs: { title: 'Empty', message: 'Try adding an item.' },
    });
    expect(screen.getByText('Try adding an item.')).toBeInTheDocument();
  });

  it('does not render message element when message is undefined', async () => {
    await render(EmptyStateComponent, { componentInputs: { title: 'Empty' } });
    expect(document.querySelector('.rdk-empty-state__message')).not.toBeInTheDocument();
  });

  it('applies the icon CSS class when icon is provided', async () => {
    await render(EmptyStateComponent, {
      componentInputs: { title: 'Empty', icon: 'pi-inbox' },
    });
    const iconEl = document.querySelector('.rdk-empty-state__icon');
    expect(iconEl).toBeInTheDocument();
    expect(iconEl?.classList).toContain('pi-inbox');
  });

  it('does not render icon element when icon is omitted', async () => {
    await render(EmptyStateComponent, { componentInputs: { title: 'Empty' } });
    expect(document.querySelector('.rdk-empty-state__icon')).not.toBeInTheDocument();
  });
});

// ─── ConfirmDialogComponent ───────────────────────────────────────────────────

describe('ConfirmDialogComponent', () => {
  it('confirmed and cancelled are EventEmitter outputs', () => {
    const instance = new ConfirmDialogComponent();
    expect(typeof instance.confirmed.emit).toBe('function');
    expect(typeof instance.cancelled.emit).toBe('function');
  });

  it('confirmed emits void when called', () => {
    const instance = new ConfirmDialogComponent();
    const spy = jest.fn();
    instance.confirmed.subscribe(spy);
    instance.confirmed.emit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('cancelled emits void when called', () => {
    const instance = new ConfirmDialogComponent();
    const spy = jest.fn();
    instance.cancelled.subscribe(spy);
    instance.cancelled.emit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('ngOnDestroy completes the confirmed emitter', () => {
    const instance = new ConfirmDialogComponent();
    const completeSpy = jest.fn();
    instance.confirmed.subscribe({ complete: completeSpy });
    instance.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('ngOnDestroy completes the cancelled emitter', () => {
    const instance = new ConfirmDialogComponent();
    const completeSpy = jest.fn();
    instance.cancelled.subscribe({ complete: completeSpy });
    instance.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('has the expected default input values', () => {
    const instance = new ConfirmDialogComponent();
    expect(instance.visible).toBe(false);
    expect(instance.title).toBe('Confirm');
    expect(instance.message).toBe('Are you sure?');
    expect(instance.confirmLabel).toBe('Confirm');
    expect(instance.cancelLabel).toBe('Cancel');
    expect(instance.confirmButtonClass).toBe('p-button-danger');
  });
});
