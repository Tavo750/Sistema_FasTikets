// ===== INTERFACES PARA GESTIÓN DE ADMINISTRADORES =====

// Interfaz base para los datos del administrador
export interface Administrador {
  idAdministrador: number;
  tipoDocumento: string;
  docIdentidad: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  direccion: string;
  cargo: string;
  edad: number;
  activo: boolean;
  ultimoAccesoFormateado: string;
}

// ===== OBTENER ADMINISTRADOR POR ID =====
// GET /api/v1/administrador/perfil/{id}
export interface AdministradorPorIdResponse extends Administrador {}

// ===== LISTAR TODOS LOS ADMINISTRADORES =====
// GET /api/v1/administrador/listar
export interface ListarAdministradoresResponse {
  ok: boolean;
  mensaje: string;
  data: Administrador[];
}

// ===== MODIFICAR ADMINISTRADOR =====
// PUT /api/v1/administrador/perfil/{id}
export interface ModificarAdministradorRequest {
  nombres: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  cargo: string;
  email: string;
}

export interface ModificarAdministradorResponse {
  ok: boolean;
  mensaje: string;
  data: Administrador;
}

// ===== DESACTIVAR ADMINISTRADOR =====
// PUT /api/v1/administrador/desactivar/{id}
export interface DesactivarAdministradorResponse {
  ok: boolean;
  mensaje: string;
  data: {};
}
