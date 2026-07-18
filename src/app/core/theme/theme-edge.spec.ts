import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { THEME_REGISTRY } from './token-contract';

const STORAGE_KEY = 'rdk_theme';

function makeService(): ThemeService {
  TestBed.configureTestingModule({});
  return TestBed.inject(ThemeService);
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  it('applies the active theme to the document on construction', () => {
    const service = makeService();
    expect(document.documentElement.getAttribute('data-theme')).toBe(service.current());
  });

  it('set() updates the signal, the document and storage', () => {
    const service = makeService();
    const target = THEME_REGISTRY[THEME_REGISTRY.length - 1].id;
    service.set(target);
    expect(service.current()).toBe(target);
    expect(document.documentElement.getAttribute('data-theme')).toBe(target);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(target);
  });

  it('toggle() advances through the registry and wraps around', () => {
    const service = makeService();
    const start = service.current();
    for (let i = 0; i < THEME_REGISTRY.length; i += 1) {
      service.toggle();
    }
    expect(service.current()).toBe(start);
  });

  it('exposes the theme registry', () => {
    expect(makeService().registry.length).toBe(THEME_REGISTRY.length);
  });

  it('validateCurrentTheme reports missing contract tokens without throwing', () => {
    const service = makeService();
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(() => service.validateCurrentTheme()).not.toThrow();
    warn.mockRestore();
  });

  it('set() survives a storage write failure', () => {
    const service = makeService();
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    expect(() => service.set(THEME_REGISTRY[0].id)).not.toThrow();
    expect(service.current()).toBe(THEME_REGISTRY[0].id);
  });

  it('falls back to the default theme when storage cannot be read', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    TestBed.resetTestingModule();
    const service = makeService();
    expect(THEME_REGISTRY.some((t) => t.id === service.current())).toBe(true);
  });

  it('ignores an unknown stored theme id', () => {
    localStorage.setItem(STORAGE_KEY, 'not-a-real-theme');
    TestBed.resetTestingModule();
    const service = makeService();
    expect(THEME_REGISTRY.some((t) => t.id === service.current())).toBe(true);
  });
});
