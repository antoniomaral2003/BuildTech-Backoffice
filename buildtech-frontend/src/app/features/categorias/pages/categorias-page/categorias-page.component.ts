import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoriasService } from '../../services/categorias.service';
import { TiposMaquinariaService } from '../../services/tipos-maquinaria.service';
import { Categoria } from '../../../../core/models/categoria.model';
import { TipoMaquinaria } from '../../../../core/models/tipo-maquinaria.model';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { FormFieldComponent } from '../../../../shared/components/forms/form-field/form-field.component';
import { FormActionsComponent } from '../../../../shared/components/forms/form-actions/form-actions.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/layout/empty-state/empty-state.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { noWhitespaceValidator } from '../../../../shared/validators/no-whitespace.validator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias-page',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule,
    PageHeaderComponent, ButtonComponent, ModalComponent,
    FormFieldComponent, FormActionsComponent, SpinnerComponent, EmptyStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <app-page-header title="Categorías y Tipos" subtitle="Gestión de categorías y tipos de maquinaria">
        <div actions>
          <app-button variant="secondary" (clicked)="openTipoModal()">+ Nuevo Tipo</app-button>
          <app-button variant="primary" (clicked)="openCategoriaModal()">+ Nueva Categoría</app-button>
        </div>
      </app-page-header>

      @if (loading()) {
        <app-spinner></app-spinner>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Categorías -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Categorías</h3>
            </div>
            @if (categorias().length === 0) {
              <app-empty-state title="Sin categorías" description="Crea la primera categoría." icon="🗂️"></app-empty-state>
            } @else {
              <ul class="divide-y divide-gray-200">
                @for (cat of categorias(); track cat.id) {
                  <li class="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ cat.nombre }}</p>
                      @if (cat.descripcion) { <p class="text-xs text-gray-500">{{ cat.descripcion }}</p> }
                    </div>
                    <div class="flex items-center gap-2">
                      <button (click)="editCategoria(cat)" class="text-sm text-gray-600 hover:text-gray-800 font-medium">Editar</button>
                      <button (click)="deleteCategoria(cat)" class="text-sm text-red-600 hover:text-red-800 font-medium">Eliminar</button>
                    </div>
                  </li>
                }
              </ul>
            }
          </div>

          <!-- Tipos de Maquinaria -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Tipos de Maquinaria</h3>
            </div>
            @if (tipos().length === 0) {
              <app-empty-state title="Sin tipos" description="Crea el primer tipo de maquinaria." icon="⚙️"></app-empty-state>
            } @else {
              <ul class="divide-y divide-gray-200">
                @for (tipo of tipos(); track tipo.id) {
                  <li class="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ tipo.nombre }}</p>
                      <p class="text-xs text-gray-500">{{ tipo.categoriaNombre }}</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <button (click)="editTipo(tipo)" class="text-sm text-gray-600 hover:text-gray-800 font-medium">Editar</button>
                      <button (click)="deleteTipo(tipo)" class="text-sm text-red-600 hover:text-red-800 font-medium">Eliminar</button>
                    </div>
                  </li>
                }
              </ul>
            }
          </div>
        </div>
      }
    </div>

    <!-- Modal Categoría -->
    <app-modal [title]="editingCategoria() ? 'Editar Categoría' : 'Nueva Categoría'" [isOpen]="showCategoriaModal()" (closed)="closeCategoriaModal()">
      <form [formGroup]="categoriaForm" (ngSubmit)="saveCategoria()">
        <div class="space-y-4">
          <app-form-field label="Nombre" fieldId="cat-nombre" [required]="true" [error]="getCatError('nombre')">
            <input id="cat-nombre" formControlName="nombre" type="text"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
          </app-form-field>
          <app-form-field label="Descripción" fieldId="cat-descripcion">
            <textarea id="cat-descripcion" formControlName="descripcion" rows="2"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"></textarea>
          </app-form-field>
        </div>
      </form>
      <div modal-footer>
        <app-form-actions [saveLabel]="editingCategoria() ? 'Actualizar' : 'Crear'" [loading]="saving()" [disabled]="categoriaForm.invalid" (cancelled)="closeCategoriaModal()" (saved)="saveCategoria()"></app-form-actions>
      </div>
    </app-modal>

    <!-- Modal Tipo -->
    <app-modal [title]="editingTipo() ? 'Editar Tipo' : 'Nuevo Tipo de Maquinaria'" [isOpen]="showTipoModal()" (closed)="closeTipoModal()">
      <form [formGroup]="tipoForm" (ngSubmit)="saveTipo()">
        <div class="space-y-4">
          <app-form-field label="Nombre" fieldId="tipo-nombre" [required]="true" [error]="getTipoError('nombre')">
            <input id="tipo-nombre" formControlName="nombre" type="text"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
          </app-form-field>
          <app-form-field label="Categoría" fieldId="tipo-categoriaId" [required]="true" [error]="getTipoError('categoriaId')">
            <select id="tipo-categoriaId" formControlName="categoriaId"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500">
              <option value="">Seleccionar categoría...</option>
              @for (cat of categorias(); track cat.id) {
                <option [value]="cat.id">{{ cat.nombre }}</option>
              }
            </select>
          </app-form-field>
          <app-form-field label="Descripción" fieldId="tipo-descripcion">
            <textarea id="tipo-descripcion" formControlName="descripcion" rows="2"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"></textarea>
          </app-form-field>
        </div>
      </form>
      <div modal-footer>
        <app-form-actions [saveLabel]="editingTipo() ? 'Actualizar' : 'Crear'" [loading]="saving()" [disabled]="tipoForm.invalid" (cancelled)="closeTipoModal()" (saved)="saveTipo()"></app-form-actions>
      </div>
    </app-modal>
  `
})
export class CategoriasPageComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  categorias = signal<Categoria[]>([]);
  tipos = signal<TipoMaquinaria[]>([]);
  showCategoriaModal = signal(false);
  showTipoModal = signal(false);
  editingCategoria = signal<Categoria | null>(null);
  editingTipo = signal<TipoMaquinaria | null>(null);

  categoriaForm!: FormGroup;
  tipoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoriasService: CategoriasService,
    private tiposService: TiposMaquinariaService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.categoriaForm = this.fb.group({ nombre: ['', [Validators.required, noWhitespaceValidator]], descripcion: [''] });
    this.tipoForm = this.fb.group({ nombre: ['', [Validators.required, noWhitespaceValidator]], categoriaId: ['', Validators.required], descripcion: [''] });
    this.loadData();
  }

  loadData(): void {
    this.categoriasService.getAll().subscribe(data => { this.categorias.set(data); this.loading.set(false); });
    this.tiposService.getAll().subscribe(data => this.tipos.set(data));
  }

  openCategoriaModal(): void { this.editingCategoria.set(null); this.categoriaForm.reset(); this.showCategoriaModal.set(true); }
  closeCategoriaModal(): void { this.showCategoriaModal.set(false); }

  editCategoria(cat: Categoria): void {
    this.editingCategoria.set(cat);
    this.categoriaForm.patchValue(cat);
    this.showCategoriaModal.set(true);
  }

  openTipoModal(): void { this.editingTipo.set(null); this.tipoForm.reset(); this.showTipoModal.set(true); }
  closeTipoModal(): void { this.showTipoModal.set(false); }

  editTipo(tipo: TipoMaquinaria): void {
    this.editingTipo.set(tipo);
    this.tipoForm.patchValue({ ...tipo, categoriaId: tipo.categoriaId });
    this.showTipoModal.set(true);
  }

  getCatError(field: string): string | null {
    const c = this.categoriaForm.get(field);
    if (!c || !c.invalid || !c.touched) return null;
    return 'Este campo es obligatorio';
  }

  getTipoError(field: string): string | null {
    const c = this.tipoForm.get(field);
    if (!c || !c.invalid || !c.touched) return null;
    return 'Este campo es obligatorio';
  }

  saveCategoria(): void {
    if (this.categoriaForm.invalid) { this.categoriaForm.markAllAsTouched(); return; }
    this.saving.set(true);
    const dto = this.categoriaForm.value;
    const editing = this.editingCategoria();
    const obs = editing ? this.categoriasService.update(editing.id, dto) : this.categoriasService.create(dto);
    obs.subscribe({
      next: () => {
        this.notificationService.success(editing ? 'Categoría actualizada' : 'Categoría creada');
        this.closeCategoriaModal();
        this.saving.set(false);
        this.categoriasService.getAll().subscribe(data => this.categorias.set(data));
      },
      error: () => this.saving.set(false)
    });
  }

  saveTipo(): void {
    if (this.tipoForm.invalid) { this.tipoForm.markAllAsTouched(); return; }
    this.saving.set(true);
    const value = this.tipoForm.value;
    const dto = { ...value, categoriaId: Number(value.categoriaId) };
    const editing = this.editingTipo();
    const obs = editing ? this.tiposService.update(editing.id, dto) : this.tiposService.create(dto);
    obs.subscribe({
      next: () => {
        this.notificationService.success(editing ? 'Tipo actualizado' : 'Tipo creado');
        this.closeTipoModal();
        this.saving.set(false);
        this.tiposService.getAll().subscribe(data => this.tipos.set(data));
      },
      error: () => this.saving.set(false)
    });
  }

  deleteCategoria(cat: Categoria): void {
    if (!confirm(`¿Eliminar la categoría "${cat.nombre}"?`)) return;
    this.categoriasService.delete(cat.id).subscribe({
      next: () => {
        this.notificationService.success('Categoría eliminada');
        this.categorias.update(prev => prev.filter(c => c.id !== cat.id));
      }
    });
  }

  deleteTipo(tipo: TipoMaquinaria): void {
    if (!confirm(`¿Eliminar el tipo "${tipo.nombre}"?`)) return;
    this.tiposService.delete(tipo.id).subscribe({
      next: () => {
        this.notificationService.success('Tipo eliminado');
        this.tipos.update(prev => prev.filter(t => t.id !== tipo.id));
      }
    });
  }
}
