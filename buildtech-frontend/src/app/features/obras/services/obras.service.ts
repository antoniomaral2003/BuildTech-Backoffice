import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Obra, CreateObraDto, UpdateObraDto } from '../../../core/models/obra.model';

@Injectable({ providedIn: 'root' })
export class ObrasService {
  private readonly baseUrl = 'http://localhost:5289/api/obra';
  private obrasSubject = new BehaviorSubject<Obra[]>([]);
  obras$ = this.obrasSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Obra[]> {
    return this.http.get<Obra[]>(this.baseUrl).pipe(
      map(items => items.map(item => this.transformDates(item))),
      tap(data => this.obrasSubject.next(data))
    );
  }

  getById(id: number): Observable<Obra> {
    return this.http.get<Obra>(`${this.baseUrl}/${id}`).pipe(
      map(item => this.transformDates(item))
    );
  }

  create(dto: CreateObraDto): Observable<Obra> {
    return this.http.post<Obra>(this.baseUrl, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  update(id: number, dto: UpdateObraDto): Observable<Obra> {
    return this.http.put<Obra>(`${this.baseUrl}/${id}`, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  private transformDates(item: Obra): Obra {
    return {
      ...item,
      fechaInicio: item.fechaInicio ? new Date(item.fechaInicio) : undefined,
      fechaFinEstimada: item.fechaFinEstimada ? new Date(item.fechaFinEstimada) : undefined,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    };
  }
}
