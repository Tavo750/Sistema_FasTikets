import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LogErroresService } from '../../services/log-errores.service';
import { LogErroresResponse, Datum } from '../../interfaces/log-errores/log-errores.interface';
import { MessageService as CustomMessageService } from '../../../../../core/services/message.service';
import { Subscription } from 'rxjs';

interface ErrorLog {
  idError: number;
  fechaHora: Date;
  fechaHoraString: string;
  severidad: 'ERROR' | 'WARN';
  modulo: string;
  mensajeBreve: string;
  detalleTecnico: string;
  nombreAdmin: string;
}

@Component({
  selector: 'app-log-errores',
  standalone: false,
  templateUrl: './log-errores.component.html',
  styleUrl: './log-errores.component.css'
})
export class LogErroresComponent implements OnInit, OnDestroy {

  errores: ErrorLog[] = [];
  filteredErrores: ErrorLog[] = [];
  isLoading: boolean = false;
  totalRecords: number = 0;
  private subscription: Subscription = new Subscription();

  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;
  fechaHastaSecond: Date | null = null;
  filtroSeveridad: string | null = null;

  severidadOptions = [
    { label: 'Todas', value: null },
    { label: 'Error', value: 'ERROR' },
    { label: 'Warning', value: 'WARN' }
  ];

  selectedSeveridad: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private logErroresService: LogErroresService,
    private customMessageService: CustomMessageService
  ) { }

  ngOnInit(): void {
    this.cargarRegistrosErrores();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Carga los registros de errores desde el backend
   */
  cargarRegistrosErrores(): void {
    this.isLoading = true;
    this.customMessageService.info('Cargando log de errores...', 'Cargando');

    this.logErroresService.getListarLogErrores().subscribe({
      next: (response: LogErroresResponse) => {
        console.log('Respuesta del servicio:', response);

        // Verificar si la respuesta es exitosa y tiene datos
        if (response && response.ok && response.data) {
          this.errores = this.transformarDatosErrores(response.data);
          // Ordenar por fecha descendente (más recientes primero)
          this.errores.sort((a, b) => b.fechaHora.getTime() - a.fechaHora.getTime());
          this.filteredErrores = [...this.errores];
          this.totalRecords = this.errores.length;

          if (this.errores.length > 0) {
            this.customMessageService.success(
              `Se cargaron ${this.errores.length} registros de errores correctamente`,
              'Carga completada'
            );
          } else {
            this.customMessageService.info('No se encontraron registros de errores', 'Sin resultados');
          }
        } else {
          console.warn('Estructura de respuesta inesperada:', response);
          this.customMessageService.info('No se encontraron registros de errores', 'Sin resultados');
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar log de errores:', error);
        this.customMessageService.error(
          'Error al cargar los registros de errores. Por favor, inténtelo de nuevo.',
          'Error de conexión'
        );
        this.isLoading = false;
      }
    });
  }

  /**
   * Transforma los datos del backend al formato esperado por la vista
   */
  private transformarDatosErrores(data: Datum[]): ErrorLog[] {
    return data.map(record => ({
      idError: record.idError,
      fechaHora: new Date(record.fechaHora),
      fechaHoraString: this.formatearFecha(record.fechaHora.toString()),
      severidad: record.severidad,
      modulo: record.modulo,
      mensajeBreve: record.mensajeBreve,
      detalleTecnico: record.detalleTecnico,
      nombreAdmin: record.nombreAdmin
    }));
  }

  /**
   * Formatea una fecha al formato local español con zona horaria local del sistema
   */
  private formatearFecha(fechaISO: string): string {
    // Crear la fecha y obtener los componentes en hora local
    const fecha = new Date(fechaISO);
    
    // Formatear usando métodos que respetan la zona horaria local
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    
    return `${dia}/${mes}/${anio}, ${horas}:${minutos}:${segundos}`;
  }

  filtrar(): void {
    this.filteredErrores = this.errores.filter(error => {
      let matches = true;

      // Filtro por severidad
      if (this.filtroSeveridad && error.severidad !== this.filtroSeveridad) {
        matches = false;
      }

      // Filtro por fecha desde (inicio del día)
      if (this.fechaDesde) {
        const fechaDesdeInicio = new Date(this.fechaDesde);
        fechaDesdeInicio.setHours(0, 0, 0, 0); // Inicio del día (00:00:00)
        
        const errorDate = error.fechaHora;
        if (errorDate < fechaDesdeInicio) {
          matches = false;
        }
      }

      // Filtro por fecha hasta (fin del día)
      if (this.fechaHasta) {
        const fechaHastaFin = new Date(this.fechaHasta);
        fechaHastaFin.setHours(23, 59, 59, 999); // Fin del día (23:59:59.999)
        
        const errorDate = error.fechaHora;
        if (errorDate > fechaHastaFin) {
          matches = false;
        }
      }

      return matches;
    });
    
    // Ordenar resultados filtrados por fecha descendente (más recientes primero)
    this.filteredErrores.sort((a, b) => b.fechaHora.getTime() - a.fechaHora.getTime());
    
    // Actualizar el total de registros para la paginación
    this.totalRecords = this.filteredErrores.length;
  }

  limpiarFiltros(): void {
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.fechaHastaSecond = null;
    this.filtroSeveridad = null;
    this.filteredErrores = [...this.errores];
    // Ordenar por fecha descendente (más recientes primero)
    this.filteredErrores.sort((a, b) => b.fechaHora.getTime() - a.fechaHora.getTime());
    this.totalRecords = this.errores.length;
  }

  registrarNuevoError(): void {
    this.router.navigate(['registrar'], { relativeTo: this.route });
  }

  getSeveridadClass(severidad: string): string {
    const severidadClasses: { [key: string]: string } = {
      'CRITICA': 'severity-critica',
      'ERROR': 'severity-error',
      'WARN': 'severity-warn'
    };
    return severidadClasses[severidad] || '';
  }

  getSeveridadSeverity(severidad: string): 'success' | 'info' | 'warning' | 'danger' | null {
    // No usar severity de PrimeNG, usar solo clases personalizadas
    return null;
  }
}
