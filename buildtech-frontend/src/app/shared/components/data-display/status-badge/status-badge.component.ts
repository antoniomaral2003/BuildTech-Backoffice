import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BadgeComponent } from '../../ui/badge/badge.component';

type BadgeVariant = 'green' | 'blue' | 'yellow' | 'red' | 'gray' | 'orange' | 'purple';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-badge [text]="estado" [variant]="variant"></app-badge>`
})
export class StatusBadgeComponent {
  @Input() estado = '';
  @Input() entity: 'maquinaria' | 'asignacion' | 'mantenimiento' | 'obra' | 'operador' = 'maquinaria';

  get variant(): BadgeVariant {
    const maps: Record<string, Record<string, BadgeVariant>> = {
      maquinaria: {
        'Disponible': 'green',
        'Asignada': 'blue',
        'En Mantenimiento': 'yellow',
        'Fuera de Servicio': 'red',
        'En Tránsito': 'gray'
      },
      asignacion: {
        'Programada': 'blue',
        'En Curso': 'green',
        'Finalizada': 'gray',
        'Cancelada': 'red'
      },
      mantenimiento: {
        'Programado': 'blue',
        'En Proceso': 'yellow',
        'Completado': 'green',
        'Cancelado': 'red'
      },
      obra: {
        'Activa': 'green',
        'En Pausa': 'yellow',
        'Finalizada': 'gray',
        'Cancelada': 'red'
      },
      operador: {
        'Activo': 'green',
        'Inactivo': 'gray'
      }
    };
    return (maps[this.entity]?.[this.estado] as BadgeVariant) ?? 'gray';
  }
}
