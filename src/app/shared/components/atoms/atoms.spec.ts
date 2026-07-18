import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { ButtonComponent } from './button/button.component';
import { BadgeComponent } from './badge/badge.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ChipComponent } from './chip/chip.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { DividerComponent } from './divider/divider.component';
import { IconComponent } from './icon/icon.component';

// ─── ButtonComponent ──────────────────────────────────────────────────────────
describe('ButtonComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders projected label text', async () => {
    await render('<rdk-button>Save</rdk-button>', { imports: [ButtonComponent] });
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('has type="button" by default', async () => {
    await render('<rdk-button>Go</rdk-button>', { imports: [ButtonComponent] });
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('is disabled when disabled=true', async () => {
    await render('<rdk-button [disabled]="true">Go</rdk-button>', { imports: [ButtonComponent] });
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when loading=true', async () => {
    await render('<rdk-button [loading]="true">Go</rdk-button>', { imports: [ButtonComponent] });
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows spinner element when loading', async () => {
    await render('<rdk-button [loading]="true">Go</rdk-button>', { imports: [ButtonComponent] });
    expect(document.querySelector('.rdk-btn__spinner')).toBeInTheDocument();
  });

  it('does not show spinner when not loading', async () => {
    await render('<rdk-button>Go</rdk-button>', { imports: [ButtonComponent] });
    expect(document.querySelector('.rdk-btn__spinner')).not.toBeInTheDocument();
  });

  it('emits clicked event on click', async () => {
    const clickFn = jest.fn();
    await render('<rdk-button (clicked)="onClick($event)">Go</rdk-button>', {
      imports: [ButtonComponent],
      componentProperties: { onClick: clickFn },
    });
    fireEvent.click(screen.getByRole('button'));
    expect(clickFn).toHaveBeenCalledTimes(1);
  });

  it('does not emit clicked when disabled', async () => {
    const clickFn = jest.fn();
    await render('<rdk-button [disabled]="true" (clicked)="onClick($event)">Go</rdk-button>', {
      imports: [ButtonComponent],
      componentProperties: { onClick: clickFn },
    });
    fireEvent.click(screen.getByRole('button'));
    expect(clickFn).not.toHaveBeenCalled();
  });

  it('applies variant class', async () => {
    await render('<rdk-button variant="danger">Delete</rdk-button>', { imports: [ButtonComponent] });
    expect(document.querySelector('.rdk-btn--danger')).toBeInTheDocument();
  });

  it('applies size class', async () => {
    await render('<rdk-button size="sm">Small</rdk-button>', { imports: [ButtonComponent] });
    expect(document.querySelector('.rdk-btn--sm')).toBeInTheDocument();
  });

  it('applies full-width class', async () => {
    await render('<rdk-button [fullWidth]="true">Full</rdk-button>', { imports: [ButtonComponent] });
    expect(document.querySelector('.rdk-btn--full')).toBeInTheDocument();
  });

  it('renders left icon when icon and iconPos=left', async () => {
    await render('<rdk-button icon="pi-save" iconPos="left">Save</rdk-button>', { imports: [ButtonComponent] });
    expect(document.querySelector('.rdk-btn__icon--left')).toBeInTheDocument();
  });

  it('renders right icon when iconPos=right', async () => {
    await render('<rdk-button icon="pi-arrow-right" iconPos="right">Next</rdk-button>', { imports: [ButtonComponent] });
    expect(document.querySelector('.rdk-btn__icon--right')).toBeInTheDocument();
  });

  it('does not show icon while loading (spinner replaces it)', async () => {
    await render('<rdk-button icon="pi-save" [loading]="true">Save</rdk-button>', { imports: [ButtonComponent] });
    expect(document.querySelector('.rdk-btn__icon--left')).not.toBeInTheDocument();
    expect(document.querySelector('.rdk-btn__spinner')).toBeInTheDocument();
  });
});

// ─── BadgeComponent ───────────────────────────────────────────────────────────
describe('BadgeComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders projected content', async () => {
    await render('<rdk-badge>New</rdk-badge>', { imports: [BadgeComponent] });
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant class', async () => {
    await render('<rdk-badge variant="success">OK</rdk-badge>', { imports: [BadgeComponent] });
    expect(document.querySelector('.rdk-badge--success')).toBeInTheDocument();
  });

  it('applies size class', async () => {
    await render('<rdk-badge size="lg">Big</rdk-badge>', { imports: [BadgeComponent] });
    expect(document.querySelector('.rdk-badge--lg')).toBeInTheDocument();
  });

  it('renders dot element when dot=true', async () => {
    await render('<rdk-badge [dot]="true">Live</rdk-badge>', { imports: [BadgeComponent] });
    expect(document.querySelector('.rdk-badge__dot')).toBeInTheDocument();
  });

  it('renders dismiss button when dismissible=true', async () => {
    await render('<rdk-badge [dismissible]="true">Label</rdk-badge>', { imports: [BadgeComponent] });
    expect(document.querySelector('.rdk-badge__dismiss')).toBeInTheDocument();
  });

  it('emits dismissed when dismiss button clicked', async () => {
    const fn = jest.fn();
    await render('<rdk-badge [dismissible]="true" (dismissed)="fn()">Label</rdk-badge>', {
      imports: [BadgeComponent],
      componentProperties: { fn },
    });
    fireEvent.click(document.querySelector('.rdk-badge__dismiss')!);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

// ─── AvatarComponent ─────────────────────────────────────────────────────────
describe('AvatarComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders img when src is provided', async () => {
    await render('<rdk-avatar src="/a.jpg" alt="User" />', { imports: [AvatarComponent] });
    expect(document.querySelector('img')).toBeInTheDocument();
  });

  it('shows initials when name is provided and no src', async () => {
    await render('<rdk-avatar name="Jane Doe" />', { imports: [AvatarComponent] });
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('shows single initial for single-word name', async () => {
    await render('<rdk-avatar name="Alice" />', { imports: [AvatarComponent] });
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('shows icon fallback when no src or name', async () => {
    await render('<rdk-avatar />', { imports: [AvatarComponent] });
    expect(document.querySelector('.rdk-avatar__icon')).toBeInTheDocument();
  });

  it('falls back to initials on image load error', async () => {
    const { detectChanges } = await render(
      '<rdk-avatar src="/bad.jpg" name="Test User" />',
      { imports: [AvatarComponent] },
    );
    const img = document.querySelector('img')!;
    fireEvent.error(img);
    detectChanges();
    expect(screen.getByText('TU')).toBeInTheDocument();
  });

  it('applies size class', async () => {
    await render('<rdk-avatar size="xl" />', { imports: [AvatarComponent] });
    expect(document.querySelector('.rdk-avatar--xl')).toBeInTheDocument();
  });

  it('applies shape class', async () => {
    await render('<rdk-avatar shape="rounded" />', { imports: [AvatarComponent] });
    expect(document.querySelector('.rdk-avatar--rounded')).toBeInTheDocument();
  });

  it('has role=img', async () => {
    await render('<rdk-avatar name="A" />', { imports: [AvatarComponent] });
    expect(document.querySelector('[role="img"]')).toBeInTheDocument();
  });
});

// ─── ChipComponent ────────────────────────────────────────────────────────────
describe('ChipComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders label', async () => {
    await render('<rdk-chip label="Angular" />', { imports: [ChipComponent] });
    expect(screen.getByText('Angular')).toBeInTheDocument();
  });

  it('renders icon when provided', async () => {
    await render('<rdk-chip label="A" icon="pi-tag" />', { imports: [ChipComponent] });
    expect(document.querySelector('.pi-tag')).toBeInTheDocument();
  });

  it('emits selectedChange when selectable and clicked', async () => {
    const fn = jest.fn();
    await render(
      '<rdk-chip label="Tag" [selectable]="true" (selectedChange)="fn($event)" />',
      { imports: [ChipComponent], componentProperties: { fn } },
    );
    fireEvent.click(document.querySelector('.rdk-chip')!);
    expect(fn).toHaveBeenCalledWith(true);
  });

  it('does not emit selectedChange when disabled', async () => {
    const fn = jest.fn();
    await render(
      '<rdk-chip label="Tag" [selectable]="true" [disabled]="true" (selectedChange)="fn($event)" />',
      { imports: [ChipComponent], componentProperties: { fn } },
    );
    fireEvent.click(document.querySelector('.rdk-chip')!);
    expect(fn).not.toHaveBeenCalled();
  });

  it('shows dismiss button when dismissible=true', async () => {
    await render('<rdk-chip label="X" [dismissible]="true" />', { imports: [ChipComponent] });
    expect(document.querySelector('.rdk-chip__dismiss')).toBeInTheDocument();
  });

  it('emits dismissed when dismiss clicked', async () => {
    const fn = jest.fn();
    await render(
      '<rdk-chip label="X" [dismissible]="true" (dismissed)="fn()" />',
      { imports: [ChipComponent], componentProperties: { fn } },
    );
    fireEvent.click(document.querySelector('.rdk-chip__dismiss')!);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('applies variant class', async () => {
    await render('<rdk-chip label="OK" variant="success" />', { imports: [ChipComponent] });
    expect(document.querySelector('.rdk-chip--success')).toBeInTheDocument();
  });
});

// ─── SpinnerComponent ─────────────────────────────────────────────────────────
describe('SpinnerComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders with role=status', async () => {
    await render('<rdk-spinner />', { imports: [SpinnerComponent] });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('sets aria-label from label input', async () => {
    await render('<rdk-spinner label="Fetching data" />', { imports: [SpinnerComponent] });
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Fetching data');
  });

  it('shows label text when showLabel=true', async () => {
    await render('<rdk-spinner label="Loading…" [showLabel]="true" />', { imports: [SpinnerComponent] });
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('does not show label text when showLabel=false (default)', async () => {
    await render('<rdk-spinner label="Loading…" />', { imports: [SpinnerComponent] });
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
  });

  it('applies size class', async () => {
    await render('<rdk-spinner size="lg" />', { imports: [SpinnerComponent] });
    expect(document.querySelector('.rdk-spinner--lg')).toBeInTheDocument();
  });

  it('applies overlay class when overlay=true', async () => {
    await render('<rdk-spinner [overlay]="true" />', { imports: [SpinnerComponent] });
    expect(document.querySelector('.rdk-spinner--overlay')).toBeInTheDocument();
  });

  it('applies color class', async () => {
    await render('<rdk-spinner color="success" />', { imports: [SpinnerComponent] });
    expect(document.querySelector('.rdk-spinner--success')).toBeInTheDocument();
  });

  it('renders the ring element', async () => {
    await render('<rdk-spinner />', { imports: [SpinnerComponent] });
    expect(document.querySelector('.rdk-spinner__ring')).toBeInTheDocument();
  });
});

// ─── DividerComponent ─────────────────────────────────────────────────────────
describe('DividerComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders with role=separator', async () => {
    await render('<rdk-divider />', { imports: [DividerComponent] });
    expect(document.querySelector('[role="separator"]')).toBeInTheDocument();
  });

  it('has aria-orientation=horizontal by default', async () => {
    await render('<rdk-divider />', { imports: [DividerComponent] });
    expect(document.querySelector('[role="separator"]')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('has aria-orientation=vertical when direction=v', async () => {
    await render('<rdk-divider direction="v" />', { imports: [DividerComponent] });
    expect(document.querySelector('[role="separator"]')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renders label text when label is provided', async () => {
    await render('<rdk-divider label="Or" />', { imports: [DividerComponent] });
    expect(screen.getByText('Or')).toBeInTheDocument();
  });

  it('does not render label element when label is omitted', async () => {
    await render('<rdk-divider />', { imports: [DividerComponent] });
    expect(document.querySelector('.rdk-divider__label')).not.toBeInTheDocument();
  });

  it('applies direction class', async () => {
    await render('<rdk-divider direction="v" />', { imports: [DividerComponent] });
    expect(document.querySelector('.rdk-divider--v')).toBeInTheDocument();
  });
});

// ─── IconComponent ────────────────────────────────────────────────────────────
describe('IconComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('applies the icon name as a class', async () => {
    await render('<rdk-icon name="pi-home" />', { imports: [IconComponent] });
    expect(document.querySelector('.pi-home')).toBeInTheDocument();
  });

  it('is aria-hidden when decorative=true (default)', async () => {
    await render('<rdk-icon name="pi-home" />', { imports: [IconComponent] });
    expect(document.querySelector('.rdk-icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('has role=img and aria-label when decorative=false', async () => {
    await render('<rdk-icon name="pi-home" [decorative]="false" label="Home" />', { imports: [IconComponent] });
    const el = document.querySelector('.rdk-icon');
    expect(el).toHaveAttribute('role', 'img');
    expect(el).toHaveAttribute('aria-label', 'Home');
  });

  it('applies size class', async () => {
    await render('<rdk-icon name="pi-home" size="xl" />', { imports: [IconComponent] });
    expect(document.querySelector('.rdk-icon--xl')).toBeInTheDocument();
  });
});
