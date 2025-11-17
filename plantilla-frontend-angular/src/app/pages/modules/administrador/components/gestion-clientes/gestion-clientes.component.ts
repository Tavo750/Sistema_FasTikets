import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { GestionClientesService } from '../../services/gestion-clientes.service';
import { AyudaSoporteService } from '../../../usuario/services/ayuda-soporte.service';
import { AyudaSoporteListItem, AyudaSoporteListResponse } from '../../../usuario/interfaces/ayuda-soporte/ayuda-soporte-listar.interface';
import { AyudaSoporteAdmiObtenerIdResponse } from '../../../usuario/interfaces/ayuda-soporte/ayuda-soporte-admi-obtener-id.interface';
import { AyudaSoporteAdmiModificarResponse } from '../../../usuario/interfaces/ayuda-soporte/ayuda-soporte-admi-modificar.interface';

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
  verificado: boolean;
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

  // Ayuda y soporte global
  mostrarDialogAyudaGlobal: boolean = false;
  solicitudesGlobales: AyudaSoporteListItem[] = [];
  loadingSolicitudesGlobales: boolean = false;
  mostrarDialogSolicitudGlobal: boolean = false;
  solicitudGlobalSeleccionada: AyudaSoporteListItem | null = null;
  mostrarDialogModificarGlobal: boolean = false;
  solicitudGlobalParaEditar: AyudaSoporteListItem | null = null;
  editarObservacionGlobal: string = '';
  loadingModificarGlobal: boolean = false;
  searchSolicitudesGlobales: string = '';
  filterEstadoGlobal: string | null = null;
  estadoFilterOptionsGlobal = [
    { label: 'Todos', value: null },
    { label: 'ABIERTO', value: 'ABIERTO' },
    { label: 'RESUELTO', value: 'RESUELTO' },
    { label: 'CERRADO', value: 'CERRADO' }
  ];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private gestionClientesService: GestionClientesService,
    private ayudaSoporteService: AyudaSoporteService
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

  // ===== MÉTODOS AYUDA Y SOPORTE GLOBAL =====

  abrirAyudaGlobal(): void {
    this.mostrarDialogAyudaGlobal = true;
    this.cargarSolicitudesGlobales();
  }

  cargarSolicitudesGlobales(): void {
    this.loadingSolicitudesGlobales = true;
    this.ayudaSoporteService.listarSolicitudes().subscribe({
      next: (response: AyudaSoporteListResponse) => {
        this.loadingSolicitudesGlobales = false;
        if (response && response.ok && Array.isArray(response.data)) {
          this.solicitudesGlobales = response.data;
          console.log('Solicitudes globales cargadas:', this.solicitudesGlobales.length);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje || 'No se pudieron cargar las solicitudes de soporte'
          });
        }
      },
      error: (error: any) => {
        this.loadingSolicitudesGlobales = false;
        console.error('Error al cargar solicitudes globales:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las solicitudes de soporte'
        });
      }
    });
  }

  verSolicitudGlobal(solicitud: AyudaSoporteListItem): void {
    this.solicitudGlobalSeleccionada = solicitud;
    this.mostrarDialogSolicitudGlobal = true;
  }

  abrirModificarObservacionGlobal(solicitud: AyudaSoporteListItem): void {
    if (!solicitud || !solicitud.idSolicitud) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Advertencia', 
        detail: 'Solicitud inválida' 
      });
      return;
    }
    
    this.loadingModificarGlobal = true;
    this.ayudaSoporteService.obtenerPorId(Number(solicitud.idSolicitud)).subscribe({
      next: (response: AyudaSoporteAdmiObtenerIdResponse) => {
        this.loadingModificarGlobal = false;
        if (response && response.ok && response.data) {
          this.solicitudGlobalParaEditar = response.data;
          this.editarObservacionGlobal = response.data.observaciones || '';
          this.mostrarDialogModificarGlobal = true;
        } else {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudo obtener el detalle de la solicitud' 
          });
        }
      },
      error: (error: any) => {
        this.loadingModificarGlobal = false;
        console.error('Error al obtener detalle de solicitud:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudo obtener el detalle de la solicitud' 
        });
      }
    });
  }

  guardarObservacionGlobal(): void {
    if (!this.solicitudGlobalParaEditar) return;
    
    const id = Number(this.solicitudGlobalParaEditar.idSolicitud);
    const payload = {
      estado: 'RESUELTO',
      observaciones: this.editarObservacionGlobal || null
    };

    this.loadingModificarGlobal = true;
    this.ayudaSoporteService.modificarEstadoSolicitudAdmin(id, payload).subscribe({
      next: (response: AyudaSoporteAdmiModificarResponse) => {
        this.loadingModificarGlobal = false;
        if (response && response.ok && response.data) {
          // Actualizar la solicitud en la lista
          const index = this.solicitudesGlobales.findIndex(s => 
            Number(s.idSolicitud) === id
          );
          if (index !== -1) {
            this.solicitudesGlobales[index] = {
              ...this.solicitudesGlobales[index],
              estado: response.data.estado,
              observaciones: response.data.observaciones
            };
          }
          
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Observación actualizada correctamente'
          });
          
          this.mostrarDialogModificarGlobal = false;
          this.editarObservacionGlobal = '';
          this.solicitudGlobalParaEditar = null;
        } else {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: response?.mensaje || 'No se pudo actualizar la observación' 
          });
        }
      },
      error: (error: any) => {
        this.loadingModificarGlobal = false;
        console.error('Error al modificar observación global:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al actualizar la observación' 
        });
      }
    });
  }

  get filteredSolicitudesGlobales(): AyudaSoporteListItem[] {
    const searchTerm = (this.searchSolicitudesGlobales || '').toString().trim().toLowerCase();
    return this.solicitudesGlobales.filter(s => {
      // Filtrar por término de búsqueda
      if (searchTerm) {
        const asunto = (s.asunto || '').toLowerCase();
        const mensaje = (s.mensaje || '').toLowerCase();
        const nombreUsuario = (s.nombreUsuario || '').toLowerCase();
        const emailUsuario = (s.emailUsuario || '').toLowerCase();
        if (!asunto.includes(searchTerm) && !mensaje.includes(searchTerm) && 
            !nombreUsuario.includes(searchTerm) && !emailUsuario.includes(searchTerm)) {
          return false;
        }
      }
      
      // Filtrar por estado
      if (this.filterEstadoGlobal && s.estado !== this.filterEstadoGlobal) {
        return false;
      }
      
      return true;
    });
  }

  limpiarFiltrosGlobales(): void {
    this.searchSolicitudesGlobales = '';
    this.filterEstadoGlobal = null;
  }
}