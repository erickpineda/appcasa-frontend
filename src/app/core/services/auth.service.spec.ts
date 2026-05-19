import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('sends withCredentials on login and stores the token', () => {
    service.login({ email: 'ana@example.com', password: 'Password123' }).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/login');
    expect(req.request.withCredentials).toBeTrue();

    req.flush({
      token: 'jwt-token',
      usuario: {
        id: '1',
        nombre: 'Ana',
        email: 'ana@example.com',
        tema: 'CLARO',
        locale: 'es-ES',
        idEstado: 1,
      },
    });

    expect(service.getToken()).toBe('jwt-token');
    expect(service.usuario?.email).toBe('ana@example.com');
  });

  it('refreshes silently and updates the stored user', () => {
    service.refresh().subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/refresh');
    expect(req.request.withCredentials).toBeTrue();

    req.flush({
      token: 'jwt-token-2',
      usuario: {
        id: '1',
        nombre: 'Ana',
        email: 'ana@example.com',
        tema: 'CLARO',
        locale: 'es-ES',
        idEstado: 1,
      },
    });

    expect(service.getToken()).toBe('jwt-token-2');
    expect(service.usuario?.nombre).toBe('Ana');
  });

  it('restores the session on app startup when refresh cookie is still valid', () => {
    let restored = false;

    service.restoreSession().subscribe((result) => {
      restored = result;
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/refresh');
    expect(req.request.withCredentials).toBeTrue();

    req.flush({
      token: 'boot-token',
      usuario: {
        id: '1',
        nombre: 'Ana',
        email: 'ana@example.com',
        tema: 'CLARO',
        locale: 'es-ES',
        idEstado: 1,
      },
    });

    expect(restored).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
  });
});
