import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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
    private toast: MessageService
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

    // TODO: Llamar al servicio para crear el código
    // const payload = {
    //   codigo: this.form.value.codigo,
    //   descripcion: this.form.value.descripcion,
    //   fechaFin: this.form.value.fechaFin.toISOString(),
    //   tipo: this.form.value.tipo,
    //   valor: this.form.value.valor,
    //   stock: this.form.value.stock,
    //   cantidadPorCliente: this.form.value.cantidadPorCliente
    // };
    //
    // this.codigoPromocionalService.crear(payload).subscribe({
    //   next: (response) => {
    //     if (response.ok) {
    //       this.toast.add({
    //         severity: 'success',
    //         summary: 'Éxito',
    //         detail: response.mensaje
    //       });
    //       this.router.navigate(['/administrador/codigosPromocionales']);
    //     }
    //   },
    //   error: (err) => {
    //     this.loading = false;
    //     this.toast.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: err.error?.mensaje || 'No se pudo crear el código promocional'
    //     });
    //   }
    // });

    // Simulación
    setTimeout(() => {
      this.loading = false;
      this.toast.add({
        severity: 'success',
        summary: 'Código creado',
        detail: 'El código promocional ha sido creado exitosamente'
      });
      this.router.navigate(['/administrador/codigosPromocionales']);
    }, 1000);
  }
}