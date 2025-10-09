import { Usuario, Persona } from "./login.interface";

export interface CacheStore {
  usuario: Usuario;
  persona?: Persona;
}
