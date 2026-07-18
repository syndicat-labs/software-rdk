import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[rdkIntersect]',
  standalone: true,
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  @Input() rdkIntersectOnce = true;
  @Input() rdkIntersectThreshold = 0.1;
  @Input() rdkIntersectRootMargin = '0px';

  @Output() rdkIntersect = new EventEmitter<IntersectionObserverEntry>();

  private observer?: IntersectionObserver;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          this.rdkIntersect.emit(entry);
          if (this.rdkIntersectOnce) {
            this.observer?.disconnect();
          }
        }
      },
      {
        threshold: this.rdkIntersectThreshold,
        rootMargin: this.rdkIntersectRootMargin,
      },
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
