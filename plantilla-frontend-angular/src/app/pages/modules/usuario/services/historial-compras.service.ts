import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { baseUrl } from '../../../../global';
import { SessionService } from '../../../../shared/services/session.service';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { 
  HistorialComprasResponse, 
  OrdenCompra, 
  ResumenCompras 
} from '../interfaces/beneficios/historial-compras.interface';

@Injectable({
  providedIn: 'root'
})
export class HistorialComprasService {

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
    private httpUtils: HttpUtilsService
  ) {}

  /**
   * Obtiene el historial de compras del cliente autenticado
   * @returns Observable con el historial de compras
   */
  getHistorialCompras(): Observable<HistorialComprasResponse> {
    const url = `${baseUrl}/clientes/historial-compras`;
    
    const token = this.sessionService.getCurrentUser()?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    console.log('🛒 Cargando historial de compras desde:', url);

    return this.http.get<HistorialComprasResponse>(url, { headers })
      .pipe(
        map(response => {
          console.log('✅ Historial de compras cargado:', response);
          return response;
        }),
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Calcula el total de entradas compradas por el cliente
   * Solo considera órdenes con pagos APROBADOS
   * @param ordenes Array de órdenes de compra
   * @returns Número total de entradas
   */
  calcularTotalEntradas(ordenes: OrdenCompra[]): number {
    if (!ordenes || ordenes.length === 0) {
      return 0;
    }

    return ordenes
      .filter(orden => orden.pago && orden.pago.estado === 'APROBADO') // Solo pagos aprobados
      .reduce((totalEntradas, orden) => {
        // Sumar la cantidad de cada item en la orden
        const entradasOrden = orden.items.reduce((sum, item) => sum + item.cantidad, 0);
        console.log(`📦 Orden ${orden.idOrdenCompra}: ${entradasOrden} entradas (Pago: ${orden.pago.estado})`);
        return totalEntradas + entradasOrden;
      }, 0);
  }

  /**
   * Genera un resumen completo de las compras del cliente
   * Solo considera órdenes con pagos APROBADOS
   * @param ordenes Array de órdenes de compra
   * @returns Resumen con estadísticas de compras
   */
  generarResumenCompras(ordenes: OrdenCompra[]): ResumenCompras {
    if (!ordenes || ordenes.length === 0) {
      return {
        totalOrdenes: 0,
        totalEntradas: 0,
        montoTotal: 0
      };
    }

    // Filtrar solo órdenes con pagos aprobados
    const ordenesAprobadas = ordenes.filter(orden => 
      orden.pago && orden.pago.estado === 'APROBADO'
    );
    
    const totalEntradas = this.calcularTotalEntradas(ordenes);
    const montoTotal = ordenesAprobadas.reduce((sum, orden) => sum + orden.total, 0);
    
    // Obtener fechas de primera y última compra (solo de pagos aprobados)
    const fechasOrden = ordenesAprobadas
      .map(orden => new Date(orden.fechaOrden))
      .sort((a, b) => a.getTime() - b.getTime());

    const primeraCompra = fechasOrden.length > 0 
      ? fechasOrden[0].toLocaleDateString('es-ES') 
      : undefined;
    
    const ultimaCompra = fechasOrden.length > 0 
      ? fechasOrden[fechasOrden.length - 1].toLocaleDateString('es-ES') 
      : undefined;

    console.log('📊 Resumen de compras calculado:', {
      totalOrdenesAprobadas: ordenesAprobadas.length,
      totalEntradas,
      montoTotal,
      primeraCompra,
      ultimaCompra
    });

    return {
      totalOrdenes: ordenesAprobadas.length,
      totalEntradas,
      montoTotal,
      primeraCompra,
      ultimaCompra
    };
  }

  /**
   * Calcula el tier de membresía basado en el número total de entradas compradas
   * @param totalEntradas Número total de entradas compradas
   * @returns Tier correspondiente
   */
  calcularTierPorEntradas(totalEntradas: number): 'BRONCE' | 'PLATA' | 'ORO' {
    if (totalEntradas > 50) {
      return 'ORO';
    } else if (totalEntradas >= 31) {
      return 'PLATA';
    } else {
      return 'BRONCE';
    }
  }

  /**
   * Obtiene el tier del cliente basado en su historial de compras
   * @returns Observable con el tier calculado
   */
  getTierPorHistorialCompras(): Observable<{
    tier: 'BRONCE' | 'PLATA' | 'ORO',
    totalEntradas: number,
    resumen: ResumenCompras
  }> {
    return this.getHistorialCompras().pipe(
      map(response => {
        if (response.ok && response.data) {
          const totalEntradas = this.calcularTotalEntradas(response.data);
          const tier = this.calcularTierPorEntradas(totalEntradas);
          const resumen = this.generarResumenCompras(response.data);

          console.log('📊 Cálculo de tier completado:', {
            totalEntradas,
            tier,
            resumen,
            criterio: 'Solo pagos APROBADOS'
          });

          return { tier, totalEntradas, resumen };
        } else {
          console.warn('⚠️ Respuesta sin datos válidos, usando tier por defecto');
          return {
            tier: 'BRONCE' as const,
            totalEntradas: 0,
            resumen: {
              totalOrdenes: 0,
              totalEntradas: 0,
              montoTotal: 0
            }
          };
        }
      }),
      catchError(error => {
        console.error('❌ Error al calcular tier por historial:', error);
        // Retornar tier por defecto en caso de error
        return [{
          tier: 'BRONCE' as const,
          totalEntradas: 0,
          resumen: {
            totalOrdenes: 0,
            totalEntradas: 0,
            montoTotal: 0
          }
        }];
      })
    );
  }
}