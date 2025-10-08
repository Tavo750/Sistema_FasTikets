import { Component, OnInit } from '@angular/core';

interface Evento {
  titulo: string;
  categoria: string;
  fecha: Date;
  hora: {
    horas: string;
    minutos: string;
  };
  descripcion: string;
  local: string;
  banner?: File;
  videoPromocional?: File;
}

interface Asiento {
  nombre: string;
  aforoMaximo: number;
  aforoDisponible: number;
}

interface Entrada {
  nombre: string;
  categoria: string;
  estado: string;
}

@Component({
  selector: 'app-editar-evento',
  standalone: false,
  templateUrl: './editar-evento.component.html',
  styleUrl: './editar-evento.component.css'
})
export class EditarEventoComponent implements OnInit {
  evento: Evento = {
    titulo: '',
    categoria: '',
    fecha: new Date(),
    hora: {
      horas: '',
      minutos: ''
    },
    descripcion: '',
    local: ''
  };

  categorias = [
    { nombre: 'Conciertos' },
    { nombre: 'Deportes' },
    { nombre: 'Teatro' },
    { nombre: 'Festivales' }
  ];

  asientos: Asiento[] = [
    { nombre: 'General', aforoMaximo: 25000, aforoDisponible: 914 },
    { nombre: 'Premium', aforoMaximo: 15000, aforoDisponible: 0 }
  ];

  entradas: Entrada[] = [
    { nombre: 'Regular', categoria: 'General', estado: 'ACTIVO' },
    { nombre: 'Premium', categoria: 'Premium', estado: 'VENDIDO' }
  ];

  estadosEntrada = [
    { nombre: 'ACTIVO' },
    { nombre: 'INACTIVO' },
    { nombre: 'VENDIDO' }
  ];

  constructor() {}

  ngOnInit(): void {
  }

  onGuardarCambios(): void {
    console.log('Guardando cambios:', this.evento);
  }

  onCancelarEvento(): void {
    console.log('Cancelando evento');
  }

  onSubirBanner(event: any): void {
    if (event.files && event.files[0]) {
      this.evento.banner = event.files[0];
    }
  }

  onSubirVideo(event: any): void {
    if (event.files && event.files[0]) {
      this.evento.videoPromocional = event.files[0];
    }
  }
}
