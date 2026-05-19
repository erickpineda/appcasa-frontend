import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Tarea } from '../../core/models/domain.models';
import { HogarService } from '../../core/services/hogar.service';
import { TareaService } from '../../core/services/tarea.service';

@Component({
  selector: 'app-tareas',
  standalone: false,
  templateUrl: './tareas.page.html',
})
export class TareasPage implements OnInit {

  tareas: Tarea[] = [];
  cargando = true;
  segmento: 'pendientes' | 'completadas' = 'pendientes';

  constructor(
    private tareaService: TareaService,
    private hogarService: HogarService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    const hogarCodigo = this.hogarService.hogarActual?.codigo ?? '';

    if (!hogarCodigo) {
      this.tareas = [];
      this.cargando = false;
      return;
    }

    this.tareaService.listarPendientes(hogarCodigo).subscribe({
      next: (tareas) => { this.tareas = tareas; this.cargando = false; },
      error: ()       => { this.cargando = false; },
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
}
