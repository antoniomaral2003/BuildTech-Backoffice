import { Component, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OperadoresService } from '../../services/operadores.service';
import { Operador } from '../../../../core/models/operador.model';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { SearchInputComponent } from '../../../../shared/components/forms/search-input/search-input.component';
import { StatusBadgeComponent } from '../../../../shared/components/data-display/status-badge/status-badge.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/layout/empty-state/empty-state.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-operadores-list-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, ButtonComponent, SearchInputComponent, StatusBadgeComponent, SpinnerComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <app-page-header title="Operadores" subtitle="Gestión de operadores de maquinaria">
        <div actions>
          <app-button routerLink="/operadores/nuevo" variant="primary">+ Nuevo Operador</app-button>
        </div>
      </app-page-header>

      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <div class="flex-1">
          <app-search-input placeholder="Buscar por nombre, DNI..." (searched)="onSearch($event)"></app-search-input>
        </div>
        <select class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" (change)="onEstadoFilter($event)">
          <option value="">Todos</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>

      @if (loading()) {
        <app-spinner></app-spinner>
      } @else if (filtered().length === 0) {
        <app-empty-state title="No hay operadores" description="No se encontraron operadores registrados." icon="👷">
          <app-button routerLink="/operadores/nuevo" variant="primary">Nuevo Operador</app-button>
        </app-empty-state>
      } @else {
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operador</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Licencias</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (op of filtered(); track op.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <p class="text-sm font-medium text-gray-900">{{ op.nombre }} {{ op.apellidos }}</p>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{{ op.dni }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <p class="text-sm text-gray-600">{{ op.telefono || '—' }}</p>
                    <p class="text-xs text-gray-400">{{ op.email || '' }}</p>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ op.licencias || '—' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <app-status-badge [estado]="op.estado" entity="operador"></app-status-badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div class="flex items-center justify-end gap-2">
                      <a [routerLink]="['/operadores', op.id, 'editar']" class="text-gray-600 hover:text-gray-800 font-medium">Editar</a>
                      <button (click)="onDelete(op)" class="text-red-600 hover:text-red-800 font-medium">Eliminar</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          <div class="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p class="text-xs text-gray-500">{{ filtered().length }} de {{ items().length }} registros</p>
          </div>
        </div>
      }
    </div>
  `
})
export class OperadoresListPageComponent implements OnInit {
  loading = signal(true);
  items = signal<Operador[]>([]);
  searchTerm = signal('');
  estadoFilter = signal('');

  filtered = computed(() => {
    let result = this.items();
    const term = this.searchTerm().toLowerCase();
    if (term) {
      result = result.filter(op =>
        op.nombre.toLowerCase().includes(term) ||
        op.apellidos.toLowerCase().includes(term) ||
        op.dni.toLowerCase().includes(term)
      );
    }
    if (this.estadoFilter()) result = result.filter(op => op.estado === this.estadoFilter());
    return result;
  });

  constructor(private operadoresService: OperadoresService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.operadoresService.getAll().subscribe({
      next: data => { this.items.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onSearch(term: string): void { this.searchTerm.set(term); }
  onEstadoFilter(event: Event): void { this.estadoFilter.set((event.target as HTMLSelectElement).value); }

  onDelete(op: Operador): void {
    if (!confirm(`¿Eliminar al operador ${op.nombre} ${op.apellidos}?`)) return;
    this.operadoresService.delete(op.id).subscribe({
      next: () => {
        this.notificationService.success('Operador eliminado');
        this.items.update(prev => prev.filter(o => o.id !== op.id));
      }
    });
  }
}
