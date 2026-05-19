import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastController } from '@ionic/angular';
import { of } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';
import { Hogar } from '../../../core/models/domain.models';
import { HogarService } from '../../../core/services/hogar.service';
import { MiembroService } from '../../../core/services/miembro.service';
import { TareaService } from '../../../core/services/tarea.service';
import { TareaFormPage } from './tarea-form.page';

class HogarServiceStub {
  hogarActual: Hogar | null = {
    id: 'hogar-1',
    nombre: 'Casa demo',
    codigo: 'CASA1234',
    idEstado: 1,
  };

  get idHogarActual(): string {
    return this.hogarActual?.id ?? '';
  }
}

describe('TareaFormPage', () => {
  let component: TareaFormPage;
  let fixture: ComponentFixture<TareaFormPage>;
  let hogarService: HogarServiceStub;
  let miembroService: jasmine.SpyObj<MiembroService>;
  let tareaService: jasmine.SpyObj<TareaService>;
  let router: Router;

  beforeEach(async () => {
    hogarService = new HogarServiceStub();
    miembroService = jasmine.createSpyObj<MiembroService>('MiembroService', ['listarPorHogar']);
    tareaService = jasmine.createSpyObj<TareaService>('TareaService', ['crear', 'actualizar', 'obtener']);

    miembroService.listarPorHogar.and.returnValue(of([]));
    tareaService.crear.and.returnValue(of({ id: 'tarea-1' } as any));
    tareaService.actualizar.and.returnValue(of({ id: 'tarea-1' } as any));

    const toast = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toast.present.and.returnValue(Promise.resolve());
    const toastCtrl = jasmine.createSpyObj<ToastController>('ToastController', ['create']);
    toastCtrl.create.and.returnValue(Promise.resolve(toast as any));

    await TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [TareaFormPage],
      providers: [
        { provide: HogarService, useValue: hogarService },
        { provide: MiembroService, useValue: miembroService },
        { provide: TareaService, useValue: tareaService },
        { provide: ToastController, useValue: toastCtrl },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TareaFormPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('shows a visible warning block when there is no active hogar', () => {
    hogarService.hogarActual = null;

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Selecciona un hogar antes de crear la tarea');
  });

  it('renders categoria as a fixed select', () => {
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('ion-select[formControlName="categoria"]');
    expect(select).not.toBeNull();
  });

  it('submits fechaLimite as ISO datetime and categoria from the fixed selector', async () => {
    fixture.detectChanges();

    component.form.patchValue({
      titulo: 'Poner lavadora',
      categoria: 'Limpieza',
      fechaLimite: '2026-05-20T18:30:00Z',
      esPersonal: false,
    });

    await component.guardar();

    expect(tareaService.crear).toHaveBeenCalledWith(jasmine.objectContaining({
      hogarCodigo: 'CASA1234',
      categoria: 'Limpieza',
      fechaLimite: '2026-05-20T18:30:00Z',
    }));
  });
});
