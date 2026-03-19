import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes) },
  { path: 'maquinaria', loadChildren: () => import('./features/maquinaria/maquinaria.routes').then(m => m.maquinariaRoutes) },
  { path: 'obras', loadChildren: () => import('./features/obras/obras.routes').then(m => m.obrasRoutes) },
  { path: 'asignaciones', loadChildren: () => import('./features/asignaciones/asignaciones.routes').then(m => m.asignacionesRoutes) },
  { path: 'mantenimientos', loadChildren: () => import('./features/mantenimientos/mantenimientos.routes').then(m => m.mantenimientosRoutes) },
  { path: 'operadores', loadChildren: () => import('./features/operadores/operadores.routes').then(m => m.operadoresRoutes) },
  { path: 'categorias', loadChildren: () => import('./features/categorias/categorias.routes').then(m => m.categoriasRoutes) },
  { path: 'ubicaciones', loadChildren: () => import('./features/ubicaciones/ubicaciones.routes').then(m => m.ubicacionesRoutes) },
  { path: '**', redirectTo: 'dashboard' },
];
