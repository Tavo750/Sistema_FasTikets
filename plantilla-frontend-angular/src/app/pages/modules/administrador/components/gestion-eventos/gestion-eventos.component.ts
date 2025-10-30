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
    console.log('Generando reporte para:', evento.nombre);
  }

  verDetalles(evento: Evento) {
    console.log('Viendo detalles de:', evento.nombre);
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
}
