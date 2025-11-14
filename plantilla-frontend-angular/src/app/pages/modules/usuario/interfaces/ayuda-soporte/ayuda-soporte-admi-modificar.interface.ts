import { AyudaSoporteListItem } from './ayuda-soporte-listar.interface';

export interface AyudaSoporteAdmiModificarRequest {
  estado: 'ABIERTO' | 'RESUELTO' | 'CERRADO' | string;
  observaciones?: string | null;
}

export interface AyudaSoporteAdmiModificarResponse {
  ok: boolean;
  mensaje: string;
  data: AyudaSoporteListItem;
}
