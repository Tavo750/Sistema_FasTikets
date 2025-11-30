export interface CodigosPromocionalesResponse {
    ok:      boolean;
    mensaje: string;
    data:    Data;
}

export interface BodyCodigosPromocionales {
    codigo:             string;
    descripcion:        string;
    fechaFin:           Date;
    tipo:               string;
    valor:              number;
    stock:              number;
    cantidadPorCliente: number;
}

export interface Data {
    idCodigoPromocional: number;
    codigo:              string;
    descripcion:         string;
    fechaFin:            Date;
    tipo:                string;
    valor:               number;
    stock:               number;
    cantidadPorCliente:  number;
    activo:              boolean;
}

