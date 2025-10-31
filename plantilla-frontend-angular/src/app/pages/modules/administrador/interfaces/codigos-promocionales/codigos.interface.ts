export interface CodigosResponse {
  ok:      boolean;
  mensaje: string;
  data:    Data;
}

export interface Data {
  idCodigoPromocional: number;
  codigo:              string;
  descripcion:         string;
  fechaFin:            Date;
  tipo:                string;
  valor:               number;
  stock:               number;
  cantidadPorCliente:  number;
}

export interface CrearCodigoPromocionalRequest {
  codigo:              string;
  descripcion:         string;
  fechaFin:            string;
  tipo:                string;
  valor:               number;
  stock:               number;
  cantidadPorCliente:  number;
}
