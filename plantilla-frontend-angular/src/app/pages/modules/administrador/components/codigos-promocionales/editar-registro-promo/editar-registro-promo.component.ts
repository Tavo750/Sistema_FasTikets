import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-editar-registro-promo',
  standalone: false,
  templateUrl: './editar-registro-promo.component.html',
  styleUrls: ['./editar-registro-promo.component.css'],
  providers: [MessageService]
})
export class EditarRegistroPromoComponent implements OnInit  {
   tipos = [
    { label: 'Porcentaje', value: 'PORCENTAJE' },
    { label: 'Dinero',     value: 'DINERO' }
  ];
  segmentos = [
    { label: 'Evento',  value: 'EVENTO' },
    { label: 'Cliente', value: 'CLIENTE' }
  ];
  elementosOptions = [
    { label: 'Concierto Shakira', value: 'Concierto Shakira' },
    { label: 'Concierto Nuevo',   value: 'Concierto Nuevo' },
    { label: 'Estudiante', value: 'Estudiante' },
    { label: 'VIP', value: 'VIP' },
    { label: 'General', value: 'General' },
  ];

  form!: FormGroup;

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
      fechaExpiracion: [null, Validators.required],
      tipo: [null, Validators.required],
      valor: [null, Validators.required],
      segmento: [null, Validators.required],
      elementos: [[], Validators.required],
    });

    const id = this.route.snapshot.paramMap.get('id');

    // Simulación de carga de datos para edición
    if (id) {
      this.form.patchValue({
        codigo: 'SHAKIRACNRT',
        descripcion: 'Código promocional concierto',
        fechaExpiracion: new Date(), // demo
        tipo: 'PORCENTAJE',
        valor: 10,
        segmento: 'EVENTO',
        elementos: ['Concierto Shakira', 'Concierto Nuevo']
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.toast.add({
      severity: 'success',
      summary: 'Actualizado',
      detail: 'Cambios guardados'
    });

    this.router.navigate(['/administrador/codigosPromocionales']);
  }
}
