import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { DashboardResumen, Hogar, Tarea } from '../../core/models/domain.models';
import { HogarService } from '../../core/services/hogar.service';
import { TareaService } from '../../core/services/tarea.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.page.html',
})
export class DashboardPage {

  resumen: DashboardResumen | null = null;
  cargando = true;
  hogares: Hogar[] = [];
  hogarActual: Hogar | null = null;

  constructor(
    private tareaService: TareaService,
    private hogarService: HogarService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ionViewDidEnter(): void {
    this.cargarContexto();
  }

  cargarResumen(): void {
    this.cargando = true;
    const hogarCodigo = this.hogarActual?.codigo ?? '';

    if (!hogarCodigo) {
      this.resumen = this.crearResumenVacio();
      this.cargando = false;
      return;
    }

    this.tareaService.listarPendientes(hogarCodigo).subscribe({
      next: (tareas) => {
        this.runInAngular(() => {
          this.resumen = {
            tareasPendientes: tareas.length,
            tareasHoy: this.filtrarTareasHoy(tareas),
            proximosRecordatorios: [],
            cumpleanosProximos: [],
            miembros: [],
          };
          this.cargando = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.runInAngular(() => {
          this.resumen = this.crearResumenVacio();
          this.cargando = false;
          this.cdr.detectChanges();
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
            this.resumen = this.crearResumenVacio();
            this.cargando = false;
            this.cdr.detectChanges();
            return;
          }
          this.cargarResumen();
        });
      },
      error: async () => {
        this.runInAngular(() => {
          this.hogares = [];
          this.hogarActual = null;
          this.resumen = this.crearResumenVacio();
          this.cargando = false;
          this.cdr.detectChanges();
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
      this.cargarResumen();
      this.cdr.detectChanges();
    });
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
                  this.cargarResumen();
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
                  this.cargarResumen();
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

  private crearResumenVacio(): DashboardResumen {
    return {
      tareasPendientes: 0,
      tareasHoy: [],
      proximosRecordatorios: [],
      cumpleanosProximos: [],
      miembros: [],
    };
  }

  private filtrarTareasHoy(tareas: Tarea[]): Tarea[] {
    const hoy = new Date().toISOString().split('T')[0];
    return tareas.filter((t) => (t.fechaLimite ?? '').startsWith(hoy));
  }

  private runInAngular(work: () => void): void {
    this.ngZone.run(work);
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
}
