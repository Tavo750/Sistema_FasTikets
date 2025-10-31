export interface ListarCodigosResponse {
  ok:      boolean;
  mensaje: string;
  data:    Datum[];
}

export interface Datum {
  idCodigoPromocional: number;
  codigo:              string;
  descripcion:         string;
  fechaFin:            Date;
  tipo:                string;
  valor:               number;
  stock:               number;
  cantidadPorCliente:  number;
}
