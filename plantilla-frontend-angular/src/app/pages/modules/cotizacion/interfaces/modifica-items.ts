export interface Cliente {
  id: number;
  nombre: string;
  contacto?: string;
  email?: string;
  telefono?: string;
}

export interface Vendedor {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

export interface DetalleCotizacion {
  id?: number;
  productoId: number;
  producto: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  total: number;
}

export interface Cotizacion {
  id: number;
  numero: string;
  fecha: Date;
  fechaVencimiento: Date;
  clienteId: number;
  cliente?: Cliente;
  vendedorId: number;
  vendedor?: Vendedor;
  observaciones?: string;
  subtotal: number;
  descuentoTotal: number;
  igv: number;
  total: number;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  detalles: DetalleCotizacion[];
}
