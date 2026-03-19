import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200" [class.p-6]="padding">
      @if (title) {
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ title }}</h3>
      }
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  @Input() title = '';
  @Input() padding = true;
}
