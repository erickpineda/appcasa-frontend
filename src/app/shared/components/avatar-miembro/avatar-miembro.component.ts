import { Component, Input } from '@angular/core';
import { MiembroHogar, TipoMiembro } from '../../../core/models/domain.models';

const ICONOS: Record<TipoMiembro, string> = {
  PERSONA:  'person',
  PERRO:    'paw',
  GATO:     'paw',
  TORTUGA:  'leaf',
  AVE:      'egg',
  OTRO:     'help-circle',
};

@Component({
  selector: 'app-avatar-miembro',
  standalone: false,
  template: `
    <div class="avatar-wrapper" [style.background]="color">
      @if (miembro.avatarUrl) {
        <ion-avatar>
          <img [src]="miembro.avatarUrl" [alt]="miembro.nombre" />
        </ion-avatar>
      } @else {
        <div class="avatar-icon">
          <ion-icon [name]="icono"></ion-icon>
        </div>
      }
    </div>
    @if (mostrarNombre) {
      <span class="nombre">{{ miembro.nombre }}</span>
    }
    `,
  styles: [`
    :host { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .avatar-wrapper {
      width: 40px; height: 40px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: var(--ion-color-light);
    }
    .avatar-icon { font-size: 1.4rem; color: var(--ion-color-primary); }
    .nombre { font-size: 0.7rem; color: var(--ion-color-medium); }
  `],
})
export class AvatarMiembroComponent {
  @Input() miembro!: MiembroHogar;
  @Input() mostrarNombre = false;
  @Input() color = '';

  get icono(): string {
    return ICONOS[this.miembro.tipoMiembro ?? 'PERSONA'];
  }
}
