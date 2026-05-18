import { Component, Input } from '@angular/core';

const CONFIG: Record<number, { label: string; color: string }> = {
  1: { label: 'Baja',    color: 'success' },
  2: { label: 'Media',   color: 'warning' },
  3: { label: 'Alta',    color: 'danger'  },
  4: { label: 'Urgente', color: 'danger'  },
};

@Component({
  selector: 'app-badge-prioridad',
  standalone: false,
  template: `
    <ion-badge [color]="cfg.color">{{ cfg.label }}</ion-badge>
  `,
})
export class BadgePrioridadComponent {
  @Input() idPrioridad: number = 1;

  get cfg() {
    return CONFIG[this.idPrioridad] ?? CONFIG[1];
  }
}
