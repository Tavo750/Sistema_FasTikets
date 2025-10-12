import { Component, Input } from '@angular/core';


interface TicketType {
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-evento',
  standalone: false,
  templateUrl: './evento.component.html',
  styleUrl: './evento.component.css'
})
export class EventoComponent {
  @Input() imageUrl: string = 'assets/images/ub40.jpg';
    @Input() title: string = 'UB40 Ft. Ali Campbell';
    @Input() date: string = 'Jueves 11 de Septiembre, 2025';
    @Input() time: string = '06:00 PM';

    tickets: TicketType[] = [
      { name: 'Platinum', price: 410.00, quantity: 0 },
      { name: 'Vip',      price: 150.00, quantity: 0 },
      { name: 'Tribuna',  price: 130.00, quantity: 0 },
      { name: 'General',  price: 100.00, quantity: 0 },
    ];

    increment(t: TicketType) {
      t.quantity++;
    }

    decrement(t: TicketType) {
      if (t.quantity > 0) { t.quantity--; }
    }

    onAddToCart() {
      // aquí disparar lógica para añadir al carrito
      console.log('Añadir al carrito', this.tickets.filter(t => t.quantity > 0));
    }

    onBuyNow() {
      // aquí disparar flujo de compra inmediata
      console.log('Comprar ahora', this.tickets.filter(t => t.quantity > 0));
    }
}
