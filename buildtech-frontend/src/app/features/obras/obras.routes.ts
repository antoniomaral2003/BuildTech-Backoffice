import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

export const obrasRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/obras-list-page/obras-list-page.component').then(m => m.ObrasListPageComponent) },
  { path: 'nueva', loadComponent: () => import('./pages/obra-form-page/obra-form-page.component').then(m => m.ObraFormPageComponent), canDeactivate: [unsavedChangesGuard] },
  { path: ':id', loadComponent: () => import('./pages/obra-detail-page/obra-detail-page.component').then(m => m.ObraDetailPageComponent) },
  { path: ':id/editar', loadComponent: () => import('./pages/obra-form-page/obra-form-page.component').then(m => m.ObraFormPageComponent), canDeactivate: [unsavedChangesGuard] },
];
