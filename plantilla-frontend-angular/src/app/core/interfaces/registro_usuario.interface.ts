export interface RegistroResponse {
  email:   string;
  mensaje: string;
  exito:   boolean;
}

export interface RegistroUsuario {
  docIdentidad: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  direccion: string;
  contrasena: string;
  fechaNacimiento: string;
  tipoDocumento: string;
  rol: string;
}
