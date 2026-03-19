import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Mantenimiento, CreateMantenimientoDto, UpdateMantenimientoDto } from '../../../core/models/mantenimiento.model';

@Injectable({ providedIn: 'root' })
export class MantenimientosService {
  private readonly baseUrl = 'http://localhost:5289/api/mantenimiento';
  private mantenimientosSubject = new BehaviorSubject<Mantenimiento[]>([]);
  mantenimientos$ = this.mantenimientosSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(this.baseUrl).pipe(
      map(items => items.map(item => this.transformDates(item))),
      tap(data => this.mantenimientosSubject.next(data))
    );
  }

  getProximos(dias: number): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(`${this.baseUrl}/proximos/${dias}`).pipe(
      map(items => items.map(item => this.transformDates(item)))
    );
  }

  getByMaquinaria(maquinariaId: number): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(`${this.baseUrl}/maquinaria/${maquinariaId}`).pipe(
      map(items => items.map(item => this.transformDates(item)))
    );
  }

  getById(id: number): Observable<Mantenimiento> {
    return this.http.get<Mantenimiento>(`${this.baseUrl}/${id}`).pipe(
      map(item => this.transformDates(item))
    );
  }

  create(dto: CreateMantenimientoDto): Observable<Mantenimiento> {
    return this.http.post<Mantenimiento>(this.baseUrl, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  update(id: number, dto: UpdateMantenimientoDto): Observable<Mantenimiento> {
    return this.http.put<Mantenimiento>(`${this.baseUrl}/${id}`, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  private transformDates(item: Mantenimiento): Mantenimiento {
    return {
      ...item,
      fechaProgramada: item.fechaProgramada ? new Date(item.fechaProgramada) : undefined,
      fechaInicio: item.fechaInicio ? new Date(item.fechaInicio) : undefined,
      fechaFin: item.fechaFin ? new Date(item.fechaFin) : undefined,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      maquinariaCodigo: item.maquinaria?.codigoInterno ?? item.maquinariaCodigo,
      maquinariaMarca: item.maquinaria?.marca ?? item.maquinariaMarca,
      maquinariaModelo: item.maquinaria?.modelo ?? item.maquinariaModelo,
    };
  }
}
