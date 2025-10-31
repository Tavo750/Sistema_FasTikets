import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CodigosPromocionalesService } from '../../../services/codigos-promocionales.service';
import { Data } from '../../../interfaces/codigos-promocionales/codigos.interface';
import { CrearCodigoPromocionalRequest } from '../../../interfaces/codigos-promocionales/codigos.interface';
import { MessageService } from '../../../../../../core/services/message.service';

@Component({
  selector: 'app-editar-registro-promo',
  standalone: false,
  templateUrl: './editar-registro-promo.component.html',
  styleUrls: ['./editar-registro-promo.component.css']
})
export class EditarRegistroPromoComponent implements OnInit {
  tipos = [
    { label: 'Porcentaje', value: 'PORCENTAJE' },
    { label: 'Monto Fijo', value: 'MONTO_FIJO' }
  ];

  form!: FormGroup;
  loading = false;
  codigoPromocionalId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private codigosPromocionalesService: CodigosPromocionalesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.codigoPromocionalId = Number(id);
      this.cargarCodigoPromocional(this.codigoPromocionalId);
    }
  }

  cargarCodigoPromocional(id: number): void {
    this.loading = true;

    this.codigosPromocionalesService.getListadoCodigosPromocionalesPorID(id).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.ok && response.data) {
          this.cargarDatos(response.data);
        } else {
          this.messageService.error('No se encontró el código promocional');
          this.router.navigate(['/administrador/codigosPromocionales']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.messageService.error('No se pudo cargar el código promocional');
        this.router.navigate(['/administrador/codigosPromocionales']);
      }
    });
  }

  cargarDatos(data: Data): void {
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
      this.messageService.warn('Por favor complete todos los campos requeridos', 'Formulario incompleto');
      return;
    }

    this.loading = true;

    if (!this.codigoPromocionalId) {
      this.messageService.error('ID del código promocional no válido');
      this.loading = false;
      return;
    }

    const payload: CrearCodigoPromocionalRequest = {
      codigo: this.form.value.codigo,
      descripcion: this.form.value.descripcion,
      fechaFin: this.form.value.fechaFin.toISOString(),
      tipo: this.form.value.tipo,
      valor: this.form.value.valor,
      stock: this.form.value.stock,
      cantidadPorCliente: this.form.value.cantidadPorCliente
    };

    this.codigosPromocionalesService.putActualizaCodigoPromocional(this.codigoPromocionalId, payload).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.ok) {
          this.messageService.success(
            response.mensaje || 'Código promocional actualizado exitosamente',
            'Actualizado'
          );
          this.router.navigate(['/administrador/codigosPromocionales']);
        } else {
          this.messageService.error(
            response.mensaje || 'No se pudo actualizar el código promocional'
          );
        }
      },
      error: (err) => {
        this.loading = false;
        this.messageService.error('No se pudo actualizar el código promocional');
      }
    });
  }
}
