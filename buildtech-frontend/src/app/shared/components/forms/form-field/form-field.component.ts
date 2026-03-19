import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-1">
      @if (label) {
        <label [for]="fieldId" class="block text-sm font-medium text-gray-700">
          {{ label }}
          @if (required) { <span class="text-red-500 ml-0.5">*</span> }
        </label>
      }
      <ng-content></ng-content>
      @if (error) {
        <p class="text-sm text-red-600 flex items-center gap-1">
          <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          {{ error }}
        </p>
      }
      @if (hint && !error) {
        <p class="text-xs text-gray-500">{{ hint }}</p>
      }
    </div>
  `
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() fieldId = '';
  @Input() required = false;
  @Input() error: string | null | undefined = null;
  @Input() hint = '';
}
