import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UbicacionesService } from '../../services/ubicaciones.service';
import { Ubicacion } from '../../../../core/models/ubicacion.model';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { FormFieldComponent } from '../../../../shared/components/forms/form-field/form-field.component';
import { FormActionsComponent } from '../../../../shared/components/forms/form-actions/form-actions.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/layout/empty-state/empty-state.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { noWhitespaceValidator } from '../../../../shared/validators/no-whitespace.validator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ubicaciones-page',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule,
    PageHeaderComponent, ButtonComponent, ModalComponent,
    FormFieldComponent, FormActionsComponent, SpinnerComponent, EmptyStateComponent, BadgeComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <app-page-header title="Ubicaciones" subtitle="Gestión de ubicaciones de maquinaria">
        <div actions>
          <app-button variant="primary" (clicked)="openModal()">+ Nueva Ubicación</app-button>
        </div>
      </app-page-header>

      @if (loading()) {
        <app-spinner></app-spinner>
      } @else if (ubicaciones().length === 0) {
        <app-empty-state title="No hay ubicaciones" description="Crea la primera ubicación." icon="📍">
          <app-button variant="primary" (clicked)="openModal()">Nueva Ubicación</app-button>
        </app-empty-state>
      } @else {
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (ub of ubicaciones(); track ub.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ ub.nombre }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <app-badge [text]="ub.tipo" [variant]="tipoVariant(ub.tipo)"></app-badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ ub.direccion || '—' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ ub.ciudad || '—' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div class="flex items-center justify-end gap-2">
                      <button (click)="editUbicacion(ub)" class="text-gray-600 hover:text-gray-800 font-medium">Editar</button>
                      <button (click)="deleteUbicacion(ub)" class="text-red-600 hover:text-red-800 font-medium">Eliminar</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <app-modal [title]="editing() ? 'Editar Ubicación' : 'Nueva Ubicación'" [isOpen]="showModal()" (closed)="closeModal()">
      <form [formGroup]="form" (ngSubmit)="save()">
        <div class="space-y-4">
          <app-form-field label="Nombre" fieldId="ub-nombre" [required]="true" [error]="getError('nombre')">
            <input id="ub-nombre" formControlName="nombre" type="text"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
          </app-form-field>
          <app-form-field label="Tipo" fieldId="ub-tipo" [required]="true">
            <select id="ub-tipo" formControlName="tipo"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500">
              <option value="Obra">Obra</option>
              <option value="Almacén">Almacén</option>
              <option value="Taller">Taller</option>
              <option value="Otro">Otro</option>
            </select>
          </app-form-field>
          <app-form-field label="Dirección" fieldId="ub-direccion">
            <input id="ub-direccion" formControlName="direccion" type="text"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
          </app-form-field>
          <app-form-field label="Ciudad" fieldId="ub-ciudad">
            <input id="ub-ciudad" formControlName="ciudad" type="text"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
          </app-form-field>
          <app-form-field label="Código Postal" fieldId="ub-codigoPostal">
            <input id="ub-codigoPostal" formControlName="codigoPostal" type="text"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
          </app-form-field>
        </div>
      </form>
      <div modal-footer>
        <app-form-actions [saveLabel]="editing() ? 'Actualizar' : 'Crear'" [loading]="saving()" [disabled]="form.invalid" (cancelled)="closeModal()" (saved)="save()"></app-form-actions>
      </div>
    </app-modal>
  `
})
export class UbicacionesPageComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  ubicaciones = signal<Ubicacion[]>([]);
  showModal = signal(false);
  editing = signal<Ubicacion | null>(null);
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ubicacionesService: UbicacionesService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, noWhitespaceValidator]],
      tipo: ['Obra', Validators.required],
      direccion: [''],
      ciudad: [''],
      codigoPostal: ['']
    });
    this.ubicacionesService.getAll().subscribe({
      next: data => { this.ubicaciones.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  tipoVariant(tipo: string): 'green' | 'blue' | 'yellow' | 'gray' {
    const map: Record<string, 'green' | 'blue' | 'yellow' | 'gray'> = {
      'Obra': 'green', 'Almacén': 'blue', 'Taller': 'yellow', 'Otro': 'gray'
    };
    return map[tipo] ?? 'gray';
  }

  openModal(): void { this.editing.set(null); this.form.reset({ tipo: 'Obra' }); this.showModal.set(true); }
  closeModal(): void { this.showModal.set(false); }

  editUbicacion(ub: Ubicacion): void {
    this.editing.set(ub);
    this.form.patchValue(ub);
    this.showModal.set(true);
  }

  getError(field: string): string | null {
    const c = this.form.get(field);
    if (!c || !c.invalid || !c.touched) return null;
    return 'Este campo es obligatorio';
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const dto = { ...this.form.value };
    const ed = this.editing();
    const obs = ed ? this.ubicacionesService.update(ed.id, dto) : this.ubicacionesService.create(dto);
    obs.subscribe({
      next: () => {
        this.notificationService.success(ed ? 'Ubicación actualizada' : 'Ubicación creada');
        this.closeModal();
        this.saving.set(false);
        this.ubicacionesService.getAll().subscribe(data => this.ubicaciones.set(data));
      },
      error: () => this.saving.set(false)
    });
  }

  deleteUbicacion(ub: Ubicacion): void {
    if (!confirm(`¿Eliminar la ubicación "${ub.nombre}"?`)) return;
    this.ubicacionesService.delete(ub.id).subscribe({
      next: () => {
        this.notificationService.success('Ubicación eliminada');
        this.ubicaciones.update(prev => prev.filter(u => u.id !== ub.id));
      }
    });
  }
}
