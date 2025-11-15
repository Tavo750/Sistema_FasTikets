import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { GestionClientesService } from '../../../services/gestion-clientes.service';
import { AyudaSoporteService } from '../../../../usuario/services/ayuda-soporte.service';
import { AyudaSoporteListItem } from '../../../../usuario/interfaces/ayuda-soporte/ayuda-soporte-listar.interface';

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
  fechaNacimiento: string;
  nivel: string;
  puntosAcumulados: number;
  fechaCreacion: string;
  departamento?: string;
  distrito?: string;
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
  // Ayuda y soporte
  solicitudes: AyudaSoporteListItem[] = [];
  loadingSolicitudes: boolean = false;
  mostrarDialogSolicitud: boolean = false;
  solicitudSeleccionada: AyudaSoporteListItem | null = null;
  // Editar observación
  mostrarDialogModificar: boolean = false;
  solicitudParaEditar: AyudaSoporteListItem | null = null;
  editarObservacion: string = '';
  loadingModificar: boolean = false;
  // Filtros para Ayuda y soporte (barra superior)
  filterAsunto: string = '';
  filterEstado: string | null = null;
  filterFechaDesde: Date | null = null;
  filterFechaHasta: Date | null = null;
  estadoFilterOptions = [
    { label: 'Todos', value: null },
    { label: 'ABIERTO', value: 'ABIERTO' },
    { label: 'RESUELTO', value: 'RESUELTO' },
    { label: 'CERRADO', value: 'CERRADO' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private gestionClientesService: GestionClientesService,
    private ayudaSoporteService: AyudaSoporteService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.clienteId = Number(idParam);
      console.log('ID del cliente:', this.clienteId); // Para debugging
      this.cargarDatosCliente();
      // Solo cargar el historial si tenemos un ID válido
      if (this.clienteId > 0) {
        this.cargarHistorialCompras();
        this.cargarHistorialPuntos();
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se proporcionó un ID de cliente válido'
      });
      this.router.navigate(['/admin/gestion-clientes']);
    }
  }

  estatusOptions = [
    { label: 'Ganado', value: 'Ganado' },
    { label: 'Canjeado', value: 'Canjeado' }
  ];

  obtenerDepartamento(direccion: string): string {
    const partes = direccion.split(',');
    return partes.length > 1 ? partes[partes.length - 1].trim() : 'Lima';
  }

  obtenerDistrito(direccion: string): string {
    const partes = direccion.split(',');
    return partes.length > 1 ? partes[partes.length - 2].trim() : direccion.split(' ')[0];
  }

  cargarDatosCliente(): void {
    if (!this.clienteId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de cliente no válido'
      });
      return;
    }

    this.loading = true;
    
    this.gestionClientesService.getListarGestionClientesPorId(this.clienteId)
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response && response.ok && response.data) {
            const clienteData = response.data;
            try {
              this.cliente = {
                idCliente: clienteData.idCliente,
                nombres: clienteData.nombres || '',
                apellidos: clienteData.apellidos || '',
                email: clienteData.email || '',
                docIdentidad: clienteData.docIdentidad || '',
                edad: clienteData.edad || 0,
                telefono: clienteData.telefono || '',
                tipoDocumento: clienteData.tipoDocumento || '',
                direccion: clienteData.direccion || '',
                fechaNacimiento: clienteData.fechaNacimiento ? new Date(clienteData.fechaNacimiento).toISOString().split('T')[0] : '',
                nivel: clienteData.nivel || '',
                puntosAcumulados: clienteData.puntosAcumulados || 0,
                fechaCreacion: clienteData.fechaCreacion ? new Date(clienteData.fechaCreacion).toISOString().split('T')[0] : '',
                departamento: this.obtenerDepartamento(clienteData.direccion || ''),
                distrito: this.obtenerDistrito(clienteData.direccion || '')
              };
              
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Datos del cliente cargados correctamente'
              });
            } catch (e) {
              console.error('Error al procesar datos del cliente:', e);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al procesar los datos del cliente'
              });
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.mensaje || 'No se pudieron cargar los datos del cliente'
            });
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al cargar datos del cliente:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los datos del cliente'
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
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
    // Cargar historial real desde el servicio
    this.gestionClientesService.getHistorialPuntosPorCliente(this.clienteId)
      .subscribe({
        next: (res) => {
          if (res && res.ok) {
            const serverData = res.data || [];
            if (serverData.length === 0) {
              // Mostrar notificación si está vacío
              this.messageService.add({
                severity: 'info',
                summary: 'Sin registros',
                detail: 'No hay puntos registrados para este cliente'
              });
              this.puntos = [];
              return;
            }

            // Mapear la respuesta del backend a la estructura que usa la plantilla
            this.puntos = serverData.map(p => ({
              // mantener propiedades originales del backend
              idPuntos: p.idPuntos,
              cantPuntos: p.cantPuntos,
              tipoTransaccion: p.tipoTransaccion,
              fechaTransaccion: p.fechaTransaccion,
              fechaVencimiento: p.fechaVencimiento,
              idRegla: p.idRegla,
              activo: p.activo,
              idCliente: p.idCliente,
              // mantener propiedades usadas por la UI anterior para compatibilidad
              id: p.idPuntos,
              estatus: p.tipoTransaccion ? (p.tipoTransaccion.toLowerCase() === 'ganado' ? 'Ganado' : (p.tipoTransaccion.toLowerCase() === 'canjeado' ? 'Canjeado' : p.tipoTransaccion)) : 'Desconocido',
              puntos: p.cantPuntos,
              fecha: p.fechaTransaccion ? new Date(p.fechaTransaccion).toLocaleDateString() : '',
              cliente: '',
              tipo: p.tipoTransaccion || '',
              valor: p.cantPuntos,
              canjeable: (p.tipoTransaccion ? p.tipoTransaccion.toLowerCase() === 'ganado' : false)
            }));
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: res?.mensaje || 'No se pudo obtener el historial de puntos'
            });
          }
        },
        error: (err) => {
          console.error('Error al obtener historial de puntos:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar el historial de puntos'
          });
        }
      });
  }

    /**
     * Maneja el cambio de pestaña (p-tabView)
     */
    onTabChange(event: any): void {
      this.activeTab = event.index;
      // La nueva pestaña "Ayuda y soporte" será la índice 3 (0..3)
      if (this.activeTab === 3 && this.clienteId > 0) {
        this.cargarSolicitudes();
      }
    }

    cargarSolicitudes(): void {
      if (!this.clienteId) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'ID de cliente no válido para filtrar solicitudes' });
        return;
      }

      this.loadingSolicitudes = true;
      this.ayudaSoporteService.listarSolicitudes().subscribe({
        next: (res) => {
          this.loadingSolicitudes = false;
          if (res && res.ok && Array.isArray(res.data)) {
            // Filtrar solo las solicitudes pertenecientes al cliente actual (idUsuario === clienteId)
            this.solicitudes = res.data.filter(s => Number(s.idUsuario) === Number(this.clienteId));
            if (this.solicitudes.length === 0) {
              this.messageService.add({ severity: 'info', summary: 'Sin solicitudes', detail: 'No se encontraron solicitudes de soporte para este cliente' });
            }
          } else {
            this.solicitudes = [];
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: res?.mensaje || 'No se pudieron obtener las solicitudes' });
          }
        },
        error: (err) => {
          this.loadingSolicitudes = false;
          console.error('Error al cargar solicitudes de ayuda:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar las solicitudes de soporte' });
        }
      });
    }

    verSolicitud(solicitud: AyudaSoporteListItem): void {
      this.solicitudSeleccionada = solicitud;
      this.mostrarDialogSolicitud = true;
    }

    abrirModificarObservacion(solicitud: AyudaSoporteListItem): void {
      if (!solicitud || !solicitud.idSolicitud) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Solicitud inválida' });
        return;
      }
      this.loadingModificar = true; // usar como indicador temporal mientras cargamos el detalle
      this.ayudaSoporteService.obtenerPorId(Number(solicitud.idSolicitud)).subscribe({
        next: (res) => {
          this.loadingModificar = false;
          if (res && res.ok && res.data) {
            // cargar el ticket completo en solicitudParaEditar, y permitir sólo editar la observación
            this.solicitudParaEditar = res.data;
            this.editarObservacion = res.data.observaciones || '';
            this.mostrarDialogModificar = true;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: res?.mensaje || 'No se pudo obtener el detalle de la solicitud' });
          }
        },
        error: (err) => {
          this.loadingModificar = false;
          console.error('Error al obtener detalle de solicitud:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el detalle de la solicitud' });
        }
      });
    }

    guardarObservacion(): void {
      if (!this.solicitudParaEditar) return;
      const id = Number(this.solicitudParaEditar.idSolicitud);

      // Construir payload respetando los valores actuales del ticket y cambiando sólo observaciones y estado
      // Forzar estado RESUELTO en el objeto local antes de enviar
      this.solicitudParaEditar.estado = 'RESUELTO';

      const payload = {
        asunto: this.solicitudParaEditar.asunto,
        mensaje: this.solicitudParaEditar.mensaje,
        prioridad: this.solicitudParaEditar.prioridad,
        canalOrigen: this.solicitudParaEditar.canalOrigen,
        ipOrigen: this.solicitudParaEditar.ipOrigen,
        metadataAdicional: this.solicitudParaEditar.metadataAdicional || null,
        observaciones: this.editarObservacion || null,
        estado: 'RESUELTO'
      };

      this.loadingModificar = true;
      this.ayudaSoporteService.modificarEstadoSolicitud(id, payload).subscribe({
        next: (res) => {
          this.loadingModificar = false;
          if (res && res.ok && res.data) {
            // actualizar la lista localmente con el objeto devuelto por el servidor
            this.solicitudes = this.solicitudes.map(s => s.idSolicitud === res.data.idSolicitud ? res.data : s);
            // si el detalle abierto corresponde a este ticket, actualizarlo también
            if (this.solicitudSeleccionada && this.solicitudSeleccionada.idSolicitud === res.data.idSolicitud) {
              this.solicitudSeleccionada = res.data;
            }

            // Asegurarnos de sincronizar con el servidor: re-obtener el ticket actualizado
            this.ayudaSoporteService.obtenerPorId(id).subscribe({
              next: (fresh) => {
                if (fresh && fresh.ok && fresh.data) {
                  this.solicitudes = this.solicitudes.map(s => s.idSolicitud === fresh.data.idSolicitud ? fresh.data : s);
                  if (this.solicitudSeleccionada && this.solicitudSeleccionada.idSolicitud === fresh.data.idSolicitud) {
                    this.solicitudSeleccionada = fresh.data;
                  }
                }
              },
              error: (e) => {
                console.warn('No se pudo re-obtener el ticket tras actualización:', e);
              }
            });

            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: res.mensaje || 'Solicitud actualizada' });
            this.mostrarDialogModificar = false;
            this.solicitudParaEditar = null;
            this.editarObservacion = '';
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: res?.mensaje || 'No se pudo actualizar la solicitud' });
          }
        },
        error: (err) => {
          this.loadingModificar = false;
          console.error('Error al modificar observación:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la observación' });
        }
      });
    }

    // Retorna las solicitudes ya filtradas por los controles de la barra
    get filteredSolicitudes(): AyudaSoporteListItem[] {
      const asunto = (this.filterAsunto || '').toString().trim().toLowerCase();
      return this.solicitudes.filter(s => {
        // filtrar por asunto
        if (asunto) {
          const hayAsunto = (s.asunto || '').toString().toLowerCase().includes(asunto);
          if (!hayAsunto) return false;
        }
        // filtrar por estado
        if (this.filterEstado) {
          if ((s.estado || '').toString() !== this.filterEstado) return false;
        }
        // filtrar por fecha rango (si existen fechas)
        if (this.filterFechaDesde || this.filterFechaHasta) {
          const fechaStr = s.fechaCreacion;
          if (!fechaStr) return false;
          const fecha = new Date(fechaStr);
          if (this.filterFechaDesde && fecha < this.startOfDay(this.filterFechaDesde)) return false;
          if (this.filterFechaHasta && fecha > this.endOfDay(this.filterFechaHasta)) return false;
        }
        return true;
      });
    }

    applyFilters(): void {
      // Método placeholder por compatibilidad con el botón de filtro
      // La tabla usa el getter `filteredSolicitudes` así que los cambios en ngModel ya aplican.
    }

    clearFilters(): void {
      this.filterAsunto = '';
      this.filterEstado = null;
      this.filterFechaDesde = null;
      this.filterFechaHasta = null;
    }

    private startOfDay(d: Date): Date {
      const x = new Date(d);
      x.setHours(0,0,0,0);
      return x;
    }

    private endOfDay(d: Date): Date {
      const x = new Date(d);
      x.setHours(23,59,59,999);
      return x;
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
    if (!this.clienteId || !punto || !('id' in punto)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID de cliente o punto no válido' });
      return;
    }

    this.loading = true;
    this.gestionClientesService.eliminarPuntoPorCliente(this.clienteId, (punto as any).id)
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res && res.ok) {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: res.mensaje || 'Registro de puntos eliminado' });
            // recargar el historial desde el servidor
            this.cargarHistorialPuntos();
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: res?.mensaje || 'No se pudo eliminar el registro' });
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Error eliminando punto:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el registro de puntos' });
        }
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
