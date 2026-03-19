import { Routes } from '@angular/router';

export const asignacionesRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/asignaciones-list-page/asignaciones-list-page.component').then(m => m.AsignacionesListPageComponent) },
  { path: 'nueva', loadComponent: () => import('./pages/asignacion-wizard-page/asignacion-wizard-page.component').then(m => m.AsignacionWizardPageComponent) },
];
