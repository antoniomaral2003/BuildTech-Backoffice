import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaquinariaService } from '../../services/maquinaria.service';
import { Maquinaria } from '../../../../core/models/maquinaria.model';
import { PageHeaderComponent, Breadcrumb } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { InfoRowComponent } from '../../../../shared/components/data-display/info-row/info-row.component';
import { StatusBadgeComponent } from '../../../../shared/components/data-display/status-badge/status-badge.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-maquinaria-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    PageHeaderComponent,
    ButtonComponent,
    CardComponent,
    InfoRowComponent,
    StatusBadgeComponent,
    SpinnerComponent,
    DateFormatPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <app-page-header [title]="item()?.codigoInterno ?? 'Detalle'" [breadcrumbs]="breadcrumbs">
        <div actions>
          @if (item()) {
            <app-button variant="secondary" [routerLink]="['/maquinaria', item()!.id, 'editar']">Editar</app-button>
          }
        </div>
      </app-page-header>

      @if (loading()) {
        <app-spinner></app-spinner>
      } @else if (item()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <app-card title="Información General">
            <dl>
              <app-info-row label="Código Interno" [value]="item()!.codigoInterno"></app-info-row>
              <app-info-row label="Marca" [value]="item()!.marca"></app-info-row>
              <app-info-row label="Modelo" [value]="item()!.modelo"></app-info-row>
              <app-info-row label="Año Fabricación" [value]="item()!.anioFabricacion"></app-info-row>
              <app-info-row label="N° Serie" [value]="item()!.numeroSerie"></app-info-row>
              <app-info-row label="Tipo" [value]="item()!.tipoNombre"></app-info-row>
              <app-info-row label="Categoría" [value]="item()!.categoriaNombre"></app-info-row>
            </dl>
          </app-card>

          <app-card title="Estado y Ubicación">
            <dl>
              <div class="flex items-start py-2 border-b border-gray-100">
                <dt class="text-sm font-medium text-gray-500 w-40 flex-shrink-0">Estado</dt>
                <dd class="text-sm text-gray-900 flex-1">
                  <app-status-badge [estado]="item()!.estado" entity="maquinaria"></app-status-badge>
                </dd>
              </div>
              <app-info-row label="Ubicación" [value]="item()!.ubicacionNombre"></app-info-row>
              <app-info-row label="Observaciones" [value]="item()!.observaciones"></app-info-row>
              <app-info-row label="Creado" [value]="(item()!.createdAt | dateFormat:'long')"></app-info-row>
              <app-info-row label="Actualizado" [value]="(item()!.updatedAt | dateFormat:'datetime')"></app-info-row>
            </dl>
          </app-card>
        </div>
      }
    </div>
  `
})
export class MaquinariaDetailPageComponent implements OnInit {
  loading = signal(true);
  item = signal<Maquinaria | null>(null);
  breadcrumbs: Breadcrumb[] = [
    { label: 'Maquinaria', route: '/maquinaria' },
    { label: 'Detalle' }
  ];

  constructor(
    private route: ActivatedRoute,
    private maquinariaService: MaquinariaService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.maquinariaService.getById(id).subscribe({
      next: data => { this.item.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
