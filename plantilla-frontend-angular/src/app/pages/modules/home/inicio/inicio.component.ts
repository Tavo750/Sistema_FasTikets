import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Evento } from './interfaces/inicio/evento.interface';
import { EventoService } from '../../administrador/services/evento.service';
import { Data } from '../../administrador/interfaces/gestion-evento/evento.interface';
import { FavoritosService } from '../../../../core/services/favoritos.service';
import { MessageService } from 'primeng/api';
import { SearchService } from '../../../../shared/services/search.service';
import { SessionService } from '../../../../shared/services/session.service';
import { FavoritosStateService } from '../../../../shared/services/favoritos-state.service';
import { Subscription } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogTerminosComponent } from '../../../full-pages/crear-usuario/dialog-terminos/dialog-terminos.component';
import { DialogPoliticaComponent } from '../../../full-pages/crear-usuario/dialog-politica/dialog-politica.component';

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

export class InicioComponent implements OnInit, OnDestroy {
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  categorias: string[] = [];
  ubicaciones: string[] = [];
  paginaActual: number = 1;
  eventosPorPagina: number = 6;
  cargandoEventos: boolean = false;
  currentYear: number = new Date().getFullYear();
  imagenPorDefecto: string = 'img/logo/concierto.jpg';
  searchTerm: string = '';
  private searchSubscription!: Subscription;
  eventosFavoritos: Set<number> = new Set();

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
  
  // Variables para favoritos
  cargandoFavoritos: boolean = false;

  constructor(
    private router: Router,
    private eventoService: EventoService,
    private favoritosService: FavoritosService,
    private favoritosStateService: FavoritosStateService,
    private messageService: MessageService,
    private searchService: SearchService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.cargarFavoritos();
    this.cargarEventos();

    // Suscribirse a los cambios de búsqueda
    this.searchSubscription = this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.aplicarFiltros();
    });
    
    // Asegurar que el servicio de favoritos esté inicializado
    // Esto se hace automáticamente por la inyección de dependencias
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  inicializarDropdowns(): void {
    // Extraer categorías únicas de los eventos cargados
    const categoriasUnicas = [...new Set(this.eventos.map(evento => evento.categoria))];
    this.categorias = categoriasUnicas;
    this.categoriasDropdown = categoriasUnicas.map(cat => ({ label: cat, value: cat }));

    // Extraer ubicaciones únicas de los eventos cargados
    const ubicacionesUnicas = [...new Set(this.eventos.map(evento => evento.lugar))];
    this.ubicaciones = ubicacionesUnicas;
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

          // Filtrar solo eventos cuyo estadoEvento sea 'PUBLICADO'
          const eventosPublicados = eventosData.filter(evento => evento.estadoEvento === 'PUBLICADO');

          this.eventos = eventosPublicados.map(evento => this.mapearEventoData(evento));
          this.aplicarFiltros();
          this.inicializarDropdowns();
          this.aplicarOrden();
        } else {
          console.error('Error al cargar eventos:', response.mensaje);
          // No usar eventos en duro: dejar listas vacías y actualizar dropdowns
          this.eventos = [];
          this.eventosFiltrados = [];
          this.inicializarDropdowns();
        }
      },
      error: (error) => {
        this.cargandoEventos = false;
        console.error('Error al cargar eventos:', error);
        // No usar datos en duro como fallback; mostrar lista vacía
        this.eventos = [];
        this.eventosFiltrados = [];
        this.inicializarDropdowns();
      }
    });
  }

  private mapearEventoData(eventoData: Data): Evento {
    const imagenUrl = eventoData.imagenUrl || this.generarImagenPlaceholder(eventoData.nombre);
    console.log('Mapeando evento:', eventoData.nombre, 'Imagen URL:', imagenUrl);

    return {
      id: eventoData.idEvento,
      nombre: eventoData.nombre,
      fecha: this.formatearFecha(eventoData.fechaEvento),
      lugar: eventoData.nombreLocal || 'Lugar no especificado',
      categoria: eventoData.tipoEvento,
      precio: this.obtenerPrecioDesde(eventoData.idEvento), // Precio dinámico o valor por defecto
      imagen: imagenUrl,
      esFavorito: this.eventosFavoritos.has(eventoData.idEvento)
    };
  }

  private obtenerPrecioDesde(idEvento: number): number {
    // Por ahora retornamos un precio base
    // Aquí podrías hacer una llamada al servicio para obtener el precio mínimo de las entradas
    // this.eventoService.getListarEntradasPorEvento(idEvento) - si existiera este método
    return 100; // Precio base temporal
  }

  private generarImagenPlaceholder(nombreEvento: string): string {
    return 'img/logo/concierto.jpg';
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
    // Hardcoded example events removed — events are fetched from backend via EventoService
    this.eventos = [];
    this.eventosFiltrados = [];
    this.inicializarDropdowns();
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

      // Filtro de búsqueda por nombre
      const cumpleBusqueda = !this.searchTerm ||
        evento.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        evento.categoria.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        evento.lugar.toLowerCase().includes(this.searchTerm.toLowerCase());

      return cumpleCategoria && cumpleUbicacion && cumpleBusqueda;
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

  onImageError(evento: Evento): void {
    console.error('Error al cargar imagen para evento:', evento.nombre, 'URL:', evento.imagen);
    evento.imagen = this.imagenPorDefecto;
  }

  cargarFavoritos(): void {
    this.favoritosService.GetListarEventoFavorito().subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          this.eventosFavoritos = new Set(response.data.map(fav => fav.idEvento));
          // Actualizar el estado de favoritos en los eventos ya cargados
          this.actualizarEstadoFavoritos();
        }
      },
      error: (error) => {
        console.error('Error al cargar favoritos:', error);
      }
    });
  }

  actualizarEstadoFavoritos(): void {
    this.eventos.forEach(evento => {
      evento.esFavorito = this.eventosFavoritos.has(evento.id);
    });
    this.eventosFiltrados.forEach(evento => {
      evento.esFavorito = this.eventosFavoritos.has(evento.id);
    });
  }

  toggleFavorito(evento: Evento, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const eventoId = evento.id;
    const esFavorito = this.eventosFavoritos.has(eventoId);

    if (esFavorito) {
      // Quitar de favoritos
      this.favoritosService.DeleteEliminaEventoFavorito(eventoId).subscribe({
        next: (response) => {
          if (response.ok) {
            this.eventosFavoritos.delete(eventoId);
            evento.esFavorito = false;
            this.messageService.add({
              severity: 'info',
              summary: 'Eliminado',
              detail: 'Evento eliminado de favoritos',
              life: 1000
            });
          }
        },
        error: (error) => {
          console.error('Error al eliminar de favoritos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.mensaje || 'No se pudo eliminar el evento de favoritos',
            life: 1000
          });
        }
      });
    } else {
      // Agregar a favoritos
      this.favoritosService.PostAgregaEventoFavorito(eventoId).subscribe({
        next: (response) => {
          if (response.ok) {
            this.eventosFavoritos.add(eventoId);
            evento.esFavorito = true;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Evento agregado a favoritos',
              life: 1000
            });
          }
        },
        error: (error) => {
          console.error('Error al agregar a favoritos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.mensaje || 'No se pudo agregar el evento a favoritos',
            life: 1000
          });
        }
      });
    }
  }

  abrirDialogTerminos(event: Event) {
    event.preventDefault();
    this.dialogService.open(DialogTerminosComponent, {
      header: 'Términos y Condiciones',
      width: '70%',
      modal: true,
      breakpoints: {
        '960px': '90%',
        '640px': '95%'
      }
    });
  }

  abrirDialogPolitica(event: Event) {
    event.preventDefault();
    this.dialogService.open(DialogPoliticaComponent, {
      header: 'Política de Privacidad',
      width: '70%',
      modal: true,
      breakpoints: {
        '960px': '90%',
        '640px': '95%'
      }
    });
  }
}
