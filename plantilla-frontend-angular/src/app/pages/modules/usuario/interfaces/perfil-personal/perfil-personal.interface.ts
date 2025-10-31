export interface PerfilPersonalResponse {
    ok:      boolean;
    mensaje: string;
    data:    Data;
}
export interface BodyPerfilPersonal {
    nombres:   string;
    apellidos: string;
    telefono:  string;
    direccion: string;
    email:     string;
}

export interface Data {
    idCliente:        number;
    tipoDocumento:    string;
    docIdentidad:     string;
    nombres:          string;
    apellidos:        string;
    telefono:         string;
    email:            string;
    fechaNacimiento:  Date;
    direccion:        string;
    puntosAcumulados: number;
    nivel:            string;
    edad:             number;
}
