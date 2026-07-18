import { Pipe, PipeTransform } from '@angular/core';

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

@Pipe({ name: 'fileSize', standalone: true, pure: true })
export class FileSizePipe implements PipeTransform {
  transform(bytes: number | null | undefined, decimals = 1): string {
    if (bytes == null || bytes < 0) return '';
    if (bytes === 0) return '0 B';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const clamped = Math.min(i, UNITS.length - 1);
    const value = bytes / Math.pow(1024, clamped);
    return `${value.toFixed(clamped === 0 ? 0 : decimals)} ${UNITS[clamped]}`;
  }
}
