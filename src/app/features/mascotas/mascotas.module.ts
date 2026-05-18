import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MascotasPage } from './mascotas.page';

const routes: Routes = [
  { path: '', component: MascotasPage },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [MascotasPage],
})
export class MascotasModule {}
