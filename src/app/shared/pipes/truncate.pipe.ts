import { Pipe, PipeTransform } from '@angular/core';

const DEFAULT_LENGTH = 100;
const DEFAULT_TRAIL = '…';

@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    maxLength: number = DEFAULT_LENGTH,
    trail: string = DEFAULT_TRAIL,
  ): string {
    if (!value) {
      return '';
    }
    if (value.length <= maxLength) {
      return value;
    }
    return value.slice(0, maxLength).trimEnd() + trail;
  }
}
