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
  private hogaresSubject = new BehaviorSubject<Hogar[]>([]);
  hogar$ = this.hogarSubject.asObservable();
  hogares$ = this.hogaresSubject.asObservable();

  constructor(private http: HttpClient) {}

  get hogarActual(): Hogar | null {
    return this.hogarSubject.value;
  }

  get idHogarActual(): string {
    return this.hogarActual?.id ?? '';
  }

  get hogaresDisponibles(): Hogar[] {
    return this.hogaresSubject.value;
  }

  seleccionar(hogar: Hogar | null): void {
    if (!hogar) {
      localStorage.removeItem(HOGAR_KEY);
      this.hogarSubject.next(null);
      return;
    }

    localStorage.setItem(HOGAR_KEY, JSON.stringify(hogar));
    this.hogarSubject.next(hogar);
  }

  obtener(id: string): Observable<Hogar> {
    return this.http.get<Hogar>(`${this.apiUrl}/${id}`);
  }

  listarMisHogares(): Observable<Hogar[]> {
    return this.http.get<Hogar[]>(this.apiUrl).pipe(
      tap((hogares) => {
        this.hogaresSubject.next(hogares);
        this.sincronizarHogarActual(hogares);
      })
    );
  }

  crear(nombre: string, descripcion?: string): Observable<Hogar> {
    return this.http.post<Hogar>(this.apiUrl, { nombre, descripcion }).pipe(
      tap((hogar) => this.registrarYSeleccionar(hogar))
    );
  }

  unirse(codigo: string): Observable<Hogar> {
    return this.http.post<Hogar>(`${this.apiUrl}/unirse`, { codigo }).pipe(
      tap((hogar) => this.registrarYSeleccionar(hogar))
    );
  }

  sincronizarHogarActual(hogares: Hogar[]): Hogar | null {
    const hogarActual = this.hogarActual;
    if (hogarActual) {
      const hogarVigente = hogares.find((hogar) => hogar.id === hogarActual.id);
      if (hogarVigente) {
        this.seleccionar(hogarVigente);
        return hogarVigente;
      }
    }

    if (hogares.length === 1) {
      this.seleccionar(hogares[0]);
      return hogares[0];
    }

    this.seleccionar(null);
    return null;
  }

  private loadHogar(): Hogar | null {
    const raw = localStorage.getItem(HOGAR_KEY);
    return raw ? (JSON.parse(raw) as Hogar) : null;
  }

  private registrarYSeleccionar(hogar: Hogar): void {
    const resto = this.hogaresDisponibles.filter((item) => item.id !== hogar.id);
    this.hogaresSubject.next([hogar, ...resto].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    this.seleccionar(hogar);
  }
}
