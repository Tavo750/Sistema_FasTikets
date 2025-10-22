import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface TipoConcierto {
  name: string;
  code: string;
}

interface Evento {
  id: number;
  nombre: string;
  tipo: string;
  fecha: Date;
  lugar: string;
  capacidad: number;
  vendidos: number;
  ocupacion: number;
  ingresos: number;
  estado: string;
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.tiposConcierto = [
      { name: 'Todos los tipos', code: 'ALL' },
      { name: 'Rock', code: 'ROCK' },
      { name: 'Pop', code: 'POP' },
      { name: 'Reggaeton', code: 'RGTN' },
      { name: 'Electrónica', code: 'ELEC' },
      { name: 'Jazz', code: 'JAZZ' }
    ];

    // Datos de ejemplo
    this.eventos = [
      {
        id: 1,
        nombre: 'Bad Bunny',
        tipo: 'Reggaeton',
        fecha: new Date('2024-03-14'),
        lugar: 'Estadio Nacional Peru',
        capacidad: 45000,
        vendidos: 42930,
        ocupacion: 95.4,
        ingresos: 333874000.992,
        estado: 'Completado'
      },
      {
        id: 2,
        nombre: 'Metallica',
        tipo: 'Rock',
        fecha: new Date('2024-05-20'),
        lugar: 'Arena Lima',
        capacidad: 35000,
        vendidos: 34200,
        ocupacion: 97.7,
        ingresos: 425000000,
        estado: 'Próximo'
      },
      {
        id: 3,
        nombre: 'Taylor Swift',
        tipo: 'Pop',
        fecha: new Date('2024-07-15'),
        lugar: 'Estadio San Marcos',
        capacidad: 50000,
        vendidos: 49800,
        ocupacion: 99.6,
        ingresos: 780000000,
        estado: 'Vendido'
      }
    ];

    this.eventosFiltrados = [...this.eventos];
  }

  filtrarEventos() {
    this.eventosFiltrados = this.eventos.filter(evento => {
      const coincideNombre = evento.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase());
      const coincideTipo = !this.tipoSeleccionado ||
                          this.tipoSeleccionado.code === 'ALL' ||
                          evento.tipo === this.tipoSeleccionado.name;

      return coincideNombre && coincideTipo;
    });
  }

  onBusquedaChange() {
    this.filtrarEventos();
  }

  onTipoChange() {
    this.filtrarEventos();
  }

  getEstadoSeverity(estado: string): string {
    switch (estado) {
      case 'Completado':
        return 'success';
      case 'Próximo':
        return 'info';
      case 'Vendido':
        return 'warning';
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
    console.log('Generando reporte para:', evento.nombre);
  }

  verDetalles(evento: Evento) {
    console.log('Viendo detalles de:', evento.nombre);
  }

  agregarEvento() {
    console.log('Agregando evento...');
  }

  editarEvento(id: number) {
    this.router.navigate(['/administrador/gestionEventos/editar', id]);
  }

  crearEvento(id:number){
    this.router.navigate(['/administrador/gestionEventos/crear', id]);
  }
}
