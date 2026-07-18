import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'initials', standalone: true, pure: true })
export class InitialsPipe implements PipeTransform {
  transform(name: string | null | undefined, maxChars = 2): string {
    if (!name) return '';
    return name
      .trim()
      .split(/\s+/)
      .slice(0, maxChars)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');
  }
}
