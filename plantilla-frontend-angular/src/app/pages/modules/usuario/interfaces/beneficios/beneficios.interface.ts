export interface BeneficiosResponse {
    ok:      boolean;
    mensaje: string;
    data:    Data;
}

export interface Data {
    idCliente:        number;
    puntosAcumulados: number;
    mensaje:          string;
}
