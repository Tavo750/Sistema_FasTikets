import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { baseUrl } from '../../../../global';
import { SessionService } from '../../../../shared/services/session.service';
// import { ReporteVentasService } from './reporte-ventas.service'; // Comentado hasta implementar en backend
import {
  DashboardResponse,
  DashboardData,
  VentasEventoResponse,
  VentasTotalesResponse,
  EventosProximosResponse,
  EventosPopularesResponse,
  EventosPorEstadoResponse,
  EstadoEvento,
  EventoPopular,
  EventoProximo,
  EventoPorEstado,
  VentasTotales
} from '../interfaces/dashboard/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
    // private reporteVentasService: ReporteVentasService // Comentado hasta implementar en backend
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
   * Obtener ventas totales por evento específico
   */
  getVentasPorEvento(idEvento: number): Observable<VentasEventoResponse> {
    const url = `${baseUrl}/eventos/${idEvento}/ventas`;
    const headers = this.getHeaders();
    
    return this.http.get<VentasEventoResponse>(url, { headers })
      .pipe(
        catchError(error => {
          
          return of({
            ok: false,
            data: {
              idEvento: idEvento,
              nombreEvento: '',
              ventasTotales: 0,
              ingresosGenerados: 0,
              entradasVendidas: 0,
              aforoTotal: 0,
              porcentajeOcupacion: 0
            },
            mensaje: 'Error al cargar ventas del evento'
          });
        })
      );
  }

  /**
   * Obtener datos de ventas mejorados usando el servicio de reportes
   * Primero intenta el reporte simple, si falla usa el método original
   * COMENTADO: Pendiente implementación de endpoints en backend
   */
  /*
  getVentasPorEventoMejorado(idEvento: number): Observable<VentasEventoResponse> {
    return this.reporteVentasService.getReporteVentasSimple(idEvento).pipe(
      map(reporteResponse => {
        if (reporteResponse.ok && reporteResponse.data) {
          // Convertir datos del reporte al formato VentasEvento
          const { evento, metricas } = reporteResponse.data;
          
          return {
            ok: true,
            data: {
              idEvento: evento.idEvento,
              nombreEvento: evento.nombre,
              ventasTotales: metricas.totalVentas,
              ingresosGenerados: metricas.ingresosGenerados,
              entradasVendidas: metricas.entradasVendidas,
              aforoTotal: evento.aforoTotal,
              porcentajeOcupacion: metricas.porcentajeOcupacion
            },
            mensaje: 'Datos de ventas obtenidos del reporte'
          };
        } else {
          throw new Error('No se pudieron obtener datos del reporte');
        }
      }),
      catchError(error => {
        console.warn('⚠️ Reporte de ventas no disponible, usando método original:', error.message);
        // Fallback al método original
        return this.getVentasPorEvento(idEvento);
      })
    );
  }
  */

  /**
   * Obtener ventas totales de todos los eventos
   */
  getVentasTotales(): Observable<VentasTotalesResponse> {
    const url = `${baseUrl}/eventos/ventas`;
    const headers = this.getHeaders();
    
    
    
    return this.http.get<VentasTotalesResponse>(url, { headers })
      .pipe(
        map(response => {
          
          
          // Manejar caso cuando la respuesta es exitosa pero data es null
          if (response.ok && response.data === null) {
            
            return {
              ...response,
              data: 0
            };
          }
          
          // Manejar caso cuando data es undefined o valores falsy numéricos
          if (response.ok && (response.data === undefined || response.data === 0 || !response.data)) {
            
            return {
              ...response,
              data: 0
            };
          }
          
          return response;
        }),
        catchError(error => {
          
          
          // Mensaje específico para error de null pointer
          let mensajeError = 'Error al cargar ventas totales';
          if (error.error?.message?.includes('doubleValue()') && error.error?.message?.includes('null')) {
            mensajeError = 'No hay ventas registradas aún';
            
            
            // Retornar 0 en lugar de error cuando es un problema de null
            return of({
              ok: true,
              data: 0,
              mensaje: 'No hay ventas registradas'
            });
          }
          
          return of({
            ok: false,
            data: 0, // Respuesta simple como número
            mensaje: mensajeError
          });
        })
      );
  }

  /**
   * Obtener ventas de un evento específico
   */
  getVentasEvento(eventoId: number): Observable<VentasTotalesResponse> {
    const url = `${baseUrl}/eventos/${eventoId}/ventas`;
    const headers = this.getHeaders();
    
    
    
    return this.http.get<VentasTotalesResponse>(url, { headers })
      .pipe(
        map(response => {
          
          return response;
        }),
        catchError(error => {
          
          
          let mensajeError = `Error al cargar ventas del evento ${eventoId}`;
          if (error.error?.message?.includes('doubleValue()') && error.error?.message?.includes('null')) {
            mensajeError = `No hay datos de ventas disponibles para este evento`;
          }
          
          return of({
            ok: false,
            data: 0,
            mensaje: mensajeError
          });
        })
      );
  }

  /**
   * Obtener eventos próximos
   */
  getEventosProximos(): Observable<EventosProximosResponse> {
    const url = `${baseUrl}/eventos/proximos`;
    const headers = this.getHeaders();
    
    return this.http.get<EventosProximosResponse>(url, { headers })
      .pipe(
        catchError(error => {
          
          return of({
            ok: false,
            data: [],
            mensaje: 'Error al cargar eventos próximos'
          });
        })
      );
  }

  /**
   * Obtener top N eventos populares
   */
  getEventosPopulares(topN: number = 5): Observable<EventosPopularesResponse> {
    const url = `${baseUrl}/eventos/populares/${topN}`;
    const headers = this.getHeaders();
    
    
    
    return this.http.get<EventosPopularesResponse>(url, { headers })
      .pipe(
        map(response => {
          
          return response;
        }),
        catchError(error => {
          
          // Mensaje específico para el error de query duplicada
          let mensajeError = 'Error al cargar eventos populares';
          if (error.error?.message?.includes('Query did not return a unique result')) {
            mensajeError = 'Error en base de datos: consulta con resultados duplicados. Se usarán datos alternativos.';
            console.warn('⚠️ El endpoint de eventos populares tiene problemas de duplicados en la BD');
          }
          
          return of({
            ok: false,
            data: [],
            mensaje: mensajeError
          });
        })
      );
  }

  /**
   * Obtener eventos populares alternativos basados en eventos por estado
   * Se usa como fallback cuando el endpoint de populares falla
   */
  getEventosPopularesAlternativos(): Observable<EventosPopularesResponse> {
    
    return this.getEventosPorEstado(EstadoEvento.ACTIVO).pipe(
      map(response => {
        if (response.ok && response.data && response.data.length > 0) {
          // Tomar los primeros 3 eventos activos como "populares"
          const eventosPopulares: EventoPopular[] = response.data
            .slice(0, 3)
            .map((evento, index): EventoPopular => ({
              idEvento: evento.idEvento,
              nombre: evento.nombre,
              descripcion: evento.descripcion || 'Descripción no disponible',
              fechaEvento: evento.fechaEvento,
              fechaFinEvento: evento.fechaFinEvento,
              horaInicio: evento.horaInicio || '00:00',
              horaFin: evento.horaFin || '23:59',
              imagenUrl: evento.imagenUrl,
              imagenZonasUrl: evento.imagenZonasUrl,
              tipoEvento: evento.tipoEvento,
              estadoEvento: evento.estadoEvento,
              aforoDisponible: evento.aforoDisponible,
              activo: evento.activo ?? true,
              idLocal: evento.idLocal || 0,
              nombreLocal: evento.nombreLocal,
              fechaCreacion: evento.fechaCreacion || new Date().toISOString(),
              menoresDeEdadPermitidos: evento.menoresDeEdadPermitidos ?? false,
              restricciones: evento.restricciones,
              politicasDevolucion: evento.politicasDevolucion,
              // Solo datos reales del backend - sin simulaciones
              ranking: index + 1
            }));
          
          
          return {
            ok: true,
            data: eventosPopulares,
            mensaje: 'Eventos populares obtenidos usando datos alternativos'
          };
        } else {
          return {
            ok: false,
            data: [],
            mensaje: 'No se encontraron eventos para mostrar como populares'
          };
        }
      }),
      catchError(error => {
        
        return of({
          ok: false,
          data: [],
          mensaje: 'Error obteniendo datos alternativos'
        });
      })
    );
  }
  /**
   * Obtener eventos populares con datos reales de ventas
   */
  getEventosPopularesConVentas(topN: number = 3): Observable<EventosPopularesResponse> {
    return this.getEventosPopulares(topN).pipe(
      switchMap(eventosResponse => {
        if (!eventosResponse.ok || !eventosResponse.data || eventosResponse.data.length === 0) {
          // Si falla, usar método alternativo SIN datos simulados
          return this.getEventosPopularesAlternativos();
        }

        // Obtener datos reales de ventas para cada evento popular
        const ventasRequests = eventosResponse.data.map(evento => 
          this.getVentasPorEvento(evento.idEvento).pipe(
            map(ventasResponse => ({
              evento,
              ventas: ventasResponse.ok ? ventasResponse.data : null
            })),
            catchError(() => of({ evento, ventas: null }))
          )
        );

        return forkJoin(ventasRequests).pipe(
          map(resultados => {
            const eventosConVentasReales = resultados.map(({ evento, ventas }, index) => ({
              ...evento,
              // Solo usar datos reales del backend
              ventasTotales: ventas?.ventasTotales || undefined,
              entradasVendidas: ventas?.entradasVendidas || undefined,
              porcentajeOcupacion: ventas?.porcentajeOcupacion || undefined,
              ingresosGenerados: ventas?.ingresosGenerados || undefined,
              aforoTotal: ventas?.aforoTotal || undefined,
              ranking: index + 1
            }));

            return {
              ok: true,
              data: eventosConVentasReales,
              mensaje: 'Eventos populares con datos reales de ventas'
            };
          })
        );
      }),
      catchError(() => this.getEventosPopularesAlternativos())
    );
  }

  /**
   * Obtener eventos próximos con datos reales de ventas
   */
  getEventosProximosConVentas(): Observable<EventosProximosResponse> {
    return this.getEventosProximos().pipe(
      switchMap(eventosResponse => {
        if (!eventosResponse.ok || !eventosResponse.data || eventosResponse.data.length === 0) {
          return of(eventosResponse);
        }

        // Obtener datos reales de ventas para cada evento próximo
        const ventasRequests = eventosResponse.data.map(evento => 
          this.getVentasPorEvento(evento.idEvento).pipe(
            map(ventasResponse => ({
              evento,
              ventas: ventasResponse.ok ? ventasResponse.data : null
            })),
            catchError(() => of({ evento, ventas: null }))
          )
        );

        return forkJoin(ventasRequests).pipe(
          map(resultados => {
            const eventosConVentasReales = resultados.map(({ evento, ventas }) => ({
              ...evento,
              // Solo usar datos reales del backend
              aforoTotal: ventas?.aforoTotal || undefined,
              entradasVendidas: ventas?.entradasVendidas || undefined,
              porcentajeOcupacion: ventas?.porcentajeOcupacion || undefined
            }));

            return {
              ok: true,
              data: eventosConVentasReales,
              mensaje: 'Eventos próximos con datos reales de ventas'
            };
          })
        );
      })
    );
  }

  getEventosPorEstado(estado: EstadoEvento): Observable<EventosPorEstadoResponse> {
    const url = `${baseUrl}/eventos/estado/${estado}`;
    const headers = this.getHeaders();
    
    return this.http.get<EventosPorEstadoResponse>(url, { headers })
      .pipe(
        catchError(error => {
          
          return of({
            ok: false,
            data: [],
            mensaje: `Error al cargar eventos con estado ${estado}`
          });
        })
      );
  }

  /**
   * Obtener todos los datos del dashboard de manera consolidada
   * Combina todas las llamadas necesarias para el dashboard
   */
  getDashboardCompleto(): Observable<DashboardResponse> {
    

    const ventasTotales$ = this.getVentasTotales();
    const eventosProximos$ = this.getEventosProximos();
    
    // Usar métodos originales hasta implementar endpoints de reportes
    const eventosPopulares$ = this.getEventosPopulares(3).pipe(
      catchError(error => {
        console.log('🔄 Usando datos alternativos para eventos populares');
        return this.getEventosPopularesAlternativos();
      })
    );
    
    // Obtener eventos por diferentes estados
    const eventosActivos$ = this.getEventosPorEstado(EstadoEvento.ACTIVO);
    const eventosPublicados$ = this.getEventosPorEstado(EstadoEvento.PUBLICADO);
    const eventosFinalizados$ = this.getEventosPorEstado(EstadoEvento.FINALIZADO);
    const eventosCancelados$ = this.getEventosPorEstado(EstadoEvento.CANCELADO);
    const eventosBorrador$ = this.getEventosPorEstado(EstadoEvento.BORRADOR);
    const eventosAgotados$ = this.getEventosPorEstado(EstadoEvento.AGOTADO);

    return forkJoin({
      ventasTotales: ventasTotales$,
      eventosProximos: eventosProximos$,
      eventosPopulares: eventosPopulares$,
      eventosActivos: eventosActivos$,
      eventosPublicados: eventosPublicados$,
      eventosFinalizados: eventosFinalizados$,
      eventosCancelados: eventosCancelados$,
      eventosBorrador: eventosBorrador$,
      eventosAgotados: eventosAgotados$
    }).pipe(
      map(responses => {
        // Combinar eventos activos y publicados
        const eventosActivosTotal = (responses.eventosActivos.data?.length || 0) + 
                                   (responses.eventosPublicados.data?.length || 0);

        // Calcular total de eventos
        const totalEventos = eventosActivosTotal + 
                           (responses.eventosFinalizados.data?.length || 0) + 
                           (responses.eventosCancelados.data?.length || 0) +
                           (responses.eventosBorrador.data?.length || 0) +
                           (responses.eventosAgotados.data?.length || 0);

        // Usar solo datos básicos del backend - sin información de ventas detallada
        let eventosPopularesConDatos: EventoPopular[] = [];
        
        if (responses.eventosPopulares.ok && responses.eventosPopulares.data) {
          eventosPopularesConDatos = responses.eventosPopulares.data;
        } 

        const dashboardData: DashboardData = {
          // KPIs principales
          totalEventos: totalEventos,
          eventosActivos: eventosActivosTotal,
          eventosFinalizados: responses.eventosFinalizados.data?.length || 0,
          eventosCancelados: responses.eventosCancelados.data?.length || 0,
          eventosProximos: responses.eventosProximos.data?.length || 0,

          // Métricas de ventas reales (adaptadas a la respuesta simple)
          ventasTotales: responses.ventasTotales.data || 0,
          ingresosReales: responses.ventasTotales.data || 0, // Usar el mismo valor de ventas totales

          // Top eventos (datos reales con cálculos)
          top3Eventos: eventosPopularesConDatos.slice(0, 3),

          // Próximos eventos (datos reales)
          proximosEventos: responses.eventosProximos.data || []
        };

        
        
        return {
          ok: true,
          data: dashboardData,
          mensaje: 'Dashboard cargado exitosamente'
        };
      }),
      catchError(error => {
        
        return of({
          ok: false,
          data: {} as DashboardData,
          mensaje: 'Error al cargar los datos del dashboard'
        });
      })
    );
  }

  /**
   * Obtener colores para tipos de eventos (mantenemos los colores existentes)
   */
  obtenerColorTipo(tipo: string): string {
    const colores: Record<string, string> = {
      'ROCK': '#e74c3c',
      'METAL': '#34495e', 
      'PUNK': '#9b59b6',
      'POP': '#f39c12',
      'REGGAE': '#27ae60',
      'REGGAETON': '#e67e22',
      'ELECTRONICA': '#3498db',
      'ROCK_POP': '#e91e63',
      'URBANO': '#ff9800'
    };
    return colores[tipo] || '#95a5a6';
  }
}