import { Component, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MantenimientosService } from '../../services/mantenimientos.service';
import { Mantenimiento, EstadoMantenimiento } from '../../../../core/models/mantenimiento.model';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { SearchInputComponent } from '../../../../shared/components/forms/search-input/search-input.component';
import { StatusBadgeComponent } from '../../../../shared/components/data-display/status-badge/status-badge.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/layout/empty-state/empty-state.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-mantenimientos-list-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, ButtonComponent, SearchInputComponent, StatusBadgeComponent, SpinnerComponent, EmptyStateComponent, DateFormatPipe, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <app-page-header title="Mantenimientos" subtitle="Registro de mantenimientos preventivos y correctivos">
        <div actions>
          <app-button routerLink="/mantenimientos/nuevo" variant="primary">+ Nuevo Mantenimiento</app-button>
        </div>
      </app-page-header>

      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <div class="flex-1">
          <app-search-input placeholder="Buscar por maquinaria, descripción..." (searched)="onSearch($event)"></app-search-input>
        </div>
        <select class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" (change)="onEstadoFilter($event)">
          <option value="">Todos los estados</option>
          <option value="Programado">Programado</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Completado">Completado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      @if (loading()) {
        <app-spinner></app-spinner>
      } @else if (filtered().length === 0) {
        <app-empty-state title="No hay mantenimientos" description="No se encontraron mantenimientos registrados." icon="🔧">
          <app-button routerLink="/mantenimientos/nuevo" variant="primary">Nuevo Mantenimiento</app-button>
        </app-empty-state>
      } @else {
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maquinaria</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Prog.</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (item of filtered(); track item.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <p class="text-sm font-mono font-medium text-sky-700">{{ item.maquinariaCodigo }}</p>
                    <p class="text-xs text-gray-500">{{ item.maquinariaMarca }} {{ item.maquinariaModelo }}</p>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <app-badge [text]="item.tipo" [variant]="item.tipo === 'Preventivo' ? 'blue' : 'orange'"></app-badge>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{{ item.descripcion }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.fechaProgramada | dateFormat }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <app-status-badge [estado]="item.estado" entity="mantenimiento"></app-status-badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div class="flex items-center justify-end gap-2">
                      <a [routerLink]="['/mantenimientos', item.id, 'editar']" class="text-gray-600 hover:text-gray-800 font-medium">Editar</a>
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
export class MantenimientosListPageComponent implements OnInit {
  loading = signal(true);
  items = signal<Mantenimiento[]>([]);
  searchTerm = signal('');
  estadoFilter = signal<EstadoMantenimiento | ''>('');

  filtered = computed(() => {
    let result = this.items();
    const term = this.searchTerm().toLowerCase();
    if (term) {
      result = result.filter(m =>
        (m.maquinariaCodigo ?? '').toLowerCase().includes(term) ||
        m.descripcion.toLowerCase().includes(term)
      );
    }
    if (this.estadoFilter()) result = result.filter(m => m.estado === this.estadoFilter());
    return result;
  });

  constructor(private mantenimientosService: MantenimientosService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.mantenimientosService.getAll().subscribe({
      next: data => { this.items.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onSearch(term: string): void { this.searchTerm.set(term); }
  onEstadoFilter(event: Event): void {
    this.estadoFilter.set((event.target as HTMLSelectElement).value as EstadoMantenimiento | '');
  }

  onDelete(item: Mantenimiento): void {
    if (!confirm('¿Eliminar este mantenimiento?')) return;
    this.mantenimientosService.delete(item.id).subscribe({
      next: () => {
        this.notificationService.success('Mantenimiento eliminado');
        this.items.update(prev => prev.filter(m => m.id !== item.id));
      }
    });
  }
}
