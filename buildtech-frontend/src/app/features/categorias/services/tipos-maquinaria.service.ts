import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TipoMaquinaria, CreateTipoMaquinariaDto, UpdateTipoMaquinariaDto } from '../../../core/models/tipo-maquinaria.model';

@Injectable({ providedIn: 'root' })
export class TiposMaquinariaService {
  private readonly baseUrl = 'http://localhost:5289/api/tipomaquinaria';
  private tiposSubject = new BehaviorSubject<TipoMaquinaria[]>([]);
  tipos$ = this.tiposSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<TipoMaquinaria[]> {
    return this.http.get<TipoMaquinaria[]>(this.baseUrl).pipe(
      tap(data => this.tiposSubject.next(data))
    );
  }

  getById(id: number): Observable<TipoMaquinaria> {
    return this.http.get<TipoMaquinaria>(`${this.baseUrl}/${id}`);
  }

  getByCategoria(categoriaId: number): Observable<TipoMaquinaria[]> {
    return this.http.get<TipoMaquinaria[]>(`${this.baseUrl}/categoria/${categoriaId}`);
  }

  create(dto: CreateTipoMaquinariaDto): Observable<TipoMaquinaria> {
    return this.http.post<TipoMaquinaria>(this.baseUrl, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  update(id: number, dto: UpdateTipoMaquinariaDto): Observable<TipoMaquinaria> {
    return this.http.put<TipoMaquinaria>(`${this.baseUrl}/${id}`, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.getAll().subscribe())
    );
  }
}
