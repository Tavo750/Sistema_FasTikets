
export interface FavoritosResponse {
    ok:      boolean;
    mensaje: string;
    data:    Datum[];
}

export interface Datum {
    idEvento:                number;
    nombre:                  string;
    descripcion:             string;
    fechaEvento:             Date;
    horaInicio:              string;
    horaFin:                 string;
    imagenUrl:               string;
    imagenZonasUrl:          string;
    tipoEvento:              string;
    estadoEvento:            string;
    aforoDisponible:         number;
    activo:                  boolean;
    idLocal:                 number;
    nombreLocal:             string;
    fechaCreacion:           Date;
    menoresDeEdadPermitidos: boolean;
    restricciones:           string;
    politicasDevolucion:     string;
}


export interface AgregaFavoritoResponse {
    ok:      boolean;
    mensaje: string;
    data:    Datum;
}

export interface QuitaFavoritoResponse {
    ok:      boolean;
    mensaje: string;
    data:    Data;
}

export interface Data {
}
