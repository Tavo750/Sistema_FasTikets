import { Component, AfterViewInit } from '@angular/core';
import { MessageService } from 'primeng/api';

interface Local {
  id: number;
  nombre: string;
  direccion: string;
  distrito: string;
  aforo: number;
  estado: string;
}

@Component({
  selector: 'app-gestion-locales',
  standalone: false,
  templateUrl: './gestion-locales.component.html',
  styleUrls: ['./gestion-locales.component.css']
})

export class GestionLocalesComponent implements AfterViewInit {
  constructor(private messageService: MessageService) {}

  ngAfterViewInit(): void {
    const botonesEliminar = document.querySelectorAll('.eliminar-btn');
    botonesEliminar.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        this.confirmarEliminacion();
      });
    });
  }

  confirmarEliminacion(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Local eliminado',
      detail: 'El local ha sido eliminado correctamente',
      life: 3000
    });
  }
}
