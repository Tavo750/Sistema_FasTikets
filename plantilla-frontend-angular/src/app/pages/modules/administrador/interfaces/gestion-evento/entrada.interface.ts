export interface EntradaResponse {
  ok:      boolean;
  mensaje: string;
  data:    Data;
}

export interface EntradaResponseArray {
  ok:      boolean;
  mensaje: string;
  data:    Data[];
}

export interface Data {
  idTipoTicket:     number;
  nombre:           string;
  descripcion:      string;
  precio:           number;
  stock:            number;
  activo:           boolean;
  idZona:           number;
  nombreZona:       string;
  limitePorPersona: number;
  fechaInicioVenta: string;
  fechaFinVenta:    string;
}
