export interface RegistroResponse {
  ok:      boolean;
  mensaje: string;
  data:    Data;
}

export interface Data {
  email:   string;
  mensaje: string;
  exito:   boolean;
  timestamp: Date;
  status:    number;
  error:     string;
  message:   string;
  path:      string;
  details:   null;

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


