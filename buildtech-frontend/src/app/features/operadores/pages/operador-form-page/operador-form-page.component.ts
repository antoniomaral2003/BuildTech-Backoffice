import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OperadoresService } from '../../services/operadores.service';
import { HasUnsavedChanges } from '../../../../core/guards/unsaved-changes.guard';
import { PageHeaderComponent, Breadcrumb } from '../../../../shared/components/layout/page-header/page-header.component';
import { FormFieldComponent } from '../../../../shared/components/forms/form-field/form-field.component';
import { FormActionsComponent } from '../../../../shared/components/forms/form-actions/form-actions.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { noWhitespaceValidator } from '../../../../shared/validators/no-whitespace.validator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-operador-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PageHeaderComponent, FormFieldComponent, FormActionsComponent, CardComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <app-page-header [title]="isEdit ? 'Editar Operador' : 'Nuevo Operador'" [breadcrumbs]="breadcrumbs"></app-page-header>
      @if (loading()) {
        <app-spinner></app-spinner>
      } @else {
        <div class="max-w-2xl">
          <app-card>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <app-form-field label="Nombre" fieldId="nombre" [required]="true" [error]="getError('nombre')">
                  <input id="nombre" formControlName="nombre" type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
                </app-form-field>
                <app-form-field label="Apellidos" fieldId="apellidos" [required]="true" [error]="getError('apellidos')">
                  <input id="apellidos" formControlName="apellidos" type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
                </app-form-field>
                <app-form-field label="DNI" fieldId="dni" [required]="true" [error]="getError('dni')">
                  <input id="dni" formControlName="dni" type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
                </app-form-field>
                <app-form-field label="Teléfono" fieldId="telefono">
                  <input id="telefono" formControlName="telefono" type="tel"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
                </app-form-field>
                <app-form-field label="Email" fieldId="email" [error]="getError('email')">
                  <input id="email" formControlName="email" type="email"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
                </app-form-field>
                <app-form-field label="Licencias" fieldId="licencias" hint="Ej: C1, C2, Gruista">
                  <input id="licencias" formControlName="licencias" type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
                </app-form-field>
                @if (isEdit) {
                  <app-form-field label="Estado" fieldId="estado">
                    <select id="estado" formControlName="estado"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500">
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
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
export class OperadorFormPageComponent implements OnInit, HasUnsavedChanges {
  loading = signal(true);
  saving = signal(false);
  isEdit = false;
  editId = 0;
  form!: FormGroup;
  breadcrumbs: Breadcrumb[] = [{ label: 'Operadores', route: '/operadores' }, { label: '' }];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private operadoresService: OperadoresService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.editId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.editId && !isNaN(this.editId);
    this.breadcrumbs[1].label = this.isEdit ? 'Editar' : 'Nuevo';

    this.form = this.fb.group({
      nombre: ['', [Validators.required, noWhitespaceValidator]],
      apellidos: ['', [Validators.required, noWhitespaceValidator]],
      dni: ['', [Validators.required, noWhitespaceValidator]],
      telefono: [''],
      email: ['', Validators.email],
      licencias: [''],
      estado: ['Activo']
    });

    if (this.isEdit) {
      this.operadoresService.getById(this.editId).subscribe({
        next: item => { this.form.patchValue(item); this.loading.set(false); },
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
    return null;
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const dto = { ...this.form.value };
    const obs = this.isEdit ? this.operadoresService.update(this.editId, dto) : this.operadoresService.create(dto);
    obs.subscribe({
      next: () => {
        this.notificationService.success(this.isEdit ? 'Operador actualizado' : 'Operador creado');
        this.form.markAsPristine();
        this.router.navigate(['/operadores']);
      },
      error: () => this.saving.set(false)
    });
  }

  onCancel(): void { this.router.navigate(['/operadores']); }
}
