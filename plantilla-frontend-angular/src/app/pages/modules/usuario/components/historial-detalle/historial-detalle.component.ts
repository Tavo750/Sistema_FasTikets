import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-detalle.component.html',
  styleUrls: ['./historial-detalle.component.css']
})
export class HistorialDetalleComponent implements OnInit {
  purchase: any = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Try to read purchase from navigation state
    const state: any = this.router.getCurrentNavigation()?.extras?.state as any;
    if (state && state.purchase) {
      this.purchase = state.purchase;
      return;
    }

    // Otherwise try to read from history.state (fallback)
    if ((history as any).state && (history as any).state.purchase) {
      this.purchase = (history as any).state.purchase;
      return;
    }

    // If still not available, try id param and show minimal placeholder
    const id = this.route.snapshot.paramMap.get('id');
    // For development: if no state, show a "Transferido" example to test the UI
    if (!id) {
      this.purchase = {
        id: 'T-0001',
        purchaseNumber: '#61601087',
        title: 'Electronic Festival',
        image: '/assets/img/banners/electronic-festival.jpg',
        estado: 'Transferido',
        dateFull: '24/08/2025',
        fechaCompra: '24/08/2025',
        items: [{ qty: 1, desc: 'General', price: 150 }],
        puntosCanjeados: 40,
        puntosObtenidos: 18,
        descuento: 0,
        monto: 150,
        tarjetaMasked: '455788XXXXXX1589',
        detallePago: '#29311205',
        medioPago: 'VISA',
        nombres: 'Comprador Ejemplo',
        dni: '12345678',
        personaTransferida: { nombre: 'Luis Enrique Rios Sosa', dni: '72894616' }
      };
    } else {
      this.purchase = { id, purchaseNumber: id ? `#${id}` : 'N/A', title: 'Compra', image: '/assets/img/banners/electronic-festival.jpg' };
    }
  }

  back() {
    this.router.navigateByUrl('/usuario/historialCompras');
  }

  downloadQr() {
    console.log('Descargar QR', this.purchase?.qrData || this.purchase);
  }
}
