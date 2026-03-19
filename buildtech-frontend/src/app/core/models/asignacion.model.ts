export type EstadoAsignacion = 'Programada' | 'En Curso' | 'Finalizada' | 'Cancelada';

export interface Asignacion {
  id: number;
  obraId: number;
  maquinariaId: number;
  operadorId?: number;
  fechaInicio: Date;
  fechaFinEstimada: Date;
  fechaEntregaReal?: Date;
  fechaDevolucionReal?: Date;
  condicionesEntrega?: string;
  observaciones?: string;
  estado: EstadoAsignacion;
  createdAt: Date;
  updatedAt: Date;
  // Navigation (nested objects from API)
  obra?: { id: number; nombre: string; codigo?: string };
  maquinaria?: { id: number; codigoInterno: string; marca: string; modelo: string };
  operador?: { id: number; nombre: string; apellidos: string };
  // Flat fields (populated by service from nested objects)
  obraNombre?: string;
  maquinariaCodigo?: string;
  maquinariaMarca?: string;
  maquinariaModelo?: string;
  operadorNombre?: string;
  operadorApellidos?: string;
}

export interface CreateAsignacionDto {
  obraId: number;
  maquinariaId: number;
  operadorId?: number;
  fechaInicio: string;
  fechaFinEstimada: string;
  condicionesEntrega?: string;
  observaciones?: string;
}

export interface UpdateAsignacionDto {
  obraId: number;
  maquinariaId: number;
  operadorId?: number;
  fechaInicio: string;
  fechaFinEstimada: string;
  fechaEntregaReal?: string;
  fechaDevolucionReal?: string;
  condicionesEntrega?: string;
  observaciones?: string;
  estado: EstadoAsignacion;
}
