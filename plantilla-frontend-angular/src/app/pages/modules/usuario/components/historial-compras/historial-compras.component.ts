import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial-compras',
  standalone: false,
  templateUrl: './historial-compras.component.html',
  styleUrls: ['./historial-compras.component.css']
})
export class HistorialComprasComponent {

  // Datos de ejemplo; reemplazar con llamada al backend cuando esté listo
  purchases = [
    {
      id: 1,
      purchaseNumber: '#61601087',
      title: 'Electronic Festival',
      date: '18/07/2025',
      dateFull: '18 de julio de 2025 - 20:00',
      tickets: 2,
      items: [{ desc: 'Entrada General', qty: 2, price: 75 }],
      total: 150.0,
      puntosCanjeados: 40,
      descuento: 20.0,
      nombres: 'Luis Enrique Rios Sosa',
      dni: '72894616',
      puntosObtenidos: 18,
      detallePago: '#29311205',
      medioPago: 'VISA',
      monto: 390.0,
      tarjetaMasked: '455788XXXXXX1589',
      estado: 'Rechazado',
      statusClass: 'status-rejected',
      fechaCompra: '24/08/2025',
      image: '/assets/img/banners/electronic-festival.jpg',
      qrData: 'QR_DATA_1'
    },
    {
      id: 2,
      purchaseNumber: '#61601088',
      title: 'Electronic Festival',
      date: '18/07/2025',
      dateFull: '18 de julio de 2025 - 20:00',
      tickets: 2,
      items: [{ desc: 'Entrada VIP', qty: 2, price: 75 }],
      total: 150.0,
      puntosCanjeados: 0,
      descuento: 0,
      nombres: 'Ana María López',
      dni: '71234567',
      puntosObtenidos: 12,
      detallePago: '#29311206',
      medioPago: 'VISA',
      monto: 150.0,
      tarjetaMasked: '455788XXXXXX1589',
      estado: 'Aprobado',
      statusClass: 'status-approved',
      fechaCompra: '24/08/2025',
      image: '/assets/img/banners/electronic-festival.jpg',
      qrData: 'QR_DATA_2'
    },
    {
      id: 3,
      purchaseNumber: '#61601089',
      title: 'Electronic Festival',
      date: '18/07/2025',
      dateFull: '18 de julio de 2025 - 20:00',
      tickets: 2,
      items: [{ desc: 'Entrada General', qty: 2, price: 75 }],
      total: 150.0,
      puntosCanjeados: 0,
      descuento: 0,
      nombres: 'Carlos Rivera',
      dni: '70123456',
      puntosObtenidos: 18,
      detallePago: '#29311207',
      medioPago: 'VISA',
      monto: 150.0,
      tarjetaMasked: '455788XXXXXX1589',
      estado: 'Transferido',
      statusClass: 'status-transfer',
      fechaCompra: '24/08/2025',
      image: '/assets/img/banners/electronic-festival.jpg',
      qrData: 'QR_DATA_3'
    },
    {
      id: 4,
      purchaseNumber: '#61601090',
      title: 'UB40 Ft. Alli Campbell',
      date: '09/09/2025',
      dateFull: '09 de septiembre de 2025 - 19:30',
      tickets: 1,
      items: [{ desc: 'Entrada V.I.P', qty: 1, price: 410 }],
      total: 410.0,
      puntosCanjeados: 0,
      descuento: 20.0,
      nombres: 'Luis Enrique Rios Sosa',
      dni: '72894616',
      puntosObtenidos: 18,
      detallePago: '#29311205',
      medioPago: 'VISA',
      monto: 390.0,
      tarjetaMasked: '455788XXXXXX1589',
      estado: 'Aprobado',
      statusClass: 'status-approved',
      fechaCompra: '24/08/2025',
      image: '/assets/img/banners/ub40.jpg',
      qrData: 'QR_DATA_4'
    }
  ];

  // Filtros (no funcionales todavía)
  filterCategory = '';
  filterStatus = '';
  filterDate = '';

  constructor(private router: Router) {}

  viewDetail(p: any) {
    // Navigate to detail page and pass purchase in navigation state
    const url = `/usuario/historialCompras/detalle/${p.id}`;
    // Pass the real purchase object so the detail page shows the correct layout
    this.router.navigateByUrl(url, { state: { purchase: p } });
  }

}
