import { Component, Input } from '@angular/core';

const CONFIG: Record<string, { label: string; color: string }> = {
  BAJA: { label: 'Baja', color: 'success' },
  MEDIA: { label: 'Media', color: 'warning' },
  ALTA: { label: 'Alta', color: 'danger' },
  URGENTE: { label: 'Urgente', color: 'danger' },
};

@Component({
  selector: 'app-badge-prioridad',
  standalone: false,
  template: `
    <ion-badge [color]="cfg.color">{{ cfg.label }}</ion-badge>
  `,
})
export class BadgePrioridadComponent {
  @Input() prioridadCodigo: string = 'BAJA';

  get cfg() {
    return CONFIG[this.prioridadCodigo] ?? CONFIG['BAJA'];
  }
}
