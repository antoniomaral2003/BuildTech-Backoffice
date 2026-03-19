import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Asignacion, CreateAsignacionDto, UpdateAsignacionDto } from '../../../core/models/asignacion.model';

@Injectable({ providedIn: 'root' })
export class AsignacionesService {
  private readonly baseUrl = 'http://localhost:5289/api/asignacion';
  private asignacionesSubject = new BehaviorSubject<Asignacion[]>([]);
  asignaciones$ = this.asignacionesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(this.baseUrl).pipe(
      map(items => items.map(item => this.transformDates(item))),
      tap(data => this.asignacionesSubject.next(data))
    );
  }

  getActivas(): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.baseUrl}/activas`).pipe(
      map(items => items.map(item => this.transformDates(item)))
    );
  }

  getByObra(obraId: number): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.baseUrl}/obra/${obraId}`).pipe(
      map(items => items.map(item => this.transformDates(item)))
    );
  }

  getByMaquinaria(maquinariaId: number): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.baseUrl}/maquinaria/${maquinariaId}`).pipe(
      map(items => items.map(item => this.transformDates(item)))
    );
  }

  getById(id: number): Observable<Asignacion> {
    return this.http.get<Asignacion>(`${this.baseUrl}/${id}`).pipe(
      map(item => this.transformDates(item))
    );
  }

  create(dto: CreateAsignacionDto): Observable<Asignacion> {
    return this.http.post<Asignacion>(this.baseUrl, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  update(id: number, dto: UpdateAsignacionDto): Observable<Asignacion> {
    return this.http.put<Asignacion>(`${this.baseUrl}/${id}`, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  private transformDates(item: Asignacion): Asignacion {
    return {
      ...item,
      fechaInicio: new Date(item.fechaInicio),
      fechaFinEstimada: new Date(item.fechaFinEstimada),
      fechaEntregaReal: item.fechaEntregaReal ? new Date(item.fechaEntregaReal) : undefined,
      fechaDevolucionReal: item.fechaDevolucionReal ? new Date(item.fechaDevolucionReal) : undefined,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      obraNombre: item.obra?.nombre ?? item.obraNombre,
      maquinariaCodigo: item.maquinaria?.codigoInterno ?? item.maquinariaCodigo,
      maquinariaMarca: item.maquinaria?.marca ?? item.maquinariaMarca,
      maquinariaModelo: item.maquinaria?.modelo ?? item.maquinariaModelo,
      operadorNombre: item.operador?.nombre ?? item.operadorNombre,
      operadorApellidos: item.operador?.apellidos ?? item.operadorApellidos,
    };
  }
}
