import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { GestionClientesService } from '../../../services/gestion-clientes.service';

@Component({
  selector: 'app-cambiar-a-admin',
  standalone: false,
  templateUrl: './cambiar-a-admin.component.html',
  styleUrl: './cambiar-a-admin.component.css',
  providers: [MessageService, ConfirmationService]
})
export class CambiarAAdminComponent implements OnInit {
  idCliente: number = 0;
  clienteNombre: string = '';
  cargoSeleccionado: string = '';
  claveConfirmacion: string = '';
  mostrarDialogConfirmacion: boolean = false;
  loading: boolean = false;
  guardando: boolean = false;

  cargosDisponibles = [
    { label: 'Administrador General', value: 'Administrador General' },
    { label: 'Administrador de Eventos', value: 'Administrador de Eventos' },
    { label: 'Administrador de Soporte', value: 'Administrador de Soporte' },
    { label: 'Administrador de Ventas', value: 'Administrador de Ventas' }
  ];

  cliente: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private gestionClientesService: GestionClientesService
  ) {}

  ngOnInit(): void {
    this.idCliente = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idCliente) {
      this.cargarDatosCliente();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de cliente no válido'
      });
      this.volver();
    }
  }

  cargarDatosCliente(): void {
    this.loading = true;
    this.gestionClientesService.getListarGestionClientesPorId(this.idCliente).subscribe({
      next: (response) => {
        this.loading = false;
        if (response && response.ok && response.data) {
          this.cliente = response.data;
          this.clienteNombre = `${this.cliente.nombres} ${this.cliente.apellidos}`;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar los datos del cliente'
          });
          this.volver();
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al cargar cliente:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los datos del cliente'
        });
        this.volver();
      }
    });
  }

  abrirConfirmacion(): void {
    if (!this.cargoSeleccionado) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar un cargo'
      });
      return;
    }
    this.claveConfirmacion = '';
    this.mostrarDialogConfirmacion = true;
  }

  confirmarCambio(): void {
    if (!this.claveConfirmacion || this.claveConfirmacion.trim().length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe ingresar la clave de confirmación'
      });
      return;
    }

    // Validar clave de confirmación
    // Nota: La validación de clave debería hacerse en el backend por seguridad
    // Por ahora usamos una validación simple en el frontend
    if (this.claveConfirmacion !== 'ADMIN2025') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Clave de confirmación incorrecta'
      });
      return;
    }

    this.realizarCambio();
  }

  realizarCambio(): void {
    this.guardando = true;
    
    this.gestionClientesService.promoverAAdministrador(this.idCliente, this.cargoSeleccionado).subscribe({
      next: (response) => {
        this.guardando = false;
        this.mostrarDialogConfirmacion = false;
        
        if (response && response.ok) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: response.mensaje || `${this.clienteNombre} ha sido promovido a Administrador con cargo: ${this.cargoSeleccionado}`
          });

          setTimeout(() => {
            this.volver();
          }, 2000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje || 'No se pudo promover al cliente'
          });
        }
      },
      error: (error) => {
        this.guardando = false;
        this.mostrarDialogConfirmacion = false;
        console.error('Error al promover cliente a administrador:', error);
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo convertir el cliente a administrador. Por favor, intente nuevamente.'
        });
      }
    });
  }

  volver(): void {
    this.router.navigate(['/administrador/gestionClientes']);
  }
}
