import { Component, OnInit } from '@angular/core';
import { DashboardResumen, Tarea } from '../../core/models/domain.models';
import { HogarService } from '../../core/services/hogar.service';
import { TareaService } from '../../core/services/tarea.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit {

  resumen: DashboardResumen | null = null;
  cargando = true;

  constructor(
    private tareaService: TareaService,
    private hogarService: HogarService
  ) {}

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen(): void {
    this.cargando = true;
    const idHogar = this.hogarService.idHogarActual;

    if (!idHogar) {
      this.resumen = this.crearResumenVacio();
      this.cargando = false;
      return;
    }

    this.tareaService.listarPendientes(idHogar).subscribe({
      next: (tareas) => {
        // TODO: llamar también a RecordatorioService, EventoService, etc.
        this.resumen = {
          tareasPendientes: tareas.length,
          tareasHoy: this.filtrarTareasHoy(tareas),
          proximosRecordatorios: [],
          cumpleanosProximos: [],
          miembros: [],
        };
        this.cargando = false;
      },
      error: () => {
        this.resumen = this.crearResumenVacio();
        this.cargando = false;
      },
    });
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
    return tareas.filter((t) => t.fechaLimite === hoy);
  }
}
