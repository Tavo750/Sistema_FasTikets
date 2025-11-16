export interface ReglaPuntos {
  idRegla: number;
  solesPorPunto: number;
  tipoRegla: 'CANJE' | 'COMPRA' | string;
  activo: boolean;
  estado: string;
}

export interface ReglasPuntosListResponse {
  ok: boolean;
  mensaje: string;
  data: ReglaPuntos[];
}

export interface CreateReglaPuntosRequest {
  solesPorPunto: number;
  tipoRegla: 'CANJE' | 'COMPRA';
  activo: boolean;
  estado: string;
}

export interface CreateReglaPuntosResponse {
  ok: boolean;
  mensaje: string;
  data: ReglaPuntos;
}

export interface UpdateReglaPuntosRequest {
  solesPorPunto?: number;
  tipoRegla?: 'CANJE' | 'COMPRA';
  activo?: boolean;
  estado?: string;
}

export interface UpdateReglaPuntosResponse {
  ok: boolean;
  mensaje: string;
  data: ReglaPuntos;
}

export interface DeleteReglaPuntosResponse {
  ok: boolean;
  mensaje: string;
}