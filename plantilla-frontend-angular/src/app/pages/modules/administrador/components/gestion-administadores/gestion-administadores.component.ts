import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { SessionService } from '../../../../../shared/services/session.service';
import { GestionAdministradoresService } from '../../services/gestion-administradores.service';
import { PerfilAdministradorService } from '../../services/perfil-administrador.service';
import { 
  ListarAdministradoresResponse, 
  Administrador
} from '../../interfaces/gestion-administradores/gestion-admi.interface';

@Component({
  selector: 'app-gestion-administadores',
  standalone: false,
  templateUrl: './gestion-administadores.component.html',
  styleUrl: './gestion-administadores.component.css'
})
export class GestionAdministadoresComponent implements OnInit {
  administradores: Administrador[] = [];
  filteredAdministradores: Administrador[] = [];
  globalFilterValue: string = '';
  rows: number = 10;
  first: number = 0;
  isLoading = false;

  // Diálogos
  mostrarDialogPerfil: boolean = false;
  administradorSeleccionado: Administrador | null = null;
  loadingDialogPerfil: boolean = false;
  
  // Diálogo de acceso denegado
  mostrarDialogAcceso: boolean = false;
  mensajeAcceso: string = '';

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private sessionService: SessionService,
    private gestionAdministradoresService: GestionAdministradoresService,
    private perfilAdministradorService: PerfilAdministradorService
  ) {}

  ngOnInit(): void {
    this.verificarAccesoModulo();
  }

  /**
   * Verificar si el administrador tiene acceso al módulo
   */
  verificarAccesoModulo(): void {
    const usuarioData = this.sessionService.getCurrentUser();
    
    // Verificar si el usuario está autenticado
    if (!usuarioData || !this.sessionService.isAuthenticated()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Acceso Denegado',
        detail: 'Debe iniciar sesión para acceder a este módulo.',
        life: 6000
      });
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
      
      return;
    }

    // Debug: Mostrar datos del usuario para verificar
    console.log('Datos del usuario en sesión:', usuarioData);
    console.log('ID del usuario:', usuarioData.idUsuario);

    // Obtener el perfil real del administrador desde el backend
    this.perfilAdministradorService.getPerfilAdministrador(usuarioData.idUsuario).subscribe({
      next: (perfilResponse) => {
        console.log('Perfil del administrador obtenido:', perfilResponse);
        
        if (perfilResponse && perfilResponse.ok && perfilResponse.data) {
          const cargoReal = perfilResponse.data.cargo;
          console.log('Cargo real del administrador:', cargoReal);
          
          // Verificar si el cargo permite gestionar administradores
          this.verificarPermisosPorCargo(cargoReal);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo obtener la información del perfil del administrador'
          });
          
          setTimeout(() => {
            this.router.navigate(['/administrador']);
          }, 1000);
        }
      },
      error: (error) => {
        console.error('Error al obtener perfil del administrador:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al verificar permisos del usuario'
        });
        
        setTimeout(() => {
          this.router.navigate(['/administrador']);
        }, 1000);
      }
    });
  }

  /**
   * Verificar permisos basado en el cargo real del administrador
   */
  private verificarPermisosPorCargo(cargo: string): void {
    console.log('Verificando permisos para cargo:', cargo);
    
    // Cargos que pueden gestionar administradores
    const cargosPermitidos = [
      'Administrador General',
      'Super Administrador',
      'Administrador Principal'
    ];
    
    // Cargos específicamente bloqueados
    const cargosBloqueados = [
      'Administrador del Sistema',
      'Administrador de Soporte',
      'Administrador Operativo'
    ];
    
    // Verificar si está bloqueado específicamente
    const estaBloquedo = cargosBloqueados.some(cargoBloquedo => 
      cargo?.toLowerCase() === cargoBloquedo.toLowerCase()
    );
    
    // Verificar si tiene permiso
    const tienePermiso = cargosPermitidos.some(cargoPermitido => 
      cargo?.toLowerCase() === cargoPermitido.toLowerCase()
    );

    if (estaBloquedo) {
      this.mensajeAcceso = `Lo sentimos, no tiene acceso a este módulo. Los usuarios con cargo "${cargo}" no pueden gestionar administradores.`;
      this.mostrarDialogAcceso = true;
      
      return;
    }
    
    if (!tienePermiso) {
      this.mensajeAcceso = `Su cargo actual es "${cargo}". Solo administradores con cargos específicos pueden gestionar otros administradores.`;
      this.mostrarDialogAcceso = true;
      return;
    }
    
    // Si tiene permisos, cargar los datos
    console.log('Acceso concedido para cargo:', cargo);
    this.loadAdministradores();
  }

  loadAdministradores(): void {
    this.isLoading = true;

    this.gestionAdministradoresService.listarAdministradores().subscribe({
      next: (response: ListarAdministradoresResponse) => {
        console.log('Respuesta del servicio:', response);

        if (response && response.ok && Array.isArray(response.data)) {
          this.administradores = response.data;
          this.filteredAdministradores = [...this.administradores];

          if (this.administradores.length > 0) {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `Se cargaron ${this.administradores.length} administradores correctamente`
            });
          } else {
            this.messageService.add({
              severity: 'info',
              summary: 'Información',
              detail: 'No se encontraron administradores registrados'
            });
          }
        } else {
          console.warn('Estructura de respuesta inesperada:', response);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje || 'Error al procesar la respuesta del servidor'
          });
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar administradores:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.mensaje || 'Error al conectar con el servidor'
        });
        this.isLoading = false;
      }
    });
  }

  applyGlobalFilter(event: any): void {
    this.globalFilterValue = event.target.value;
    this.filteredAdministradores = this.administradores.filter(admin =>
      admin.nombres.toLowerCase().includes(this.globalFilterValue.toLowerCase()) ||
      admin.apellidos.toLowerCase().includes(this.globalFilterValue.toLowerCase()) ||
      admin.email.toLowerCase().includes(this.globalFilterValue.toLowerCase()) ||
      admin.cargo.toLowerCase().includes(this.globalFilterValue.toLowerCase()) ||
      this.getEstadoAdministrador(admin.activo).toLowerCase().includes(this.globalFilterValue.toLowerCase())
    );
  }



  confirmarDesactivacion(admin: Administrador, event: Event): void {
    // Solo permitir desactivar administradores activos
    if (!admin.activo) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Administrador Inactivo',
        detail: 'Este administrador ya se encuentra desactivado'
      });
      return;
    }

    const mensaje = `¿Está seguro que desea desactivar permanentemente al administrador "${admin.nombres} ${admin.apellidos}"?\n\nEsta acción no se puede deshacer.`;
    
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: mensaje,
      header: 'Confirmar Desactivación Permanente',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.desactivarAdministrador(admin.idAdministrador);
      }
    });
  }

  desactivarAdministrador(id: number): void {
    const adminADesactivar = this.administradores.find(admin => admin.idAdministrador === id);
    const nombreAdmin = adminADesactivar ? `${adminADesactivar.nombres} ${adminADesactivar.apellidos}` : 'el administrador';

    this.isLoading = true;

    this.gestionAdministradoresService.desactivarAdministrador(id).subscribe({
      next: (response) => {
        console.log('Administrador desactivado:', response);

        if (response && response.ok) {
          // Actualizar el estado del administrador en la lista local
          const index = this.administradores.findIndex(admin => admin.idAdministrador === id);
          if (index !== -1) {
            this.administradores[index].activo = false;
          }
          
          // También actualizar en la lista filtrada
          const filteredIndex = this.filteredAdministradores.findIndex(admin => admin.idAdministrador === id);
          if (filteredIndex !== -1) {
            this.filteredAdministradores[filteredIndex].activo = false;
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Administrador Desactivado',
            detail: `${nombreAdmin} ha sido desactivado permanentemente del sistema`
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje || 'Error al desactivar el administrador'
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al desactivar el administrador:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.mensaje || 'Error al conectar con el servidor'
        });
        this.isLoading = false;
      }
    });
  }



  verPerfil(administrador: Administrador): void {
    this.administradorSeleccionado = administrador;
    this.mostrarDialogPerfil = true;
  }

  /**
   * Método para refrescar la lista de administradores
   */
  refrescarLista(): void {
    this.loadAdministradores();
  }

  /**
   * Método getter para mostrar el estado del administrador en la vista
   */
  getEstadoAdministrador(activo: boolean): string {
    return activo ? 'ACTIVO' : 'INACTIVO';
  }

  /**
   * Método getter para obtener la clase CSS del estado
   */
  getEstadoClass(activo: boolean): string {
    return activo ? 'estado-activo' : 'estado-inactivo';
  }

  /**
   * Formatear fecha de último acceso
   */
  formatearUltimoAcceso(fechaAcceso: string): string {
    return fechaAcceso || 'Sin acceso';
  }

  /**
   * Cerrar diálogo de perfil
   */
  cerrarDialogPerfil(): void {
    this.mostrarDialogPerfil = false;
    this.administradorSeleccionado = null;
    this.loadingDialogPerfil = false;
  }

  /**
   * Cerrar diálogo de acceso y redirigir
   */
  cerrarDialogAcceso(): void {
    this.mostrarDialogAcceso = false;
    this.mensajeAcceso = '';
    this.router.navigate(['/administrador']);
  }
}
