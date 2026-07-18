import { inject, Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'highlight', standalone: true, pure: true })
export class HighlightPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(text: string | null | undefined, query: string | null | undefined): SafeHtml {
    if (!text) return '';
    if (!query || !query.trim()) return text;

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const highlighted = text.replace(regex, '<mark>$1</mark>');
    const safe = this.sanitizer.sanitize(SecurityContext.HTML, highlighted) ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(safe);
  }
}
