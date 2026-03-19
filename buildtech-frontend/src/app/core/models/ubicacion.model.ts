export type TipoUbicacion = 'Obra' | 'Almacén' | 'Taller' | 'Otro';

export interface Ubicacion {
  id: number;
  nombre: string;
  tipo: string;
  direccion: string;
  ciudad?: string;
  codigoPostal: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUbicacionDto {
  nombre: string;
  tipo: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
}

export interface UpdateUbicacionDto {
  nombre: string;
  tipo: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
}
