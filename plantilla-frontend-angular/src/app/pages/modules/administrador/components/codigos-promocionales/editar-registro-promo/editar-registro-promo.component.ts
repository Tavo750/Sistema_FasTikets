import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

interface CodigoPromocional {
  idCodigoPromocional: number;
  codigo: string;
  descripcion: string;
  fechaFin: string;
  tipo: 'PORCENTAJE' | 'MONTO_FIJO';
  valor: number;
  stock: number;
  cantidadPorCliente: number;
}

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toast: MessageService
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

    const id = this.route.snapshot.paramMap.get('id');

    // Simulación de carga de datos para edición
    if (id) {
      // TODO: Llamar al servicio para obtener los datos
      // this.codigoPromocionalService.obtenerDetalle(id).subscribe({
      //   next: (response) => {
      //     if (response.ok) {
      //       this.cargarDatos(response.data);
      //     }
      //   },
      //   error: (err) => {
      //     this.toast.add({
      //       severity: 'error',
      //       summary: 'Error',
      //       detail: 'No se pudo cargar el código promocional'
      //     });
      //   }
      // });

      // Datos de ejemplo (simula respuesta del backend)
      const datosEjemplo: CodigoPromocional = {
        idCodigoPromocional: 1,
        codigo: 'PikeStereo',
        descripcion: 'Concierto Monumental',
        fechaFin: '2025-11-15T10:01:36.472',
        tipo: 'MONTO_FIJO',
        valor: 7.0,
        stock: 0,
        cantidadPorCliente: 3
      };
      
      this.cargarDatos(datosEjemplo);
    }
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
    const id = this.route.snapshot.paramMap.get('id');

    // TODO: Llamar al servicio para actualizar
    // const payload = {
    //   ...this.form.value,
    //   fechaFin: this.form.value.fechaFin.toISOString()
    // };
    // 
    // this.codigoPromocionalService.actualizar(id, payload).subscribe({
    //   next: (response) => {
    //     if (response.ok) {
    //       this.toast.add({
    //         severity: 'success',
    //         summary: 'Actualizado',
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
    //       detail: 'No se pudo actualizar el código promocional'
    //     });
    //   }
    // });

    // Simulación
    setTimeout(() => {
      this.loading = false;
      this.toast.add({
        severity: 'success',
        summary: 'Actualizado',
        detail: 'Código actualizado exitosamente.'
      });
      this.router.navigate(['/administrador/codigosPromocionales']);
    }, 1000);
  }
}