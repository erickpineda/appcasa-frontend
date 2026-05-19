import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TareaService } from './tarea.service';

describe('TareaService', () => {
  let service: TareaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(TareaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sends tarea request using codigos and no technical ids', () => {
    service.crear({
      hogarCodigo: 'CASA1234',
      titulo: 'Comprar pienso',
      prioridadCodigo: 'ALTA',
      esPersonal: false,
      miembroIds: ['m1', 'm2'],
    }).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/v1/tareas');
    expect(req.request.body.prioridadCodigo).toBe('ALTA');
    expect(req.request.body.miembroIds).toEqual(['m1', 'm2']);
    expect(req.request.body.idPrioridad).toBeUndefined();
    expect(req.request.body.idHogar).toBeUndefined();

    req.flush({});
  });

  it('sends fechaLimite as full ISO datetime', () => {
    service.crear({
      hogarCodigo: 'CASA1234',
      titulo: 'Comprar pienso',
      fechaLimite: '2026-05-20T18:30:00Z',
      esPersonal: false,
    }).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/v1/tareas');
    expect(req.request.body.fechaLimite).toBe('2026-05-20T18:30:00Z');

    req.flush({});
  });

  it('lists pending tasks by hogar codigo', () => {
    service.listarPendientes('CASA1234').subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/v1/tareas/hogar/CASA1234/pendientes');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
