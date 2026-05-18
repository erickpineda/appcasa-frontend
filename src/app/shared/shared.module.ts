import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Componentes compartidos
import { TarjetaTareaComponent } from './components/tarjeta-tarea/tarjeta-tarea.component';
import { AvatarMiembroComponent } from './components/avatar-miembro/avatar-miembro.component';
import { BadgePrioridadComponent } from './components/badge-prioridad/badge-prioridad.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';

const COMPONENTS = [
  TarjetaTareaComponent,
  AvatarMiembroComponent,
  BadgePrioridadComponent,
  EmptyStateComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: COMPONENTS,
  exports: [
    CommonModule,
    RouterModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ...COMPONENTS,
  ],
})
export class SharedModule {}
