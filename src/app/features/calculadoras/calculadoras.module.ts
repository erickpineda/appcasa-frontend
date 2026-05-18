import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CalculadorasPage } from './calculadoras.page';

const routes: Routes = [
  { path: '', component: CalculadorasPage },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [CalculadorasPage],
})
export class CalculadorasModule {}
