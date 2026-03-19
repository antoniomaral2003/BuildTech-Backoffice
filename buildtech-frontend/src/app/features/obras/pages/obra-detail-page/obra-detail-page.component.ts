import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ObrasService } from '../../services/obras.service';
import { Obra } from '../../../../core/models/obra.model';
import { PageHeaderComponent, Breadcrumb } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { InfoRowComponent } from '../../../../shared/components/data-display/info-row/info-row.component';
import { StatusBadgeComponent } from '../../../../shared/components/data-display/status-badge/status-badge.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-obra-detail-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, ButtonComponent, CardComponent, InfoRowComponent, StatusBadgeComponent, SpinnerComponent, DateFormatPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <app-page-header [title]="item()?.nombre ?? 'Detalle de Obra'" [breadcrumbs]="breadcrumbs">
        <div actions>
          @if (item()) {
            <app-button variant="secondary" [routerLink]="['/obras', item()!.id, 'editar']">Editar</app-button>
          }
        </div>
      </app-page-header>

      @if (loading()) {
        <app-spinner></app-spinner>
      } @else if (item()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <app-card title="Información General">
            <dl>
              <app-info-row label="Nombre" [value]="item()!.nombre"></app-info-row>
              <app-info-row label="Código" [value]="item()!.codigo"></app-info-row>
              <app-info-row label="Dirección" [value]="item()!.direccion"></app-info-row>
              <app-info-row label="Ciudad" [value]="item()!.ciudad"></app-info-row>
              <div class="flex items-start py-2 border-b border-gray-100">
                <dt class="text-sm font-medium text-gray-500 w-40 flex-shrink-0">Estado</dt>
                <dd><app-status-badge [estado]="item()!.estado" entity="obra"></app-status-badge></dd>
              </div>
            </dl>
          </app-card>
          <app-card title="Responsable y Fechas">
            <dl>
              <app-info-row label="Responsable" [value]="item()!.responsableNombre"></app-info-row>
              <app-info-row label="Teléfono" [value]="item()!.responsableTelefono"></app-info-row>
              <app-info-row label="Email" [value]="item()!.responsableEmail"></app-info-row>
              <app-info-row label="Fecha Inicio" [value]="(item()!.fechaInicio | dateFormat:'long')"></app-info-row>
              <app-info-row label="Fecha Fin Est." [value]="(item()!.fechaFinEstimada | dateFormat:'long')"></app-info-row>
            </dl>
          </app-card>
        </div>
      }
    </div>
  `
})
export class ObraDetailPageComponent implements OnInit {
  loading = signal(true);
  item = signal<Obra | null>(null);
  breadcrumbs: Breadcrumb[] = [{ label: 'Obras', route: '/obras' }, { label: 'Detalle' }];

  constructor(private route: ActivatedRoute, private obrasService: ObrasService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.obrasService.getById(id).subscribe({
      next: data => { this.item.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
