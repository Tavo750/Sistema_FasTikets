export interface CodigosPromocionalesListResponse {
    ok:      boolean;
    mensaje: string;
    data:    Data[];
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
}