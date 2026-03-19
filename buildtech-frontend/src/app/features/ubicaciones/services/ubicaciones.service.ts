import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Ubicacion, CreateUbicacionDto, UpdateUbicacionDto } from '../../../core/models/ubicacion.model';

@Injectable({ providedIn: 'root' })
export class UbicacionesService {
  private readonly baseUrl = 'http://localhost:5289/api/ubicacion';
  private ubicacionesSubject = new BehaviorSubject<Ubicacion[]>([]);
  ubicaciones$ = this.ubicacionesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(this.baseUrl).pipe(
      tap(data => this.ubicacionesSubject.next(data))
    );
  }

  getById(id: number): Observable<Ubicacion> {
    return this.http.get<Ubicacion>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateUbicacionDto): Observable<Ubicacion> {
    return this.http.post<Ubicacion>(this.baseUrl, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  update(id: number, dto: UpdateUbicacionDto): Observable<Ubicacion> {
    return this.http.put<Ubicacion>(`${this.baseUrl}/${id}`, dto).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.getAll().subscribe())
    );
  }
}
