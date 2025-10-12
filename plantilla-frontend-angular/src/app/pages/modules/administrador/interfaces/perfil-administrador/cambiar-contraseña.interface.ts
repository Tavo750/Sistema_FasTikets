export interface CambiarContrasenaRequest {
    contrasenaActual: string;
    contrasenaNueva: string;
    contrasenaConfirmacion: string;
}

export interface CambiarContrasenaResponse {
    ok:      boolean;
    mensaje: string;
    data:    Data;
}

export interface Data {
    timestamp: Date;
    status:    number;
    error:     string;
    message:   string;
    path:      string;
    details:   string;
}
