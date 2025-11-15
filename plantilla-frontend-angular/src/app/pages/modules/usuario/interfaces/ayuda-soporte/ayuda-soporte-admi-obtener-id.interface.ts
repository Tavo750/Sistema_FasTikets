
import { AyudaSoporteListItem } from './ayuda-soporte-listar.interface';

/**
 * Respuesta al obtener una solicitud de ayuda/soporte por su ID
 * Ejemplo de respuesta (Postman):
 * {
 *  "ok": true,
 *  "mensaje": "Detalle del ticket",
 *  "data": { ... AyudaSoporteListItem }
 * }
 */
export interface AyudaSoporteAdmiObtenerIdResponse {
	ok: boolean;
	mensaje: string;
	data: AyudaSoporteListItem;
}

// Alias/Tipo auxiliar por compatibilidad si se prefiere referenciar data directamente
export type AyudaSoporteAdmiObtenerIdData = AyudaSoporteListItem;
