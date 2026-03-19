import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MantenimientosService } from '../../services/mantenimientos.service';
import { MaquinariaService } from '../../../maquinaria/services/maquinaria.service';
import { HasUnsavedChanges } from '../../../../core/guards/unsaved-changes.guard';
import { PageHeaderComponent, Breadcrumb } from '../../../../shared/components/layout/page-header/page-header.component';
import { FormFieldComponent } from '../../../../shared/components/forms/form-field/form-field.component';
import { FormActionsComponent } from '../../../../shared/components/forms/form-actions/form-actions.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { Maquinaria } from '../../../../core/models/maquinaria.model';
import { CommonModule } from '@angular/common';
import { noWhitespaceValidator } from '../../../../shared/validators/no-whitespace.validator';

@Component({
  selector: 'app-mantenimiento-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PageHeaderComponent, FormFieldComponent, FormActionsComponent, CardComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <app-page-header [title]="isEdit ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'" [breadcrumbs]="breadcrumbs"></app-page-header>
      @if (loading()) {
        <app-spinner></app-spinner>
      } @else {
        <div class="max-w-2xl">
          <app-card>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <app-form-field label="Maquinaria" fieldId="maquinariaId" [required]="true" [error]="getError('maquinariaId')">
                  <select id="maquinariaId" formControlName="maquinariaId"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500">
                    <option value="">Seleccionar maquinaria...</option>
                    @for (m of maquinarias(); track m.id) {
                      <option [value]="m.id">{{ m.codigoInterno }} - {{ m.marca }} {{ m.modelo }}</option>
                    }
                  </select>
                </app-form-field>

                <app-form-field label="Tipo" fieldId="tipo" [required]="true">
                  <select id="tipo" formControlName="tipo"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500">
                    <option value="Preventivo">Preventivo</option>
                    <option value="Correctivo">Correctivo</option>
                  </select>
                </app-form-field>

                <app-form-field label="Fecha Programada" fieldId="fechaProgramada">
                  <input id="fechaProgramada" formControlName="fechaProgramada" type="date"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
                </app-form-field>

                @if (isEdit) {
                  <app-form-field label="Fecha Inicio" fieldId="fechaInicio">
                    <input id="fechaInicio" formControlName="fechaInicio" type="date"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
                  </app-form-field>

                  <app-form-field label="Fecha Fin" fieldId="fechaFin">
                    <input id="fechaFin" formControlName="fechaFin" type="date"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
                  </app-form-field>

                  <app-form-field label="Estado" fieldId="estado">
                    <select id="estado" formControlName="estado"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500">
                      <option value="Programado">Programado</option>
                      <option value="En Proceso">En Proceso</option>
                      <option value="Completado">Completado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </app-form-field>

                  <app-form-field label="Costo (€)" fieldId="costo">
                    <input id="costo" formControlName="costo" type="number" min="0" step="0.01"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
                  </app-form-field>
                }

                <app-form-field label="Horas de Uso" fieldId="horasUsoMomento">
                  <input id="horasUsoMomento" formControlName="horasUsoMomento" type="number" min="0"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
                </app-form-field>

                <app-form-field label="Taller" fieldId="taller">
                  <input id="taller" formControlName="taller" type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
                </app-form-field>

                <div class="sm:col-span-2">
                  <app-form-field label="Descripción" fieldId="descripcion" [required]="true" [error]="getError('descripcion')">
                    <textarea id="descripcion" formControlName="descripcion" rows="3"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"></textarea>
                  </app-form-field>
                </div>

                <div class="sm:col-span-2">
                  <app-form-field label="Observaciones" fieldId="observaciones">
                    <textarea id="observaciones" formControlName="observaciones" rows="2"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"></textarea>
                  </app-form-field>
                </div>
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
export class MantenimientoFormPageComponent implements OnInit, HasUnsavedChanges {
  loading = signal(true);
  saving = signal(false);
  maquinarias = signal<Maquinaria[]>([]);
  isEdit = false;
  editId = 0;
  form!: FormGroup;
  breadcrumbs: Breadcrumb[] = [{ label: 'Mantenimientos', route: '/mantenimientos' }, { label: '' }];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private mantenimientosService: MantenimientosService,
    private maquinariaService: MaquinariaService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.editId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.editId && !isNaN(this.editId);
    this.breadcrumbs[1].label = this.isEdit ? 'Editar' : 'Nuevo';

    this.form = this.fb.group({
      maquinariaId: ['', Validators.required],
      tipo: ['Preventivo', Validators.required],
      fechaProgramada: [''],
      fechaInicio: [''],
      fechaFin: [''],
      descripcion: ['', [Validators.required, noWhitespaceValidator]],
      horasUsoMomento: [''],
      taller: [''],
      costo: [''],
      observaciones: [''],
      estado: ['Programado']
    });

    this.maquinariaService.getAll().subscribe(data => this.maquinarias.set(data));

    if (this.isEdit) {
      this.mantenimientosService.getById(this.editId).subscribe({
        next: item => {
          this.form.patchValue({
            ...item,
            maquinariaId: item.maquinariaId,
            fechaProgramada: item.fechaProgramada ? new Date(item.fechaProgramada).toISOString().split('T')[0] : '',
            fechaInicio: item.fechaInicio ? new Date(item.fechaInicio).toISOString().split('T')[0] : '',
            fechaFin: item.fechaFin ? new Date(item.fechaFin).toISOString().split('T')[0] : ''
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
    return null;
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const value = this.form.value;
    const dto = {
      ...value,
      maquinariaId: Number(value.maquinariaId),
      fechaProgramada: value.fechaProgramada || undefined,
      fechaInicio: value.fechaInicio || undefined,
      fechaFin: value.fechaFin || undefined,
      horasUsoMomento: value.horasUsoMomento ? Number(value.horasUsoMomento) : undefined,
      costo: value.costo ? Number(value.costo) : undefined
    };

    const obs = this.isEdit
      ? this.mantenimientosService.update(this.editId, dto)
      : this.mantenimientosService.create(dto);

    obs.subscribe({
      next: () => {
        this.notificationService.success(this.isEdit ? 'Mantenimiento actualizado' : 'Mantenimiento creado');
        this.form.markAsPristine();
        this.router.navigate(['/mantenimientos']);
      },
      error: () => this.saving.set(false)
    });
  }

  onCancel(): void { this.router.navigate(['/mantenimientos']); }
}
