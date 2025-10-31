import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CodigosPromocionalesService } from '../../../services/codigos-promocionales.service';
import { Data as CodigoPromocional } from '../../../interfaces/codigos-promocionales/codigos-promocionales.interface';

@Component({
  selector: 'app-editar-registro-promo',
  standalone: false,
  templateUrl: './editar-registro-promo.component.html',
  styleUrls: ['./editar-registro-promo.component.css'],
  providers: [MessageService]
})
export class EditarRegistroPromoComponent implements OnInit {
  tipos = [
    { label: 'Porcentaje', value: 'PORCENTAJE' },
    { label: 'Monto Fijo', value: 'MONTO_FIJO' }
  ];

  form!: FormGroup;
  loading = false;

  private codigoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toast: MessageService,
    private codigosPromocionalesService: CodigosPromocionalesService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      codigo: ['', Validators.required],
      descripcion: [''],
      fechaFin: [null, Validators.required],
      tipo: [null, Validators.required],
      valor: [null, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      cantidadPorCliente: [1, [Validators.required, Validators.min(1)]]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.mostrarError('ID no válido');
      this.router.navigate(['/administrador/codigosPromocionales']);
      return;
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      this.mostrarError('ID no válido');
      this.router.navigate(['/administrador/codigosPromocionales']);
      return;
    }

    this.codigoId = id;
    this.cargarDatosPromocional(id);
  }

  cargarDatos(data: CodigoPromocional): void {
    this.form.patchValue({
      codigo: data.codigo,
      descripcion: data.descripcion,
      fechaFin: new Date(data.fechaFin),
      tipo: data.tipo,
      valor: data.valor,
      stock: data.stock,
      cantidadPorCliente: data.cantidadPorCliente
    });
  }

  private cargarDatosPromocional(id: number): void {
    this.loading = true;
    this.codigosPromocionalesService.getListarCodigosPromocionalesPorId(id)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.cargarDatos(response.data);
          } else {
            this.mostrarError('No se pudo cargar el código promocional');
          }
        },
        error: (error) => {
          console.error('Error al cargar código promocional:', error);
          this.mostrarError('Error al cargar el código promocional');
          this.router.navigate(['/administrador/codigosPromocionales']);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  private mostrarError(mensaje: string): void {
    this.toast.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje
    });
  }

  private mostrarExito(mensaje: string): void {
    this.toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: mensaje
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor complete todos los campos requeridos'
      });
      return;
    }

    if (!this.codigoId) {
      this.mostrarError('ID no válido');
      return;
    }

    this.loading = true;
    
    const payload = {
      codigo: this.form.value.codigo,
      descripcion: this.form.value.descripcion || '',
      fechaFin: this.form.value.fechaFin,
      tipo: this.form.value.tipo,
      valor: this.form.value.valor,
      stock: this.form.value.stock,
      cantidadPorCliente: this.form.value.cantidadPorCliente
    };

    this.codigosPromocionalesService.putListarCodigosPromocionalesPorId(this.codigoId, payload)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.mostrarExito(response.mensaje);
            this.router.navigate(['/administrador/codigosPromocionales']);
          } else {
            this.mostrarError('No se pudo actualizar el código promocional');
          }
        },
        error: (error) => {
          console.error('Error al actualizar código promocional:', error);
          this.mostrarError(error.error?.mensaje || 'No se pudo actualizar el código promocional');
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}