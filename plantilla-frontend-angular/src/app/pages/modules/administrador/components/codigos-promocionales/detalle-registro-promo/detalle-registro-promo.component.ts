import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-detalle-registro-promo',
  standalone: false,
  templateUrl: './detalle-registro-promo.component.html',
  styleUrls: ['./detalle-registro-promo.component.css']
})
export class DetalleRegistroPromoComponent implements OnInit{
  data = {
    codigo: 'SHAKIRACNRT',
    descripcion: 'Código promocional concierto',
    fechaExpiracion: '10/09/2025',
    tipo: 'PORCENTAJE', // PORCENTAJE | DINERO
    valor: 10,
    segmento: 'EVENTO',  // EVENTO | CLIENTE
    elementos: ['Concierto Shakira', 'Concierto Nuevo']
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // TODO: cargar detalle por id
  }
}
