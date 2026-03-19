import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Breadcrumb {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-6">
      @if (breadcrumbs.length > 0) {
        <nav class="flex mb-2" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-1 text-sm text-gray-500">
            @for (crumb of breadcrumbs; track crumb.label; let last = $last) {
              <li class="flex items-center">
                @if (!last && crumb.route) {
                  <a [routerLink]="crumb.route" class="hover:text-gray-700 transition-colors">{{ crumb.label }}</a>
                  <svg class="mx-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                  </svg>
                } @else {
                  <span [class.text-gray-900]="last" [class.font-medium]="last">{{ crumb.label }}</span>
                }
              </li>
            }
          </ol>
        </nav>
      }
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
          @if (subtitle) {
            <p class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
          }
        </div>
        <div class="flex items-center space-x-3">
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() breadcrumbs: Breadcrumb[] = [];
}
