export interface LogErroresResponse {
    ok:      boolean;
    mensaje: string;
    data:    Datum[];
}

export interface Datum {
    idError:        number;
    fechaHora:      Date;
    severidad:      Severidad;
    modulo:         string;
    mensajeBreve:   string;
    detalleTecnico: string;
    nombreAdmin:    NombreAdmin;
}

export enum NombreAdmin {
    Sistema = "Sistema",
}

export enum Severidad {
    Error = "ERROR",
    Warn = "WARN",
}

// Interfaces para crear errores
export interface CrearErrorRequest {
    fechaHora: string;
    severidad: string;
    modulo: string;
    mensajeBreve: string;
    detalleTecnico: string;
    traza: string;
}

export interface CrearErrorResponse {
    ok: boolean;
    mensaje: string;
    data: Datum;
}

