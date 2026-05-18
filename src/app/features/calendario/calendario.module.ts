import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CalendarioPage } from './calendario.page';

const routes: Routes = [
  { path: '', component: CalendarioPage },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [CalendarioPage],
})
export class CalendarioModule {}
