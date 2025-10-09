import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-crear-local',
  standalone: false,
  templateUrl: './crear-local.component.html',
  styleUrls: ['./crear-local.component.css']
})


export class CrearLocalComponent implements AfterViewInit {
  constructor(
      public router: Router,
      private messageService: MessageService 
    ) { }

  ngAfterViewInit(): void {
    // Inicializar el mapa aquí si es necesario
  }
crearLocal(): void {
  const nombre = (document.getElementById('nombre') as HTMLInputElement)?.value.trim();
  const direccion = (document.getElementById('direccion') as HTMLInputElement)?.value.trim();
  const distrito = (document.getElementById('distrito') as HTMLSelectElement)?.value;
  const aforo = (document.getElementById('aforo') as HTMLInputElement)?.value.trim();
  const estado = (document.getElementById('estado') as HTMLSelectElement)?.value;
  const ubicacion = 'Mapa fijo'; // Simulado

  // Validaciones
  if (!nombre || !direccion || !distrito || !aforo || !estado || !ubicacion) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Campos incompletos',
      detail: 'Por favor complete todos los campos antes de continuar',
      life: 3000
    });
    return;
  }

  if (isNaN(Number(aforo)) || Number(aforo) <= 0) {
    this.messageService.add({
      severity: 'error',
      summary: 'Aforo inválido',
      detail: 'Ingrese un número válido mayor a cero',
      life: 3000
    });
    return;
  }

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