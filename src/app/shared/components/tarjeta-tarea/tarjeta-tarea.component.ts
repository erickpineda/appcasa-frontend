import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tarea } from '../../../core/models/domain.models';

@Component({
  selector: 'app-tarjeta-tarea',
  standalone: false,
  template: `
    <ion-item
      [detail]="true"
      button
      (click)="seleccionada.emit(tarea)"
      class="tarjeta-tarea"
      >
      <ion-checkbox
        slot="start"
        [checked]="!!tarea.fechaCompletada"
        (ionChange)="completar.emit(tarea)"
        (click)="$event.stopPropagation()"
      ></ion-checkbox>
    
      <ion-label>
        <h3 [class.completada]="!!tarea.fechaCompletada">
          {{ tarea.titulo }}
        </h3>
        @if (tarea.categoria) {
          <p>{{ tarea.categoria }}</p>
        }
        @if (tarea.fechaLimite) {
          <p class="fecha">
            <ion-icon name="calendar-outline"></ion-icon>
            {{ tarea.fechaLimite | date: 'dd/MM/yyyy' }}
          </p>
        }
        @if (nombresAsignados.length > 0) {
          <p class="asignados">
            <ion-icon name="people-outline"></ion-icon>
            {{ nombresAsignados.join(', ') }}
          </p>
        }
      </ion-label>
    
      <app-badge-prioridad
        slot="end"
        [prioridadCodigo]="tarea.prioridad.codigo"
      ></app-badge-prioridad>
    </ion-item>
    `,
  styles: [`
    .completada {
      text-decoration: line-through;
      color: var(--ion-color-medium);
    }
    .fecha {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .asignados {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `],
})
export class TarjetaTareaComponent {
  @Input() tarea!: Tarea;
  @Output() seleccionada = new EventEmitter<Tarea>();
  @Output() completar    = new EventEmitter<Tarea>();

  get nombresAsignados(): string[] {
    return (this.tarea?.asignaciones ?? [])
      .map((asignacion) => asignacion.nombreMiembro?.trim())
      .filter((nombre): nombre is string => !!nombre);
  }
}
