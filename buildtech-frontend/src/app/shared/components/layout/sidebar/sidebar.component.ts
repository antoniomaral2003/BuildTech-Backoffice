import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-40">
      <!-- Logo -->
      <div class="flex items-center h-16 px-6 border-b border-gray-200 flex-shrink-0">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-bold text-gray-900">BuildTech</p>
            <p class="text-xs text-gray-500">Backoffice</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-sky-50 text-sky-700 font-medium"
            [routerLinkActiveOptions]="{exact: item.route === '/'}"
            class="flex items-center px-3 py-2.5 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors group"
            ariaCurrentWhenActive="page"
          >
            <span class="mr-3 text-lg" aria-hidden="true">{{ item.icon }}</span>
            {{ item.label }}
          </a>
        }
      </nav>

      <!-- Footer -->
      <div class="px-4 py-3 border-t border-gray-200 flex-shrink-0">
        <p class="text-xs text-gray-400 text-center">BuildTech Solutions © 2026</p>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Maquinaria', route: '/maquinaria', icon: '🏗️' },
    { label: 'Obras', route: '/obras', icon: '🔨' },
    { label: 'Asignaciones', route: '/asignaciones', icon: '📋' },
    { label: 'Mantenimientos', route: '/mantenimientos', icon: '🔧' },
    { label: 'Operadores', route: '/operadores', icon: '👷' },
    { label: 'Categorías', route: '/categorias', icon: '🗂️' },
    { label: 'Ubicaciones', route: '/ubicaciones', icon: '📍' },
  ];
}
