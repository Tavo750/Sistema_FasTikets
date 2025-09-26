import { Component } from '@angular/core';
import { Factura, FacturaCabecera } from '../../../../../core/interfaces/factura-registro.interface';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  value: string | undefined;
  date: Date | undefined;
  divisas: string[] = ['PEN', 'USD', 'EUR'];

  registro: FacturaCabecera = {
  numeroOC: 1752,
  proveedor: 'FERCOM',
  numeroProveedor: 20219,
  divisa: '',
  totalOC: 254.24,
  totalAsociado: 254.24,
  facturas: [
    {
      numero: 4769797,
      fecha: new Date() ,
      facturado: '720.00',
      pendiente: '0.00',
      asociado: '254.24'
    }
  ],
    nomLote: '',
    fechaUltimoPago: '23-08-2012',
    retenido: 'No',
    numeroCheque: '151',
    despachar: '',
    lineaOC: 'Múltiple',
    envioOC: ''
  };

  nuevaFactura:Factura ={
    numero: 0,
    fecha: new Date(),
    facturado: '',
    pendiente: '',
    asociado: ''
  };

  agregarFactura() {
    this.registro.facturas.push({ ...this.nuevaFactura });

    // ✅ Restablece con estructura válida
    this.nuevaFactura = {
      numero: 0,
      fecha: new Date(),
      facturado: '',
      pendiente: '',
      asociado: ''
    };
  }

}
