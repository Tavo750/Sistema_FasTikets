export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

export interface ItemCotizacion {
  productoId: number | null;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface Cotizacion {
  id?: number;
  clienteId: number;
  fechaCreacion: Date;
  fechaVencimiento: Date;
  observaciones: string;
  items: ItemCotizacion[];
  subtotal: number;
  igv: number;
  total: number;
  estado: 'borrador' | 'enviada' | 'aprobada' | 'rechazada';
}
