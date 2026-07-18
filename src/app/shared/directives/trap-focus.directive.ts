import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
} from '@angular/core';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

@Directive({
  selector: '[rdkTrapFocus]',
  standalone: true,
})
export class TrapFocusDirective implements OnChanges {
  @Input() rdkTrapFocus = false;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngOnChanges(): void {
    if (this.rdkTrapFocus) {
      // Focus first focusable element after render tick
      setTimeout(() => this.focusFirst(), 0);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.rdkTrapFocus || event.key !== 'Tab') return;

    const focusable = Array.from(
      this.el.nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter((el) => !el.closest('[disabled]'));

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  private focusFirst(): void {
    const first = this.el.nativeElement.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();
  }
}
