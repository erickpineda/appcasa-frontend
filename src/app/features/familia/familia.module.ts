import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FamiliaPage } from './familia.page';

const routes: Routes = [
  { path: '', component: FamiliaPage },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [FamiliaPage],
})
export class FamiliaModule {}
