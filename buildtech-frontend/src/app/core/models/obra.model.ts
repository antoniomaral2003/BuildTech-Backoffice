export type EstadoObra = 'Activa' | 'En Pausa' | 'Finalizada' | 'Cancelada';

export interface Obra {
  id: number;
  nombre: string;
  codigo?: string;
  direccion: string;
  ciudad?: string;
  responsableNombre?: string;
  responsableTelefono?: string;
  responsableEmail?: string;
  fechaInicio?: Date;
  fechaFinEstimada?: Date;
  estado: EstadoObra;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateObraDto {
  nombre: string;
  codigo?: string;
  direccion: string;
  ciudad?: string;
  responsableNombre?: string;
  responsableTelefono?: string;
  responsableEmail?: string;
  fechaInicio?: string;
  fechaFinEstimada?: string;
}

export interface UpdateObraDto {
  nombre: string;
  codigo?: string;
  direccion: string;
  ciudad?: string;
  responsableNombre?: string;
  responsableTelefono?: string;
  responsableEmail?: string;
  fechaInicio?: string;
  fechaFinEstimada?: string;
  estado: EstadoObra;
}
