// tabs/tabs.routes.ts

import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('../inicio/inicio.page').then(m => m.InicioPage)
      },
      {
        path: 'pets',
        loadComponent: () => import('../pets/pets.page').then(m => m.PetsPage)
      },
      {
        path: 'consultas',
        loadComponent: () => import('../consultas/consultas.page').then(m => m.ConsultasPage)
      },
      {
        path: 'agendar',
        loadComponent: () => import('../agendar-consulta/agendar-consulta.page').then(m => m.AgendarConsultaPage)
      },
      {
        path: '',
        redirectTo: '/tabs/inicio',
        pathMatch: 'full',
      },
    ],
  },
  {
    // Redirecionamento geral: se o usuário logado tentar ir para a raiz, mande para as abas
    path: '',
    redirectTo: '/tabs/inicio',
    pathMatch: 'full',
  },
];
