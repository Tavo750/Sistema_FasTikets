import { AyudaSoporteListItem } from './ayuda-soporte-listar.interface';

/**
 * Request para modificar solo el estado y observaciones de una solicitud (admin)
 * Corresponde al endpoint PUT /soporte/{id}/estado
 */
export interface AyudaSoporteEstadoAdmiRequest {
  estado: 'ABIERTO' | 'RESUELTO' | 'CERRADO' | string;
  observaciones?: string | null;
}

/**
 * Response del endpoint PUT /soporte/{id}/estado
 * Devuelve el ticket actualizado
 */
export interface AyudaSoporteEstadoAdmiResponse {
  ok: boolean;
  mensaje: string;
  data: AyudaSoporteListItem;
}
