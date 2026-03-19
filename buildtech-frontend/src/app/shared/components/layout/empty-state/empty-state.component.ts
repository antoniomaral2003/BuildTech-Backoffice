import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="text-center py-12">
      <div class="text-5xl mb-4">{{ icon }}</div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">{{ title }}</h3>
      <p class="text-sm text-gray-500 mb-6">{{ description }}</p>
      <ng-content></ng-content>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() title = 'Sin resultados';
  @Input() description = 'No hay datos para mostrar.';
  @Input() icon = '📭';
}
