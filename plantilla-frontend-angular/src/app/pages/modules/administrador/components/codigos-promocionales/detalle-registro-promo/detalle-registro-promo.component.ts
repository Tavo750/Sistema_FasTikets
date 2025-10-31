import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface CodigoPromocional {
  idCodigoPromocional: number;
  codigo: string;
  descripcion: string;
  fechaFin: string;
  tipo: 'PORCENTAJE' | 'MONTO_FIJO';
  valor: number;
  stock: number;
  cantidadPorCliente: number;
}

@Component({
  selector: 'app-detalle-registro-promo',
  standalone: false,
  templateUrl: './detalle-registro-promo.component.html',
  styleUrls: ['./detalle-registro-promo.component.css']
})
export class DetalleRegistroPromoComponent implements OnInit {
  data: CodigoPromocional = {
    idCodigoPromocional: 1,
    codigo: 'PikeStereo',
    descripcion: 'Concierto Monumental',
    fechaFin: '2025-11-15T10:01:36.472',
    tipo: 'MONTO_FIJO',
    valor: 7.0,
    stock: 0,
    cantidadPorCliente: 3
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // TODO: cargar detalle por id
    // Ejemplo:
    // this.codigoPromocionalService.obtenerDetalle(id).subscribe({
    //   next: (response) => {
    //     if (response.ok) {
    //       this.data = response.data;
    //     }
    //   },
    //   error: (err) => console.error('Error al cargar detalle:', err)
    // });
  }
}