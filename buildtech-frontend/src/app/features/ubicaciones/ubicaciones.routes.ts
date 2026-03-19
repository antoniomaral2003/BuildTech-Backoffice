import { Routes } from '@angular/router';

export const ubicacionesRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/ubicaciones-page/ubicaciones-page.component').then(m => m.UbicacionesPageComponent) },
];
