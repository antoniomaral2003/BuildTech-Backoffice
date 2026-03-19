import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaquinariaService } from '../../services/maquinaria.service';
import { TiposMaquinariaService } from '../../../categorias/services/tipos-maquinaria.service';
import { UbicacionesService } from '../../../ubicaciones/services/ubicaciones.service';
import { HasUnsavedChanges } from '../../../../core/guards/unsaved-changes.guard';
import { PageHeaderComponent, Breadcrumb } from '../../../../shared/components/layout/page-header/page-header.component';
import { FormFieldComponent } from '../../../../shared/components/forms/form-field/form-field.component';
import { FormActionsComponent } from '../../../../shared/components/forms/form-actions/form-actions.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { TipoMaquinaria } from '../../../../core/models/tipo-maquinaria.model';
import { Ubicacion } from '../../../../core/models/ubicacion.model';
import { CommonModule } from '@angular/common';
import { noWhitespaceValidator } from '../../../../shared/validators/no-whitespace.validator';

@Component({
  selector: 'app-maquinaria-form-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PageHeaderComponent,
    FormFieldComponent,
    FormActionsComponent,
    CardComponent,
    SpinnerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <app-page-header [title]="isEdit ? 'Editar Maquinaria' : 'Nueva Maquinaria'" [breadcrumbs]="breadcrumbs"></app-page-header>

      @if (loading()) {
        <app-spinner></app-spinner>
      } @else {
        <div class="max-w-2xl">
          <app-card>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <app-form-field label="Código Interno" fieldId="codigoInterno" [required]="true" [error]="getError('codigoInterno')">
                  <input id="codigoInterno" formControlName="codigoInterno" type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="EJ-001" />
                </app-form-field>

                <app-form-field label="Tipo de Maquinaria" fieldId="tipoId" [required]="true" [error]="getError('tipoId')">
                  <select id="tipoId" formControlName="tipoId"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500">
                    <option value="">Seleccionar tipo...</option>
                    @for (tipo of tipos(); track tipo.id) {
                      <option [value]="tipo.id">{{ tipo.nombre }} ({{ tipo.categoriaNombre }})</option>
                    }
                  </select>
                </app-form-field>

                <app-form-field label="Marca" fieldId="marca" [required]="true" [error]="getError('marca')">
                  <input id="marca" formControlName="marca" type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Caterpillar" />
                </app-form-field>

                <app-form-field label="Modelo" fieldId="modelo" [required]="true" [error]="getError('modelo')">
                  <input id="modelo" formControlName="modelo" type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="320D" />
                </app-form-field>

                <app-form-field label="Año Fabricación" fieldId="anioFabricacion" [required]="true" [error]="getError('anioFabricacion')">
                  <input id="anioFabricacion" formControlName="anioFabricacion" type="number"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                    [min]="1980" [max]="currentYear" />
                </app-form-field>

                <app-form-field label="Número de Serie" fieldId="numeroSerie" [required]="true" [error]="getError('numeroSerie')">
                  <input id="numeroSerie" formControlName="numeroSerie" type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" />
                </app-form-field>

                @if (isEdit) {
                  <app-form-field label="Estado" fieldId="estado" [required]="true">
                    <select id="estado" formControlName="estado"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500">
                      <option value="Disponible">Disponible</option>
                      <option value="Asignada">Asignada</option>
                      <option value="En Mantenimiento">En Mantenimiento</option>
                      <option value="Fuera de Servicio">Fuera de Servicio</option>
                      <option value="En Tránsito">En Tránsito</option>
                    </select>
                  </app-form-field>
                }

                <app-form-field label="Ubicación" fieldId="ubicacionId">
                  <select id="ubicacionId" formControlName="ubicacionId"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500">
                    <option value="">Sin ubicación asignada</option>
                    @for (ub of ubicaciones(); track ub.id) {
                      <option [value]="ub.id">{{ ub.nombre }}</option>
                    }
                  </select>
                </app-form-field>
              </div>

              <div class="mt-4">
                <app-form-field label="Observaciones" fieldId="observaciones">
                  <textarea id="observaciones" formControlName="observaciones" rows="3"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"></textarea>
                </app-form-field>
              </div>

              <div class="mt-6">
                <app-form-actions
                  [saveLabel]="isEdit ? 'Actualizar' : 'Crear'"
                  [loading]="saving()"
                  [disabled]="form.invalid"
                  (cancelled)="onCancel()"
                  (saved)="onSubmit()"
                ></app-form-actions>
              </div>
            </form>
          </app-card>
        </div>
      }
    </div>
  `
})
export class MaquinariaFormPageComponent implements OnInit, HasUnsavedChanges {
  loading = signal(true);
  saving = signal(false);
  tipos = signal<TipoMaquinaria[]>([]);
  ubicaciones = signal<Ubicacion[]>([]);
  isEdit = false;
  editId = 0;
  currentYear = new Date().getFullYear();
  form!: FormGroup;

  breadcrumbs: Breadcrumb[] = [
    { label: 'Maquinaria', route: '/maquinaria' },
    { label: '' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private maquinariaService: MaquinariaService,
    private tiposService: TiposMaquinariaService,
    private ubicacionesService: UbicacionesService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.editId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.editId && !isNaN(this.editId);
    this.breadcrumbs[1].label = this.isEdit ? 'Editar' : 'Nuevo';

    this.form = this.fb.group({
      codigoInterno: ['', [Validators.required, noWhitespaceValidator]],
      tipoId: ['', Validators.required],
      marca: ['', [Validators.required, noWhitespaceValidator]],
      modelo: ['', [Validators.required, noWhitespaceValidator]],
      anioFabricacion: [new Date().getFullYear(), [Validators.required, Validators.min(1980), Validators.max(this.currentYear)]],
      numeroSerie: ['', [Validators.required, noWhitespaceValidator]],
      estado: ['Disponible'],
      ubicacionId: [''],
      observaciones: ['']
    });

    // Load selects
    this.tiposService.getAll().subscribe(data => this.tipos.set(data));
    this.ubicacionesService.getAll().subscribe(data => this.ubicaciones.set(data));

    if (this.isEdit) {
      this.maquinariaService.getById(this.editId).subscribe({
        next: item => {
          this.form.patchValue({
            ...item,
            tipoId: item.tipoId,
            ubicacionId: item.ubicacionId ?? ''
          });
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.loading.set(false);
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form.dirty && !this.saving();
  }

  getError(field: string): string | null {
    const control = this.form.get(field);
    if (!control || !control.invalid || !control.touched) return null;
    if (control.errors?.['required'] || control.errors?.['noWhitespace']) return 'Este campo es obligatorio';
    if (control.errors?.['min']) return `El valor mínimo es ${control.errors['min'].min}`;
    if (control.errors?.['max']) return `El valor máximo es ${control.errors['max'].max}`;
    return 'Campo inválido';
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const value = this.form.value;
    const dto = {
      ...value,
      tipoId: Number(value.tipoId),
      anioFabricacion: Number(value.anioFabricacion),
      ubicacionId: value.ubicacionId ? Number(value.ubicacionId) : undefined
    };

    const obs = this.isEdit
      ? this.maquinariaService.update(this.editId, dto)
      : this.maquinariaService.create(dto);

    obs.subscribe({
      next: () => {
        this.notificationService.success(this.isEdit ? 'Maquinaria actualizada' : 'Maquinaria creada');
        this.form.markAsPristine();
        this.router.navigate(['/maquinaria']);
      },
      error: () => this.saving.set(false)
    });
  }

  onCancel(): void {
    this.router.navigate(['/maquinaria']);
  }
}
