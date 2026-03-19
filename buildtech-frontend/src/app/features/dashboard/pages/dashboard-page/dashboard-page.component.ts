import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { StatCardComponent } from '../../../../shared/components/data-display/stat-card/stat-card.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { StatusBadgeComponent } from '../../../../shared/components/data-display/status-badge/status-badge.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { MaquinariaService } from '../../../maquinaria/services/maquinaria.service';
import { ObrasService } from '../../../obras/services/obras.service';
import { AsignacionesService } from '../../../asignaciones/services/asignaciones.service';
import { MantenimientosService } from '../../../mantenimientos/services/mantenimientos.service';
import { Maquinaria } from '../../../../core/models/maquinaria.model';
import { Obra } from '../../../../core/models/obra.model';
import { Asignacion } from '../../../../core/models/asignacion.model';
import { Mantenimiento } from '../../../../core/models/mantenimiento.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    StatCardComponent,
    PageHeaderComponent,
    SpinnerComponent,
    StatusBadgeComponent,
    DateFormatPipe,
    TruncatePipe,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <app-page-header
        title="Dashboard"
        subtitle="Resumen general del sistema de gestión de maquinaria"
      ></app-page-header>

      @if (loading()) {
        <app-spinner size="lg" [fullPage]="true"></app-spinner>
      } @else {
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <app-stat-card
            title="Total Maquinaria"
            [value]="maquinarias().length"
            icon="🏗️"
            color="blue"
            [subtitle]="disponiblesCount() + ' disponibles'"
          ></app-stat-card>
          <app-stat-card
            title="Obras Activas"
            [value]="obrasActivas()"
            icon="🔨"
            color="green"
          ></app-stat-card>
          <app-stat-card
            title="Asignaciones Activas"
            [value]="asignacionesActivas().length"
            icon="📋"
            color="yellow"
          ></app-stat-card>
          <app-stat-card
            title="Mantenimientos Próximos"
            [value]="mantenimientosProximos().length"
            icon="🔧"
            color="red"
            subtitle="próximos 30 días"
          ></app-stat-card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Asignaciones activas -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Asignaciones Activas</h3>
              <a routerLink="/asignaciones" class="text-sm text-sky-600 hover:text-sky-700 font-medium">Ver todas</a>
            </div>
            @if (asignacionesActivas().length === 0) {
              <p class="text-sm text-gray-500 text-center py-6">No hay asignaciones activas</p>
            } @else {
              <div class="space-y-3">
                @for (asignacion of asignacionesActivas().slice(0, 5); track asignacion.id) {
                  <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ asignacion.maquinariaCodigo }} - {{ asignacion.maquinariaMarca }} {{ asignacion.maquinariaModelo }}</p>
                      <p class="text-xs text-gray-500">{{ asignacion.obraNombre }}</p>
                    </div>
                    <app-status-badge [estado]="asignacion.estado" entity="asignacion"></app-status-badge>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Mantenimientos próximos -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Mantenimientos Próximos</h3>
              <a routerLink="/mantenimientos" class="text-sm text-sky-600 hover:text-sky-700 font-medium">Ver todos</a>
            </div>
            @if (mantenimientosProximos().length === 0) {
              <p class="text-sm text-gray-500 text-center py-6">No hay mantenimientos programados</p>
            } @else {
              <div class="space-y-3">
                @for (mant of mantenimientosProximos().slice(0, 5); track mant.id) {
                  <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ mant.maquinariaCodigo }} - {{ mant.descripcion | truncate:40 }}</p>
                      <p class="text-xs text-gray-500">{{ mant.fechaProgramada | dateFormat }}</p>
                    </div>
                    <app-status-badge [estado]="mant.estado" entity="mantenimiento"></app-status-badge>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Estado de la flota -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Estado de la Flota</h3>
            <div class="space-y-2">
              @for (estado of estadosFlota(); track estado.label) {
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">{{ estado.label }}</span>
                  <div class="flex items-center gap-2">
                    <div class="w-32 bg-gray-200 rounded-full h-2">
                      <div class="h-2 rounded-full transition-all" [style.width.%]="estado.pct" [class]="estado.barClass"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900 w-6 text-right">{{ estado.count }}</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Obras recientes -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Obras</h3>
              <a routerLink="/obras" class="text-sm text-sky-600 hover:text-sky-700 font-medium">Ver todas</a>
            </div>
            @if (obras().length === 0) {
              <p class="text-sm text-gray-500 text-center py-6">No hay obras registradas</p>
            } @else {
              <div class="space-y-3">
                @for (obra of obras().slice(0, 5); track obra.id) {
                  <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ obra.nombre }}</p>
                      <p class="text-xs text-gray-500">{{ obra.ciudad }}</p>
                    </div>
                    <app-status-badge [estado]="obra.estado" entity="obra"></app-status-badge>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class DashboardPageComponent implements OnInit {
  loading = signal(true);
  maquinarias = signal<Maquinaria[]>([]);
  obras = signal<Obra[]>([]);
  asignacionesActivas = signal<Asignacion[]>([]);
  mantenimientosProximos = signal<Mantenimiento[]>([]);

  constructor(
    private maquinariaService: MaquinariaService,
    private obrasService: ObrasService,
    private asignacionesService: AsignacionesService,
    private mantenimientosService: MantenimientosService
  ) {}

  ngOnInit(): void {
    forkJoin({
      maquinarias: this.maquinariaService.getAll(),
      obras: this.obrasService.getAll(),
      asignaciones: this.asignacionesService.getActivas(),
      mantenimientos: this.mantenimientosService.getProximos(30)
    }).subscribe({
      next: ({ maquinarias, obras, asignaciones, mantenimientos }) => {
        this.maquinarias.set(maquinarias);
        this.obras.set(obras);
        this.asignacionesActivas.set(asignaciones);
        this.mantenimientosProximos.set(mantenimientos);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  get disponiblesCount(): ReturnType<typeof signal<number>> {
    return signal(this.maquinarias().filter(m => m.estado === 'Disponible').length);
  }

  obrasActivas(): number {
    return this.obras().filter(o => o.estado === 'Activa').length;
  }

  estadosFlota(): { label: string; count: number; pct: number; barClass: string }[] {
    const total = this.maquinarias().length || 1;
    const estadoConfig = [
      { label: 'Disponible', barClass: 'bg-emerald-500' },
      { label: 'Asignada', barClass: 'bg-blue-500' },
      { label: 'En Mantenimiento', barClass: 'bg-amber-500' },
      { label: 'Fuera de Servicio', barClass: 'bg-red-500' },
      { label: 'En Tránsito', barClass: 'bg-gray-500' },
    ];
    return estadoConfig.map(e => {
      const count = this.maquinarias().filter(m => m.estado === e.label).length;
      return { ...e, count, pct: Math.round((count / total) * 100) };
    });
  }
}
