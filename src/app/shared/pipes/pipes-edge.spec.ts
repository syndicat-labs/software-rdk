import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { HighlightPipe } from './highlight.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { InitialsPipe } from './initials.pipe';
import { RelativeTimePipe } from './relative-time.pipe';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

describe('HighlightPipe (sanitizer returns null)', () => {
  it('falls back to empty string when sanitize returns null', () => {
    TestBed.configureTestingModule({
      providers: [
        HighlightPipe,
        {
          provide: DomSanitizer,
          useValue: { sanitize: () => null, bypassSecurityTrustHtml: (v: string) => v },
        },
      ],
    });
    const pipe = TestBed.inject(HighlightPipe);
    expect(pipe.transform('hello world', 'world')).toBe('');
  });
});

describe('SafeHtmlPipe (sanitizer returns null)', () => {
  it('falls back to empty string when sanitize returns null', () => {
    TestBed.configureTestingModule({
      providers: [SafeHtmlPipe, { provide: DomSanitizer, useValue: { sanitize: () => null } }],
    });
    const pipe = TestBed.inject(SafeHtmlPipe);
    expect(pipe.transform('<b>x</b>')).toBe('');
  });
});

describe('InitialsPipe (whitespace-only)', () => {
  it('returns empty string for a whitespace-only name', () => {
    expect(new InitialsPipe().transform('   ')).toBe('');
  });
});

describe('RelativeTimePipe (day / month / year / future thresholds)', () => {
  const pipe = new RelativeTimePipe();

  it('formats a single day', () => {
    expect(pipe.transform(new Date(Date.now() - 24 * HOUR_MS))).toBe('1 day ago');
  });

  it('formats multiple days', () => {
    expect(pipe.transform(new Date(Date.now() - 3 * DAY_MS))).toBe('3 days ago');
  });

  it('formats a single month', () => {
    expect(pipe.transform(new Date(Date.now() - 30 * DAY_MS))).toBe('1 month ago');
  });

  it('formats multiple months', () => {
    expect(pipe.transform(new Date(Date.now() - 90 * DAY_MS))).toBe('3 months ago');
  });

  it('formats a single year', () => {
    expect(pipe.transform(new Date(Date.now() - 365 * DAY_MS))).toBe('1 year ago');
  });

  it('formats multiple years', () => {
    expect(pipe.transform(new Date(Date.now() - 800 * DAY_MS))).toBe('2 years ago');
  });

  it('formats a future time with an "in" prefix', () => {
    expect(pipe.transform(new Date(Date.now() + 2 * HOUR_MS))).toBe('in 2 hours');
  });
});
