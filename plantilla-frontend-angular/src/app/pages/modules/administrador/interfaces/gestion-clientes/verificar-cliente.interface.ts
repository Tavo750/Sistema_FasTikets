export interface VerificarClienteResponse {
    ok: boolean;
    mensaje: string;
    data: VerificarClienteData;
}

export interface VerificarClienteData {
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