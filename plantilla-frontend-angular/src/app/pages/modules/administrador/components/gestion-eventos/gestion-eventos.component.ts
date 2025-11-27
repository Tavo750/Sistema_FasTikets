import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { Data as EventoData } from '../../interfaces/gestion-evento/evento.interface';
import { baseUrl } from '../../../../../global';
import { LoadingService } from '../../../../../shared/services/loading.service';

interface TipoConcierto {
  label: string;
  value: string;
}

interface Evento {
  idEvento: number;
  nombre: string;
  tipoEvento: string;
  fechaEvento: Date;
  fechaFinEvento?: Date;
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

  // Variables para el dashboard de analytics
  mostrarDashboard: boolean = false;
  analyticsData: any = {};

  constructor(
    private router: Router,
    private eventoService: EventoService,
    private loadingService: LoadingService
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
    this.loadingService.show();
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
              fechaEvento: this.convertirFechaLocal(evento.fechaEvento.toString()),
              fechaFinEvento: evento.fechaFinEvento ? this.convertirFechaLocal(evento.fechaFinEvento.toString()) : undefined,
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

        this.loadingService.hide();
        this.cargando = false;

        console.log('Eventos cargados:', this.eventos);
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        this.eventos = [];
        this.eventosFiltrados = [];
        this.loadingService.hide();
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

  /**
   * Convierte una fecha string a Date local sin problemas de zona horaria
   * Evita que reste un día al convertir
   */
  convertirFechaLocal(fechaString: string): Date {
    // Separar la fecha en partes (YYYY-MM-DD)
    const [year, month, day] = fechaString.split('-').map(Number);
    // Crear fecha local (mes es 0-indexed en JS)
    return new Date(year, month - 1, day);
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
            fechaEvento: this.convertirFechaLocal(response.data.fechaEvento.toString()),
            fechaFinEvento: (response.data as any).fechaFinEvento ? this.convertirFechaLocal((response.data as any).fechaFinEvento.toString()) : undefined,
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

  abrirDashboard() {
    this.calcularAnalytics();
    this.mostrarDashboard = true;
  }

  cerrarDashboard() {
    this.mostrarDashboard = false;
    this.analyticsData = {};
  }

  calcularAnalytics() {
    const ahora = new Date();

    // Calcular métricas básicas
    const eventosActivos = this.eventos.filter(e => e.estadoEvento === 'PUBLICADO' || e.estadoEvento === 'ACTIVO');
    const eventosFinalizados = this.eventos.filter(e => e.estadoEvento === 'COMPLETADO' || e.estadoEvento === 'FINALIZADO');
    const eventosCancelados = this.eventos.filter(e => e.estadoEvento === 'CANCELADO');
    const eventosProximos = this.eventos.filter(e => new Date(e.fechaEvento) > ahora);

    // Top 3 eventos por menor aforo disponible (más vendidos)
    const top3EventosMasVendidos = this.eventos
      .filter(e => e.estadoEvento !== 'CANCELADO')
      .sort((a, b) => a.aforoDisponible - b.aforoDisponible)
      .slice(0, 3);

    // Eventos por tipo
    const eventosPorTipo = this.agruparPorTipo();

    // Próximos eventos (siguiente semana)
    const proximosEventos = this.eventos
      .filter(e => {
        const fechaEvento = new Date(e.fechaEvento);
        const unaSemana = new Date();
        unaSemana.setDate(unaSemana.getDate() + 7);
        return fechaEvento > ahora && fechaEvento <= unaSemana;
      })
      .sort((a, b) => new Date(a.fechaEvento).getTime() - new Date(b.fechaEvento).getTime())
      .slice(0, 5);

    // Capacidad total y ocupada
    const capacidadTotal = this.eventos
      .filter(e => e.estadoEvento !== 'CANCELADO')
      .reduce((total, evento) => {
        // Asumimos que la capacidad total es aforo disponible + vendidos (simulado)
        const capacidadEvento = evento.aforoDisponible + Math.floor(evento.aforoDisponible * 0.3); // Simulamos 30% vendido
        return total + capacidadEvento;
      }, 0);

    const aforoDisponibleTotal = this.eventos
      .filter(e => e.estadoEvento !== 'CANCELADO')
      .reduce((total, evento) => total + evento.aforoDisponible, 0);

    const ocupacionEstimada = capacidadTotal > 0 ? ((capacidadTotal - aforoDisponibleTotal) / capacidadTotal * 100) : 0;

    this.analyticsData = {
      // KPIs principales
      totalEventos: this.eventos.length,
      eventosActivos: eventosActivos.length,
      eventosFinalizados: eventosFinalizados.length,
      eventosCancelados: eventosCancelados.length,
      eventosProximos: eventosProximos.length,

      // Top eventos
      top3Eventos: top3EventosMasVendidos,

      // Distribuciones
      eventosPorTipo: eventosPorTipo,
      proximosEventos: proximosEventos,

      // Métricas de capacidad
      capacidadTotal: capacidadTotal,
      aforoDisponible: aforoDisponibleTotal,
      ocupacionEstimada: Math.round(ocupacionEstimada),

      // Ingresos estimados (simulado)
      ingresosEstimados: this.calcularIngresosEstimados()
    };

    console.log('📊 Analytics calculados:', this.analyticsData);
  }

  agruparPorTipo() {
    return this.eventos.reduce((acc, evento) => {
      const tipo = evento.tipoEvento || 'Sin categoría';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  calcularIngresosEstimados() {
    // Simulamos ingresos basados en el aforo y tipo de evento
    const preciosPromedio: Record<string, number> = {
      'ROCK': 120,
      'METAL': 100,
      'PUNK': 80,
      'POP': 150,
      'REGGAE': 90,
      'REGGAETON': 140,
      'ELECTRONICA': 160,
      'ROCK_POP': 130,
      'URBANO': 110
    };

    return this.eventos
      .filter(e => e.estadoEvento !== 'CANCELADO')
      .reduce((total, evento) => {
        const precioPromedio = preciosPromedio[evento.tipoEvento] || 100;
        const ventasEstimadas = Math.floor((evento.aforoDisponible || 0) * 0.3); // 30% de ocupación estimada
        return total + (ventasEstimadas * precioPromedio);
      }, 0);
  }

  obtenerColorTipo(tipo: string): string {
    const colores: Record<string, string> = {
      'ROCK': '#e74c3c',
      'METAL': '#34495e',
      'PUNK': '#9b59b6',
      'POP': '#f39c12',
      'REGGAE': '#27ae60',
      'REGGAETON': '#e67e22',
      'ELECTRONICA': '#3498db',
      'ROCK_POP': '#e91e63',
      'URBANO': '#ff9800'
    };
    return colores[tipo] || '#95a5a6';
  }

  // Métodos auxiliares para el template del dashboard
  getStringValue(value: unknown): string {
    return String(value || '');
  }

  getNumberValue(value: unknown): number {
    return Number(value) || 0;
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
    return `${baseUrl.replace('/api/v1', '')}${imagenUrl}`;
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
