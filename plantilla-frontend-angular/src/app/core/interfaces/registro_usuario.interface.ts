export interface RegistroResponse {
  ok:      boolean;
  mensaje: string;
  data:    Data;
}

export interface Data {
  email:   string;
  mensaje: string;
  exito:   boolean;
}

export interface RegistroUsuario {
  tipoDocumento: string;
  docIdentidad: string;
  nombres: string;
  apellidos: string;
  email: string;
  contrasena: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
  idDistrito: number;
}
