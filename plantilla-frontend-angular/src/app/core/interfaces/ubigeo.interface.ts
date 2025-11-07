export interface Departamento {
  id: string;
  nombre: string;
}

export interface Provincia {
  id: string;
  nombre: string;
  departamento_id: string;
}

export interface Distrito {
  id: string;
  nombre: string;
  provincia_id: string;
}
