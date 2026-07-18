import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { ClickOutsideDirective } from './click-outside.directive';
import { TrapFocusDirective } from './trap-focus.directive';
import { IntersectionObserverDirective } from './intersection-observer.directive';

// ─── ClickOutsideDirective ────────────────────────────────────────────────────
describe('ClickOutsideDirective', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('emits rdkClickOutside when document click is outside host', async () => {
    const fn = jest.fn();
    await render(
      `<div>
        <div id="inside" rdkClickOutside (rdkClickOutside)="fn($event)">Inside</div>
        <button id="outside">Outside</button>
      </div>`,
      { imports: [ClickOutsideDirective], componentProperties: { fn } },
    );

    await new Promise((r) => setTimeout(r, 10));
    fireEvent.click(document.getElementById('outside')!);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not emit when click is inside host', async () => {
    const fn = jest.fn();
    await render(
      '<div rdkClickOutside (rdkClickOutside)="fn($event)"><button id="btn">Click me</button></div>',
      { imports: [ClickOutsideDirective], componentProperties: { fn } },
    );

    await new Promise((r) => setTimeout(r, 10));
    fireEvent.click(document.getElementById('btn')!);
    expect(fn).not.toHaveBeenCalled();
  });
});

// ─── TrapFocusDirective ───────────────────────────────────────────────────────
describe('TrapFocusDirective', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('does not throw when rendered with rdkTrapFocus=false', async () => {
    await expect(
      render(
        '<div [rdkTrapFocus]="false"><button>A</button></div>',
        { imports: [TrapFocusDirective] },
      ),
    ).resolves.not.toThrow();
  });

  it('does not throw when rendered with rdkTrapFocus=true', async () => {
    await expect(
      render(
        '<div [rdkTrapFocus]="true"><button>A</button><button>B</button></div>',
        { imports: [TrapFocusDirective] },
      ),
    ).resolves.not.toThrow();
  });

  it('traps Tab — wraps from last to first', async () => {
    const { fixture } = await render(
      '<div id="trap" [rdkTrapFocus]="true"><button id="a">A</button><button id="b">B</button></div>',
      { imports: [TrapFocusDirective] },
    );
    fixture.detectChanges();
    const trap = document.getElementById('trap')!;
    const btnB = document.getElementById('b') as HTMLButtonElement;
    const btnA = document.getElementById('a') as HTMLButtonElement;
    btnB.focus();
    fireEvent.keyDown(trap, { key: 'Tab', bubbles: true });
    expect(document.activeElement).toBe(btnA);
  });
});

// ─── IntersectionObserverDirective ────────────────────────────────────────────
describe('IntersectionObserverDirective', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('renders without errors', async () => {
    await expect(
      render(
        '<div rdkIntersect><p>Content</p></div>',
        { imports: [IntersectionObserverDirective] },
      ),
    ).resolves.not.toThrow();
  });

  it('accepts threshold and rootMargin inputs', async () => {
    await expect(
      render(
        '<div rdkIntersect [rdkIntersectThreshold]="0.5" rdkIntersectRootMargin="20px"><p>Content</p></div>',
        { imports: [IntersectionObserverDirective] },
      ),
    ).resolves.not.toThrow();
  });
});
