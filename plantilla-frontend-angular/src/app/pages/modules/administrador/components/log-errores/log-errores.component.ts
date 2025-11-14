import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

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

  errores: ErrorLog[] = [];
  isLoading: boolean = false;

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
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.inicializarDatosMock();
  }

  inicializarDatosMock(): void {
    // Datos mock para desarrollo
    this.errores = [
      {
        fechaHora: '2024-11-13 14:30:15',
        severidad: 'CRITICO',
        modulo: 'Autenticación',
        mensajeBreve: 'Error en validación de credenciales',
        accion: 'Pendiente de resolución'
      },
      {
        fechaHora: '2024-11-13 13:45:22',
        severidad: 'ALTO',
        modulo: 'Pagos',
        mensajeBreve: 'Fallo en procesamiento de pago',
        accion: 'En investigación'
      },
      {
        fechaHora: '2024-11-13 12:20:08',
        severidad: 'MEDIO',
        modulo: 'Base de Datos',
        mensajeBreve: 'Timeout en consulta de usuarios',
        accion: 'Resuelto'
      },
      {
        fechaHora: '2024-11-13 11:15:33',
        severidad: 'BAJO',
        modulo: 'Interfaz',
        mensajeBreve: 'Lentitud en carga de componente',
        accion: 'Optimizado'
      }
    ];
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
