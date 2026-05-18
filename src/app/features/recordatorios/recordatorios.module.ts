import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { RecordatoriosPage } from './recordatorios.page';

const routes: Routes = [
  { path: '', component: RecordatoriosPage },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [RecordatoriosPage],
})
export class RecordatoriosModule {}
