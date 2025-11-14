export interface LogErroresResponse {
    ok:      boolean;
    mensaje: string;
    data:    ErrorRecord[];
}

export interface ErrorRecord {
    idError:      number;
    fechaHora:    Date;
    severidad:    'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO';
    modulo:       string;
    mensaje:      string;
    traza:        string;
    solucionado:  boolean;
    adminEmail?:  string;
}

export interface CrearErrorRequest {
    severidad:    'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO';
    modulo:       string;
    mensaje:      string;
    traza:        string;
}

export interface CrearErrorResponse {
    ok:      boolean;
    mensaje: string;
    data:    ErrorRecord;
}