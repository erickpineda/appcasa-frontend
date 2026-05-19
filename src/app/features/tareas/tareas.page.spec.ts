import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { of } from 'rxjs';
import { Hogar } from '../../core/models/domain.models';
import { HogarService } from '../../core/services/hogar.service';
import { TareaService } from '../../core/services/tarea.service';
import { TareasPage } from './tareas.page';

describe('TareasPage', () => {
  it('does not depend on manual change detection while loading tasks', () => {
    const hogar: Hogar = {
      id: 'hogar-1',
      nombre: 'Casa demo',
      codigo: 'CASA1234',
      idEstado: 1,
    };
    const tareaService = jasmine.createSpyObj<TareaService>('TareaService', ['listarPendientes']);
    const hogarService = jasmine.createSpyObj<HogarService>(
      'HogarService',
      ['listarMisHogares', 'seleccionar', 'crear', 'unirse'],
      {
        hogarActual: hogar,
        hogaresDisponibles: [hogar],
      },
    );
    const router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    const alertCtrl = jasmine.createSpyObj<AlertController>('AlertController', ['create']);
    const toastCtrl = jasmine.createSpyObj<ToastController>('ToastController', ['create']);
    const ngZone = jasmine.createSpyObj<NgZone>('NgZone', ['run']);

    tareaService.listarPendientes.and.returnValue(of([]));
    hogarService.listarMisHogares.and.returnValue(of([hogar]));
    ngZone.run.and.callFake(<T>(work: () => T) => work());

    const page = new TareasPage(
      tareaService,
      hogarService,
      router,
      alertCtrl,
      toastCtrl,
      ngZone,
    );

    page.ionViewDidEnter();

    expect((page as { cdr?: unknown }).cdr).toBeUndefined();
  });
});
