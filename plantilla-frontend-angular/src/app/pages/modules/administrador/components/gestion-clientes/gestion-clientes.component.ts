import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { GestionClientesService } from '../../services/gestion-clientes.service';

interface Cliente {
  idCliente: number;
  nombres: string;
  apellidos: string;
  email: string;
  docIdentidad: string;
  edad: number;
  telefono: string;
  tipoDocumento: string;
  direccion: string;
  fechaCreacion: string;
  fechaNacimiento: string;
  nivel: string;
  puntosAcumulados: number;
  departamento?: string;
  distrito?: string;
  rol?: string;
}

@Component({
  selector: 'app-gestion-clientes',
  standalone: false,
  templateUrl: './gestion-clientes.component.html',
  styleUrls: ['./gestion-clientes.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class GestionClientesComponent implements OnInit {
  
  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  mostrarDialogDetalle: boolean = false;
  searchValue: string = '';
  loading: boolean = false;
  totalRecords: number = 0;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private gestionClientesService: GestionClientesService
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading = true;
    this.clientes = [];
    this.totalRecords = 0;

    this.gestionClientesService.getListarClientes().subscribe({
      next: (response) => {
        console.log('Respuesta del servicio:', response);
        
        if (response && response.ok && response.data) {
          try {
            this.clientes = response.data.map(cliente => ({
              ...cliente,
              departamento: this.obtenerDepartamento(cliente.direccion || ''),
              distrito: this.obtenerDistrito(cliente.direccion || ''),
              rol: 'CLIENTE'
            }));
            
            this.totalRecords = this.clientes.length;
            console.log('Clientes procesados:', this.clientes);
            
            if (this.clientes.length > 0) {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: `Se cargaron ${this.clientes.length} clientes`
              });
            } else {
              this.messageService.add({
                severity: 'info',
                summary: 'Información',
                detail: 'No hay clientes registrados'
              });
            }
          } catch (error) {
            console.error('Error al procesar los datos:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al procesar los datos de los clientes'
            });
          }
        } else {
          console.error('Respuesta inválida:', response);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje || 'No se pudieron cargar los clientes'
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.mensaje || 'Error al conectar con el servidor'
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
    
    // TODO: Reemplazar con llamada real al servicio
    // this.clienteService.obtenerClientes().subscribe({
    //   next: (response) => {
    //     this.clientes = response.data;
    //     this.totalRecords = response.total;
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     this.loading = false;
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'No se pudieron cargar los clientes'
    //     });
    //   }
    // });
  }

  obtenerDepartamento(direccion: string): string {
    const partes = direccion.split(',');
    return partes.length > 1 ? partes[partes.length - 1].trim() : 'Lima';
  }

  obtenerDistrito(direccion: string): string {
    const partes = direccion.split(',');
    return partes.length > 1 ? partes[partes.length - 2].trim() : direccion.split(' ')[0];
  }

  verDetalle(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    //this.mostrarDialogDetalle = true;
    this.router.navigate(['/administrador/gestionClientes/detalle', cliente.idCliente]);
  }

  editarCliente(cliente: Cliente): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Editar Cliente',
      detail: `Editando cliente: ${cliente.nombres} ${cliente.apellidos}`
    });
    this.router.navigate(['/administrador/gestionClientes/editar', cliente.idCliente]);
  }

  confirmarEliminacion(cliente: Cliente): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar al cliente ${cliente.nombres} ${cliente.apellidos}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.eliminarCliente(cliente);
      }
    });
  }

  eliminarCliente(cliente: Cliente): void {
    this.loading = true;
    // TODO: Implementar el servicio de eliminación cuando esté disponible en el backend
    setTimeout(() => {
      this.clientes = this.clientes.filter(c => c.idCliente !== cliente.idCliente);
      this.totalRecords = this.clientes.length;
      this.loading = false;
      
      this.messageService.add({
        severity: 'success',
        summary: 'Cliente Eliminado',
        detail: `${cliente.nombres} ${cliente.apellidos} ha sido eliminado correctamente`
      });
    }, 500);
    
    // TODO: Reemplazar con llamada real al servicio
    // this.clienteService.eliminarCliente(cliente.id).subscribe({
    //   next: () => {
    //     this.cargarClientes();
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Cliente Eliminado',
    //       detail: 'El cliente ha sido eliminado correctamente'
    //     });
    //   },
    //   error: (error) => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'No se pudo eliminar el cliente'
    //     });
    //   }
    // });
  }
}