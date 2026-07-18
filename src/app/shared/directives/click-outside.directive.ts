import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  Output,
} from '@angular/core';

@Directive({
  selector: '[rdkClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective implements OnDestroy {
  @Output() rdkClickOutside = new EventEmitter<MouseEvent>();

  private active = false;

  constructor(private readonly el: ElementRef<HTMLElement>) {
    // Defer activation so the triggering click that opens the panel
    // doesn't immediately fire rdkClickOutside.
    setTimeout(() => (this.active = true), 0);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.active) return;
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.rdkClickOutside.emit(event);
    }
  }

  ngOnDestroy(): void {
    this.active = false;
  }
}
