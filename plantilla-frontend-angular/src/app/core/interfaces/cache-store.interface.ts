import { Data } from "./login.interface";

export interface Usuario {
  codiPers: string;
  nombPers: string;
  linkFoto: string;
  codiPues: number;
  permissions: any[];
}

export interface CacheStore {
  usuario: Usuario;
  persona?: Data;
}
