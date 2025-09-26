export interface LoginResponse {
  responseCode: string;
  data: Usuario;
  message?: string;
}

export interface Usuario {
  codiPers: string;
  nombPers: string;
  codiPues: number;
  linkFoto: string;
  permissions: Permiso[];
}

export interface Permiso {
  TCODIPROC: number;
  TNOMBPROC: string;
}

//BasicResponse
export interface BasicResponse {
  responseCode: string;
  message: string;
}
