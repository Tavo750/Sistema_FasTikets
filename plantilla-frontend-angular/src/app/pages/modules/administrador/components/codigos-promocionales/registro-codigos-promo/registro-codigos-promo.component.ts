import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-registro-codigos-promo',
  standalone: false,
  templateUrl: './registro-codigos-promo.component.html',
  styleUrls: ['./registro-codigos-promo.component.css'],
  providers: [MessageService]
})
export class RegistroCodigosPromoComponent implements OnInit  {

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
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.toast.add({
      severity: 'success',
      summary: 'Guardado',
      detail: 'Código creado'
    });

    this.router.navigate(['/administrador/codigosPromocionales']);
  }

}
