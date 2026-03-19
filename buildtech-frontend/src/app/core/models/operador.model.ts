export type EstadoOperador = 'Activo' | 'Inactivo';

export interface Operador {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono?: string;
  email?: string;
  licencias?: string;
  estado: EstadoOperador;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOperadorDto {
  nombre: string;
  apellidos: string;
  dni: string;
  telefono?: string;
  email?: string;
  licencias?: string;
}

export interface UpdateOperadorDto {
  nombre: string;
  apellidos: string;
  dni: string;
  telefono?: string;
  email?: string;
  licencias?: string;
  estado: EstadoOperador;
}
