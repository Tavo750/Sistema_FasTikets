export interface ZonaCategoriaResponse {
  ok:      boolean;
  mensaje: string;
  data:    Data;
}

export interface Data {
  idZona:               number;
  aforoMax:             number;
  usuarioCreacion:      null;
  usuarioActualizacion: null;
  nombre:               string;
  activo:               boolean;
  fechaCreacion:        null;
  fechaActualizacion:   null;
  idLocal:              number;
}
