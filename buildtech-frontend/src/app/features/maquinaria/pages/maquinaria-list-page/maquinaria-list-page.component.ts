import { Component, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaquinariaService } from '../../services/maquinaria.service';
import { Maquinaria, EstadoMaquinaria } from '../../../../core/models/maquinaria.model';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { SearchInputComponent } from '../../../../shared/components/forms/search-input/search-input.component';
import { StatusBadgeComponent } from '../../../../shared/components/data-display/status-badge/status-badge.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/layout/empty-state/empty-state.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-maquinaria-list-page',
  standalone: true,
  imports: [
    RouterLink,
    PageHeaderComponent,
    ButtonComponent,
    SearchInputComponent,
    StatusBadgeComponent,
    SpinnerComponent,
    EmptyStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <app-page-header title="Maquinaria" subtitle="Gestión de la flota de maquinaria">
        <div actions>
          <app-button routerLink="/maquinaria/nuevo" variant="primary">
            + Nueva Maquinaria
          </app-button>
        </div>
      </app-page-header>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <div class="flex-1">
          <app-search-input placeholder="Buscar por código, marca, modelo..." (searched)="onSearch($event)"></app-search-input>
        </div>
        <select
          class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
          (change)="onEstadoFilter($event)"
        >
          <option value="">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Asignada">Asignada</option>
          <option value="En Mantenimiento">En Mantenimiento</option>
          <option value="Fuera de Servicio">Fuera de Servicio</option>
          <option value="En Tránsito">En Tránsito</option>
        </select>
      </div>

      @if (loading()) {
        <app-spinner></app-spinner>
      } @else if (filtered().length === 0) {
        <app-empty-state
          title="No hay maquinaria"
          description="No se encontró maquinaria con los filtros aplicados."
          icon="🏗️"
        >
          <app-button routerLink="/maquinaria/nuevo" variant="primary">Agregar Maquinaria</app-button>
        </app-empty-state>
      } @else {
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maquinaria</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (item of filtered(); track item.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-mono font-medium text-sky-700">{{ item.codigoInterno }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ item.marca }} {{ item.modelo }}</p>
                      <p class="text-xs text-gray-500">{{ item.anioFabricacion }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p class="text-sm text-gray-900">{{ item.tipoNombre }}</p>
                      <p class="text-xs text-gray-500">{{ item.categoriaNombre }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <app-status-badge [estado]="item.estado" entity="maquinaria"></app-status-badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ item.ubicacionNombre || '—' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div class="flex items-center justify-end gap-2">
                      <a [routerLink]="['/maquinaria', item.id]" class="text-sky-600 hover:text-sky-800 font-medium">Ver</a>
                      <a [routerLink]="['/maquinaria', item.id, 'editar']" class="text-gray-600 hover:text-gray-800 font-medium">Editar</a>
                      <button (click)="onDelete(item)" class="text-red-600 hover:text-red-800 font-medium">Eliminar</button>
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
export class MaquinariaListPageComponent implements OnInit {
  loading = signal(true);
  items = signal<Maquinaria[]>([]);
  searchTerm = signal('');
  estadoFilter = signal<EstadoMaquinaria | ''>('');

  filtered = computed(() => {
    let result = this.items();
    const term = this.searchTerm().toLowerCase();
    if (term) {
      result = result.filter(m =>
        m.codigoInterno.toLowerCase().includes(term) ||
        m.marca.toLowerCase().includes(term) ||
        m.modelo.toLowerCase().includes(term) ||
        (m.tipoNombre ?? '').toLowerCase().includes(term)
      );
    }
    if (this.estadoFilter()) {
      result = result.filter(m => m.estado === this.estadoFilter());
    }
    return result;
  });

  constructor(
    private maquinariaService: MaquinariaService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.maquinariaService.getAll().subscribe({
      next: data => { this.items.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onSearch(term: string): void { this.searchTerm.set(term); }
  onEstadoFilter(event: Event): void {
    this.estadoFilter.set((event.target as HTMLSelectElement).value as EstadoMaquinaria | '');
  }

  onDelete(item: Maquinaria): void {
    if (!confirm(`¿Eliminar la maquinaria ${item.codigoInterno}?`)) return;
    this.maquinariaService.delete(item.id).subscribe({
      next: () => {
        this.notificationService.success('Maquinaria eliminada correctamente');
        this.items.update(prev => prev.filter(m => m.id !== item.id));
      }
    });
  }
}
