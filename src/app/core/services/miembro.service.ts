import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MiembroHogar } from '../models/domain.models';

export interface MiembroRequest {
  idHogar: string;
  idTipoMiembro: number;
  nombre: string;
  fechaNacimiento?: string;
  notas?: string;
  raza?: string;
  color?: string;
  pesoKg?: number;
  microchip?: string;
  esterilizado?: boolean;
}

@Injectable({ providedIn: 'root' })
export class MiembroService {

  private readonly apiUrl = `${environment.apiUrl}/miembros`;

  constructor(private http: HttpClient) {}

  listarPorHogar(idHogar: string): Observable<MiembroHogar[]> {
    return this.http.get<MiembroHogar[]>(`${this.apiUrl}/hogar/${idHogar}`);
  }

  obtener(id: string): Observable<MiembroHogar> {
    return this.http.get<MiembroHogar>(`${this.apiUrl}/${id}`);
  }

  crear(request: MiembroRequest): Observable<MiembroHogar> {
    return this.http.post<MiembroHogar>(this.apiUrl, request);
  }

  actualizar(id: string, request: MiembroRequest): Observable<MiembroHogar> {
    return this.http.put<MiembroHogar>(`${this.apiUrl}/${id}`, request);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
