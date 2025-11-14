export interface AuditoriaResponse {
    ok:      boolean;
    mensaje: string;
    data:    AuditoriaRecord[];
}

export interface AuditoriaRecord {
    idAudit:    number;
    fechaHora:  string;  // Cambiado a string ya que viene como ISO string
    accion:     string;
    modulo:     string;
    detalle:    string;
    adminEmail: string;
}
