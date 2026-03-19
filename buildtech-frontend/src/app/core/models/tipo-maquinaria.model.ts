export interface TipoMaquinaria {
  id: number;
  nombre: string;
  categoriaId: number;
  descripcion?: string;
  createdAt: Date;
  updatedAt: Date;
  categoriaNombre?: string;
}

export interface CreateTipoMaquinariaDto {
  nombre: string;
  categoriaId: number;
  descripcion?: string;
}

export interface UpdateTipoMaquinariaDto {
  nombre: string;
  categoriaId: number;
  descripcion?: string;
}
