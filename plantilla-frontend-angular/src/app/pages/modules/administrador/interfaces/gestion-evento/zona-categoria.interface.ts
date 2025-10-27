export interface ZonaCategoriaResponse {
  ok:      boolean;
  mensaje: string;
  data:    Data;
}

export interface Data {
  idZona:               number;
  nombre:               string;
  aforoMax:             number;
  activo:               boolean;
  usuarioCreacion:      number;
  fechaCreacion:        Date;
  usuarioActualizacion: number;
  fechaActualizacion:   Date;
  local:                null;
}
