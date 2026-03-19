export type TipoMantenimiento = 'Preventivo' | 'Correctivo';
export type EstadoMantenimiento = 'Programado' | 'En Proceso' | 'Completado' | 'Cancelado';

export interface Mantenimiento {
  id: number;
  maquinariaId: number;
  tipo: TipoMantenimiento;
  fechaProgramada?: Date;
  fechaInicio?: Date;
  fechaFin?: Date;
  descripcion: string;
  horasUsoMomento?: number;
  taller?: string;
  costo?: number;
  observaciones?: string;
  estado: EstadoMantenimiento;
  createdAt: Date;
  updatedAt: Date;
  // Navigation (nested object from API)
  maquinaria?: { id: number; codigoInterno: string; marca: string; modelo: string };
  // Flat fields (populated by service from nested object)
  maquinariaCodigo?: string;
  maquinariaMarca?: string;
  maquinariaModelo?: string;
}

export interface CreateMantenimientoDto {
  maquinariaId: number;
  tipo: TipoMantenimiento;
  fechaProgramada?: string;
  descripcion: string;
  horasUsoMomento?: number;
  taller?: string;
  observaciones?: string;
}

export interface UpdateMantenimientoDto {
  maquinariaId: number;
  tipo: TipoMantenimiento;
  fechaProgramada?: string;
  fechaInicio?: string;
  fechaFin?: string;
  descripcion: string;
  horasUsoMomento?: number;
  taller?: string;
  costo?: number;
  observaciones?: string;
  estado: EstadoMantenimiento;
}
