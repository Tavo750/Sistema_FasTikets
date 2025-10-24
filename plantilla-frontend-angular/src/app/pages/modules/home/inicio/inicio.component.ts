import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evento } from './interfaces/inicio/evento.interface';

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarEventos();
    this.inicializarDropdowns();
  }

  inicializarDropdowns(): void {
    this.categoriasDropdown = this.categorias.map(cat => ({ label: cat, value: cat }));
    this.ubicacionesDropdown = this.ubicaciones.map(ub => ({ label: ub, value: ub }));
  }

  cargarEventos() {
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

  goToEvento(): void {
    this.router.navigate(['/home/evento']);
  }

  comprarEvento(evento: Evento): void {
    // Lógica para comprar evento
    console.log('Comprando evento:', evento.nombre);
    // Aquí se podría navegar a una página de compra o abrir un modal
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
}
