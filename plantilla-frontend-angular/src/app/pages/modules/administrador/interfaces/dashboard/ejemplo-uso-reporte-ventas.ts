// Ejemplo de uso del ReporteVentasService

// 1. Importar el servicio en tu componente
import { ReporteVentasService } from '../../services/reporte-ventas.service';

// 2. Inyectarlo en el constructor
constructor(
  private reporteVentasService: ReporteVentasService
  // ... otros servicios
) {}

// 3. Obtener reporte completo de un evento
obtenerReporteCompleto(idEvento: number) {
  this.reporteVentasService.getReporteVentasCompleto(idEvento).subscribe({
    next: (response) => {
      if (response.ok) {
        console.log('📊 Reporte completo:', response.data);
        
        // Acceder a los datos
        const { evento, metricas, ventasPorZona, ventasPorFecha } = response.data;
        
        console.log('Evento:', evento.nombre);
        console.log('Ingresos generados:', metricas.ingresosGenerados);
        console.log('Entradas vendidas:', metricas.entradasVendidas);
        console.log('Porcentaje ocupación:', metricas.porcentajeOcupacion);
        
        // Analizar ventas por zona
        ventasPorZona.forEach(zona => {
          console.log(`Zona ${zona.nombreZona}: ${zona.entradasVendidas}/${zona.capacidadTotal} entradas`);
        });
        
        // Mostrar evolución de ventas
        ventasPorFecha.forEach(venta => {
          console.log(`${venta.fecha}: ${venta.cantidadVentas} ventas`);
        });
      }
    },
    error: (error) => {
      console.error('Error al obtener reporte:', error);
    }
  });
}

// 4. Obtener solo métricas básicas (más rápido)
obtenerMetricasBasicas(idEvento: number) {
  this.reporteVentasService.getReporteVentasSimple(idEvento).subscribe({
    next: (response) => {
      if (response.ok) {
        const { evento, metricas } = response.data;
        
        // Usar los datos para actualizar el dashboard
        this.actualizarDashboard({
          nombreEvento: evento.nombre,
          totalVentas: metricas.totalVentas,
          ingresos: metricas.ingresosGenerados,
          ocupacion: metricas.porcentajeOcupacion
        });
      }
    }
  });
}

// 5. Obtener reporte por rango de fechas
obtenerReportePorFechas(idEvento: number, fechaInicio: string, fechaFin: string) {
  this.reporteVentasService.getReportePorFechas(idEvento, fechaInicio, fechaFin).subscribe({
    next: (response) => {
      if (response.ok) {
        console.log('📅 Reporte por fechas:', response.data);
        
        // Analizar tendencia de ventas
        const ventasPorFecha = response.data.ventasPorFecha;
        const tendencia = this.analizarTendencia(ventasPorFecha);
        console.log('Tendencia de ventas:', tendencia);
      }
    }
  });
}

// 6. Validar si hay datos antes de mostrar el reporte
async validarYMostrarReporte(idEvento: number) {
  const tieneVentas = await this.reporteVentasService.validarDatosVentas(idEvento).toPromise();
  
  if (tieneVentas) {
    this.obtenerReporteCompleto(idEvento);
  } else {
    console.log('⚠️ Este evento no tiene ventas registradas');
    // Mostrar mensaje al usuario
  }
}

// 7. Calcular métricas adicionales
obtenerAnalisisAvanzado(idEvento: number) {
  this.reporteVentasService.getReporteVentasCompleto(idEvento).subscribe({
    next: (response) => {
      if (response.ok) {
        // Usar el método de análisis
        const metricas = this.reporteVentasService.calcularMetricasAdicionales(response);
        
        if (metricas) {
          console.log('📈 Análisis avanzado:');
          console.log('Zona más popular:', metricas.zonaMasPopular?.nombreZona);
          console.log('Zonas agotadas:', metricas.zonasAgotadas.length);
          console.log('Ingresos potenciales:', this.formatearMoneda(metricas.ingresosPotenciales));
          console.log('Ingresos perdidos:', this.formatearMoneda(metricas.ingresosPerdidos));
        }
      }
    }
  });
}

// Métodos auxiliares
private formatearMoneda(cantidad: number): string {
  return this.reporteVentasService.formatearMoneda(cantidad);
}

private analizarTendencia(ventasPorFecha: any[]): string {
  if (ventasPorFecha.length < 2) return 'Datos insuficientes';
  
  const primera = ventasPorFecha[0].cantidadVentas;
  const ultima = ventasPorFecha[ventasPorFecha.length - 1].cantidadVentas;
  
  if (ultima > primera) return 'Creciente';
  if (ultima < primera) return 'Decreciente';
  return 'Estable';
}

private actualizarDashboard(datos: any) {
  // Lógica para actualizar tu dashboard
  console.log('Actualizando dashboard con:', datos);
}

/*
ENDPOINTS QUE NECESITAS CREAR EN EL BACKEND:

1. GET /api/v1/eventos/{id}/reporte/ventas/json
   - Retorna los mismos datos del PDF pero en formato JSON
   - Incluye toda la información detallada

2. GET /api/v1/eventos/{id}/reporte/ventas/simple  
   - Retorna solo las métricas básicas
   - Más rápido para el dashboard

3. GET /api/v1/eventos/{id}/reporte/ventas/tipo/{tipo}
   - Parámetros: COMPLETO, SIMPLE, POR_ZONAS, POR_FECHAS
   - Retorna datos específicos según el tipo

Parámetros opcionales:
- fechaInicio: string (YYYY-MM-DD)
- fechaFin: string (YYYY-MM-DD)  
- incluirDetalleZonas: boolean
- incluirVentasPorFecha: boolean
- incluirResumenEntradas: boolean

El PDF original se mantiene en:
GET /api/v1/eventos/{id}/reporte/ventas/pdf
*/