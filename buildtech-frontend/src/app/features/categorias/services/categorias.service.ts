import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Categoria, CreateCategoriaDto, UpdateCategoriaDto } from '../../../core/models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private readonly baseUrl = 'http://localhost:5289/api/categoria';
  private categoriasSubject = new BehaviorSubject<Categoria[]>([]);
  categorias$ = this.categoriasSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.baseUrl).pipe(
      tap(data => this.categoriasSubject.next(data))
    );
  }

  getById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateCategoriaDto): Observable<Categoria> {
    return this.http.post<Categoria>(this.baseUrl, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  update(id: number, dto: UpdateCategoriaDto): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.baseUrl}/${id}`, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.getAll().subscribe())
    );
  }
}
