import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tarea } from '../models/domain.models';

export interface TareaRequest {
  idHogar: string;
  titulo: string;
  descripcion?: string;
  idPrioridad?: number;
  categoria?: string;
  fechaLimite?: string;
  esPeriodica?: boolean;
  periodicidad?: string;
  esPersonal?: boolean;
  idsMiembros?: string[];
}

@Injectable({ providedIn: 'root' })
export class TareaService {

  private readonly apiUrl = `${environment.apiUrl}/tareas`;

  constructor(private http: HttpClient) {}

  listarPendientes(idHogar: string): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.apiUrl}/hogar/${idHogar}/pendientes`);
  }

  obtener(id: string): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.apiUrl}/${id}`);
  }

  crear(request: TareaRequest): Observable<Tarea> {
    return this.http.post<Tarea>(this.apiUrl, request);
  }

  actualizar(id: string, request: TareaRequest): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.apiUrl}/${id}`, request);
  }

  completar(id: string): Observable<Tarea> {
    return this.http.patch<Tarea>(`${this.apiUrl}/${id}/completar`, {});
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
