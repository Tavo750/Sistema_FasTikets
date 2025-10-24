import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

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

export class GestionLocalesComponent implements OnInit {
  locales: Local[] = [];
  filteredLocales: Local[] = [];
  globalFilterValue: string = '';
  rows: number = 10;
  first: number = 0;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLocales();
  }

  loadLocales(): void {
    // Datos de ejemplo - aquí iría la llamada al servicio
    this.locales = [
      {
        id: 1,
        nombre: 'Jockey Plaza Centro de Exposiciones',
        direccion: 'Av. Javier Prado 42000',
        distrito: 'Santiago de Surco',
        aforo: 5000,
        estado: 'HABILITADO'
      },
      {
        id: 2,
        nombre: 'Mall del Sur',
        direccion: 'Av. Los Lirios 15081',
        distrito: 'San Juan de Miraflores',
        aforo: 1000,
        estado: 'HABILITADO'
      },
      {
        id: 3,
        nombre: 'Nombre Genérico',
        direccion: 'Av. Brasil 1450',
        distrito: 'Jesús María',
        aforo: 200,
        estado: 'HABILITADO'
      }
    ];
    this.filteredLocales = [...this.locales];
  }

  applyGlobalFilter(event: any): void {
    this.globalFilterValue = event.target.value;
    this.filteredLocales = this.locales.filter(local =>
      local.nombre.toLowerCase().includes(this.globalFilterValue.toLowerCase()) ||
      local.distrito.toLowerCase().includes(this.globalFilterValue.toLowerCase()) ||
      local.estado.toLowerCase().includes(this.globalFilterValue.toLowerCase())
    );
  }

  editarLocal(id: number): void {
    this.router.navigate(['/administrador/gestionLocales/editarLocal', id]);
  }

  confirmarEliminacion(local: Local, event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea eliminar el local "${local.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.eliminarLocal(local.id);
      }
    });
  }

  eliminarLocal(id: number): void {
    // Aquí iría la lógica para eliminar del servicio
    this.locales = this.locales.filter(local => local.id !== id);
    this.filteredLocales = this.filteredLocales.filter(local => local.id !== id);

    this.messageService.add({
      severity: 'success',
      summary: 'Local eliminado',
      detail: 'El local ha sido eliminado correctamente',
      life: 3000
    });
  }

  crearNuevoLocal(): void {
    this.router.navigate(['/administrador/gestionLocales/crearLocal']);
  }
}
