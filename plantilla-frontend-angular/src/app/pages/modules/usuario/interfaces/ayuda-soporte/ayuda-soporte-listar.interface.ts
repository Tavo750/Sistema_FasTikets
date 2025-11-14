export interface AyudaSoporteListItem {
  idSolicitud: number;
  idUsuario: number;
  nombreUsuario: string;
  emailUsuario: string;
  asunto: string;
  mensaje: string;
  estado: string;
  prioridad: string;
  canalOrigen: string;
  ipOrigen?: string | null;
  metadataAdicional?: string | null;
  observaciones?: string | null;
  fechaCreacion?: string | null;
  fechaActualizacion?: string | null;
  fechaCierre?: string | null;
}

export interface AyudaSoporteListResponse {
  ok: boolean;
  mensaje: string;
  data: AyudaSoporteListItem[];
}
