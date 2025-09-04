import { Routes } from '@angular/router';
// import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'tabs', // tabs
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  // {
  //   path: 'inicio',
  //   loadComponent: () => import('./inicio/inicio.page').then((m) => m.InicioPage),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'consultas',
  //   loadComponent: () => import('./consultas/consultas.page').then( m => m.ConsultasPage),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'agendar-consulta',
  //   loadComponent: () => import('./agendar-consulta/agendar-consulta.page').then( m => m.AgendarConsultaPage),
  //   canActivate: [AuthGuard]
  // },
];
