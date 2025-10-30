import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // ← IMPORTAR Router
import { MessageService, ConfirmationService } from 'primeng/api';

interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  docIdentidad: string;
  edad: number; // ← AGREGADO
  telefono: string;
  departamento: string; // ← AGREGADO
  distrito: string; // ← AGREGADO
  direccion: string;
  fechaCreacion: string;
  fechaNacimiento: string;
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
    private router: Router, // ← INYECTAR Router
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
          nombres: 'Luis',
          apellidos: 'Rios Sosa',
          email: 'Luis.enrique@gmail.com',
          docIdentidad: '78364573',
          edad: 35,
          telefono: '983953765',
          departamento: 'Lima',
          distrito: 'Miraflores',
          direccion: 'Av. Larco 1234, Miraflores',
          fechaCreacion: '2025-09-10T10:30:00',
          fechaNacimiento: '1990-05-15',
          rol: 'CLIENTE'
        },
        {
          id: 8,
          nombres: 'María Elena',
          apellidos: 'González Torres',
          email: 'maria.gonzalez@gmail.com',
          docIdentidad: '45678912',
          edad: 28,
          telefono: '987654322',
          departamento: 'Lima',
          distrito: 'San Isidro',
          direccion: 'Jr. Las Camelias 456, San Isidro',
          fechaCreacion: '2025-09-10T11:45:00',
          fechaNacimiento: '1990-05-15',
          rol: 'CLIENTE'
        },
        {
          id: 9,
          nombres: 'Carlos Alberto',
          apellidos: 'Pérez Sánchez',
          email: 'carlos.perez@gmail.com',
          docIdentidad: '12345678',
          edad: 42,
          telefono: '987654323',
          departamento: 'Arequipa',
          distrito: 'Barranco',
          direccion: 'Calle Bolognesi 789, Barranco',
          fechaCreacion: '2025-09-10T14:20:00',
          fechaNacimiento: '1990-05-15',
          rol: 'CLIENTE'
        },
        {
          id: 10,
          nombres: 'Ana Lucía',
          apellidos: 'Ramírez Castro',
          email: 'ana.ramirez@gmail.com',
          docIdentidad: '87654321',
          edad: 31,
          telefono: '987654324',
          departamento: 'Cusco',
          distrito: 'Surco',
          direccion: 'Av. Benavides 321, Surco',
          fechaCreacion: '2025-09-10T16:10:00',
          fechaNacimiento: '1990-05-15',
          rol: 'CLIENTE'
        },
        {
          id: 11,
          nombres: 'Luis Fernando',
          apellidos: 'Rios Sosa',
          email: 'luis.rios@gmail.com',
          docIdentidad: '23456789',
          edad: 39,
          telefono: '987654325',
          departamento: 'Lima',
          distrito: 'San Borja',
          direccion: 'Av. San Borja Norte 567, San Borja',
          fechaCreacion: '2025-09-11T09:15:00',
          fechaNacimiento: '1990-05-15',
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
    //this.mostrarDialogDetalle = true;
    this.router.navigate(['/administrador/gestionClientes/detalle', cliente.id]);
  }

  editarCliente(cliente: Cliente): void {
    // TODO: Abrir dialog de edición o navegar a página de edición
    this.messageService.add({
      severity: 'info',
      summary: 'Editar Cliente',
      detail: `Editando cliente: ${cliente.nombres} ${cliente.apellidos}`
    });
    this.router.navigate(['/administrador/gestionClientes/editar', cliente.id]);
    //console.log('Editar cliente:', cliente);
    
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