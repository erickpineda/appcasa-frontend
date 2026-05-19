import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { HogarService } from '../../../core/services/hogar.service';
import { MiembroService } from '../../../core/services/miembro.service';
import { TareaService, TareaRequest } from '../../../core/services/tarea.service';
import { Hogar, MiembroHogar, Tarea } from '../../../core/models/domain.models';

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
  hogares: Hogar[] = [];
  hogarActual: Hogar | null = null;
  hogarActivo = false;

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

  readonly categorias = [
    { value: 'Limpieza', label: 'Limpieza' },
    { value: 'Compras', label: 'Compras' },
    { value: 'Cocina', label: 'Cocina' },
    { value: 'Mascotas', label: 'Mascotas' },
    { value: 'Niños', label: 'Niños' },
    { value: 'Mantenimiento', label: 'Mantenimiento' },
    { value: 'Otros', label: 'Otros' },
  ];

  constructor(
    private fb: FormBuilder,
    private hogarService: HogarService,
    private miembroService: MiembroService,
    private tareaService: TareaService,
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.tareaId = this.route.snapshot.paramMap.get('id');
    if (this.tareaId) {
      this.modoEdicion = true;
      this.cargarTarea(this.tareaId);
    }
  }

  ionViewDidEnter(): void {
    this.cargarContexto();
  }

  private initForm(): void {
    this.form = this.fb.group({
      titulo:        ['', [Validators.required, Validators.maxLength(200)]],
      descripcion:   [''],
      prioridadCodigo: ['BAJA'],
      categoria:     [''],
      fechaLimite:   [null],
      esPeriodica:   [false],
      periodicidadCodigo: [null],
      miembroIds:    [[]],
      esPersonal:    [false],
    });
  }

  private cargarMiembros(): void {
    const idHogar = this.hogarActual?.id ?? '';
    if (!idHogar) {
      this.miembrosDisponibles = [];
      this.cdr.detectChanges();
      return;
    }

    this.miembroService.listarPorHogar(idHogar).subscribe({
      next: (miembros) => {
        this.miembrosDisponibles = miembros;
        this.cdr.detectChanges();
      },
      error: () => {
        this.miembrosDisponibles = [];
        this.cdr.detectChanges();
      },
    });
  }

  cargarContexto(): void {
    this.hogarService.listarMisHogares().subscribe({
      next: (hogares) => {
        this.runInAngular(() => {
          this.hogares = hogares;
          this.hogarActual = this.hogarService.hogarActual;
          this.hogarActivo = !!this.hogarActual?.codigo;
          this.cargarMiembros();
          this.cdr.detectChanges();
        });
      },
      error: async () => {
        this.runInAngular(() => {
          this.hogares = [];
          this.hogarActual = null;
          this.hogarActivo = false;
          this.miembrosDisponibles = [];
          this.cdr.detectChanges();
        });
        await this.presentarToast('No se pudieron cargar tus hogares', 'warning');
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
          categoria:         this.normalizarCategoria(tarea.categoria),
          fechaLimite:       tarea.fechaLimite ?? null,
          esPeriodica:       tarea.esPeriodica,
          periodicidadCodigo: tarea.periodicidad?.codigo ?? null,
          miembroIds:        tarea.asignaciones?.map((asignacion) => asignacion.miembroId) ?? [],
          esPersonal:        tarea.esPersonal,
        }, { emitEvent: false });
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => { this.cargando = false; this.cdr.detectChanges(); this.volver(); },
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

  seleccionarHogar(idHogar: string | null | undefined): void {
    const hogar = this.hogares.find((item) => item.id === idHogar);
    if (!hogar) {
      return;
    }

    this.hogarService.seleccionar(hogar);
    this.runInAngular(() => {
      this.hogarActual = hogar;
      this.hogarActivo = true;
      this.cargarMiembros();
      this.cdr.detectChanges();
    });
  }

  async guardar(): Promise<void> {
    if (this.form.invalid || !this.hogarActivo) {
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges();
    const miembroIds = ((this.form.value.miembroIds ?? []) as string[]).filter(Boolean);
    const request: TareaRequest = {
      hogarCodigo:       this.hogarActual!.codigo,
      titulo:            this.form.value.titulo,
      descripcion:       this.form.value.descripcion,
      prioridadCodigo:   this.form.value.prioridadCodigo,
      categoria:         this.form.value.categoria || undefined,
      fechaLimite:       this.normalizarFechaLimiteParaApi(this.form.value.fechaLimite),
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
        this.runInAngular(() => {
          this.cargando = false;
          this.cdr.detectChanges();
        });
        const toast = await this.toastCtrl.create({
          message: this.modoEdicion ? 'Tarea actualizada' : 'Tarea creada',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.volver();
      },
      error: async (err) => {
        setTimeout(() => {
          this.runInAngular(() => {
            this.cargando = false;
            this.cdr.detectChanges();
          });
        }, 0);
        await this.presentarToast(err?.error?.detail ?? 'No se pudo guardar la tarea', 'danger');
      },
    });
  }

  volver(): void {
    this.router.navigate(['/tareas']);
  }

  async crearHogar(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Crear hogar',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre del hogar' },
        { name: 'descripcion', type: 'textarea', placeholder: 'Descripción opcional' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: (data) => {
            const nombre = (data.nombre ?? '').trim();
            if (!nombre) {
              this.presentarToast('Indica un nombre para el hogar', 'warning');
              return false;
            }

            this.hogarService.crear(nombre, (data.descripcion ?? '').trim() || undefined).subscribe({
              next: async () => {
                this.runInAngular(() => {
                  this.hogares = this.hogarService.hogaresDisponibles;
                  this.hogarActual = this.hogarService.hogarActual;
                  this.hogarActivo = !!this.hogarActual?.codigo;
                  this.cargarMiembros();
                  this.cdr.detectChanges();
                });
                await this.presentarToast('Hogar creado y activado', 'success');
              },
              error: async () => {
                await this.presentarToast('No se pudo crear el hogar', 'danger');
              },
            });
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  async unirseConCodigo(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Unirme con código',
      inputs: [
        { name: 'codigo', type: 'text', placeholder: 'Código del hogar' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Unirme',
          handler: (data) => {
            const codigo = (data.codigo ?? '').trim().toUpperCase();
            if (!codigo) {
              this.presentarToast('Indica un código válido', 'warning');
              return false;
            }

            this.hogarService.unirse(codigo).subscribe({
              next: async () => {
                this.runInAngular(() => {
                  this.hogares = this.hogarService.hogaresDisponibles;
                  this.hogarActual = this.hogarService.hogarActual;
                  this.hogarActivo = !!this.hogarActual?.codigo;
                  this.cargarMiembros();
                  this.cdr.detectChanges();
                });
                await this.presentarToast('Te has unido al hogar', 'success');
              },
              error: async () => {
                await this.presentarToast('No se pudo unir al hogar', 'danger');
              },
            });
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  private normalizarCategoria(categoria: string | null | undefined): string {
    if (!categoria) {
      return '';
    }

    return this.categorias.some((item) => item.value === categoria) ? categoria : 'Otros';
  }

  private normalizarFechaLimiteParaApi(valor: string | null | undefined): string | undefined {
    if (!valor) {
      return undefined;
    }

    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime()) ? undefined : fecha.toISOString();
  }

  private async presentarToast(message: string, color: 'success' | 'warning' | 'danger'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
    });
    await toast.present();
  }

  private runInAngular(work: () => void): void {
    this.ngZone.run(work);
  }
}
