import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">{{ title }}</p>
          <p class="text-3xl font-bold mt-1" [class]="valueColorClass">{{ value }}</p>
          @if (subtitle) {
            <p class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
          }
        </div>
        <div [class]="iconContainerClass">
          <span class="text-2xl">{{ icon }}</span>
        </div>
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value: number | string = 0;
  @Input() subtitle = '';
  @Input() icon = '📊';
  @Input() color: 'blue' | 'green' | 'yellow' | 'red' | 'gray' = 'blue';

  get valueColorClass(): string {
    const colors = {
      blue: 'text-sky-700',
      green: 'text-emerald-700',
      yellow: 'text-amber-700',
      red: 'text-red-700',
      gray: 'text-gray-700'
    };
    return colors[this.color];
  }

  get iconContainerClass(): string {
    const colors = {
      blue: 'bg-sky-50 rounded-full p-3',
      green: 'bg-emerald-50 rounded-full p-3',
      yellow: 'bg-amber-50 rounded-full p-3',
      red: 'bg-red-50 rounded-full p-3',
      gray: 'bg-gray-50 rounded-full p-3'
    };
    return colors[this.color];
  }
}
