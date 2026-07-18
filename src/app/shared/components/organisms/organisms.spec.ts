import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { CardComponent } from './card/card.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

// ─── CardComponent ────────────────────────────────────────────────────────────
describe('CardComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders projected body content', async () => {
    await render('<rdk-card><p>Body content</p></rdk-card>', { imports: [CardComponent] });
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('applies default variant class', async () => {
    await render('<rdk-card>Content</rdk-card>', { imports: [CardComponent] });
    expect(document.querySelector('.rdk-card--default')).toBeInTheDocument();
  });

  it('applies elevated variant class', async () => {
    await render('<rdk-card variant="elevated">Content</rdk-card>', { imports: [CardComponent] });
    expect(document.querySelector('.rdk-card--elevated')).toBeInTheDocument();
  });

  it('applies outlined variant class', async () => {
    await render('<rdk-card variant="outlined">Content</rdk-card>', { imports: [CardComponent] });
    expect(document.querySelector('.rdk-card--outlined')).toBeInTheDocument();
  });

  it('applies padding class', async () => {
    await render('<rdk-card padding="lg">Content</rdk-card>', { imports: [CardComponent] });
    expect(document.querySelector('.rdk-card--pad-lg')).toBeInTheDocument();
  });

  it('applies no-padding class', async () => {
    await render('<rdk-card padding="none">Content</rdk-card>', { imports: [CardComponent] });
    expect(document.querySelector('.rdk-card--pad-none')).toBeInTheDocument();
  });

  it('projects header slot', async () => {
    await render(
      '<rdk-card><div slot="header" id="hdr">Header</div></rdk-card>',
      { imports: [CardComponent] },
    );
    expect(document.querySelector('#hdr')).toBeInTheDocument();
  });

  it('projects footer slot', async () => {
    await render(
      '<rdk-card><div slot="footer" id="ftr">Footer</div></rdk-card>',
      { imports: [CardComponent] },
    );
    expect(document.querySelector('#ftr')).toBeInTheDocument();
  });

  it('projects actions slot', async () => {
    await render(
      '<rdk-card><div slot="actions" id="act">Actions</div></rdk-card>',
      { imports: [CardComponent] },
    );
    expect(document.querySelector('#act')).toBeInTheDocument();
  });
});

// ─── FileUploadComponent ──────────────────────────────────────────────────────
describe('FileUploadComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders the drop zone', async () => {
    await render('<rdk-file-upload />', { imports: [FileUploadComponent] });
    expect(document.querySelector('.rdk-upload__zone')).toBeInTheDocument();
  });

  it('renders upload prompt text', async () => {
    await render('<rdk-file-upload />', { imports: [FileUploadComponent] });
    expect(screen.getByText('Click to upload')).toBeInTheDocument();
  });

  it('shows accept hint when accept is set', async () => {
    await render('<rdk-file-upload accept=".pdf,.doc" />', { imports: [FileUploadComponent] });
    expect(screen.getByText('.pdf,.doc')).toBeInTheDocument();
  });

  it('shows size hint when maxSizeBytes is set', async () => {
    await render('<rdk-file-upload [maxSizeBytes]="5242880" />', { imports: [FileUploadComponent] });
    expect(screen.getByText('Max 5.0 MB')).toBeInTheDocument();
  });

  it('does not show file list initially', async () => {
    await render('<rdk-file-upload />', { imports: [FileUploadComponent] });
    expect(document.querySelector('.rdk-upload__list')).not.toBeInTheDocument();
  });

  it('adds file to list on input change', async () => {
    const { detectChanges } = await render(
      '<rdk-file-upload />',
      { imports: [FileUploadComponent] },
    );
    const input = document.querySelector<HTMLInputElement>('.rdk-upload__input')!;
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    Object.defineProperty(input, 'files', { value: { 0: file, length: 1, [Symbol.iterator]: function*() { yield file; } } });
    fireEvent.change(input);
    detectChanges();
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('emits fileSelected when files are added', async () => {
    const fn = jest.fn();
    const { detectChanges } = await render(
      '<rdk-file-upload (fileSelected)="fn($event)" />',
      { imports: [FileUploadComponent], componentProperties: { fn } },
    );
    const input = document.querySelector<HTMLInputElement>('.rdk-upload__input')!;
    const file = new File(['x'], 'doc.txt', { type: 'text/plain' });
    Object.defineProperty(input, 'files', { value: { 0: file, length: 1, [Symbol.iterator]: function*() { yield file; } } });
    fireEvent.change(input);
    detectChanges();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.calls[0][0][0].name).toBe('doc.txt');
  });

  it('shows error when file exceeds maxSizeBytes', async () => {
    const { detectChanges } = await render(
      '<rdk-file-upload [maxSizeBytes]="100" />',
      { imports: [FileUploadComponent] },
    );
    const input = document.querySelector<HTMLInputElement>('.rdk-upload__input')!;
    const bigFile = new File([new ArrayBuffer(200)], 'big.txt', { type: 'text/plain' });
    Object.defineProperty(input, 'files', { value: { 0: bigFile, length: 1, [Symbol.iterator]: function*() { yield bigFile; } } });
    fireEvent.change(input);
    detectChanges();
    expect(document.querySelector('.rdk-upload__item--error')).toBeInTheDocument();
  });
});
