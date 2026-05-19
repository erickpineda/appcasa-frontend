import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    localStorage.clear();
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: router },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('retries the original request after a successful refresh', () => {
    localStorage.setItem('appcasa_token', 'jwt-token-1');

    let responseBody: unknown;
    httpClient.get('/api/secure').subscribe((response) => {
      responseBody = response;
    });

    const secure = httpMock.expectOne('/api/secure');
    expect(secure.request.headers.get('Authorization')).toBe('Bearer jwt-token-1');
    secure.flush({}, { status: 401, statusText: 'Unauthorized' });

    const refresh = httpMock.expectOne('http://localhost:8080/api/v1/auth/refresh');
    expect(refresh.request.withCredentials).toBeTrue();
    refresh.flush({
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

    const retried = httpMock.expectOne('/api/secure');
    expect(retried.request.headers.get('Authorization')).toBe('Bearer jwt-token-2');
    retried.flush({ ok: true });

    expect(responseBody).toEqual({ ok: true });
  });

  it('clears the session and redirects when refresh fails', () => {
    localStorage.setItem('appcasa_token', 'jwt-token-1');
    localStorage.setItem('appcasa_user', JSON.stringify({
      id: '1',
      nombre: 'Ana',
      email: 'ana@example.com',
      tema: 'CLARO',
      locale: 'es-ES',
      idEstado: 1,
    }));

    httpClient.get('/api/secure').subscribe({
      error: () => undefined,
    });

    const secure = httpMock.expectOne('/api/secure');
    secure.flush({}, { status: 401, statusText: 'Unauthorized' });

    const refresh = httpMock.expectOne('http://localhost:8080/api/v1/auth/refresh');
    refresh.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(authService.getToken()).toBeNull();
    expect(authService.usuario).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });
});
