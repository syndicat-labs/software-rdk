import { TestBed } from '@angular/core/testing';
import { RelativeTimePipe } from './relative-time.pipe';
import { FileSizePipe } from './file-size.pipe';
import { InitialsPipe } from './initials.pipe';
import { HighlightPipe } from './highlight.pipe';

// ─── RelativeTimePipe ─────────────────────────────────────────────────────────
describe('RelativeTimePipe', () => {
  let pipe: RelativeTimePipe;
  beforeEach(() => { pipe = new RelativeTimePipe(); });

  it('returns empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('returns empty string for invalid date', () => {
    expect(pipe.transform('not-a-date')).toBe('');
  });

  it('returns "just now" for < 45 seconds ago', () => {
    const d = new Date(Date.now() - 10_000);
    expect(pipe.transform(d)).toBe('just now');
  });

  it('returns "1 minute ago" for ~60 seconds ago', () => {
    const d = new Date(Date.now() - 60_000);
    expect(pipe.transform(d)).toBe('1 minute ago');
  });

  it('returns "X minutes ago" for < 45 minutes', () => {
    const d = new Date(Date.now() - 10 * 60_000);
    expect(pipe.transform(d)).toBe('10 minutes ago');
  });

  it('returns "1 hour ago" for ~60 minutes ago', () => {
    const d = new Date(Date.now() - 75 * 60_000);
    expect(pipe.transform(d)).toBe('1 hour ago');
  });

  it('returns "X hours ago" for hours', () => {
    const d = new Date(Date.now() - 5 * 3600_000);
    expect(pipe.transform(d)).toBe('5 hours ago');
  });

  it('returns "1 day ago" for ~24 hours', () => {
    const d = new Date(Date.now() - 30 * 3600_000);
    expect(pipe.transform(d)).toBe('1 day ago');
  });

  it('returns "in X minutes" for future date', () => {
    const d = new Date(Date.now() + 10 * 60_000);
    expect(pipe.transform(d)).toBe('in 10 minutes');
  });

  it('accepts ISO string', () => {
    const d = new Date(Date.now() - 10_000).toISOString();
    expect(pipe.transform(d)).toBe('just now');
  });

  it('accepts timestamp number', () => {
    const d = Date.now() - 10_000;
    expect(pipe.transform(d)).toBe('just now');
  });
});

// ─── FileSizePipe ─────────────────────────────────────────────────────────────
describe('FileSizePipe', () => {
  let pipe: FileSizePipe;
  beforeEach(() => { pipe = new FileSizePipe(); });

  it('returns empty for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('returns "0 B" for 0', () => {
    expect(pipe.transform(0)).toBe('0 B');
  });

  it('formats bytes', () => {
    expect(pipe.transform(512)).toBe('512 B');
  });

  it('formats kilobytes', () => {
    expect(pipe.transform(1024)).toBe('1.0 KB');
  });

  it('formats megabytes', () => {
    expect(pipe.transform(1536000)).toBe('1.5 MB');
  });

  it('formats gigabytes', () => {
    expect(pipe.transform(2 * 1024 ** 3)).toBe('2.0 GB');
  });

  it('respects decimals parameter', () => {
    expect(pipe.transform(1536000, 2)).toBe('1.46 MB');
  });

  it('returns empty for negative', () => {
    expect(pipe.transform(-1)).toBe('');
  });
});

// ─── InitialsPipe ─────────────────────────────────────────────────────────────
describe('InitialsPipe', () => {
  let pipe: InitialsPipe;
  beforeEach(() => { pipe = new InitialsPipe(); });

  it('returns empty for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('returns empty for empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('extracts two initials from full name', () => {
    expect(pipe.transform('Jane Doe')).toBe('JD');
  });

  it('uses single initial for single-word name', () => {
    expect(pipe.transform('Alice')).toBe('A');
  });

  it('limits to maxChars parameter', () => {
    expect(pipe.transform('John Michael Doe', 3)).toBe('JMD');
    expect(pipe.transform('John Michael Doe', 1)).toBe('J');
  });

  it('handles extra whitespace', () => {
    expect(pipe.transform('  Bob   Smith  ')).toBe('BS');
  });

  it('uppercases initials', () => {
    expect(pipe.transform('alice bob')).toBe('AB');
  });
});

// ─── HighlightPipe ────────────────────────────────────────────────────────────
describe('HighlightPipe', () => {
  let pipe: HighlightPipe;

  beforeEach(() => {
    pipe = TestBed.runInInjectionContext(() => new HighlightPipe());
  });

  it('returns empty string for null text', () => {
    const result = pipe.transform(null, 'foo');
    expect(result).toBe('');
  });

  it('returns original text when query is null', () => {
    expect(pipe.transform('hello world', null)).toBe('hello world');
  });

  it('returns original text when query is empty', () => {
    expect(pipe.transform('hello world', '')).toBe('hello world');
  });

  it('wraps matching text in <mark>', () => {
    const result = pipe.transform('hello world', 'world') as string;
    expect(result.toString()).toContain('<mark>world</mark>');
  });

  it('is case-insensitive', () => {
    const result = pipe.transform('Hello World', 'hello') as string;
    expect(result.toString()).toContain('<mark>');
  });

  it('escapes regex special characters in query', () => {
    expect(() => pipe.transform('price is $10.00', '$10.00')).not.toThrow();
  });
});
