import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

interface ErrorLog {
  fechaHora: string;
  severidad: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO';
  modulo: string;
  mensajeBreve: string;
  accion: string;
}

@Component({
  selector: 'app-log-errores',
  standalone: false,
  templateUrl: './log-errores.component.html',
  styleUrl: './log-errores.component.css'
})
export class LogErroresComponent implements OnInit {

  errores: ErrorLog[] = [
    {
      fechaHora: '2025-09-24 15:30:11',
      severidad: 'CRITICO',
      modulo: 'Pasarela Pago',
      mensajeBreve: 'Error de conexión con el servicio de pago de terceros.',
      accion: 'El sistema intentó procesar una compra, pero falló la conexión externa.'
    },
    {
      fechaHora: '2025-09-24 15:35:45',
      severidad: 'ALTO',
      modulo: 'Eventos/API',
      mensajeBreve: 'El sitio de venta supera el aforo total del local.',
      accion: 'Un administrador intentó editar el local y asignó cupos incorrectos.'
    },
    {
      fechaHora: '2025-09-24 15:40:02',
      severidad: 'MEDIO',
      modulo: 'Autenticacion',
      mensajeBreve: 'Bloqueo temporal de IP por 5 intentos fallidos de login.',
      accion: 'El cliente con IP 192.168.1.100 excedió el límite de intentos.'
    },
    {
      fechaHora: '2025-09-24 15:45:22',
      severidad: 'BAJO',
      modulo: 'Transferencias',
      mensajeBreve: 'El código QR de un ticket transferido fue invalidado.',
      accion: 'La transferencia de ticket ID: 22340 fue completada exitosamente.'
    }
  ];

  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;
  fechaHastaSecond: Date | null = null;
  filtroSeveridad: string | null = null;

  severidadOptions = [
    { label: 'Todas', value: null },
    { label: 'Crítico', value: 'CRITICO' },
    { label: 'Alto', value: 'ALTO' },
    { label: 'Medio', value: 'MEDIO' },
    { label: 'Bajo', value: 'BAJO' }
  ];

  severidades = [
    { label: 'Todos', value: null },
    { label: 'Crítico', value: 'CRITICO' },
    { label: 'Alto', value: 'ALTO' },
    { label: 'Medio', value: 'MEDIO' },
    { label: 'Bajo', value: 'BAJO' }
  ];

  selectedSeveridad: string | null = null;
  filteredErrores: ErrorLog[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.filteredErrores = [...this.errores];
  }

  filtrar(): void {
    this.filteredErrores = this.errores.filter(error => {
      let matches = true;

      // Filtro por severidad
      if (this.filtroSeveridad && error.severidad !== this.filtroSeveridad) {
        matches = false;
      }

      // Filtro por fecha desde
      if (this.fechaDesde) {
        const errorDate = new Date(error.fechaHora);
        if (errorDate < this.fechaDesde) {
          matches = false;
        }
      }

      // Filtro por fecha hasta
      if (this.fechaHasta) {
        const errorDate = new Date(error.fechaHora);
        if (errorDate > this.fechaHasta) {
          matches = false;
        }
      }

      return matches;
    });
  }

  limpiarFiltros(): void {
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.fechaHastaSecond = null;
    this.filtroSeveridad = null;
    this.filteredErrores = [...this.errores];
  }

  registrarNuevoError(): void {
    this.router.navigate(['registrar'], { relativeTo: this.route });
  }

  getSeveridadClass(severidad: string): string {
    const severidadClasses: { [key: string]: string } = {
      'CRITICO': 'severity-critico',
      'ALTO': 'severity-alto',
      'MEDIO': 'severity-medio',
      'BAJO': 'severity-bajo'
    };
    return severidadClasses[severidad] || '';
  }

  getSeveridadSeverity(severidad: string): 'success' | 'info' | 'warning' | 'danger' {
    const severidadMap: { [key: string]: 'success' | 'info' | 'warning' | 'danger' } = {
      'BAJO': 'success',
      'MEDIO': 'info',
      'ALTO': 'warning',
      'CRITICO': 'danger'
    };
    return severidadMap[severidad] || 'info';
  }
}
