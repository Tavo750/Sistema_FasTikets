import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { baseUrl } from '../../../../global';
import { SessionService } from '../../../../shared/services/session.service';
import {
  ReporteVentasResponse,
  ReporteVentasSimpleResponse,
  ReporteVentasRequest,
  TipoReporteVentas
} from '../interfaces/reporte-ventas/reporte-ventas.interface';

@Injectable({
  providedIn: 'root'
})
export class ReporteVentasService {

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {}

  /**
   * Obtiene los headers con autorización
   */
  private getHeaders(): HttpHeaders {
    const token = this.sessionService.getCurrentUser()?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Obtener reporte completo de ventas en formato JSON
   * Endpoint nuevo que necesitas crear en el backend: GET /api/v1/eventos/{id}/reporte/ventas/json
   */
  getReporteVentasCompleto(idEvento: number, request?: Partial<ReporteVentasRequest>): Observable<ReporteVentasResponse> {
    const url = `${baseUrl}/eventos/${idEvento}/reporte/ventas/json`;
    const headers = this.getHeaders();
    
    // Construir parámetros opcionales
    let params = new HttpParams();
    if (request?.fechaInicio) {
      params = params.set('fechaInicio', request.fechaInicio);
    }
    if (request?.fechaFin) {
      params = params.set('fechaFin', request.fechaFin);
    }
    if (request?.incluirDetalleZonas !== undefined) {
      params = params.set('incluirDetalleZonas', request.incluirDetalleZonas.toString());
    }
    if (request?.incluirVentasPorFecha !== undefined) {
      params = params.set('incluirVentasPorFecha', request.incluirVentasPorFecha.toString());
    }
    if (request?.incluirResumenEntradas !== undefined) {
      params = params.set('incluirResumenEntradas', request.incluirResumenEntradas.toString());
    }

    console.log(`📊 Obteniendo reporte completo de ventas para evento ${idEvento}`);
    
    return this.http.get<ReporteVentasResponse>(url, { headers, params })
      .pipe(
        map(response => {
          console.log('✅ Reporte de ventas obtenido:', response);
          return response;
        }),
        catchError(error => {
          console.error('❌ Error al obtener reporte de ventas:', error);
          
          // Mensaje específico según el tipo de error
          let mensajeError = 'Error al cargar el reporte de ventas';
          if (error.status === 404) {
            mensajeError = 'No se encontraron datos de ventas para este evento';
          } else if (error.status === 403) {
            mensajeError = 'No tienes permisos para ver este reporte';
          } else if (error.error?.message) {
            mensajeError = error.error.message;
          }

          return of({
            ok: false,
            data: {
              evento: {
                idEvento,
                nombre: '',
                descripcion: '',
                fechaEvento: '',
                horaInicio: '',
                horaFin: '',
                nombreLocal: '',
                tipoEvento: '',
                estadoEvento: '',
                aforoTotal: 0,
                aforoDisponible: 0
              },
              metricas: {
                totalVentas: 0,
                ingresosGenerados: 0,
                entradasVendidas: 0,
                entradasDisponibles: 0,
                porcentajeOcupacion: 0,
                promedioVentaDiaria: 0,
                diaConMasVentas: '',
                montoPromedioPorEntrada: 0
              },
              ventasPorZona: [],
              ventasPorFecha: [],
              resumenEntradas: {
                entradasPagadas: 0,
                entradasPendientes: 0,
                entradasCanceladas: 0,
                entradasDevueltas: 0,
                ventasRegulares: 0,
                ventasConDescuento: 0,
                ventasGratuitas: 0,
                ventasOnline: 0,
                ventasEnSitio: 0
              },
              fechaGeneracion: new Date().toISOString(),
              rangoFechas: {
                fechaInicio: '',
                fechaFin: ''
              }
            },
            mensaje: mensajeError
          });
        })
      );
  }

  /**
   * Obtener reporte simple de ventas (solo métricas básicas)
   * Endpoint alternativo más ligero: GET /api/v1/eventos/{id}/reporte/ventas/simple
   */
  getReporteVentasSimple(idEvento: number): Observable<ReporteVentasSimpleResponse> {
    const url = `${baseUrl}/eventos/${idEvento}/reporte/ventas/simple`;
    const headers = this.getHeaders();
    
    console.log(`📊 Obteniendo reporte simple de ventas para evento ${idEvento}`);
    
    return this.http.get<ReporteVentasSimpleResponse>(url, { headers })
      .pipe(
        map(response => {
          console.log('✅ Reporte simple obtenido:', response);
          return response;
        }),
        catchError(error => {
          console.error('❌ Error al obtener reporte simple:', error);
          
          return of({
            ok: false,
            data: {
              evento: {
                idEvento,
                nombre: '',
                descripcion: '',
                fechaEvento: '',
                horaInicio: '',
                horaFin: '',
                nombreLocal: '',
                tipoEvento: '',
                estadoEvento: '',
                aforoTotal: 0,
                aforoDisponible: 0
              },
              metricas: {
                totalVentas: 0,
                ingresosGenerados: 0,
                entradasVendidas: 0,
                entradasDisponibles: 0,
                porcentajeOcupacion: 0,
                promedioVentaDiaria: 0,
                diaConMasVentas: '',
                montoPromedioPorEntrada: 0
              }
            },
            mensaje: 'Error al cargar el reporte simple de ventas'
          });
        })
      );
  }

  /**
   * Obtener reporte por tipo específico
   */
  getReportePorTipo(idEvento: number, tipo: TipoReporteVentas): Observable<ReporteVentasResponse> {
    const url = `${baseUrl}/eventos/${idEvento}/reporte/ventas/tipo/${tipo}`;
    const headers = this.getHeaders();
    
    return this.http.get<ReporteVentasResponse>(url, { headers })
      .pipe(
        catchError(error => {
          console.error(`❌ Error al obtener reporte tipo ${tipo}:`, error);
          return this.getReporteVentasCompleto(idEvento);
        })
      );
  }

  /**
   * Obtener reporte de ventas por rango de fechas
   */
  getReportePorFechas(idEvento: number, fechaInicio: string, fechaFin: string): Observable<ReporteVentasResponse> {
    return this.getReporteVentasCompleto(idEvento, {
      fechaInicio,
      fechaFin,
      incluirVentasPorFecha: true
    });
  }

  /**
   * Descargar el PDF original (mantienes la funcionalidad existente)
   */
  descargarReportePDF(idEvento: number): Observable<Blob> {
    const url = `${baseUrl}/eventos/${idEvento}/reporte/ventas/pdf`;
    const headers = this.getHeaders();
    
    return this.http.get(url, { 
      headers, 
      responseType: 'blob' 
    }).pipe(
      catchError(error => {
        console.error('❌ Error al descargar PDF:', error);
        throw error;
      })
    );
  }

  /**
   * Validar si hay datos de ventas para un evento
   */
  validarDatosVentas(idEvento: number): Observable<boolean> {
    return this.getReporteVentasSimple(idEvento).pipe(
      map(response => {
        return response.ok && response.data.metricas.totalVentas > 0;
      }),
      catchError(() => of(false))
    );
  }

  /**
   * Formatear fecha para el reporte
   */
  formatearFecha(fecha: string | Date): string {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return fechaObj.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  /**
   * Formatear moneda para el reporte
   */
  formatearMoneda(cantidad: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(cantidad);
  }

  /**
   * Calcular métricas adicionales a partir de los datos del reporte
   */
  calcularMetricasAdicionales(reporte: ReporteVentasResponse): any {
    if (!reporte.ok || !reporte.data) {
      return null;
    }

    const { metricas, ventasPorZona } = reporte.data;

    return {
      // Métricas de eficiencia
      tasaConversion: (metricas.entradasVendidas / metricas.totalVentas) * 100,
      ingresoPromedioPorZona: ventasPorZona.length > 0 
        ? ventasPorZona.reduce((sum, zona) => sum + zona.ingresosPorZona, 0) / ventasPorZona.length 
        : 0,
      
      // Zona más popular
      zonaMasPopular: ventasPorZona.length > 0 
        ? ventasPorZona.reduce((max, zona) => 
            zona.entradasVendidas > max.entradasVendidas ? zona : max
          )
        : null,
      
      // Análisis de ocupación
      zonasAgotadas: ventasPorZona.filter(zona => zona.porcentajeOcupacion >= 100),
      zonasConBajaOcupacion: ventasPorZona.filter(zona => zona.porcentajeOcupacion < 50),
      
      // Proyecciones
      ingresosPotenciales: ventasPorZona.reduce((total, zona) => 
        total + (zona.capacidadTotal * zona.precioUnitario), 0
      ),
      ingresosPerdidos: ventasPorZona.reduce((total, zona) => 
        total + (zona.entradasDisponibles * zona.precioUnitario), 0
      )
    };
  }
}