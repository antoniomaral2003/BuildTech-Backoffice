import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Operador, CreateOperadorDto, UpdateOperadorDto } from '../../../core/models/operador.model';

@Injectable({ providedIn: 'root' })
export class OperadoresService {
  private readonly baseUrl = 'http://localhost:5289/api/operador';
  private operadoresSubject = new BehaviorSubject<Operador[]>([]);
  operadores$ = this.operadoresSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Operador[]> {
    return this.http.get<Operador[]>(this.baseUrl).pipe(
      map(items => items.map(item => this.transformDates(item))),
      tap(data => this.operadoresSubject.next(data))
    );
  }

  getById(id: number): Observable<Operador> {
    return this.http.get<Operador>(`${this.baseUrl}/${id}`).pipe(
      map(item => this.transformDates(item))
    );
  }

  create(dto: CreateOperadorDto): Observable<Operador> {
    return this.http.post<Operador>(this.baseUrl, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  update(id: number, dto: UpdateOperadorDto): Observable<Operador> {
    return this.http.put<Operador>(`${this.baseUrl}/${id}`, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  private transformDates(item: Operador): Operador {
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt)
    };
  }
}
