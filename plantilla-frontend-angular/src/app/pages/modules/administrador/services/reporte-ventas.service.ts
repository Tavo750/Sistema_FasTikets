import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { baseUrl } from '../../../../global';
import { SessionService } from '../../../../shared/services/session.service';
import {
  ReporteVentasResponse,
  ReporteVentasSimple
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
   * Obtener reporte de ventas usando el endpoint real
   */
  getReporteVentas(idEvento: number): Observable<ReporteVentasResponse> {
    const url = `${baseUrl}/eventos/${idEvento}/reporte/ventas/json`;
    const headers = this.getHeaders();
    
    return this.http.get<ReporteVentasResponse>(url, { headers })
      .pipe(
        catchError(error => {
          return of({
            ok: false,
            mensaje: 'Error al obtener reporte de ventas',
            data: {
              reporteInfo: {
                fechaGeneracion: new Date().toISOString(),
                periodoCubierto: 'Error'
              },
              eventoDetalles: {
                idEvento,
                titulo: '',
                fechaEvento: '',
                localNombre: '',
                aforoTotal: 0
              },
              resumenGeneralVentas: {
                ticketsVendidosTotal: 0,
                ingresosBrutosTotal: 0,
                descuentosAplicadosTotal: 0,
                ingresosNetosTotal: 0,
                porcentajeOcupacion: 0
              },
              desglosePorCategoriaTicket: [],
              tendenciaVentasPorFecha: null
            }
          });
        })
      );
  }

  /**
   * Convertir datos del reporte a formato simplificado para dashboard
   */
  convertirAReporteSimple(reporte: ReporteVentasResponse): ReporteVentasSimple | null {
    if (!reporte.ok || !reporte.data) {
      return null;
    }

    const { eventoDetalles, resumenGeneralVentas, desglosePorCategoriaTicket } = reporte.data;

    return {
      idEvento: eventoDetalles.idEvento,
      nombreEvento: eventoDetalles.titulo,
      aforoTotal: eventoDetalles.aforoTotal,
      ticketsVendidos: resumenGeneralVentas.ticketsVendidosTotal,
      ingresosBrutos: resumenGeneralVentas.ingresosBrutosTotal,
      ingresosNetos: resumenGeneralVentas.ingresosNetosTotal,
      porcentajeOcupacion: resumenGeneralVentas.porcentajeOcupacion * 100,
      categorias: desglosePorCategoriaTicket.map(cat => ({
        nombre: cat.categoriaNombre,
        ticketsVendidos: cat.ticketsVendidos,
        porcentajeVentas: cat.porcentajeVentasCategoria,
        ingresos: cat.ingresosNetosCategoria
      }))
    };
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
   * Formatear porcentaje
   */
  formatearPorcentaje(porcentaje: number): string {
    return `${porcentaje.toFixed(1)}%`;
  }
}