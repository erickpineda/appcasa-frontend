import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PerfilPage } from './perfil.page';

const routes: Routes = [
  { path: '', component: PerfilPage },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [PerfilPage],
})
export class PerfilModule {}
