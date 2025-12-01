// Interfaces para Reporte de Ventas

export interface ReporteVentasResponse {
  ok: boolean;
  data: ReporteVentasData;
  mensaje: string;
}

export interface ReporteVentasData {
  // Información del evento
  evento: EventoReporte;
  
  // Métricas principales
  metricas: MetricasVentas;
  
  // Ventas detalladas por zona
  ventasPorZona: VentaZona[];
  
  // Ventas por fecha
  ventasPorFecha: VentaFecha[];
  
  // Resumen de entradas
  resumenEntradas: ResumenEntradas;
  
  // Información adicional
  fechaGeneracion: string;
  rangoFechas: {
    fechaInicio: string;
    fechaFin: string;
  };
}

export interface EventoReporte {
  idEvento: number;
  nombre: string;
  descripcion: string;
  fechaEvento: string;
  horaInicio: string;
  horaFin: string;
  nombreLocal: string;
  tipoEvento: string;
  estadoEvento: string;
  aforoTotal: number;
  aforoDisponible: number;
}

export interface MetricasVentas {
  totalVentas: number;
  ingresosGenerados: number;
  entradasVendidas: number;
  entradasDisponibles: number;
  porcentajeOcupacion: number;
  promedioVentaDiaria: number;
  diaConMasVentas: string;
  montoPromedioPorEntrada: number;
}

export interface VentaZona {
  idZona: number;
  nombreZona: string;
  capacidadTotal: number;
  entradasVendidas: number;
  entradasDisponibles: number;
  porcentajeOcupacion: number;
  precioUnitario: number;
  ingresosPorZona: number;
  ordenZona?: number; // Para ordenar las zonas
}

export interface VentaFecha {
  fecha: string;
  cantidadVentas: number;
  ingresosDelDia: number;
  ventasAcumuladas: number;
  ingresosAcumulados: number;
}

export interface ResumenEntradas {
  // Por estado de entrada
  entradasPagadas: number;
  entradasPendientes: number;
  entradasCanceladas: number;
  entradasDevueltas: number;
  
  // Por tipo de cliente
  ventasRegulares: number;
  ventasConDescuento: number;
  ventasGratuitas: number;
  
  // Por canal de venta
  ventasOnline: number;
  ventasEnSitio: number;
}

// Interface para request personalizado
export interface ReporteVentasRequest {
  idEvento: number;
  fechaInicio?: string;
  fechaFin?: string;
  incluirDetalleZonas?: boolean;
  incluirVentasPorFecha?: boolean;
  incluirResumenEntradas?: boolean;
}

// Interface para reporte simplificado (si solo necesitas métricas básicas)
export interface ReporteVentasSimpleResponse {
  ok: boolean;
  data: {
    evento: EventoReporte;
    metricas: MetricasVentas;
  };
  mensaje: string;
}

// Enums para filtros
export enum TipoReporteVentas {
  COMPLETO = 'COMPLETO',
  SIMPLE = 'SIMPLE',
  POR_ZONAS = 'POR_ZONAS',
  POR_FECHAS = 'POR_FECHAS'
}

export enum EstadoVenta {
  PAGADO = 'PAGADO',
  PENDIENTE = 'PENDIENTE',
  CANCELADO = 'CANCELADO',
  DEVUELTO = 'DEVUELTO'
}