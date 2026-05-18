import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Hogar } from '../models/domain.models';

const HOGAR_KEY = 'appcasa_hogar';

@Injectable({ providedIn: 'root' })
export class HogarService {

  private readonly apiUrl = `${environment.apiUrl}/hogares`;
  private hogarSubject = new BehaviorSubject<Hogar | null>(this.loadHogar());
  hogar$ = this.hogarSubject.asObservable();

  constructor(private http: HttpClient) {}

  get hogarActual(): Hogar | null {
    return this.hogarSubject.value;
  }

  get idHogarActual(): string {
    return this.hogarActual?.id ?? '';
  }

  seleccionar(hogar: Hogar): void {
    localStorage.setItem(HOGAR_KEY, JSON.stringify(hogar));
    this.hogarSubject.next(hogar);
  }

  obtener(id: string): Observable<Hogar> {
    return this.http.get<Hogar>(`${this.apiUrl}/${id}`);
  }

  crear(nombre: string, descripcion?: string): Observable<Hogar> {
    return this.http.post<Hogar>(this.apiUrl, { nombre, descripcion }).pipe(
      tap((hogar) => this.seleccionar(hogar))
    );
  }

  unirse(codigo: string): Observable<Hogar> {
    return this.http.post<Hogar>(`${this.apiUrl}/unirse`, { codigo }).pipe(
      tap((hogar) => this.seleccionar(hogar))
    );
  }

  private loadHogar(): Hogar | null {
    const raw = localStorage.getItem(HOGAR_KEY);
    return raw ? (JSON.parse(raw) as Hogar) : null;
  }
}
