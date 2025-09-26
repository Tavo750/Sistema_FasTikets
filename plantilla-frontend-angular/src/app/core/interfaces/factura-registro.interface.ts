export interface Factura {
  numero: number;
  fecha: Date;
  facturado: string;
  pendiente: string;
  asociado: string;
}

export interface FacturaCabecera {
  numeroOC: number;
  proveedor: string;
  numeroProveedor: number;
  divisa: string;
  totalOC: number;
  totalAsociado: number;
  facturas: Factura[];
  nomLote: string;
  fechaUltimoPago: string;
  retenido: string;
  numeroCheque: string | number;
  despachar: string;
  lineaOC: string;
  envioOC: string;
}
