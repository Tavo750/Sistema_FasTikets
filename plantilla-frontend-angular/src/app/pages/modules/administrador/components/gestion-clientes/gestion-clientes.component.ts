import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';

interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  docIdentidad: string;
  tipoDocumento: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  fechaCreacion: string;
  rol: string;
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading = true;
    
    // Simulación de datos - Reemplazar con servicio real
    setTimeout(() => {
      this.clientes = [
        {
          id: 7,
          nombres: 'Juan',
          apellidos: 'Enrique',
          email: 'juan.enrique@gmail.com',
          docIdentidad: '78364573',
          tipoDocumento: 'DNI',
          telefono: '987654321',
          direccion: 'Av. Principal 123',
          fechaNacimiento: '1990-05-15',
          fechaCreacion: '2025-09-10T10:30:00',
          rol: 'CLIENTE'
        },
        {
          id: 8,
          nombres: 'Juan',
          apellidos: 'Enrique',
          email: 'juan.e@gmail.com',
          docIdentidad: '78364573',
          tipoDocumento: 'DNI',
          telefono: '987654322',
          direccion: 'Jr. Secundaria 456',
          fechaNacimiento: '1985-08-20',
          fechaCreacion: '2025-09-10T11:45:00',
          rol: 'CLIENTE'
        },
        {
          id: 9,
          nombres: 'Juan',
          apellidos: 'Enrique',
          email: 'enrique.juan@gmail.com',
          docIdentidad: '78364573',
          tipoDocumento: 'DNI',
          telefono: '987654323',
          direccion: 'Calle Tercera 789',
          fechaNacimiento: '1992-12-10',
          fechaCreacion: '2025-09-10T14:20:00',
          rol: 'CLIENTE'
        },
        {
          id: 10,
          nombres: 'Juan',
          apellidos: 'Enrique',
          email: 'j.enrique@gmail.com',
          docIdentidad: '78364573',
          tipoDocumento: 'DNI',
          telefono: '987654324',
          direccion: 'Av. Cuarta 321',
          fechaNacimiento: '1988-03-25',
          fechaCreacion: '2025-09-10T16:10:00',
          rol: 'CLIENTE'
        }
      ];
      
      this.totalRecords = this.clientes.length;
      this.loading = false;
    }, 1000);
    
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

  verDetalle(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.mostrarDialogDetalle = true;
  }

  editarCliente(cliente: Cliente): void {
    // TODO: Abrir dialog de edición o navegar a página de edición
    this.messageService.add({
      severity: 'info',
      summary: 'Editar Cliente',
      detail: `Editando cliente: ${cliente.nombres} ${cliente.apellidos}`
    });
    
    console.log('Editar cliente:', cliente);
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
    // TODO: Llamar al servicio para eliminar
    this.loading = true;
    
    setTimeout(() => {
      this.clientes = this.clientes.filter(c => c.id !== cliente.id);
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