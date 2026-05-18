import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Recordatorio } from '../models/domain.models';

export interface RecordatorioRequest {
  idHogar: string;
  titulo: string;
  descripcion?: string;
  idTipoRecordatorio: number;
  fechaHora: string;
  reglaRecurrencia?: string;
  anticipacionMinutos?: number;
  idTarea?: string;
  idMiembro?: string;
}

@Injectable({ providedIn: 'root' })
export class RecordatorioService {

  private readonly apiUrl = `${environment.apiUrl}/recordatorios`;

  constructor(private http: HttpClient) {}

  listarPorHogar(idHogar: string): Observable<Recordatorio[]> {
    return this.http.get<Recordatorio[]>(`${this.apiUrl}/hogar/${idHogar}`);
  }

  obtener(id: string): Observable<Recordatorio> {
    return this.http.get<Recordatorio>(`${this.apiUrl}/${id}`);
  }

  crear(request: RecordatorioRequest): Observable<Recordatorio> {
    return this.http.post<Recordatorio>(this.apiUrl, request);
  }

  actualizar(id: string, request: RecordatorioRequest): Observable<Recordatorio> {
    return this.http.put<Recordatorio>(`${this.apiUrl}/${id}`, request);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
