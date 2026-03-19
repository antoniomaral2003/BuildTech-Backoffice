import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ObrasService } from '../../services/obras.service';
import { HasUnsavedChanges } from '../../../../core/guards/unsaved-changes.guard';
import { PageHeaderComponent, Breadcrumb } from '../../../../shared/components/layout/page-header/page-header.component';
import { FormFieldComponent } from '../../../../shared/components/forms/form-field/form-field.component';
import { FormActionsComponent } from '../../../../shared/components/forms/form-actions/form-actions.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { noWhitespaceValidator } from '../../../../shared/validators/no-whitespace.validator';
import { dateRangeValidator } from '../../../../shared/validators/date-range.validator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-obra-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PageHeaderComponent, FormFieldComponent, FormActionsComponent, CardComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <app-page-header [title]="isEdit ? 'Editar Obra' : 'Nueva Obra'" [breadcrumbs]="breadcrumbs"></app-page-header>
      @if (loading()) {
        <app-spinner></app-spinner>
      } @else {
        <div class="max-w-2xl">
          <app-card>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <app-form-field label="Nombre de la Obra" fieldId="nombre" [required]="true" [error]="getError('nombre')">
                    <input id="nombre" formControlName="nombre" type="text"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" />
                  </app-form-field>
                </div>
                <app-form-field label="Código" fieldId="codigo">
                  <input id="codigo" formControlName="codigo" type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" />
                </app-form-field>
                <app-form-field label="Ciudad" fieldId="ciudad">
                  <input id="ciudad" formControlName="ciudad" type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" />
                </app-form-field>
                <div class="sm:col-span-2">
                  <app-form-field label="Dirección" fieldId="direccion" [required]="true" [error]="getError('direccion')">
                    <input id="direccion" formControlName="direccion" type="text"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" />
                  </app-form-field>
                </div>
                <app-form-field label="Responsable" fieldId="responsableNombre">
                  <input id="responsableNombre" formControlName="responsableNombre" type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" />
                </app-form-field>
                <app-form-field label="Teléfono" fieldId="responsableTelefono">
                  <input id="responsableTelefono" formControlName="responsableTelefono" type="tel"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" />
                </app-form-field>
                <app-form-field label="Email Responsable" fieldId="responsableEmail" [error]="getError('responsableEmail')">
                  <input id="responsableEmail" formControlName="responsableEmail" type="email"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" />
                </app-form-field>
                <app-form-field label="Fecha Inicio" fieldId="fechaInicio">
                  <input id="fechaInicio" formControlName="fechaInicio" type="date"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" />
                </app-form-field>
                <app-form-field label="Fecha Fin Estimada" fieldId="fechaFinEstimada" [error]="form.errors?.['dateRange']?.message">
                  <input id="fechaFinEstimada" formControlName="fechaFinEstimada" type="date"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" />
                </app-form-field>
                @if (isEdit) {
                  <app-form-field label="Estado" fieldId="estado">
                    <select id="estado" formControlName="estado"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500">
                      <option value="Activa">Activa</option>
                      <option value="En Pausa">En Pausa</option>
                      <option value="Finalizada">Finalizada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </app-form-field>
                }
              </div>
              <div class="mt-6">
                <app-form-actions [saveLabel]="isEdit ? 'Actualizar' : 'Crear'" [loading]="saving()" [disabled]="form.invalid" (cancelled)="onCancel()" (saved)="onSubmit()"></app-form-actions>
              </div>
            </form>
          </app-card>
        </div>
      }
    </div>
  `
})
export class ObraFormPageComponent implements OnInit, HasUnsavedChanges {
  loading = signal(true);
  saving = signal(false);
  isEdit = false;
  editId = 0;
  form!: FormGroup;
  breadcrumbs: Breadcrumb[] = [{ label: 'Obras', route: '/obras' }, { label: '' }];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private obrasService: ObrasService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.editId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.editId && !isNaN(this.editId);
    this.breadcrumbs[1].label = this.isEdit ? 'Editar' : 'Nueva';

    this.form = this.fb.group({
      nombre: ['', [Validators.required, noWhitespaceValidator]],
      codigo: [''],
      direccion: ['', [Validators.required, noWhitespaceValidator]],
      ciudad: [''],
      responsableNombre: [''],
      responsableTelefono: [''],
      responsableEmail: ['', Validators.email],
      fechaInicio: [''],
      fechaFinEstimada: [''],
      estado: ['Activa']
    }, { validators: dateRangeValidator('fechaInicio', 'fechaFinEstimada') });

    if (this.isEdit) {
      this.obrasService.getById(this.editId).subscribe({
        next: item => {
          this.form.patchValue({
            ...item,
            fechaInicio: item.fechaInicio ? new Date(item.fechaInicio).toISOString().split('T')[0] : '',
            fechaFinEstimada: item.fechaFinEstimada ? new Date(item.fechaFinEstimada).toISOString().split('T')[0] : ''
          });
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.loading.set(false);
    }
  }

  hasUnsavedChanges(): boolean { return this.form.dirty && !this.saving(); }

  getError(field: string): string | null {
    const control = this.form.get(field);
    if (!control || !control.invalid || !control.touched) return null;
    if (control.errors?.['required'] || control.errors?.['noWhitespace']) return 'Este campo es obligatorio';
    if (control.errors?.['email']) return 'Email inválido';
    return 'Campo inválido';
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const value = this.form.value;
    const dto = { ...value, fechaInicio: value.fechaInicio || undefined, fechaFinEstimada: value.fechaFinEstimada || undefined };

    const obs = this.isEdit ? this.obrasService.update(this.editId, dto) : this.obrasService.create(dto);
    obs.subscribe({
      next: () => {
        this.notificationService.success(this.isEdit ? 'Obra actualizada' : 'Obra creada');
        this.form.markAsPristine();
        this.router.navigate(['/obras']);
      },
      error: () => this.saving.set(false)
    });
  }

  onCancel(): void { this.router.navigate(['/obras']); }
}
