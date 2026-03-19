import { Component, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsignacionesService } from '../../services/asignaciones.service';
import { Asignacion, EstadoAsignacion } from '../../../../core/models/asignacion.model';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { SearchInputComponent } from '../../../../shared/components/forms/search-input/search-input.component';
import { StatusBadgeComponent } from '../../../../shared/components/data-display/status-badge/status-badge.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/layout/empty-state/empty-state.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-asignaciones-list-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, ButtonComponent, SearchInputComponent, StatusBadgeComponent, SpinnerComponent, EmptyStateComponent, DateFormatPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <app-page-header title="Asignaciones" subtitle="Asignaciones de maquinaria a obras">
        <div actions>
          <app-button routerLink="/asignaciones/nueva" variant="primary">+ Nueva Asignación</app-button>
        </div>
      </app-page-header>

      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <div class="flex-1">
          <app-search-input placeholder="Buscar por obra, maquinaria, operador..." (searched)="onSearch($event)"></app-search-input>
        </div>
        <select class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" (change)="onEstadoFilter($event)">
          <option value="">Todos los estados</option>
          <option value="Programada">Programada</option>
          <option value="En Curso">En Curso</option>
          <option value="Finalizada">Finalizada</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>

      @if (loading()) {
        <app-spinner></app-spinner>
      } @else if (filtered().length === 0) {
        <app-empty-state title="No hay asignaciones" description="No se encontraron asignaciones." icon="📋">
          <app-button routerLink="/asignaciones/nueva" variant="primary">Nueva Asignación</app-button>
        </app-empty-state>
      } @else {
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maquinaria</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obra</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operador</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin Est.</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (item of filtered(); track item.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p class="text-sm font-mono font-medium text-sky-700">{{ item.maquinariaCodigo }}</p>
                      <p class="text-xs text-gray-500">{{ item.maquinariaMarca }} {{ item.maquinariaModelo }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.obraNombre }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ item.operadorNombre ? item.operadorNombre + ' ' + item.operadorApellidos : '—' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.fechaInicio | dateFormat }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.fechaFinEstimada | dateFormat }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <app-status-badge [estado]="item.estado" entity="asignacion"></app-status-badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button (click)="onDelete(item)" class="text-red-600 hover:text-red-800 font-medium">Eliminar</button>
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
export class AsignacionesListPageComponent implements OnInit {
  loading = signal(true);
  items = signal<Asignacion[]>([]);
  searchTerm = signal('');
  estadoFilter = signal<EstadoAsignacion | ''>('');

  filtered = computed(() => {
    let result = this.items();
    const term = this.searchTerm().toLowerCase();
    if (term) {
      result = result.filter(a =>
        (a.obraNombre ?? '').toLowerCase().includes(term) ||
        (a.maquinariaCodigo ?? '').toLowerCase().includes(term) ||
        (a.operadorNombre ?? '').toLowerCase().includes(term)
      );
    }
    if (this.estadoFilter()) result = result.filter(a => a.estado === this.estadoFilter());
    return result;
  });

  constructor(private asignacionesService: AsignacionesService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.asignacionesService.getAll().subscribe({
      next: data => { this.items.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onSearch(term: string): void { this.searchTerm.set(term); }
  onEstadoFilter(event: Event): void {
    this.estadoFilter.set((event.target as HTMLSelectElement).value as EstadoAsignacion | '');
  }

  onDelete(item: Asignacion): void {
    if (!confirm('¿Eliminar esta asignación?')) return;
    this.asignacionesService.delete(item.id).subscribe({
      next: () => {
        this.notificationService.success('Asignación eliminada');
        this.items.update(prev => prev.filter(a => a.id !== item.id));
      }
    });
  }
}
