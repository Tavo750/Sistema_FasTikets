export interface HistorialComprasResponse {
  ok: boolean;
  mensaje: string;
  data: OrdenCompra[];
}

export interface OrdenCompra {
  idOrdenCompra: number;
  fechaOrden: string; // ISO date
  subtotal: number;
  descuentoPorMembrecia?: number;
  descuentoPorCanje?: number;
  igv?: number;
  total: number;
  estado?: string;
  codigoSeguimiento?: string;
  metodoPago?: string;
  activo?: boolean;
  usuarioCreacion?: number;
  fechaCreacion?: string;
  usuarioActualizacion?: number;
  fechaActualizacion?: string;
  cliente?: ClienteResumen;
  items?: ItemCarrito[];
  carroCompras?: CarroCompras;
  fechaExpiracion?: string;
  canjesAplicados?: CanjeAplicado[];
  pago?: Pago;
  descuentoPromocional?: number;
  codigoPromocionalAplicado?: string;
}

export interface ClienteResumen {
  idPersona?: number;
  tipoDocumento?: string;
  docIdentidad?: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  email?: string;
  fechaNacimiento?: string;
  direccion?: string;
  nivel?: string;
  puntosAcumulados?: number;
}

export interface ItemCarrito {
  idItemCarrito?: number;
  cantidad?: number;
  precio?: number;
  descuento?: number;
  precioFinal?: number;
  fechaAgregado?: string;
  activo?: boolean;
  tipoTicket?: TipoTicketResumen;
  tickets?: Ticket[];
}

export interface TipoTicketResumen {
  idTipoTicket?: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
}

export interface Ticket {
  idTicket?: number;
  codigoQr?: string;
  asiento?: string;
  fila?: string;
  precio?: number;
  estado?: string;
}

export interface CarroCompras {
  idCarro?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  subtotal?: number;
  total?: number;
}

export interface CanjeAplicado {
  idCanje?: number;
  fechaCanje?: string;
  ordenCompra?: string;
  puntos?: any; // estructura de puntos (puede ser extensa); usar any para flexibilidad
}

export interface Pago {
  idPago?: number;
  metodo?: string;
  monto?: number;
  estado?: string;
  fechaPago?: string;
  activo?: boolean;
  comprobantePago?: ComprobantePago;
}

export interface ComprobantePago {
  idComprobante?: number;
  numeroSerie?: string;
  fechaEmision?: string;
  total?: number;
}

export interface CarroItemNested {
  idCarro?: number;
}

// Interfaces simplificadas para regiones/ubicaciones usadas en el payload
export interface DistritoMinimal {
  idDistrito?: number;
  nombre?: string;
}
