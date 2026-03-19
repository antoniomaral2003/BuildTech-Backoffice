import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

export const mantenimientosRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/mantenimientos-list-page/mantenimientos-list-page.component').then(m => m.MantenimientosListPageComponent) },
  { path: 'nuevo', loadComponent: () => import('./pages/mantenimiento-form-page/mantenimiento-form-page.component').then(m => m.MantenimientoFormPageComponent), canDeactivate: [unsavedChangesGuard] },
  { path: ':id/editar', loadComponent: () => import('./pages/mantenimiento-form-page/mantenimiento-form-page.component').then(m => m.MantenimientoFormPageComponent), canDeactivate: [unsavedChangesGuard] },
];
