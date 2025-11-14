export interface AyudaSoporteRequest {
	idUsuario: number;
	asunto: string;
	mensaje: string;
	prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | string;
	canalOrigen: string;
	ipOrigen?: string;
	metadataAdicional?: string;
}

export interface AyudaSoporteData {
	idSolicitud: number;
	idUsuario: number;
	nombreUsuario: string;
	emailUsuario: string;
	asunto: string;
	mensaje: string;
	estado: string;
	prioridad: string;
	canalOrigen: string;
	ipOrigen?: string;
	metadataAdicional?: string;
	observaciones?: string | null;
	fechaCreacion?: string | null;
	fechaActualizacion?: string | null;
	fechaCierre?: string | null;
}

export interface AyudaSoporteResponse {
	ok: boolean;
	mensaje: string;
	data?: AyudaSoporteData;
}

