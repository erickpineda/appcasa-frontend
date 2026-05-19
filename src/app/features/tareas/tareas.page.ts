import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Hogar, Tarea } from '../../core/models/domain.models';
import { HogarService } from '../../core/services/hogar.service';
import { TareaService } from '../../core/services/tarea.service';

@Component({
  selector: 'app-tareas',
  standalone: false,
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss'],
})
export class TareasPage {

  tareas: Tarea[] = [];
  cargando = true;
  segmento: 'pendientes' | 'completadas' = 'pendientes';
  hogares: Hogar[] = [];
  hogarActual: Hogar | null = null;

  constructor(
    private tareaService: TareaService,
    private hogarService: HogarService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
  ) {}

  ionViewDidEnter(): void {
    this.cargarContexto();
  }

  cargar(): void {
    this.cargando = true;
    const hogarCodigo = this.hogarActual?.codigo ?? '';

    if (!hogarCodigo) {
      this.tareas = [];
      this.finalizarCarga();
      return;
    }

    this.tareaService.listarPendientes(hogarCodigo).subscribe({
      next: (tareas) => {
        this.runInAngular(() => {
          this.tareas = tareas;
          this.finalizarCarga();
        });
      },
      error: () => {
        this.runInAngular(() => {
          this.tareas = [];
          this.finalizarCarga();
        });
      },
    });
  }

  cargarContexto(): void {
    this.cargando = true;
    this.hogarService.listarMisHogares().subscribe({
      next: (hogares) => {
        this.runInAngular(() => {
          this.hogares = hogares;
          this.hogarActual = this.hogarService.hogarActual;
          if (!this.hogarActual) {
            this.tareas = [];
            this.finalizarCarga();
            return;
          }
          this.cargar();
        });
      },
      error: async () => {
        this.runInAngular(() => {
          this.hogares = [];
          this.hogarActual = null;
          this.tareas = [];
          this.finalizarCarga();
        });
        await this.presentarToast('No se pudieron cargar tus hogares', 'warning');
      },
    });
  }

  seleccionarHogar(idHogar: string | null | undefined): void {
    const hogar = this.hogares.find((item) => item.id === idHogar);
    if (!hogar) {
      return;
    }

    this.hogarService.seleccionar(hogar);
    this.runInAngular(() => {
      this.hogarActual = hogar;
      this.cargar();
    });
  }

  nueva(): void {
    this.router.navigate(['/tareas/new']);
  }

  abrir(tarea: Tarea): void {
    this.router.navigate(['/tareas', tarea.id]);
  }

  async completar(tarea: Tarea): Promise<void> {
    this.tareaService.completar(tarea.id).subscribe(async () => {
      const toast = await this.toastCtrl.create({
        message: `"${tarea.titulo}" completada ✅`,
        duration: 2000,
        color: 'success',
        position: 'bottom',
      });
      await toast.present();
      this.cargar();
    });
  }

  async confirmarEliminar(tarea: Tarea): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar tarea',
      message: `¿Eliminar "${tarea.titulo}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.tareaService.eliminar(tarea.id).subscribe(() => this.cargar());
          },
        },
      ],
    });
    await alert.present();
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
                  this.cargar();
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
                  this.cargar();
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

  private async presentarToast(message: string, color: 'success' | 'warning' | 'danger'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  private runInAngular(work: () => void): void {
    this.ngZone.run(work);
  }

  private finalizarCarga(): void {
    setTimeout(() => {
      this.runInAngular(() => {
        this.cargando = false;
      });
    }, 0);
  }
}
