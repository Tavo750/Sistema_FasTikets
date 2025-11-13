import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-registrar-error',
  standalone: false,
  templateUrl: './registrar-error.component.html',
  styleUrls: ['./registrar-error.component.css'],
  providers: [MessageService]
})
export class RegistrarErrorComponent implements OnInit {

  errorForm!: FormGroup;
  loading = false;

  severidades = [
    { label: 'Seleccione', value: null },
    { label: 'CRITICO', value: 'CRITICO' },
    { label: 'ALTO', value: 'ALTO' },
    { label: 'MEDIO', value: 'MEDIO' },
    { label: 'BAJO', value: 'BAJO' }
  ];

  modulos = [
    { label: 'Seleccione', value: null },
    { label: 'AUTENTICACIÓN', value: 'AUTENTICACION' },
    { label: 'EVENTOS/LOCAL', value: 'EVENTOS_LOCAL' },
    { label: 'PASARELA DE PAGO', value: 'PASARELA_PAGO' },
    { label: 'TICKETS/TRANSFERENCIA', value: 'TICKETS_TRANSFERENCIA' },
    { label: 'REPORTES', value: 'REPORTES' },
    { label: 'API EXTERNA', value: 'API_EXTERNA' }
  ];

  trazas = [
    { label: 'Seleccione', value: null },
    { label: 'ID COMPRA', value: 'ID_COMPRA' },
    { label: 'ID EVENTO', value: 'ID_EVENTO' },
    { label: 'CORREO DE USUARIO', value: 'CORREO_USUARIO' },
    { label: 'PROCESO BATCH', value: 'PROCESO_BATCH' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.errorForm = this.fb.group({
      fechaHora: [new Date(), Validators.required],
      severidad: [null, Validators.required],
      modulo: [null, Validators.required],
      mensajeBreve: ['', [Validators.required, Validators.maxLength(200)]],
      detalleTecnico: ['', [Validators.required, Validators.maxLength(1000)]],
      traza: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.errorForm.valid) {
      this.loading = true;
      
      // Simular guardado
      setTimeout(() => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registró el error exitosamente',
          life: 4000
        });
        
        // Volver a la lista después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['../'], { relativeTo: this.route });
        }, 2000);
      }, 1500);
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos requeridos'
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.errorForm.controls).forEach(key => {
      this.errorForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.errorForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.errorForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['maxlength']) {
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }
}