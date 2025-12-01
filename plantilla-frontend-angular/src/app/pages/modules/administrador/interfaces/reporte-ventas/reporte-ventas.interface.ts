// Interfaces para Reporte de Ventas - Estructura real del backend

export interface ReporteVentasResponse {
  ok: boolean;
  mensaje: string;
  data: ReporteVentasData;
}

export interface ReporteVentasData {
  reporteInfo: ReporteInfo;
  eventoDetalles: EventoDetalles;
  resumenGeneralVentas: ResumenGeneralVentas;
  desglosePorCategoriaTicket: CategoriaTicket[];
  tendenciaVentasPorFecha: any; // null en la respuesta actual
}

export interface ReporteInfo {
  fechaGeneracion: string;
  periodoCubierto: string;
}

export interface EventoDetalles {
  idEvento: number;
  titulo: string;
  fechaEvento: string;
  localNombre: string;
  aforoTotal: number;
}

export interface ResumenGeneralVentas {
  ticketsVendidosTotal: number;
  ingresosBrutosTotal: number;
  descuentosAplicadosTotal: number;
  ingresosNetosTotal: number;
  porcentajeOcupacion: number;
}

export interface CategoriaTicket {
  categoriaNombre: string;
  precioUnitarioBase: number;
  ticketsDisponibles: number;
  ticketsVendidos: number;
  ingresosBrutosCategoria: number;
  descuentosCategoria: number;
  ingresosNetosCategoria: number;
  porcentajeVentasCategoria: number;
}

// Interface simplificada para uso en dashboard
export interface ReporteVentasSimple {
  idEvento: number;
  nombreEvento: string;
  aforoTotal: number;
  ticketsVendidos: number;
  ingresosBrutos: number;
  ingresosNetos: number;
  porcentajeOcupacion: number;
  categorias: CategoriaSimple[];
}

export interface CategoriaSimple {
  nombre: string;
  ticketsVendidos: number;
  porcentajeVentas: number;
  ingresos: number;
}