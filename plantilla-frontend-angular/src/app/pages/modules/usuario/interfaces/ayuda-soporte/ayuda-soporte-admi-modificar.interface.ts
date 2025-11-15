import { AyudaSoporteListItem } from './ayuda-soporte-listar.interface';

/**
 * Request para actualizar una solicitud de soporte (admin)
 * Corresponde al body mostrado en Postman: puede incluir los campos
 * asunto, mensaje, prioridad, canalOrigen, ipOrigen, metadataAdicional y observaciones.
 */
export interface AyudaSoporteAdmiModificarRequest {
  asunto?: string;
  mensaje?: string;
  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | string;
  canalOrigen?: string;
  ipOrigen?: string | null;
  metadataAdicional?: string | null;
  observaciones?: string | null;
  // permitir enviar el estado cuando sea necesario (opcional)
  estado?: 'ABIERTO' | 'RESUELTO' | 'CERRADO' | string;
}

export interface AyudaSoporteAdmiModificarResponse {
  ok: boolean;
  mensaje: string;
  data: AyudaSoporteListItem;
}
