import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-row',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-start py-2 border-b border-gray-100 last:border-0">
      <dt class="text-sm font-medium text-gray-500 w-40 flex-shrink-0">{{ label }}</dt>
      <dd class="text-sm text-gray-900 flex-1">{{ value || '—' }}</dd>
    </div>
  `
})
export class InfoRowComponent {
  @Input() label = '';
  @Input() value: string | number | undefined | null = null;
}
