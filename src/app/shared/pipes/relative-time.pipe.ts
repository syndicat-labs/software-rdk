import { Pipe, PipeTransform } from '@angular/core';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR   = 60 * MINUTE;
const DAY    = 24 * HOUR;
const MONTH  = 30 * DAY;
const YEAR   = 365 * DAY;

@Pipe({ name: 'relativeTime', standalone: true, pure: true })
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date | number | null | undefined): string {
    if (value == null) return '';

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';

    const diff = Date.now() - date.getTime();
    const abs = Math.abs(diff);
    const future = diff < 0;

    let label: string;
    if (abs < 45 * SECOND)       label = 'just now';
    else if (abs < 90 * SECOND)  label = '1 minute';
    else if (abs < 45 * MINUTE)  label = `${Math.round(abs / MINUTE)} minutes`;
    else if (abs < 90 * MINUTE)  label = '1 hour';
    else if (abs < 22 * HOUR)    label = `${Math.round(abs / HOUR)} hours`;
    else if (abs < 36 * HOUR)    label = '1 day';
    else if (abs < 25 * DAY)     label = `${Math.round(abs / DAY)} days`;
    else if (abs < 45 * DAY)     label = '1 month';
    else if (abs < 11 * MONTH)   label = `${Math.round(abs / MONTH)} months`;
    else if (abs < 18 * MONTH)   label = '1 year';
    else                          label = `${Math.round(abs / YEAR)} years`;

    if (label === 'just now') return label;
    return future ? `in ${label}` : `${label} ago`;
  }
}
