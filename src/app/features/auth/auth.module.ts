import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthPage } from './auth.page';

const routes: Routes = [
  { path: '', component: AuthPage },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [AuthPage],
})
export class AuthModule {}
