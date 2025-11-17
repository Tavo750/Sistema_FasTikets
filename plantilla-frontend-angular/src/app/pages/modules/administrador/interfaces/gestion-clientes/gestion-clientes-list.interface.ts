export interface GestionClientesListResponse {
    ok: boolean;
    mensaje: string;
    data: Data[];
}

export interface Data {
    idCliente: number;
    tipoDocumento: string;
    docIdentidad: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    email: string;
    fechaNacimiento: string;
    direccion: string;
    puntosAcumulados: number;
    nivel: string;
    edad: number;
    fechaCreacion: string;
    verificado: boolean;
}