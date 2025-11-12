export interface departamentoResponse {
  ok: boolean;
  mensaje: string;
  data: Departamento[];
}

export interface provinciaResponse {
  ok: boolean;
  mensaje: string;
  data: Provincia[];
}

export interface distritoResponse {
  ok: boolean;
  mensaje: string;
  data: Distrito[];
}

export interface Departamento {
  idDepartamento: number;
  nombre: string;
}

export interface Provincia {
  idProvincia: number;
  nombre: string;
}

export interface Distrito {
  idDistrito: number;
  nombre: string;
}
