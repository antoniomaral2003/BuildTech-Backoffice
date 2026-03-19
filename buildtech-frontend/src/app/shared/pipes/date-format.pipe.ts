import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateFormat', standalone: true })
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | undefined | null, format: 'short' | 'long' | 'datetime' = 'short'): string {
    if (!value) return '—';
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '—';
    const options: Intl.DateTimeFormatOptions = {
      short: { day: '2-digit', month: '2-digit', year: 'numeric' },
      long: { day: '2-digit', month: 'long', year: 'numeric' },
      datetime: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    }[format] as Intl.DateTimeFormatOptions;
    return date.toLocaleDateString('es-ES', options);
  }
}
