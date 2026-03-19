import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-form-actions',
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
      <app-button variant="secondary" (clicked)="cancelled.emit()">{{ cancelLabel }}</app-button>
      <app-button variant="primary" type="submit" [loading]="loading" [disabled]="disabled" (clicked)="saved.emit()">
        {{ saveLabel }}
      </app-button>
    </div>
  `
})
export class FormActionsComponent {
  @Input() saveLabel = 'Guardar';
  @Input() cancelLabel = 'Cancelar';
  @Input() loading = false;
  @Input() disabled = false;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
