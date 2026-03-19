import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

export const operadoresRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/operadores-list-page/operadores-list-page.component').then(m => m.OperadoresListPageComponent) },
  { path: 'nuevo', loadComponent: () => import('./pages/operador-form-page/operador-form-page.component').then(m => m.OperadorFormPageComponent), canDeactivate: [unsavedChangesGuard] },
  { path: ':id/editar', loadComponent: () => import('./pages/operador-form-page/operador-form-page.component').then(m => m.OperadorFormPageComponent), canDeactivate: [unsavedChangesGuard] },
];
