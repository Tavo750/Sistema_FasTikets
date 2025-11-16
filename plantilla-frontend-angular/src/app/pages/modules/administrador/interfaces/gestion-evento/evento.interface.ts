export interface CrearEventoResponse {
    ok:      boolean;
    mensaje: string;
    data:    Data;
}

export interface CrearEventoRequest {
    nombre: string;
    descripcion: string;
    fechaEvento: string;
    horaInicio: string;
    horaFin: string;
    imagenUrl?: File; // Opcional: para permitir actualizar solo imagenZonasUrl sin modificar el banner
    imagenZonasUrl?: File; // Opcional: para permitir actualizar solo imagenUrl sin modificar las zonas
    tipoEvento: string;
    estadoEvento: string;
    aforoDisponible: number;
    idLocal: number;
    restricciones?: string;
    politicasDevolucion?: string;
    menoresDeEdadPermitidos?: boolean;
}

export interface Data {
    idEvento:        number;
    nombre:          string;
    descripcion:     string;
    fechaEvento:     Date;
    horaInicio:      string;
    horaFin:         string;
    imagenUrl:       string;
    imagenZonasUrl?: string;
    tipoEvento:      string;
    estadoEvento:    string;
    aforoDisponible: number;
    activo:          boolean;
    idLocal:         number;
    nombreLocal:     string;
    fechaCreacion:   Date;
}
