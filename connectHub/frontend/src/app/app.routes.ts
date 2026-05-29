import { Routes } from '@angular/router';
import { ContactDashboardComponent } from './contacts/contact-dashboard/contact-dashboard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'contatos/todos',
    pathMatch: 'full',
  },
  {
    path: 'contatos/:filtro',
    component: ContactDashboardComponent,
  },
];
