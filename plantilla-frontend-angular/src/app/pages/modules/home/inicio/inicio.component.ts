import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evento } from './interfaces/inicio/evento.interface';
import { EventoService } from '../../administrador/services/evento.service';
import { Data } from '../../administrador/interfaces/gestion-evento/evento.interface';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  standalone: false,
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})

export class InicioComponent implements OnInit {
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  categorias: string[] = ['Rock', 'Rock and Pop', 'Reggae', 'Pop', 'Punk', 'Reguetón', 'Jazz'];
  ubicaciones: string[] = ['Arena 1 - Cúpula', 'Arena 2', 'Arena 3', 'Movistar Arena'];
  paginaActual: number = 1;
  eventosPorPagina: number = 6;
  cargandoEventos: boolean = false;

  // Nuevas propiedades para PrimeNG
  categoriasDropdown: DropdownOption[] = [];
  ubicacionesDropdown: DropdownOption[] = [];
  ordenarOpciones: DropdownOption[] = [
    { label: 'Relevancia', value: 'relevancia' },
    { label: 'Fecha (Más próximo)', value: 'fecha-asc' },
    { label: 'Fecha (Más lejano)', value: 'fecha-desc' },
    { label: 'Precio (Menor a Mayor)', value: 'precio-asc' },
    { label: 'Precio (Mayor a Menor)', value: 'precio-desc' },
    { label: 'Nombre (A-Z)', value: 'nombre-asc' },
    { label: 'Nombre (Z-A)', value: 'nombre-desc' }
  ];

  // Variables de filtros
  categoriaSeleccionada: string | null = null;
  ubicacionSeleccionada: string | null = null;
  fechaSeleccionada: Date | null = null;
  ordenSeleccionado: string = 'relevancia';

  constructor(
    private router: Router,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  inicializarDropdowns(): void {
    // Extraer categorías únicas de los eventos cargados
    const categoriasUnicas = [...new Set(this.eventos.map(evento => evento.categoria))];
    this.categoriasDropdown = categoriasUnicas.map(cat => ({ label: cat, value: cat }));

    // Extraer ubicaciones únicas de los eventos cargados
    const ubicacionesUnicas = [...new Set(this.eventos.map(evento => evento.lugar))];
    this.ubicacionesDropdown = ubicacionesUnicas.map(ub => ({ label: ub, value: ub }));
  }

  cargarEventos() {
    this.cargandoEventos = true;

    this.eventoService.getListarEventos().subscribe({
      next: (response) => {
        this.cargandoEventos = false;

        if (response.ok && response.data) {
          let eventosData: Data[] = [];

          // Si response.data es un array
          if (Array.isArray(response.data)) {
            eventosData = response.data;
          }
          // Si response.data es un objeto único
          else {
            eventosData = [response.data];
          }

          // Filtrar solo eventos con estadoEvento = 'PUBLICADO'
          const eventosPublicados = eventosData.filter(evento => evento.estadoEvento === 'PUBLICADO');

          this.eventos = eventosPublicados.map(evento => this.mapearEventoData(evento));
          this.eventosFiltrados = [...this.eventos];
          this.inicializarDropdowns();
          this.aplicarOrden();
        } else {
          console.error('Error al cargar eventos:', response.mensaje);
          // Mantener eventos de ejemplo como fallback
          this.cargarEventosEjemplo();
        }
      },
      error: (error) => {
        this.cargandoEventos = false;
        console.error('Error al cargar eventos:', error);
        // Mantener eventos de ejemplo como fallback en caso de error
        this.cargarEventosEjemplo();
      }
    });
  }

  private mapearEventoData(eventoData: Data): Evento {
    return {
      id: eventoData.idEvento,
      nombre: eventoData.nombre,
      fecha: this.formatearFecha(eventoData.fechaEvento),
      lugar: eventoData.nombreLocal || 'Lugar no especificado',
      categoria: eventoData.tipoEvento,
      precio: this.obtenerPrecioDesde(eventoData.idEvento), // Precio dinámico o valor por defecto
      imagen: eventoData.imagenUrl || this.generarImagenPlaceholder(eventoData.nombre)
    };
  }

  private obtenerPrecioDesde(idEvento: number): number {
    // Por ahora retornamos un precio base
    // Aquí podrías hacer una llamada al servicio para obtener el precio mínimo de las entradas
    // this.eventoService.getListarEntradasPorEvento(idEvento) - si existiera este método
    return 100; // Precio base temporal
  }

  private generarImagenPlaceholder(nombreEvento: string): string {
    return `https://via.placeholder.com/400x200/dc2626/ffffff?text=${encodeURIComponent(nombreEvento)}`;
  }

  private formatearFecha(fecha: Date): string {
    const fechaObj = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long'
    };
    return fechaObj.toLocaleDateString('es-ES', opciones);
  }

  private cargarEventosEjemplo() {
    this.eventos = [
      { id: 1, nombre: 'UB40', fecha: '11 de Septiembre', lugar: 'Arena 1 - Cúpula', categoria: 'Reggae', precio: 100, imagen: 'https://via.placeholder.com/400x200/dc2626/ffffff?text=UB40' },
      { id: 2, nombre: 'Banda', fecha: '30 de Septiembre', lugar: 'Arena 2', categoria: 'Rock and Pop', precio: 100, imagen: 'https://via.placeholder.com/400x200/dc2626/ffffff?text=Rock+Band' },
      { id: 3, nombre: 'Banda 3', fecha: '3 de Octubre', lugar: 'Movistar Arena', categoria: 'Rock', precio: 180, imagen: 'https://via.placeholder.com/400x200/dc2626/ffffff?text=Rock+Festival' },
      { id: 4, nombre: 'Agrupación 1', fecha: '15 de Octubre', lugar: 'Arena 1', categoria: 'Pop', precio: 120, imagen: 'https://via.placeholder.com/400x200/dc2626/ffffff?text=Pop+Concert' },
      { id: 5, nombre: 'Agrupación 2', fecha: '21 de Octubre', lugar: 'Arena 3', categoria: 'Punk', precio: 150, imagen: 'https://via.placeholder.com/400x200/dc2626/ffffff?text=Punk+Show' },
      { id: 6, nombre: 'Agrupación 3', fecha: '31 de Octubre', lugar: 'Arena 2', categoria: 'Reguetón', precio: 200, imagen: 'https://via.placeholder.com/400x200/dc2626/ffffff?text=Reggaeton+Night' },
      { id: 7, nombre: 'Festival de Verano', fecha: '5 de Noviembre', lugar: 'Arena 1 - Cúpula', categoria: 'Rock', precio: 220, imagen: 'https://via.placeholder.com/400x200/dc2626/ffffff?text=Summer+Festival' },
      { id: 8, nombre: 'Noche de Jazz', fecha: '12 de Noviembre', lugar: 'Movistar Arena', categoria: 'Jazz', precio: 90, imagen: 'https://via.placeholder.com/400x200/dc2626/ffffff?text=Jazz+Night' },
    ];
    this.eventosFiltrados = [...this.eventos];
    this.inicializarDropdowns();
    this.aplicarOrden();
  }

  // Métodos de filtrado
  filtrarPorCategoria(categoria: string | null) {
    this.categoriaSeleccionada = categoria;
    this.aplicarFiltros();
  }

  filtrarPorUbicacion(ubicacion: string | null) {
    this.ubicacionSeleccionada = ubicacion;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.eventosFiltrados = this.eventos.filter(evento => {
      const cumpleCategoria = !this.categoriaSeleccionada || evento.categoria === this.categoriaSeleccionada;
      const cumpleUbicacion = !this.ubicacionSeleccionada || evento.lugar === this.ubicacionSeleccionada;
      // Aquí se podría agregar filtro por fecha si es necesario
      return cumpleCategoria && cumpleUbicacion;
    });

    this.aplicarOrden();
    this.paginaActual = 1;
  }

  ordenarEventos(orden: string) {
    this.ordenSeleccionado = orden;
    this.aplicarOrden();
  }

  aplicarOrden() {
    switch (this.ordenSeleccionado) {
      case 'precio-asc':
        this.eventosFiltrados.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        this.eventosFiltrados.sort((a, b) => b.precio - a.precio);
        break;
      case 'nombre-asc':
        this.eventosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre-desc':
        this.eventosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'fecha-asc':
      case 'fecha-desc':
        // Implementar ordenamiento por fecha si es necesario
        break;
      default:
        // Relevancia - mantener orden original
        break;
    }
  }

  getCategorySeverity(categoria: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined {
    const severityMap: { [key: string]: "success" | "info" | "warn" | "danger" | "secondary" | "contrast" } = {
      'Rock': 'danger',
      'Rock and Pop': 'warn',
      'Reggae': 'success',
      'Pop': 'info',
      'Punk': 'secondary',
      'Reguetón': 'contrast',
      'Jazz': 'info'
    };
    return severityMap[categoria] || 'info';
  }

  obtenerEventosPagina(): Evento[] {
    const inicio = (this.paginaActual - 1) * this.eventosPorPagina;
    return this.eventosFiltrados.slice(inicio, inicio + this.eventosPorPagina);
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
  }

  onPageChange(event: any) {
    this.paginaActual = (event.first / event.rows) + 1;
  }

  goToEvento(eventoId?: number): void {
    if (eventoId) {
      this.router.navigate(['/home/evento', eventoId]);
    } else {
      this.router.navigate(['/home/evento']);
    }
  }

  comprarEvento(evento: Evento): void {
    // Navegar a la página de compra con el ID del evento real
    console.log('Comprando evento:', evento.nombre, 'ID:', evento.id);
    this.router.navigate(['/home/evento', evento.id]);
  }

  limpiarFiltros(): void {
    this.categoriaSeleccionada = null;
    this.ubicacionSeleccionada = null;
    this.fechaSeleccionada = null;
    this.ordenSeleccionado = 'relevancia';
    this.eventosFiltrados = [...this.eventos];
    this.aplicarOrden();
    this.paginaActual = 1;
  }

  recargarEventos(): void {
    this.cargarEventos();
  }
}
