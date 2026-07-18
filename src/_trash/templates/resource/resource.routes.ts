import { Routes } from '@angular/router';

export const RESOURCE_ROUTES: Routes = [
  { path: 'resources', loadComponent: () => import('./pages/list/resource-list.component').then(m => m.ResourceListComponent), data: { title: 'Resources' } },
  { path: 'resources/:id', loadComponent: () => import('./pages/detail/resource-detail.component').then(m => m.ResourceDetailComponent), data: { title: 'Resource detail' } },
];
