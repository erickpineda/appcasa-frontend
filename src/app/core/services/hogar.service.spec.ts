import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HogarService } from './hogar.service';

describe('HogarService', () => {
  let service: HogarService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(HogarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('loads my hogares and auto-selects when there is only one', () => {
    service.listarMisHogares().subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/v1/hogares');
    req.flush([
      { id: 'hogar-1', nombre: 'Casa demo', codigo: 'CASA1234', idEstado: 1 },
    ]);

    expect(service.hogaresDisponibles.length).toBe(1);
    expect(service.hogarActual?.codigo).toBe('CASA1234');
  });

  it('keeps the active hogar when it is still present in the backend list', () => {
    service.seleccionar({
      id: 'hogar-2',
      nombre: 'Casa sur',
      codigo: 'CASA5678',
      idEstado: 1,
    });

    service.listarMisHogares().subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/v1/hogares');
    req.flush([
      { id: 'hogar-1', nombre: 'Casa norte', codigo: 'CASA1234', idEstado: 1 },
      { id: 'hogar-2', nombre: 'Casa sur', codigo: 'CASA5678', idEstado: 1 },
    ]);

    expect(service.hogarActual?.id).toBe('hogar-2');
  });

  it('clears the active hogar when it is no longer available and there are several options', () => {
    service.seleccionar({
      id: 'hogar-9',
      nombre: 'Casa antigua',
      codigo: 'CASA9999',
      idEstado: 1,
    });

    service.listarMisHogares().subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/v1/hogares');
    req.flush([
      { id: 'hogar-1', nombre: 'Casa norte', codigo: 'CASA1234', idEstado: 1 },
      { id: 'hogar-2', nombre: 'Casa sur', codigo: 'CASA5678', idEstado: 1 },
    ]);

    expect(service.hogarActual).toBeNull();
  });

  it('adds and selects the hogar returned by crear', () => {
    service.crear('Casa nueva', 'Demo').subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/v1/hogares');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'hogar-3', nombre: 'Casa nueva', codigo: 'CASA7777', idEstado: 1 });

    expect(service.hogarActual?.id).toBe('hogar-3');
    expect(service.hogaresDisponibles.map((hogar) => hogar.id)).toContain('hogar-3');
  });
});
