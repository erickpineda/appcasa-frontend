// ─── tareas.module.ts ────────────────────────────────────────
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TareasPage } from './tareas.page';
import { TareaFormPage } from './tarea-form/tarea-form.page';

const routes: Routes = [
  { path: '',     component: TareasPage    },
  { path: 'new',  component: TareaFormPage },
  { path: ':id',  component: TareaFormPage },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [TareasPage, TareaFormPage],
})
export class TareasModule {}
