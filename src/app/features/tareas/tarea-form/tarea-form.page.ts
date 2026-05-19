import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HogarService } from '../../../core/services/hogar.service';
import { MiembroService } from '../../../core/services/miembro.service';
import { TareaService, TareaRequest } from '../../../core/services/tarea.service';
import { MiembroHogar, Tarea } from '../../../core/models/domain.models';

@Component({
  selector: 'app-tarea-form',
  standalone: false,
  templateUrl: './tarea-form.page.html',
})
export class TareaFormPage implements OnInit {

  form!: FormGroup;
  cargando = false;
  modoEdicion = false;
  tareaId: string | null = null;
  miembrosDisponibles: MiembroHogar[] = [];

  readonly prioridades = [
    { codigo: 'BAJA', label: 'Baja'    },
    { codigo: 'MEDIA', label: 'Media'   },
    { codigo: 'ALTA', label: 'Alta'     },
    { codigo: 'URGENTE', label: 'Urgente' },
  ];

  readonly periodicidades = [
    { codigo: null,      label: 'Sin repetición' },
    { codigo: 'DIARIA',  label: 'Diaria'          },
    { codigo: 'SEMANAL', label: 'Semanal'         },
    { codigo: 'MENSUAL', label: 'Mensual'         },
    { codigo: 'ANUAL',   label: 'Anual'           },
  ];

  constructor(
    private fb: FormBuilder,
    private hogarService: HogarService,
    private miembroService: MiembroService,
    private tareaService: TareaService,
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarMiembros();
    this.tareaId = this.route.snapshot.paramMap.get('id');
    if (this.tareaId) {
      this.modoEdicion = true;
      this.cargarTarea(this.tareaId);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      titulo:        ['', [Validators.required, Validators.maxLength(200)]],
      descripcion:   [''],
      prioridadCodigo: ['BAJA'],
      categoria:     [''],
      fechaLimite:   [''],
      esPeriodica:   [false],
      periodicidadCodigo: [null],
      miembroIds:    [[]],
      esPersonal:    [false],
    });
  }

  private cargarMiembros(): void {
    const idHogar = this.hogarService.idHogarActual;
    if (!idHogar) {
      this.miembrosDisponibles = [];
      return;
    }

    this.miembroService.listarPorHogar(idHogar).subscribe({
      next: (miembros) => {
        this.miembrosDisponibles = miembros;
      },
      error: () => {
        this.miembrosDisponibles = [];
      },
    });
  }

  private cargarTarea(id: string): void {
    this.cargando = true;
    this.tareaService.obtener(id).subscribe({
      next: (tarea: Tarea) => {
        this.form.patchValue({
          titulo:            tarea.titulo,
          descripcion:       tarea.descripcion,
          prioridadCodigo:   tarea.prioridad?.codigo ?? 'BAJA',
          categoria:         tarea.categoria,
          fechaLimite:       tarea.fechaLimite,
          esPeriodica:       tarea.esPeriodica,
          periodicidadCodigo: tarea.periodicidad?.codigo ?? null,
          miembroIds:        tarea.asignaciones?.map((asignacion) => asignacion.miembroId) ?? [],
          esPersonal:        tarea.esPersonal,
        }, { emitEvent: false });
        this.cargando = false;
      },
      error: () => { this.cargando = false; this.volver(); },
    });
  }

  onMiembrosChange(idsMiembros: string[] | null | undefined): void {
    const seleccion = idsMiembros ?? [];
    this.form.patchValue({ miembroIds: seleccion }, { emitEvent: false });

    if (seleccion.length > 0 && this.form.value.esPersonal) {
      this.form.patchValue({ esPersonal: false }, { emitEvent: false });
    }
  }

  onEsPersonalChange(esPersonal: boolean): void {
    this.form.patchValue({ esPersonal }, { emitEvent: false });

    if (esPersonal) {
      this.form.patchValue({ miembroIds: [] }, { emitEvent: false });
    }
  }

  nombresMiembrosSeleccionados(): string {
    const seleccionados = (this.form.value.miembroIds ?? []) as string[];
    if (!seleccionados.length) {
      return '';
    }

    return this.miembrosDisponibles
      .filter((miembro) => seleccionados.includes(miembro.id))
      .map((miembro) => miembro.nombre)
      .join(', ');
  }

  async guardar(): Promise<void> {
    if (this.form.invalid) { return; }

    const hogarCodigo = this.hogarService.hogarActual?.codigo ?? '';
    if (!hogarCodigo) {
      const toast = await this.toastCtrl.create({
        message: 'Selecciona un hogar antes de guardar la tarea',
        duration: 2500,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    this.cargando = true;
    const miembroIds = ((this.form.value.miembroIds ?? []) as string[]).filter(Boolean);
    const request: TareaRequest = {
      hogarCodigo:       hogarCodigo,
      titulo:            this.form.value.titulo,
      descripcion:       this.form.value.descripcion,
      prioridadCodigo:   this.form.value.prioridadCodigo,
      categoria:         this.form.value.categoria,
      fechaLimite:       this.form.value.fechaLimite || undefined,
      esPeriodica:       this.form.value.esPeriodica,
      periodicidadCodigo: this.form.value.periodicidadCodigo || undefined,
      esPersonal:        miembroIds.length > 0 ? false : this.form.value.esPersonal,
      miembroIds:        miembroIds.length > 0 ? miembroIds : undefined,
    };

    const op$ = this.modoEdicion && this.tareaId
      ? this.tareaService.actualizar(this.tareaId, request)
      : this.tareaService.crear(request);

    op$.subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: this.modoEdicion ? 'Tarea actualizada' : 'Tarea creada',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.volver();
      },
      error: () => { this.cargando = false; },
    });
  }

  volver(): void {
    this.router.navigate(['/tareas']);
  }
}
