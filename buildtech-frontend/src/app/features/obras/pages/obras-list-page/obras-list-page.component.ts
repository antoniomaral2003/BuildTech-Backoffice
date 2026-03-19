import { Component, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ObrasService } from '../../services/obras.service';
import { Obra, EstadoObra } from '../../../../core/models/obra.model';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { SearchInputComponent } from '../../../../shared/components/forms/search-input/search-input.component';
import { StatusBadgeComponent } from '../../../../shared/components/data-display/status-badge/status-badge.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/layout/empty-state/empty-state.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-obras-list-page',
  standalone: true,
  imports: [
    RouterLink,
    PageHeaderComponent,
    ButtonComponent,
    SearchInputComponent,
    StatusBadgeComponent,
    SpinnerComponent,
    EmptyStateComponent,
    DateFormatPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <app-page-header title="Obras" subtitle="Gestión de proyectos y obras">
        <div actions>
          <app-button routerLink="/obras/nueva" variant="primary">+ Nueva Obra</app-button>
        </div>
      </app-page-header>

      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <div class="flex-1">
          <app-search-input placeholder="Buscar por nombre, código, ciudad..." (searched)="onSearch($event)"></app-search-input>
        </div>
        <select class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" (change)="onEstadoFilter($event)">
          <option value="">Todos los estados</option>
          <option value="Activa">Activa</option>
          <option value="En Pausa">En Pausa</option>
          <option value="Finalizada">Finalizada</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>

      @if (loading()) {
        <app-spinner></app-spinner>
      } @else if (filtered().length === 0) {
        <app-empty-state title="No hay obras" description="No se encontraron obras con los filtros aplicados." icon="🔨">
          <app-button routerLink="/obras/nueva" variant="primary">Nueva Obra</app-button>
        </app-empty-state>
      } @else {
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obra</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (obra of filtered(); track obra.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ obra.nombre }}</p>
                      @if (obra.codigo) { <p class="text-xs text-gray-500 font-mono">{{ obra.codigo }}</p> }
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ obra.ciudad || obra.direccion }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ obra.responsableNombre || '—' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ obra.fechaInicio | dateFormat }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <app-status-badge [estado]="obra.estado" entity="obra"></app-status-badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div class="flex items-center justify-end gap-2">
                      <a [routerLink]="['/obras', obra.id]" class="text-sky-600 hover:text-sky-800 font-medium">Ver</a>
                      <a [routerLink]="['/obras', obra.id, 'editar']" class="text-gray-600 hover:text-gray-800 font-medium">Editar</a>
                      <button (click)="onDelete(obra)" class="text-red-600 hover:text-red-800 font-medium">Eliminar</button>
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
export class ObrasListPageComponent implements OnInit {
  loading = signal(true);
  items = signal<Obra[]>([]);
  searchTerm = signal('');
  estadoFilter = signal<EstadoObra | ''>('');

  filtered = computed(() => {
    let result = this.items();
    const term = this.searchTerm().toLowerCase();
    if (term) {
      result = result.filter(o =>
        o.nombre.toLowerCase().includes(term) ||
        (o.codigo ?? '').toLowerCase().includes(term) ||
        (o.ciudad ?? '').toLowerCase().includes(term)
      );
    }
    if (this.estadoFilter()) {
      result = result.filter(o => o.estado === this.estadoFilter());
    }
    return result;
  });

  constructor(private obrasService: ObrasService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.obrasService.getAll().subscribe({
      next: data => { this.items.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onSearch(term: string): void { this.searchTerm.set(term); }
  onEstadoFilter(event: Event): void {
    this.estadoFilter.set((event.target as HTMLSelectElement).value as EstadoObra | '');
  }

  onDelete(obra: Obra): void {
    if (!confirm(`¿Eliminar la obra "${obra.nombre}"?`)) return;
    this.obrasService.delete(obra.id).subscribe({
      next: () => {
        this.notificationService.success('Obra eliminada correctamente');
        this.items.update(prev => prev.filter(o => o.id !== obra.id));
      }
    });
  }
}
