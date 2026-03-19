import { Routes } from '@angular/router';

export const categoriasRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/categorias-page/categorias-page.component').then(m => m.CategoriasPageComponent) },
];
