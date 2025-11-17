import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { Data as EventoData } from '../../interfaces/gestion-evento/evento.interface';

interface TipoConcierto {
  label: string;
  value: string;
}

interface Evento {
  idEvento: number;
  nombre: string;
  tipoEvento: string;
  fechaEvento: Date;
  nombreLocal: string;
  aforoDisponible: number;
  estadoEvento: string;
  descripcion: string;
  horaInicio: string;
  horaFin: string;
  // Campos adicionales para detalles completos
  imagenUrl?: string;
  imagenZonasUrl?: string;
  restricciones?: string;
  politicasDevolucion?: string;
  menoresDeEdadPermitidos?: boolean;
  idLocal?: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

@Component({
  selector: 'app-gestion-eventos',
  standalone: false,
  templateUrl: './gestion-eventos.component.html',
  styleUrl: './gestion-eventos.component.css'
})
export class GestionEventosComponent implements OnInit {
  tiposConcierto: TipoConcierto[] = [];
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  terminoBusqueda: string = '';
  tipoSeleccionado: TipoConcierto | null = null;
  cargando: boolean = false;
  
  // Variables para el modal de detalles
  mostrarModalDetalles: boolean = false;
  eventoSeleccionado: Evento | null = null;
  cargandoDetalles: boolean = false;

  constructor(
    private router: Router,
    private eventoService: EventoService
  ) {}

  ngOnInit() {
    this.tiposConcierto = [
      { label: 'Todos los tipos', value: 'ALL' },
      { label: 'Punk', value: 'PUNK' },
      { label: 'Rock', value: 'ROCK' },
      { label: 'Metal', value: 'METAL' },
      { label: 'Pop', value: 'POP' },
      { label: 'Reggae', value: 'REGGAE' },
      { label: 'Reggaetón', value: 'REGGAETON' },
      { label: 'Electrónica', value: 'ELECTRONICA' },
      { label: 'Rock Pop', value: 'ROCK_POP' },
      { label: 'Urbano', value: 'URBANO' }
    ];


    console.log('holaaa...');
    this.cargarEventos();
    console.log('holaaa...');
  }

  cargarEventos() {
    this.cargando = true;
    this.eventoService.getListarEventos().subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          // Si data es un array
          if (Array.isArray(response.data)) {
            this.eventos = response.data.map((evento: EventoData) => ({
              idEvento: evento.idEvento,
              nombre: evento.nombre,
              tipoEvento: evento.tipoEvento,
              fechaEvento: new Date(evento.fechaEvento),
              nombreLocal: evento.nombreLocal,
              aforoDisponible: evento.aforoDisponible,
              estadoEvento: evento.estadoEvento,
              descripcion: evento.descripcion,
              horaInicio: evento.horaInicio,
              horaFin: evento.horaFin
            }));
          } else {
            // Si data es un objeto único
            this.eventos = [{
              idEvento: response.data.idEvento,
              nombre: response.data.nombre,
              tipoEvento: response.data.tipoEvento,
              fechaEvento: new Date(response.data.fechaEvento),
              nombreLocal: response.data.nombreLocal,
              aforoDisponible: response.data.aforoDisponible,
              estadoEvento: response.data.estadoEvento,
              descripcion: response.data.descripcion,
              horaInicio: response.data.horaInicio,
              horaFin: response.data.horaFin
            }];
          }

          console.log('Eventos cargados:', this.eventos);
          this.eventosFiltrados = [...this.eventos];
        }

        this.cargando = false;

        console.log('Eventos cargados:', this.eventos);
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        this.eventos = [];
        this.eventosFiltrados = [];
        this.cargando = false;
      }
    });
  }

  onBusquedaChange() {
    //this.filtrarEventos();
  }

  onTipoChange() {
    //this.filtrarEventos();
  }

  getEstadoSeverity(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'completado':
      case 'activo':
        return 'success';
      case 'próximo':
      case 'programado':
        return 'info';
      case 'vendido':
      case 'agotado':
        return 'warning';
      case 'cancelado':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  formatearMoneda(cantidad: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(cantidad);
  }

  formatearNumero(numero: number): string {
    return new Intl.NumberFormat('es-PE').format(numero);
  }

  generarReporte(evento: Evento) {
    console.log('Descargando reporte de ventas para:', evento.nombre);
    
    this.eventoService.descargarReporteVentasPDF(evento.idEvento)
      .subscribe({
        next: (blob: Blob) => {
          // Crear URL temporal para el blob
          const url = window.URL.createObjectURL(blob);
          
          // Crear elemento 'a' para forzar la descarga
          const link = document.createElement('a');
          link.href = url;
          
          // Generar nombre del archivo con fecha actual
          const fechaActual = new Date().toISOString().split('T')[0];
          const nombreArchivo = `reporte-ventas-${evento.nombre.replace(/\s+/g, '-')}-${fechaActual}.pdf`;
          link.download = nombreArchivo;
          
          // Simular click para descargar
          document.body.appendChild(link);
          link.click();
          
          // Limpiar
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          console.log('✅ Reporte descargado exitosamente:', nombreArchivo);
        },
        error: (error) => {
          console.error('❌ Error al descargar reporte:', error);
          // Aquí podrías agregar un toast o mensaje de error para el usuario
          alert('Error al descargar el reporte. Por favor, inténtelo de nuevo.');
        }
      });
  }

  verDetalles(evento: Evento) {
    console.log('Cargando detalles completos para:', evento.nombre);
    this.cargandoDetalles = true;
    this.mostrarModalDetalles = true;
    
    // Cargar detalles completos del evento
    this.eventoService.getEventoPorId(evento.idEvento).subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          // Mapear los datos completos del evento
          this.eventoSeleccionado = {
            idEvento: response.data.idEvento,
            nombre: response.data.nombre,
            descripcion: response.data.descripcion,
            tipoEvento: response.data.tipoEvento,
            fechaEvento: new Date(response.data.fechaEvento),
            horaInicio: response.data.horaInicio,
            horaFin: response.data.horaFin,
            estadoEvento: response.data.estadoEvento,
            aforoDisponible: response.data.aforoDisponible,
            nombreLocal: response.data.nombreLocal,
            imagenUrl: response.data.imagenUrl,
            imagenZonasUrl: response.data.imagenZonasUrl,
            // Campos que pueden no existir en el backend - usar valores por defecto
            restricciones: (response.data as any).restricciones || 'No especificadas',
            politicasDevolucion: (response.data as any).politicasDevolucion || 'No especificadas',
            menoresDeEdadPermitidos: (response.data as any).menoresDeEdadPermitidos || false,
            idLocal: response.data.idLocal,
            fechaCreacion: response.data.fechaCreacion ? new Date(response.data.fechaCreacion) : undefined,
            fechaActualizacion: (response.data as any).fechaActualizacion ? new Date((response.data as any).fechaActualizacion) : undefined
          };
          
          console.log('✅ Detalles del evento cargados:', this.eventoSeleccionado);
        }
        this.cargandoDetalles = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar detalles del evento:', error);
        this.cargandoDetalles = false;
        this.mostrarModalDetalles = false;
        // Mostrar mensaje de error al usuario
        alert('Error al cargar los detalles del evento. Por favor, inténtelo de nuevo.');
      }
    });
  }

  agregarEvento() {
    console.log('Agregando evento...');
  }

  refrescarEventos() {
    this.cargarEventos();
  }

  editarEvento(idEvento: number) {
    this.router.navigate(['/administrador/gestionEventos/editar', idEvento]);
  }

  crearEvento(idEvento: number){
    this.router.navigate(['/administrador/gestionEventos/crear', idEvento]);
  }

  // Métodos para el modal de detalles
  cerrarModalDetalles() {
    this.mostrarModalDetalles = false;
    this.eventoSeleccionado = null;
    this.cargandoDetalles = false;
  }

  obtenerUrlImagen(imagenUrl: string | undefined): string {
    if (!imagenUrl) {
      return 'assets/img/evento-placeholder.jpg';
    }
    
    // Si ya es una URL completa, devolverla tal como está
    if (imagenUrl.startsWith('http')) {
      return imagenUrl;
    }
    
    // Si es una ruta relativa, construir la URL completa
    return `http://localhost:8081${imagenUrl}`;
  }

  formatearFecha(fecha: Date | undefined): string {
    if (!fecha) return 'No disponible';
    
    return new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }).format(fecha);
  }

  formatearFechaCorta(fecha: Date | undefined): string {
    if (!fecha) return 'No disponible';
    
    return new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(fecha);
  }

  // Métodos para manejo de errores de imagen
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/img/evento-placeholder.jpg';
    }
  }

  onImageZonasError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }
}
