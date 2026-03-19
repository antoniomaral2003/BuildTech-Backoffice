export type EstadoMaquinaria = 'Disponible' | 'Asignada' | 'En Mantenimiento' | 'Fuera de Servicio' | 'En Tránsito';

export interface Maquinaria {
  id: number;
  codigoInterno: string;
  tipoId: number;
  marca: string;
  modelo: string;
  anioFabricacion: number;
  numeroSerie: string;
  estado: EstadoMaquinaria;
  ubicacionId?: number;
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
  // Navigation (nested objects from API)
  tipo?: { id: number; nombre: string; descripcion?: string; categoria?: { id: number; nombre: string } };
  ubicacion?: { id: number; nombre: string; tipo?: string; ciudad?: string };
  // Flat fields (populated by service from nested objects)
  tipoNombre?: string;
  categoriaNombre?: string;
  ubicacionNombre?: string;
}

export interface CreateMaquinariaDto {
  codigoInterno: string;
  tipoId: number;
  marca: string;
  modelo: string;
  anioFabricacion: number;
  numeroSerie: string;
  ubicacionId?: number;
  observaciones?: string;
}

export interface UpdateMaquinariaDto {
  codigoInterno: string;
  tipoId: number;
  marca: string;
  modelo: string;
  anioFabricacion: number;
  numeroSerie: string;
  estado: EstadoMaquinaria;
  ubicacionId?: number;
  observaciones?: string;
}
