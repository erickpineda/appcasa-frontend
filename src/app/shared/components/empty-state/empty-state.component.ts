import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: false,
  template: `
    <div class="empty-state">
      <ion-icon [name]="icono"></ion-icon>
      <h3>{{ titulo }}</h3>
      <p>{{ mensaje }}</p>
      @if (labelAccion) {
        <ion-button (click)="accion()">
          {{ labelAccion }}
        </ion-button>
      }
    </div>
    `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
      color: var(--ion-color-medium);

      ion-icon {
        font-size: 4rem;
        margin-bottom: 16px;
        opacity: 0.5;
      }
      h3 { font-size: 1.1rem; margin: 0 0 8px; }
      p  { font-size: 0.9rem; margin: 0 0 24px; }
    }
  `],
})
export class EmptyStateComponent {
  @Input() icono    = 'document-outline';
  @Input() titulo   = 'Sin datos';
  @Input() mensaje  = '';
  @Input() labelAccion = '';

  accion(): void {}
}
