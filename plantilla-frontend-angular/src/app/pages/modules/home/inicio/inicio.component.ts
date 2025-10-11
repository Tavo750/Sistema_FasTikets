import { Component, OnInit } from '@angular/core';
import { Evento } from '../../../../models/evento.model';


@Component({
  standalone: false,
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})

export class InicioComponent implements OnInit {
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  categorias: string[] = ['Rock', 'Rock and Pop', 'Reggae', 'Pop', 'Punk', 'Reguetón'];
  ubicaciones: string[] = ['Arena 1 - Cúpula', 'Arena 2', 'Arena 3', 'Movistar Arena'];
  paginaActual: number = 1;
  eventosPorPagina: number = 6;

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos() {
    this.eventos = [
      { id: 1, nombre: 'UB40', fecha: '11 de Septiembre', lugar: 'Arena 1 - Cúpula', categoria: 'Reggae', precio: 100, imagen: 'assets/ub40.jpg' },
      { id: 2, nombre: 'Banda', fecha: '30 de Septiembre', lugar: 'Arena 2', categoria: 'Rock and Pop', precio: 100, imagen: 'assets/banda1.jpg' },
      { id: 3, nombre: 'Banda 3', fecha: '3 de Octubre', lugar: 'Movistar Arena', categoria: 'Rock', precio: 180, imagen: 'assets/banda2.jpg' },
      { id: 4, nombre: 'Agrupación 1', fecha: '15 de Octubre', lugar: 'Arena 1', categoria: 'Pop', precio: 120, imagen: 'assets/banda3.jpg' },
      { id: 5, nombre: 'Agrupación 2', fecha: '21 de Octubre', lugar: 'Arena 3', categoria: 'Punk', precio: 150, imagen: 'assets/banda4.jpg' },
      { id: 6, nombre: 'Agrupación 3', fecha: '31 de Octubre', lugar: 'Arena 2', categoria: 'Reguetón', precio: 200, imagen: 'assets/banda5.jpg' },
    ];
    this.eventosFiltrados = [...this.eventos];
  }

  // Métodos básicos de filtro
  filtrarPorCategoria(categoria: string) {
    this.eventosFiltrados = categoria
      ? this.eventos.filter(e => e.categoria === categoria)
      : [...this.eventos];
    this.paginaActual = 1;
  }

  obtenerEventosPagina(): Evento[] {
    const inicio = (this.paginaActual - 1) * this.eventosPorPagina;
    return this.eventosFiltrados.slice(inicio, inicio + this.eventosPorPagina);
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
  }
}
