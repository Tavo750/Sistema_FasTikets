import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CodigosPromocionalesService } from '../../../services/codigos-promocionales.service';

@Component({
  selector: 'app-registro-codigos-promo',
  standalone: false,
  templateUrl: './registro-codigos-promo.component.html',
  styleUrls: ['./registro-codigos-promo.component.css'],
  providers: [MessageService]
})
export class RegistroCodigosPromoComponent implements OnInit {
  tipos = [
    { label: 'Porcentaje', value: 'PORCENTAJE' },
    { label: 'Monto Fijo', value: 'MONTO_FIJO' }
  ];

  form!: FormGroup;
  loading = false;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: MessageService,
    private codigosPromocionalesService: CodigosPromocionalesService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      fechaFin: [null, Validators.required],
      tipo: [null, Validators.required],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      cantidadPorCliente: [1, [Validators.required, Validators.min(1)]]
    });
  }

  private mostrarError(mensaje: string): void {
    this.toast.add({
      severity: 'error',
      summary: 'Error',
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

    this.loading = true;
    
    const formValue = this.form.value;
    const payload = {
      codigo: formValue.codigo,
      descripcion: formValue.descripcion || '',
      fechaFin: formValue.fechaFin instanceof Date ? formValue.fechaFin.toISOString() : formValue.fechaFin,
      tipo: formValue.tipo,
      valor: Number(formValue.valor),
      stock: Number(formValue.stock),
      cantidadPorCliente: Number(formValue.cantidadPorCliente)
    };

    console.log('Payload a enviar:', payload);    
    this.codigosPromocionalesService.postCrearCodigoPromocional(payload)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.toast.add({
              severity: 'success',
              summary: 'Éxito',
              detail: response.mensaje
            });
            
            // Agregar un pequeño retraso antes de la navegación
            setTimeout(() => {
              this.router.navigate(['/administrador/codigosPromocionales'])
                .then(() => {
                  console.log('Navegación exitosa');
                })
                .catch(err => {
                  console.error('Error en la navegación:', err);
                  this.mostrarError('Error al redireccionar. Por favor, vuelva al listado manualmente.');
                });
            }, 500);
          } else {
            this.mostrarError('No se pudo crear el código promocional');
          }
        },
        error: (error) => {
          console.error('Error al crear código promocional:', error);
          this.mostrarError(error.error?.mensaje || 'No se pudo crear el código promocional');
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}