export interface LocalResponse {
    ok:      boolean;
    mensaje: string;
    data:    Data;
}

export interface ListarLocalesResponse {
    ok:      boolean;
    mensaje: string;
    data:    Data[];
}

export interface Data {
    idLocal:        number;
    nombre:         string;
    direccion:      string;
    aforoTotal:     number;
    activo:         boolean;
    idDistrito:     number;
    nombreDistrito: string;
    fechaCreacion:  Date;
}
