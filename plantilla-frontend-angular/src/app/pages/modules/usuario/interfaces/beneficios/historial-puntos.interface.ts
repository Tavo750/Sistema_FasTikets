export interface HistorialPuntosResponse {
    ok:      boolean;
    mensaje: string;
    data:    Datum[];
}

export interface Datum {
    idPuntos:         number;
    cantPuntos:       number;
    fechaVencimiento: Date;
    fechaTransaccion: Date;
    tipoTransaccion:  string;
    activo:           boolean;
    idRegla:          number;
    idCliente:        number;
}