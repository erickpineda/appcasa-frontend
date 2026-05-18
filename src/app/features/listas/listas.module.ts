import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ListasPage } from './listas.page';

const routes: Routes = [
  { path: '', component: ListasPage },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [ListasPage],
})
export class ListasModule {}
