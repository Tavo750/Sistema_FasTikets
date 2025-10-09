import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface TipoConcierto {
  name: string;
  code: string;
}

@Component({
  selector: 'app-gestion-eventos',
  standalone: false,
  templateUrl: './gestion-eventos.component.html',
  styleUrl: './gestion-eventos.component.css'
})
export class GestionEventosComponent implements OnInit {
  tiposConcierto: TipoConcierto[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.tiposConcierto = [
      { name: 'Rock', code: 'ROCK' },
      { name: 'Pop', code: 'POP' },
      { name: 'Reggaeton', code: 'RGTN' },
      { name: 'Electrónica', code: 'ELEC' },
      { name: 'Jazz', code: 'JAZZ' }
    ];
  }

  generarReporte() {
    // Implementar lógica de generación de reporte
    console.log('Generando reporte...');
  }

  verDetalles() {
    // Implementar lógica para ver detalles
    console.log('Viendo detalles...');
  }

  agregarEvento() {
    // Implementar lógica para agregar evento
    console.log('Agregando evento...');
  }

  editarEvento(id: number) {
    this.router.navigate(['/administrador/gestionEventos/editar', id]);
  }
  crearEvento(id:number){
    this.router.navigate(['/administrador/gestionEventos/crear', id]);
  }
}
