export interface HistorialPuntosResponse {
  ok: boolean;
  mensaje: string;
  data: Punto[];
}

export interface Punto {
  idPuntos: number;
  cantPuntos: number;
  fechaVencimiento?: string; // ISO date
  fechaTransaccion?: string; // ISO date
  tipoTransaccion?: string; // e.g., 'GANADO' | 'CANJEADO'
  activo?: boolean;
  idRegla?: number;
  idCliente?: number;
}
