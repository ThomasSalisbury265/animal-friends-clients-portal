import { Routes } from "@angular/router";

export const CLIENTS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('../clients/dashboard/dashboard.component')
    .then(c => c.DashboardComponent)},
  { path: ':id', loadComponent: () => import('../clients/details/details.component')
    .then(c => c.DetailsComponent)}
]
