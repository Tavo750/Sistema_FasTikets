/**
 * Interfaces para el proceso de compra de entradas
 */

export interface CreateOrderRequest {
  idCliente: number;
  items: OrderItem[];
}

export interface OrderItem {
  idTipoTicket: number;
  cantidad: number;
  asistentes: Asistente[];
}

export interface Asistente {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

export interface CreateOrderResponse {
  ok: boolean;
  data: {
    idOrden: number;
    mensaje?: string;
  };
  mensaje: string;
}

export interface RegisterPaymentRequest {
  idOrden: number;
  nombreTitular: string;
  correo: string;
  numeroTarjeta: string;
  fechaCaducidad: string;
  cvv: string;
  numeroCuotas: number;
  monto: number;
  idUsuario: number;
}

export interface RegisterPaymentResponse {
  ok: boolean;
  data?: any;
  mensaje: string;
}

export interface CheckoutCarritoRequest {
  idCarrito: number;
  asistentes: { [idTipoTicket: number]: Asistente[] };
}

export interface TicketInfo {
  idTipoTicket: number;
  nombre: string;
  precio: number;
  cantidad: number;
  description?: string;
}

export interface CompraData {
  eventInfo: {
    idEvento: number;
    title: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    organizer: string;
    image: string;
  };
  tickets: TicketInfo[];
  totalTickets: number;
  totalPrice: number;
  source: 'evento' | 'carrito';
}