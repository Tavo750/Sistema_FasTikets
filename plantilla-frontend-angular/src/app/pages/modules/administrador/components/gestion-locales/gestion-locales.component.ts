import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { LocalService } from '../../services/local.service';
import { MessageService as CustomMessageService } from '../../../../../core/services/message.service';
import { LocalResponse } from '../../interfaces/gestion-locales/local.interface';

interface Local {
  idLocal: number;
  nombre: string;
  direccion: string;
  nombreDistrito: string;
  aforoTotal: number;
  activo: boolean;
  fechaCreacion?: Date;
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
  isLoading = false;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private localService: LocalService,
    private customMessageService: CustomMessageService
  ) {}

  ngOnInit(): void {
    this.loadLocales();
  }

  loadLocales(): void {
    this.isLoading = true;
    this.customMessageService.info('Cargando locales...', 'Cargando');

    this.localService.getlistarLocales().subscribe({
      next: (responses: LocalResponse[]) => {
        // Mapear las respuestas del backend a la interfaz Local
        this.locales = responses.map(response => response.data);
        this.filteredLocales = [...this.locales];
        this.isLoading = false;

        if (this.locales.length > 0) {
          this.customMessageService.success(
            `Se cargaron ${this.locales.length} locales correctamente`,
            'Carga completada'
          );
        } else {
          this.customMessageService.info('No se encontraron locales registrados', 'Sin resultados');
        }
      },
      error: (error) => {
        console.error('Error al cargar locales:', error);
        this.customMessageService.error(
          'Error al cargar la lista de locales. Por favor, inténtelo de nuevo.',
          'Error de conexión'
        );
        this.isLoading = false;

        // Mantener datos de ejemplo en caso de error para pruebas
        this.loadMockData();
      }
    });
  }

  private loadMockData(): void {
    // Datos de ejemplo con la nueva estructura
    this.locales = [
      {
        idLocal: 1,
        nombre: 'Jockey Plaza Centro de Exposiciones',
        direccion: 'Av. Javier Prado 42000',
        nombreDistrito: 'Santiago de Surco',
        aforoTotal: 5000,
        activo: true,
        fechaCreacion: new Date()
      },
      {
        idLocal: 2,
        nombre: 'Mall del Sur',
        direccion: 'Av. Los Lirios 15081',
        nombreDistrito: 'San Juan de Miraflores',
        aforoTotal: 1000,
        activo: true,
        fechaCreacion: new Date()
      },
      {
        idLocal: 3,
        nombre: 'Nombre Genérico',
        direccion: 'Av. Brasil 1450',
        nombreDistrito: 'Jesús María',
        aforoTotal: 200,
        activo: true,
        fechaCreacion: new Date()
      }
    ];
    this.filteredLocales = [...this.locales];
  }

  applyGlobalFilter(event: any): void {
    this.globalFilterValue = event.target.value;
    this.filteredLocales = this.locales.filter(local =>
      local.nombre.toLowerCase().includes(this.globalFilterValue.toLowerCase()) ||
      local.nombreDistrito.toLowerCase().includes(this.globalFilterValue.toLowerCase()) ||
      (local.activo ? 'HABILITADO' : 'DESHABILITADO').toLowerCase().includes(this.globalFilterValue.toLowerCase())
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
        this.eliminarLocal(local.idLocal);
      }
    });
  }

  eliminarLocal(id: number): void {
    // Encontrar el local que se va a eliminar para mostrar su nombre en los mensajes
    const localAEliminar = this.locales.find(local => local.idLocal === id);
    const nombreLocal = localAEliminar?.nombre || 'el local';

    this.isLoading = true;
    this.customMessageService.info(`Eliminando ${nombreLocal}...`, 'Procesando');

    // Llamar al servicio para eliminar el local
    this.localService.deleteLocal(id).subscribe({
      next: (response) => {
        console.log('Local eliminado:', response);

        if (response.ok) {
          // Actualizar la lista local eliminando el local
          this.locales = this.locales.filter(local => local.idLocal !== id);
          this.filteredLocales = this.filteredLocales.filter(local => local.idLocal !== id);

          this.customMessageService.success(
            `${nombreLocal} ha sido eliminado correctamente`,
            'Local eliminado'
          );
        } else {
          this.customMessageService.error(
            response.mensaje || 'Error al eliminar el local',
            'Error'
          );
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al eliminar el local:', error);
        this.customMessageService.error(
          'Error al eliminar el local. Por favor, inténtelo de nuevo.',
          'Error de conexión'
        );
        this.isLoading = false;
      }
    });
  }

  crearNuevoLocal(): void {
    this.router.navigate(['/administrador/gestionLocales/crearLocal']);
  }

  /**
   * Método para refrescar la lista de locales
   */
  refrescarLista(): void {
    this.loadLocales();
  }

  /**
   * Método getter para mostrar el estado del local en la vista
   */
  getEstadoLocal(activo: boolean): string {
    return activo ? 'HABILITADO' : 'DESHABILITADO';
  }

  /**
   * Método getter para obtener la clase CSS del estado
   */
  getEstadoClass(activo: boolean): string {
    return activo ? 'estado-habilitado' : 'estado-deshabilitado';
  }
}
