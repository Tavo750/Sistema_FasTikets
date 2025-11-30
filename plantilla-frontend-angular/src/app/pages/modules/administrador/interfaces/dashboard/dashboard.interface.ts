// Interfaces para Dashboard Analytics

export interface DashboardResponse {
  ok: boolean;
  data: DashboardData;
  mensaje: string;
}

export interface DashboardData {
  // KPIs principales
  totalEventos: number;
  eventosActivos: number;
  eventosFinalizados: number;
  eventosCancelados: number;
  eventosProximos: number;

  // Métricas de ventas
  ventasTotales: number;
  ingresosReales: number;
  
  // Top eventos
  top3Eventos: EventoPopular[];
  
  // Próximos eventos
  proximosEventos: EventoProximo[];
}

export interface VentasEventoResponse {
  ok: boolean;
  data: VentasEvento;
  mensaje: string;
}

export interface VentasEvento {
  idEvento: number;
  nombreEvento: string;
  ventasTotales: number;
  ingresosGenerados: number;
  entradasVendidas: number;
  aforoTotal: number;
  porcentajeOcupacion: number;
}

export interface VentasTotalesResponse {
  ok: boolean;
  mensaje: string;
  data: number; // El backend devuelve solo un número
}

export interface VentasTotales {
  ventasTotales: number;
  ingresosGenerados: number;
  entradasVendidas: number;
  promedioVentasPorEvento: number;
}

export interface EventosProximosResponse {
  ok: boolean;
  data: EventoProximo[];
  mensaje: string;
}

export interface EventoProximo {
  idEvento: number;
  nombre: string;
  fechaEvento: string;
  horaInicio: string;
  nombreLocal: string;
  tipoEvento: string;
  estadoEvento: string;
  aforoDisponible: number;
  diasRestantes: number;
}

export interface EventosPopularesResponse {
  ok: boolean;
  data: EventoPopular[];
  mensaje: string;
}

export interface EventoPopular {
  idEvento: number;
  nombre: string;
  descripcion: string;
  fechaEvento: string;
  fechaFinEvento?: string;
  horaInicio: string;
  horaFin: string;
  imagenUrl?: string;
  imagenZonasUrl?: string;
  tipoEvento: string;
  estadoEvento: string;
  aforoDisponible: number;
  activo: boolean;
  idLocal: number;
  nombreLocal: string;
  fechaCreacion: string;
  menoresDeEdadPermitidos: boolean;
  restricciones?: string;
  politicasDevolucion?: string;
  // Propiedades calculadas para el dashboard
  ventasTotales?: number;
  entradasVendidas?: number;
  porcentajeOcupacion?: number;
  ingresosGenerados?: number;
  ranking?: number;
}

export interface EventosPorEstadoResponse {
  ok: boolean;
  data: EventoPorEstado[];
  mensaje: string;
}

export interface EventoPorEstado {
  idEvento: number;
  nombre: string;
  descripcion?: string;
  tipoEvento: string;
  fechaEvento: string;
  fechaFinEvento?: string;
  horaInicio?: string;
  horaFin?: string;
  imagenUrl?: string;
  imagenZonasUrl?: string;
  estadoEvento: string;
  aforoDisponible: number;
  activo?: boolean;
  idLocal?: number;
  nombreLocal: string;
  fechaCreacion?: string;
  menoresDeEdadPermitidos?: boolean;
  restricciones?: string;
  politicasDevolucion?: string;
}

// Enums para estados de eventos
export enum EstadoEvento {
  BORRADOR = 'BORRADOR',
  ACTIVO = 'ACTIVO',
  PUBLICADO = 'PUBLICADO',
  CANCELADO = 'CANCELADO',
  AGOTADO = 'AGOTADO',
  FINALIZADO = 'FINALIZADO'
}

// Interface para request de top eventos
export interface TopEventosRequest {
  topN: number;
}