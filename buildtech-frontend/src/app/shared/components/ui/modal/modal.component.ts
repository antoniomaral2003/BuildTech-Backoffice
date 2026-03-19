import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" (click)="onBackdropClick()"></div>
          <div [class]="modalClasses" role="dialog" aria-modal="true">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
              <button
                type="button"
                class="text-gray-400 hover:text-gray-500 transition-colors"
                (click)="close()"
                aria-label="Cerrar"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="mb-6">
              <ng-content></ng-content>
            </div>
            <div class="flex justify-end space-x-3">
              <ng-content select="[modal-footer]"></ng-content>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  @Input() title = '';
  @Input() isOpen = false;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';
  @Input() closeOnBackdrop = true;
  @Output() closed = new EventEmitter<void>();

  get modalClasses(): string {
    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      '2xl': 'max-w-6xl'
    };
    return `relative bg-white rounded-lg shadow-xl w-full ${sizes[this.size]} p-6 z-10`;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.close();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) this.close();
  }

  close(): void {
    this.closed.emit();
  }
}
