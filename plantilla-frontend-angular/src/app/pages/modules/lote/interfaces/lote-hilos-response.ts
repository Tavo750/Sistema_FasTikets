export interface ListaGruposHiloResponse {
  responseCode: string;
  message: string;
  data: GrupoHilo[];
}

export interface GrupoHilo {
  TCODIGRUPLOTE: string;
  TCODIUSUA: string;
  TFECHREGI: Date;
  TESTAACTI: string;
}
