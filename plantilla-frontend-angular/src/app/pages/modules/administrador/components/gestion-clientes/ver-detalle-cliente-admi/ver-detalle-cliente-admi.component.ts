import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';

interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  docIdentidad: string;
  edad: number;
  telefono: string;
  departamento: string;
  distrito: string;
  direccion: string;
}

interface Compra {
  id: number;
  nombreEvento: string;
  local: string;
  fechaCompra: string;
  nombreCliente: string;
  evento: string;
  tipoEntrada: string;
  categoriaEntrada: string;
  correoElectronico: string;
  cuponesUtilizados: string;
  descuento: number;
  metodoPago: string;
  cantidadTickets: number;
  precioTotal: number;
}

interface Punto {
  id: number;
  estatus: string;
  puntos: number;
  fecha: string;
  cliente: string;
  tipo: string;
  valor: number;
  canjeable: boolean;
}


@Component({
  selector: 'app-ver-detalle-cliente-admi',
  standalone: false,
  templateUrl: './ver-detalle-cliente-admi.component.html',
  styleUrls: ['./ver-detalle-cliente-admi.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class VerDetalleClienteAdmiComponent implements OnInit {
  clienteId: number = 0;
  cliente: Cliente | null = null;
  compras: Compra[] = [];
  puntos: Punto[] = [];
  
  // Pestaña activa
activeTab: number = 0;
  
  // Dialogs
  mostrarDialogCompra: boolean = false;
  mostrarDialogPunto: boolean = false;
  compraSeleccionada: Compra | null = null;
  puntoSeleccionado: Punto | null = null;
  
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatosCliente();
    this.cargarHistorialCompras();
    this.cargarHistorialPuntos();
  }

  cargarDatosCliente(): void {
    this.loading = true;
    
    // Simulación de datos
    setTimeout(() => {
      this.cliente = {
        id: this.clienteId,
        nombres: 'Roberto',
        apellidos: 'Meriño Rodriguez Gómez',
        email: 'roberto@meriño.com',
        docIdentidad: '85868475',
        edad: 18,
        telefono: '986734786',
        departamento: 'Lima',
        distrito: 'Lima',
        direccion: 'Calle siempre viva'
      };
      this.loading = false;
    }, 500);
  }

  cargarHistorialCompras(): void {
    // Simulación de historial de compras
    this.compras = [
      {
        id: 1,
        nombreEvento: 'Concierto Buba',
        local: 'Estadio San Marcod',
        fechaCompra: '15/07/2024',
        nombreCliente: 'Roberto Meriño',
        evento: 'Concierto Buba',
        tipoEntrada: 'General',
        categoriaEntrada: 'VIP',
        correoElectronico: 'roberto@meriño.com',
        cuponesUtilizados: 'DESCUENTO20',
        descuento: 20,
        metodoPago: 'Tarjeta',
        cantidadTickets: 2,
        precioTotal: 450.00
      },
      {
        id: 2,
        nombreEvento: 'Concierto Miguel',
        local: 'Estadio Monumental',
        fechaCompra: '19/09/2020',
        nombreCliente: 'Roberto Meriño',
        evento: 'Concierto Miguel',
        tipoEntrada: 'General',
        categoriaEntrada: 'Platinium',
        correoElectronico: 'roberto@meriño.com',
        cuponesUtilizados: 'NINGUNO',
        descuento: 0,
        metodoPago: 'Efectivo',
        cantidadTickets: 1,
        precioTotal: 350.00
      },
      {
        id: 3,
        nombreEvento: 'Concierto Shakira',
        local: 'Estadio Nacional',
        fechaCompra: '10/09/2025',
        nombreCliente: 'Roberto Meriño',
        evento: 'Concierto Shakira',
        tipoEntrada: 'General',
        categoriaEntrada: 'General',
        correoElectronico: 'roberto@meriño.com',
        cuponesUtilizados: 'NINGUNO',
        descuento: 0,
        metodoPago: 'Yape',
        cantidadTickets: 3,
        precioTotal: 180.00
      },
      {
        id: 4,
        nombreEvento: 'Concierto Shakira',
        local: 'Estadio Nacional',
        fechaCompra: '10/09/2025',
        nombreCliente: 'Roberto Meriño',
        evento: 'Concierto Shakira',
        tipoEntrada: 'General',
        categoriaEntrada: 'General',
        correoElectronico: 'roberto@meriño.com',
        cuponesUtilizados: 'PRIMERACOMPRA',
        descuento: 15,
        metodoPago: 'Tarjeta',
        cantidadTickets: 1,
        precioTotal: 85.00
      }
    ];
  }

  cargarHistorialPuntos(): void {
    // Simulación de historial de puntos
    this.puntos = [
      {
        id: 1,
        estatus: 'Ganado',
        puntos: 100,
        fecha: '10/09/2025',
        cliente: 'Roberto Meriño',
        tipo: 'Compra',
        valor: 100,
        canjeable: true
      },
      {
        id: 3,
        estatus: 'Canjeado',
        puntos: 100,
        fecha: '09/09/2020',
        cliente: 'Roberto Meriño',
        tipo: 'Canje',
        valor: -100,
        canjeable: false
      },
      {
        id: 4,
        estatus: 'Ganado',
        puntos: 20,
        fecha: '08/09/2002',
        cliente: 'Roberto Meriño',
        tipo: 'Referido',
        valor: 20,
        canjeable: true
      },
      {
        id: 5,
        estatus: 'Ganado',
        puntos: 20,
        fecha: '07/09/2025',
        cliente: 'Roberto Meriño',
        tipo: 'Bono',
        valor: 20,
        canjeable: true
      }
    ];
  }

  verDetalleCompra(compra: Compra): void {
    this.compraSeleccionada = compra;
    this.mostrarDialogCompra = true;
  }

  verDetallePunto(punto: Punto): void {
    this.puntoSeleccionado = punto;
    this.mostrarDialogPunto = true;
  }

  confirmarEliminacionCompra(compra: Compra): void {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar este registro de compra?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.eliminarCompra(compra);
      }
    });
  }

  eliminarCompra(compra: Compra): void {
    this.compras = this.compras.filter(c => c.id !== compra.id);
    this.messageService.add({
      severity: 'success',
      summary: 'Registro eliminado',
      detail: 'El registro de compra ha sido eliminado correctamente'
    });
  }

  confirmarEliminacionPunto(punto: Punto): void {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar este registro de puntos?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.eliminarPunto(punto);
      }
    });
  }

  eliminarPunto(punto: Punto): void {
    this.puntos = this.puntos.filter(p => p.id !== punto.id);
    this.messageService.add({
      severity: 'success',
      summary: 'Registro eliminado',
      detail: 'El registro de puntos ha sido eliminado correctamente'
    });
  }

  volver(): void {
    this.router.navigate(['/administrador/gestionClientes']);
  }

  getEstatusSeverity(estatus: string): string {
    switch(estatus.toLowerCase()) {
      case 'ganado': return 'success';
      case 'canjeado': return 'danger';
      default: return 'info';
    }
  }
}
