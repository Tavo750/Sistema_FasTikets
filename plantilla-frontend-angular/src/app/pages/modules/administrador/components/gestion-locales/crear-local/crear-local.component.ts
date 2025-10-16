import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-crear-local',
  standalone: false,
  templateUrl: './crear-local.component.html',
  styleUrls: ['./crear-local.component.css']
})


export class CrearLocalComponent implements AfterViewInit {
  localForm: FormGroup;

  distritos = [
    { label: 'Seleccionar...', value: '' },
    { label: 'Santiago de Surco', value: 'Santiago de Surco' },
    { label: 'San Juan de Miraflores', value: 'San Juan de Miraflores' },
    { label: 'Jesús María', value: 'Jesús María' }
  ];

  estados = [
    { label: 'HABILITADO', value: 'HABILITADO' },
    { label: 'DESHABILITADO', value: 'DESHABILITADO' }
  ];

  constructor(
      public router: Router,
      private messageService: MessageService,
      private fb: FormBuilder
    ) {
      this.localForm = this.fb.group({
        nombre: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        distrito: ['', [Validators.required]],
        aforo: ['', [Validators.required, Validators.min(1)]],
        estado: ['HABILITADO', [Validators.required]]
      });
    }

  ngAfterViewInit(): void {
    // Inicializar el mapa aquí si es necesario
  }
crearLocal(): void {
  if (this.localForm.invalid) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Campos incompletos',
      detail: 'Por favor complete todos los campos correctamente antes de continuar',
      life: 3000
    });
    this.localForm.markAllAsTouched();
    return;
  }

  const formData = this.localForm.value;

  // Mostrar mensaje de éxito
  this.messageService.add({
    severity: 'success',
    summary: 'Local creado',
    detail: 'El local ha sido registrado exitosamente',
    life: 3000
  });

  // Redirigir después de 2 segundos
  setTimeout(() => {
    this.router.navigate(['/administrador/gestionLocales']);
  }, 2000);
}
}
