import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/services/auth.service';
import { PerfilPage } from './perfil.page';

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['logout', 'clearSession'],
      {
        usuario: {
          id: '1',
          nombre: 'Ana',
          apellidos: 'Casa',
          email: 'ana@example.com',
          tema: 'CLARO',
          locale: 'es-ES',
          idEstado: 1,
        },
      }
    );
    authService.logout.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [PerfilPage],
      providers: [
        { provide: AuthService, useValue: authService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('shows authenticated user data and basic settings', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(component.usuario?.email).toBe('ana@example.com');
    expect(compiled.textContent).toContain('Ana Casa');
    expect(compiled.textContent).toContain('ana@example.com');
    expect(compiled.textContent).toContain('Tema');
    expect(compiled.textContent).toContain('Idioma');
    expect(compiled.textContent).toContain('Proximamente');
  });

  it('logs out and redirects to auth', () => {
    component.cerrarSesion();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth'], { replaceUrl: true });
  });

  it('clears the session and redirects even if logout fails', () => {
    authService.logout.and.returnValue(throwError(() => new Error('network')));

    component.cerrarSesion();

    expect(authService.clearSession).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth'], { replaceUrl: true });
  });
});
