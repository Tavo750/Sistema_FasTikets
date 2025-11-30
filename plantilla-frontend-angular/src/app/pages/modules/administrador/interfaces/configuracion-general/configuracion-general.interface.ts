/**
 * Interfaz para un item de configuración general
 */
export interface ConfiguracionItem {
  key: string;
  value: string;
  descripcion: string;
  valueType: string;
}

/**
 * Respuesta del endpoint GET /api/v1/admin/configuracion
 */
export interface ConfiguracionGeneralResponse {
  ok: boolean;
  mensaje: string;
  data: ConfiguracionItem[];
}

/**
 * Request para crear o actualizar una configuración
 */
export interface ConfiguracionRequest {
  key: string;
  value: string;
  descripcion: string;
  valueType: string;
}

/**
 * Respuesta al crear/actualizar una configuración
 */
export interface ConfiguracionOperacionResponse {
  ok: boolean;
  mensaje: string;
  data: ConfiguracionItem;
}
