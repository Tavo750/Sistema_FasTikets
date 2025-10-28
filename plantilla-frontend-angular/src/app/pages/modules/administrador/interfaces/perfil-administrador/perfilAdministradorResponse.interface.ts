export interface PerfilAdministradorResponse {
  ok:      boolean;
  mensaje: string;
  data:    Data;
}

export interface Data {
  idAdministrador: number;
  tipoDocumento:   string;
  docIdentidad:    string;
  nombres:         string;
  apellidos:       string;
  telefono:        string;
  email:           string;
  fechaNacimiento: Date;
  direccion:       string;
  cargo:           string;
  edad:            number;
  activo:          boolean;
}
