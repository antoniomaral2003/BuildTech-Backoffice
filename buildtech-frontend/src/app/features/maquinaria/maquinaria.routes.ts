import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

export const maquinariaRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/maquinaria-list-page/maquinaria-list-page.component').then(m => m.MaquinariaListPageComponent) },
  { path: 'nuevo', loadComponent: () => import('./pages/maquinaria-form-page/maquinaria-form-page.component').then(m => m.MaquinariaFormPageComponent), canDeactivate: [unsavedChangesGuard] },
  { path: ':id', loadComponent: () => import('./pages/maquinaria-detail-page/maquinaria-detail-page.component').then(m => m.MaquinariaDetailPageComponent) },
  { path: ':id/editar', loadComponent: () => import('./pages/maquinaria-form-page/maquinaria-form-page.component').then(m => m.MaquinariaFormPageComponent), canDeactivate: [unsavedChangesGuard] },
];
