export interface HistorialComprasResponse {
  ok: boolean;
  mensaje: string;
  data: OrdenCompra[];
}

export interface OrdenCompra {
  idOrdenCompra: number;
  fechaOrden: string;
  total: number;
  estado: string;
  codigoSeguimiento: string;
  pago: Pago;
  evento: Evento;
  items: ItemCarrito[];
  tickets: Ticket[];
}

export interface Pago {
  idPago: number;
  monto: number;
  estado: string;
  fechaPago: string;
  metodo: string;
}

export interface Evento {
  idEvento: number;
  nombre: string;
  imagenUrl: string;
}

export interface ItemCarrito {
  idItemCarrito: number;
  cantidad: number;
  precio: number;
  precioFinal: number;
  tipoTicketNombre: string;
}

export interface Ticket {
  idTicket: number;
  codigoQr: string;
  asiento: string;
  fila: string;
  estado: string;
}

// Interface auxiliar para el cálculo de entradas
export interface ResumenCompras {
  totalOrdenes: number;
  totalEntradas: number;
  montoTotal: number;
  primeraCompra?: string;
  ultimaCompra?: string;
}