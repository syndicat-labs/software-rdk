import { TestBed } from '@angular/core/testing';
import { SafeHtmlPipe } from './safe-html.pipe';
import { TruncatePipe } from './truncate.pipe';

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    pipe = TestBed.runInInjectionContext(() => new SafeHtmlPipe());
  });

  it('returns empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('returns safe HTML for plain text', () => {
    const result = String(pipe.transform('Hello world'));
    expect(result).toContain('Hello world');
  });

  it('sanitizes script tags (XSS prevention)', () => {
    const result = String(pipe.transform('<script>alert(1)</script>safe text'));
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert(1)');
  });

  it('sanitizes javascript: href (prefixes with unsafe:)', () => {
    const result = String(pipe.transform('<a href="javascript:alert(1)">click</a>'));
    // Angular sanitizer replaces javascript: with unsafe:javascript: — not executable
    expect(result).not.toContain('"javascript:alert');
    expect(result).toContain('unsafe:');
  });
});

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('returns empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('returns string unchanged when within limit', () => {
    expect(pipe.transform('Hello', 10)).toBe('Hello');
  });

  it('truncates to maxLength + trail', () => {
    const result = pipe.transform('Hello World', 5);
    expect(result).toBe('Hello…');
  });

  it('uses custom trail', () => {
    const result = pipe.transform('Hello World', 5, '...');
    expect(result).toBe('Hello...');
  });

  it('default maxLength is 100', () => {
    const long = 'a'.repeat(150);
    const result = pipe.transform(long);
    expect(result.length).toBe(101);
    expect(result.endsWith('…')).toBe(true);
  });

  it('trims trailing whitespace before appending trail', () => {
    const result = pipe.transform('Hello   ', 5);
    expect(result).toBe('Hello…');
  });

  it('exact length returns unchanged', () => {
    expect(pipe.transform('Hello', 5)).toBe('Hello');
  });
});
