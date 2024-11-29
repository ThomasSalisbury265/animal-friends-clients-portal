import { Routes } from '@angular/router';
import { clientsResolver } from './features/clients/clients.resolver';

export const routes: Routes = [
  { path: '', redirectTo: 'clients', pathMatch: 'full'},
  { path: 'clients', loadChildren: () => import('./features/clients/clients.routes')
    .then((feat) => feat.CLIENTS_ROUTES), resolve: { clientsData: clientsResolver }}
];
