export interface CargaMasivaEventoResponse {
  ok:      boolean;
  mensaje: string;
  data?: {
    eventosCreados?: number;
    errores?: number;
    conflictos?: number;
    detallesErrores?: string[];
  };
}
