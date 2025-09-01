import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'consultas',
    loadComponent: () => import('./consultas/consultas.page').then( m => m.ConsultasPage)
  },
  {
    path: 'agendar-consulta',
    loadComponent: () => import('./agendar-consulta/agendar-consulta.page').then( m => m.AgendarConsultaPage)
  },
];
