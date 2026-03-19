import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AsignacionesService } from '../../services/asignaciones.service';
import { MaquinariaService } from '../../../maquinaria/services/maquinaria.service';
import { ObrasService } from '../../../obras/services/obras.service';
import { OperadoresService } from '../../../operadores/services/operadores.service';
import { PageHeaderComponent, Breadcrumb } from '../../../../shared/components/layout/page-header/page-header.component';
import { FormFieldComponent } from '../../../../shared/components/forms/form-field/form-field.component';
import { FormActionsComponent } from '../../../../shared/components/forms/form-actions/form-actions.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { Maquinaria } from '../../../../core/models/maquinaria.model';
import { Obra } from '../../../../core/models/obra.model';
import { Operador } from '../../../../core/models/operador.model';
import { CommonModule } from '@angular/common';
import { dateRangeValidator } from '../../../../shared/validators/date-range.validator';

@Component({
  selector: 'app-asignacion-wizard-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PageHeaderComponent, FormFieldComponent, FormActionsComponent, CardComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <app-page-header title="Nueva Asignación" [breadcrumbs]="breadcrumbs"></app-page-header>
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
                    @for (m of maquinariasDisponibles(); track m.id) {
                      <option [value]="m.id">{{ m.codigoInterno }} - {{ m.marca }} {{ m.modelo }}</option>
                    }
                  </select>
                </app-form-field>

                <app-form-field label="Obra" fieldId="obraId" [required]="true" [error]="getError('obraId')">
                  <select id="obraId" formControlName="obraId"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500">
                    <option value="">Seleccionar obra...</option>
                    @for (o of obras(); track o.id) {
                      <option [value]="o.id">{{ o.nombre }}</option>
                    }
                  </select>
                </app-form-field>

                <app-form-field label="Operador" fieldId="operadorId">
                  <select id="operadorId" formControlName="operadorId"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500">
                    <option value="">Sin operador asignado</option>
                    @for (op of operadores(); track op.id) {
                      <option [value]="op.id">{{ op.nombre }} {{ op.apellidos }}</option>
                    }
                  </select>
                </app-form-field>

                <app-form-field label="Fecha Inicio" fieldId="fechaInicio" [required]="true" [error]="getError('fechaInicio')">
                  <input id="fechaInicio" formControlName="fechaInicio" type="date"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
                </app-form-field>

                <app-form-field label="Fecha Fin Estimada" fieldId="fechaFinEstimada" [required]="true" [error]="getError('fechaFinEstimada') || form.errors?.['dateRange']?.message">
                  <input id="fechaFinEstimada" formControlName="fechaFinEstimada" type="date"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
                </app-form-field>

                <div class="sm:col-span-2">
                  <app-form-field label="Condiciones de Entrega" fieldId="condicionesEntrega">
                    <textarea id="condicionesEntrega" formControlName="condicionesEntrega" rows="2"
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
                <app-form-actions saveLabel="Crear Asignación" [loading]="saving()" [disabled]="form.invalid" (cancelled)="onCancel()" (saved)="onSubmit()"></app-form-actions>
              </div>
            </form>
          </app-card>
        </div>
      }
    </div>
  `
})
export class AsignacionWizardPageComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  maquinariasDisponibles = signal<Maquinaria[]>([]);
  obras = signal<Obra[]>([]);
  operadores = signal<Operador[]>([]);
  form!: FormGroup;
  breadcrumbs: Breadcrumb[] = [{ label: 'Asignaciones', route: '/asignaciones' }, { label: 'Nueva' }];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private asignacionesService: AsignacionesService,
    private maquinariaService: MaquinariaService,
    private obrasService: ObrasService,
    private operadoresService: OperadoresService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      maquinariaId: ['', Validators.required],
      obraId: ['', Validators.required],
      operadorId: [''],
      fechaInicio: ['', Validators.required],
      fechaFinEstimada: ['', Validators.required],
      condicionesEntrega: [''],
      observaciones: ['']
    }, { validators: dateRangeValidator('fechaInicio', 'fechaFinEstimada') });

    forkJoin({
      maquinarias: this.maquinariaService.getAll(),
      obras: this.obrasService.getAll(),
      operadores: this.operadoresService.getAll()
    }).subscribe({
      next: ({ maquinarias, obras, operadores }) => {
        this.maquinariasDisponibles.set(maquinarias.filter(m => m.estado === 'Disponible'));
        this.obras.set(obras.filter(o => o.estado === 'Activa'));
        this.operadores.set(operadores.filter(op => op.estado === 'Activo'));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getError(field: string): string | null {
    const control = this.form.get(field);
    if (!control || !control.invalid || !control.touched) return null;
    if (control.errors?.['required']) return 'Este campo es obligatorio';
    return null;
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const value = this.form.value;
    const dto = {
      ...value,
      maquinariaId: Number(value.maquinariaId),
      obraId: Number(value.obraId),
      operadorId: value.operadorId ? Number(value.operadorId) : undefined
    };
    this.asignacionesService.create(dto).subscribe({
      next: () => {
        this.notificationService.success('Asignación creada correctamente');
        this.router.navigate(['/asignaciones']);
      },
      error: () => this.saving.set(false)
    });
  }

  onCancel(): void { this.router.navigate(['/asignaciones']); }
}
