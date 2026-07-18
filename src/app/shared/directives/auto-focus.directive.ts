import { AfterViewInit, Directive, ElementRef, inject, Input } from '@angular/core';

@Directive({ selector: '[rdkAutoFocus]', standalone: true })
export class AutoFocusDirective implements AfterViewInit {
  private readonly el = inject(ElementRef);

  @Input() rdkAutoFocus: boolean | '' = true;
  @Input() rdkAutoFocusDelay = 0;

  ngAfterViewInit(): void {
    if (this.rdkAutoFocus === false) {
      return;
    }
    const element = this.el.nativeElement as HTMLElement;
    if (this.rdkAutoFocusDelay > 0) {
      setTimeout(() => element.focus(), this.rdkAutoFocusDelay);
    } else {
      element.focus();
    }
  }
}
