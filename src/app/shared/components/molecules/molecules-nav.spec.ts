import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertComponent } from './alert/alert.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { PaginationComponent } from './pagination/pagination.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

// ─── AlertComponent ───────────────────────────────────────────────────────────
describe('AlertComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders with role=alert', async () => {
    await render('<rdk-alert message="Hello" />', { imports: [AlertComponent] });
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders message text', async () => {
    await render('<rdk-alert message="Something went wrong" />', { imports: [AlertComponent] });
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders title when provided', async () => {
    await render('<rdk-alert title="Error" message="Details here" />', { imports: [AlertComponent] });
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('shows icon by default', async () => {
    await render('<rdk-alert message="Test" />', { imports: [AlertComponent] });
    expect(document.querySelector('.rdk-alert__icon')).toBeInTheDocument();
  });

  it('hides icon when showIcon=false', async () => {
    await render('<rdk-alert message="Test" [showIcon]="false" />', { imports: [AlertComponent] });
    expect(document.querySelector('.rdk-alert__icon')).not.toBeInTheDocument();
  });

  it('applies severity class', async () => {
    await render('<rdk-alert severity="success" message="OK" />', { imports: [AlertComponent] });
    expect(document.querySelector('.rdk-alert--success')).toBeInTheDocument();
  });

  it('shows dismiss button when dismissible=true', async () => {
    await render('<rdk-alert message="X" [dismissible]="true" />', { imports: [AlertComponent] });
    expect(document.querySelector('.rdk-alert__close')).toBeInTheDocument();
  });

  it('hides alert when dismiss clicked', async () => {
    const { detectChanges } = await render(
      '<rdk-alert message="X" [dismissible]="true" />',
      { imports: [AlertComponent] },
    );
    fireEvent.click(document.querySelector('.rdk-alert__close')!);
    detectChanges();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('emits dismissed event', async () => {
    const fn = jest.fn();
    await render('<rdk-alert message="X" [dismissible]="true" (dismissed)="fn()" />', {
      imports: [AlertComponent],
      componentProperties: { fn },
    });
    fireEvent.click(document.querySelector('.rdk-alert__close')!);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('projects custom content', async () => {
    await render(
      '<rdk-alert><span id="custom">Custom body</span></rdk-alert>',
      { imports: [AlertComponent] },
    );
    expect(document.querySelector('#custom')).toBeInTheDocument();
  });

  it('sets aria-live=assertive for error severity', async () => {
    await render('<rdk-alert severity="error" message="E" />', { imports: [AlertComponent] });
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });
});

// ─── SearchInputComponent ─────────────────────────────────────────────────────
describe('SearchInputComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders a search input', async () => {
    await render('<rdk-search-input />', { imports: [SearchInputComponent] });
    expect(document.querySelector('input[type="search"]')).toBeInTheDocument();
  });

  it('sets placeholder', async () => {
    await render('<rdk-search-input placeholder="Find items…" />', { imports: [SearchInputComponent] });
    expect(document.querySelector('input')).toHaveAttribute('placeholder', 'Find items…');
  });

  it('shows clear button after typing', async () => {
    const { detectChanges } = await render('<rdk-search-input />', { imports: [SearchInputComponent] });
    fireEvent.input(document.querySelector('input')!, { target: { value: 'angular' } });
    detectChanges();
    expect(document.querySelector('.rdk-search__clear')).toBeInTheDocument();
  });

  it('does not show clear button on empty input', async () => {
    await render('<rdk-search-input />', { imports: [SearchInputComponent] });
    expect(document.querySelector('.rdk-search__clear')).not.toBeInTheDocument();
  });

  it('clears value and emits cleared when clear button clicked', async () => {
    const fn = jest.fn();
    const { detectChanges } = await render(
      '<rdk-search-input (cleared)="fn()" />',
      { imports: [SearchInputComponent], componentProperties: { fn } },
    );
    fireEvent.input(document.querySelector('input')!, { target: { value: 'test' } });
    detectChanges();
    fireEvent.click(document.querySelector('.rdk-search__clear')!);
    detectChanges();
    expect(fn).toHaveBeenCalledTimes(1);
    expect((document.querySelector('input') as HTMLInputElement).value).toBe('');
  });

  it('is disabled when disabled=true', async () => {
    await render('<rdk-search-input [disabled]="true" />', { imports: [SearchInputComponent] });
    expect(document.querySelector('input')).toBeDisabled();
  });
});

// ─── PaginationComponent ──────────────────────────────────────────────────────
describe('PaginationComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders navigation element', async () => {
    await render('<rdk-pagination [total]="100" />', { imports: [PaginationComponent] });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('shows range info', async () => {
    await render('<rdk-pagination [total]="100" [page]="1" [pageSize]="10" />', {
      imports: [PaginationComponent],
    });
    expect(screen.getByText('1–10 of 100')).toBeInTheDocument();
  });

  it('disables previous button on first page', async () => {
    await render('<rdk-pagination [total]="50" [page]="1" />', { imports: [PaginationComponent] });
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('First page')).toBeDisabled();
  });

  it('emits pageChange when next clicked', async () => {
    const fn = jest.fn();
    await render('<rdk-pagination [total]="50" [page]="1" [pageSize]="10" (pageChange)="fn($event)" />', {
      imports: [PaginationComponent],
      componentProperties: { fn },
    });
    fireEvent.click(screen.getByLabelText('Next page'));
    expect(fn).toHaveBeenCalledWith(2);
  });

  it('shows page size selector when showPageSize=true', async () => {
    await render('<rdk-pagination [total]="100" [showPageSize]="true" />', {
      imports: [PaginationComponent],
    });
    expect(screen.getByLabelText('Rows per page:')).toBeInTheDocument();
  });

  it('emits pageSizeChange when selector changed', async () => {
    const fn = jest.fn();
    await render(
      '<rdk-pagination [total]="100" [showPageSize]="true" (pageSizeChange)="fn($event)" />',
      { imports: [PaginationComponent], componentProperties: { fn } },
    );
    fireEvent.change(screen.getByLabelText('Rows per page:'), { target: { value: '25' } });
    expect(fn).toHaveBeenCalledWith(25);
  });

  it('disables next/last on last page', async () => {
    await render('<rdk-pagination [total]="10" [page]="1" [pageSize]="10" />', {
      imports: [PaginationComponent],
    });
    expect(screen.getByLabelText('Next page')).toBeDisabled();
    expect(screen.getByLabelText('Last page')).toBeDisabled();
  });
});

// ─── BreadcrumbComponent ──────────────────────────────────────────────────────
describe('BreadcrumbComponent', () => {
  const items = [
    { label: 'Home', path: '/' },
    { label: 'Settings', path: '/settings' },
    { label: 'Profile' },
  ];

  beforeEach(() => TestBed.resetTestingModule());

  it('renders nav element with aria-label', async () => {
    await render('<rdk-breadcrumb [items]="items" />', {
      imports: [BreadcrumbComponent, RouterTestingModule],
      componentProperties: { items },
    });
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('renders all item labels', async () => {
    await render('<rdk-breadcrumb [items]="items" />', {
      imports: [BreadcrumbComponent, RouterTestingModule],
      componentProperties: { items },
    });
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('last item has aria-current=page', async () => {
    await render('<rdk-breadcrumb [items]="items" />', {
      imports: [BreadcrumbComponent, RouterTestingModule],
      componentProperties: { items },
    });
    expect(screen.getByText('Profile')).toHaveAttribute('aria-current', 'page');
  });

  it('non-last items with path render as links', async () => {
    await render('<rdk-breadcrumb [items]="items" />', {
      imports: [BreadcrumbComponent, RouterTestingModule],
      componentProperties: { items },
    });
    expect(document.querySelector('.rdk-breadcrumb__link')).toBeInTheDocument();
  });

  it('last item renders as span (not link)', async () => {
    await render('<rdk-breadcrumb [items]="items" />', {
      imports: [BreadcrumbComponent, RouterTestingModule],
      componentProperties: { items },
    });
    expect(document.querySelector('.rdk-breadcrumb__current')).toBeInTheDocument();
  });
});
