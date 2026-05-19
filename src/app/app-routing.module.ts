import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'tareas',
        loadChildren: () =>
          import('./features/tareas/tareas.module').then(
            (m) => m.TareasModule
          ),
      },
      {
        path: 'recordatorios',
        loadChildren: () =>
          import('./features/recordatorios/recordatorios.module').then(
            (m) => m.RecordatoriosModule
          ),
      },
      {
        path: 'calendario',
        loadChildren: () =>
          import('./features/calendario/calendario.module').then(
            (m) => m.CalendarioModule
          ),
      },
      {
        path: 'mascotas',
        loadChildren: () =>
          import('./features/mascotas/mascotas.module').then(
            (m) => m.MascotasModule
          ),
      },
      {
        path: 'familia',
        loadChildren: () =>
          import('./features/familia/familia.module').then(
            (m) => m.FamiliaModule
          ),
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('./features/perfil/perfil.module').then(
            (m) => m.PerfilModule
          ),
      },
      {
        path: 'listas',
        loadChildren: () =>
          import('./features/listas/listas.module').then(
            (m) => m.ListasModule
          ),
      },
      {
        path: 'calculadoras',
        loadChildren: () =>
          import('./features/calculadoras/calculadoras.module').then(
            (m) => m.CalculadorasModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
