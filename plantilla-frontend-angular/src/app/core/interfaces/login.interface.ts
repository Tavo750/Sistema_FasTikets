export interface LoginResponse {
  ok:      boolean;
  mensaje: string;
  persona: Persona;
}

export interface Usuario {
  codiPers: string;
  nombPers: string;
  linkFoto: string;
  codiPues: number;
  permissions: any[];
}

export interface BasicResponse {
  ok: boolean;
  mensaje: string;
}

export interface Persona {
  idPersona:             number;
  usuario_creacion:      null;
  usuario_actualizacion: null;
  docIdentidad:          string;
  nombres:               string;
  apellidos:             string;
  telefono:              string;
  email:                 string;
  direccion:             string;
  contrasena:            string;
  fechaNacimiento:       Date;
  fecha_creacion:        Date;
  fecha_actualizacion:   null;
  activo:                boolean;
  tipoDocumento:         string;
  rol:                   string;
}
