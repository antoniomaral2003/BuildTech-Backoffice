import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string | undefined | null, maxLength = 50): string {
    if (!value) return '';
    return value.length > maxLength ? value.substring(0, maxLength) + '...' : value;
  }
}
