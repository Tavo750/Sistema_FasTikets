export interface LoginResponse {
  ok:      boolean;
  mensaje: string;
  data:    Data; // Agregamos persona para compatibilidad con el código existente
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


