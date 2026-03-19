import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="badgeClasses">{{ text }}</span>
  `
})
export class BadgeComponent {
  @Input() text = '';
  @Input() variant: 'green' | 'blue' | 'yellow' | 'red' | 'gray' | 'orange' | 'purple' = 'gray';

  get badgeClasses(): string {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';
    const variants = {
      green: 'bg-green-100 text-green-800 border-green-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return `${base} ${variants[this.variant]}`;
  }
}
