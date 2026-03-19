import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Maquinaria, CreateMaquinariaDto, UpdateMaquinariaDto } from '../../../core/models/maquinaria.model';

@Injectable({ providedIn: 'root' })
export class MaquinariaService {
  private readonly baseUrl = 'http://localhost:5289/api/maquinaria';
  private maquinariasSubject = new BehaviorSubject<Maquinaria[]>([]);
  maquinarias$ = this.maquinariasSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Maquinaria[]> {
    return this.http.get<Maquinaria[]>(this.baseUrl).pipe(
      map(items => items.map(item => this.transformDates(item))),
      tap(data => this.maquinariasSubject.next(data))
    );
  }

  getById(id: number): Observable<Maquinaria> {
    return this.http.get<Maquinaria>(`${this.baseUrl}/${id}`).pipe(
      map(item => this.transformDates(item))
    );
  }

  create(dto: CreateMaquinariaDto): Observable<Maquinaria> {
    return this.http.post<Maquinaria>(this.baseUrl, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  update(id: number, dto: UpdateMaquinariaDto): Observable<Maquinaria> {
    return this.http.put<Maquinaria>(`${this.baseUrl}/${id}`, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  private transformDates(item: Maquinaria): Maquinaria {
    return {
      ...item,
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      tipoNombre: item.tipo?.nombre ?? item.tipoNombre,
      categoriaNombre: item.tipo?.categoria?.nombre ?? item.categoriaNombre,
      ubicacionNombre: item.ubicacion?.nombre ?? item.ubicacionNombre,
    };
  }
}
