import { Component, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { AuthStore } from '../../core/auth/auth.store';
import { AutoFocusDirective } from './auto-focus.directive';
import { ClickOutsideDirective } from './click-outside.directive';
import { HasPermissionDirective } from './has-permission.directive';
import { IntersectionObserverDirective } from './intersection-observer.directive';
import { TrapFocusDirective } from './trap-focus.directive';

function elementRef<T extends HTMLElement>(el: T): ElementRef<T> {
  return new ElementRef(el);
}

function attach(html: string): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);
  return host;
}

describe('AutoFocusDirective', () => {
  afterEach(() => jest.useRealTimers());

  it('focuses immediately when no delay is set', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    TestBed.configureTestingModule({ providers: [{ provide: ElementRef, useValue: elementRef(input) }] });
    const directive = TestBed.runInInjectionContext(() => new AutoFocusDirective());
    directive.ngAfterViewInit();
    expect(document.activeElement).toBe(input);
  });

  it('focuses after the configured delay', () => {
    jest.useFakeTimers();
    const input = document.createElement('input');
    document.body.appendChild(input);
    TestBed.configureTestingModule({ providers: [{ provide: ElementRef, useValue: elementRef(input) }] });
    const directive = TestBed.runInInjectionContext(() => new AutoFocusDirective());
    directive.rdkAutoFocusDelay = 50;
    directive.ngAfterViewInit();
    expect(document.activeElement).not.toBe(input);
    jest.advanceTimersByTime(50);
    expect(document.activeElement).toBe(input);
  });

  it('does nothing when disabled', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.blur();
    TestBed.configureTestingModule({ providers: [{ provide: ElementRef, useValue: elementRef(input) }] });
    const directive = TestBed.runInInjectionContext(() => new AutoFocusDirective());
    directive.rdkAutoFocus = false;
    directive.ngAfterViewInit();
    expect(document.activeElement).not.toBe(input);
  });
});

describe('ClickOutsideDirective', () => {
  afterEach(() => jest.useRealTimers());

  it('ignores clicks before activation, then emits for outside clicks', () => {
    jest.useFakeTimers();
    const host = attach('<span>inside</span>');
    const directive = new ClickOutsideDirective(elementRef(host));
    const emitted: MouseEvent[] = [];
    directive.rdkClickOutside.subscribe((e) => emitted.push(e));

    directive.onDocumentClick({ target: document.body } as unknown as MouseEvent);
    expect(emitted).toHaveLength(0);

    jest.advanceTimersByTime(0);
    directive.onDocumentClick({ target: document.body } as unknown as MouseEvent);
    expect(emitted).toHaveLength(1);

    directive.onDocumentClick({ target: host.querySelector('span') } as unknown as MouseEvent);
    expect(emitted).toHaveLength(1);

    directive.ngOnDestroy();
    directive.onDocumentClick({ target: document.body } as unknown as MouseEvent);
    expect(emitted).toHaveLength(1);
  });
});

describe('IntersectionObserverDirective', () => {
  const realIO = (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;
  let capturedCallback: (entries: Partial<IntersectionObserverEntry>[]) => void;
  let observeSpy: jest.Mock;
  let disconnectSpy: jest.Mock;

  beforeEach(() => {
    observeSpy = jest.fn();
    disconnectSpy = jest.fn();
    class MockIO {
      constructor(cb: (entries: Partial<IntersectionObserverEntry>[]) => void) {
        capturedCallback = cb;
      }
      observe = observeSpy;
      disconnect = disconnectSpy;
    }
    (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = MockIO;
  });

  afterEach(() => {
    (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = realIO;
  });

  it('emits and disconnects on first intersection (once=true)', () => {
    const el = document.createElement('div');
    const directive = new IntersectionObserverDirective(elementRef(el));
    const emitted: unknown[] = [];
    directive.rdkIntersect.subscribe((e) => emitted.push(e));
    directive.ngOnInit();
    expect(observeSpy).toHaveBeenCalledWith(el);
    capturedCallback([{ isIntersecting: true }]);
    expect(emitted).toHaveLength(1);
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('does not disconnect when once=false', () => {
    const directive = new IntersectionObserverDirective(elementRef(document.createElement('div')));
    directive.rdkIntersectOnce = false;
    const emitted: unknown[] = [];
    directive.rdkIntersect.subscribe((e) => emitted.push(e));
    directive.ngOnInit();
    capturedCallback([{ isIntersecting: true }]);
    expect(emitted).toHaveLength(1);
    expect(disconnectSpy).not.toHaveBeenCalled();
  });

  it('ignores non-intersecting entries', () => {
    const directive = new IntersectionObserverDirective(elementRef(document.createElement('div')));
    const emitted: unknown[] = [];
    directive.rdkIntersect.subscribe((e) => emitted.push(e));
    directive.ngOnInit();
    capturedCallback([{ isIntersecting: false }]);
    expect(emitted).toHaveLength(0);
  });

  it('no-ops and disconnects safely when observer is unavailable', () => {
    (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = undefined;
    const directive = new IntersectionObserverDirective(elementRef(document.createElement('div')));
    expect(() => directive.ngOnInit()).not.toThrow();
    expect(() => directive.ngOnDestroy()).not.toThrow();
  });
});

describe('TrapFocusDirective', () => {
  afterEach(() => jest.useRealTimers());

  it('focuses the first focusable element on activation', () => {
    jest.useFakeTimers();
    const host = attach('<button>a</button><button>b</button>');
    const directive = new TrapFocusDirective(elementRef(host));
    directive.rdkTrapFocus = true;
    directive.ngOnChanges();
    jest.advanceTimersByTime(0);
    expect(document.activeElement).toBe(host.querySelector('button'));
  });

  it('prevents default Tab when there are no focusable elements', () => {
    const host = attach('<span>x</span>');
    const directive = new TrapFocusDirective(elementRef(host));
    directive.rdkTrapFocus = true;
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    const prevent = jest.spyOn(event, 'preventDefault');
    directive.onKeydown(event);
    expect(prevent).toHaveBeenCalled();
  });

  it('wraps to the last element on shift+Tab from the first', () => {
    const host = attach('<button>a</button><button>b</button>');
    const buttons = Array.from(host.querySelectorAll('button')) as HTMLElement[];
    buttons[0].focus();
    const directive = new TrapFocusDirective(elementRef(host));
    directive.rdkTrapFocus = true;
    directive.onKeydown(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }));
    expect(document.activeElement).toBe(buttons[1]);
  });

  it('wraps to the first element on Tab from the last', () => {
    const host = attach('<button>a</button><button>b</button>');
    const buttons = Array.from(host.querySelectorAll('button')) as HTMLElement[];
    buttons[1].focus();
    const directive = new TrapFocusDirective(elementRef(host));
    directive.rdkTrapFocus = true;
    directive.onKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('ignores keydown when inactive', () => {
    const host = attach('<button>a</button>');
    const directive = new TrapFocusDirective(elementRef(host));
    directive.rdkTrapFocus = false;
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    const prevent = jest.spyOn(event, 'preventDefault');
    directive.onKeydown(event);
    expect(prevent).not.toHaveBeenCalled();
  });

  it('does not intercept shift+Tab away from the first element', () => {
    const host = attach('<button>a</button><button>b</button>');
    const buttons = Array.from(host.querySelectorAll('button')) as HTMLElement[];
    buttons[1].focus();
    const directive = new TrapFocusDirective(elementRef(host));
    directive.rdkTrapFocus = true;
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
    const prevent = jest.spyOn(event, 'preventDefault');
    directive.onKeydown(event);
    expect(prevent).not.toHaveBeenCalled();
  });

  it('does not intercept Tab away from the last element', () => {
    const host = attach('<button>a</button><button>b</button>');
    const buttons = Array.from(host.querySelectorAll('button')) as HTMLElement[];
    buttons[0].focus();
    const directive = new TrapFocusDirective(elementRef(host));
    directive.rdkTrapFocus = true;
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    const prevent = jest.spyOn(event, 'preventDefault');
    directive.onKeydown(event);
    expect(prevent).not.toHaveBeenCalled();
  });
});

@Component({
  standalone: true,
  imports: [HasPermissionDirective],
  template: `
    <ng-template [rdkHasPermission]="roles" [rdkHasPermissionAll]="requireAll">
      <span data-testid="content">secret</span>
    </ng-template>
  `,
})
class PermissionHostComponent {
  roles: string | string[] = [];
  requireAll = false;
}

describe('HasPermissionDirective', () => {
  it('hides content when unauthenticated', async () => {
    await render(PermissionHostComponent, { componentProperties: { roles: ['admin'] } });
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('shows content when the user has the required role', async () => {
    const { fixture } = await render(PermissionHostComponent, {
      componentProperties: { roles: ['admin'] },
    });
    TestBed.inject(AuthStore).setUser({ id: '1', roles: ['admin'] });
    fixture.detectChanges();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('shows content for an authenticated user when no roles are required', async () => {
    const { fixture } = await render(PermissionHostComponent, {
      componentProperties: { roles: [] },
    });
    TestBed.inject(AuthStore).setUser({ id: '1', roles: [] });
    fixture.detectChanges();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('requires every role when rdkHasPermissionAll is set', async () => {
    const { fixture } = await render(PermissionHostComponent, {
      componentProperties: { roles: ['admin', 'auditor'], requireAll: true },
    });
    const store = TestBed.inject(AuthStore);
    store.setUser({ id: '1', roles: ['admin'] });
    fixture.detectChanges();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();

    store.setUser({ id: '1', roles: ['admin', 'auditor'] });
    fixture.detectChanges();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('destroys its effect on teardown without error', async () => {
    const { fixture } = await render(PermissionHostComponent, {
      componentProperties: { roles: ['admin'] },
    });
    expect(() => fixture.destroy()).not.toThrow();
  });
});
