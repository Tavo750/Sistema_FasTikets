export interface LoginResponse {
  ok:      boolean;
  mensaje: string;
  data:    Data;
  persona?: Persona; // Agregamos persona para compatibilidad con el código existente
}

export interface Data {
  token:          string;
  tipo:           string;
  idUsuario:      number;
  email:          string;
  nombreCompleto: string;
  rol:            string;
  expiracion:     number;
}

export interface BasicResponse {
  ok: boolean;
  mensaje: string;
}

export interface Usuario {
  codiPers: string;
  nombPers: string;
  linkFoto: string;
  codiPues: number;
  permissions: string[];
}

export interface Persona {
  docIdentidad: string;
  nombres: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  rol?: string; // Agregamos rol para compatibilidad
}
