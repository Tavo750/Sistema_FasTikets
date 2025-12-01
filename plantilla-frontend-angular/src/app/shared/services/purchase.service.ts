import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from './cart.service';

export interface PurchaseData {
  eventInfo: {
    title: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    organizer: string;
    image: string;
  };
  tickets: Array<{
    name: string;
    price: number;
    quantity: number;
    description?: string;
  }>;
  totalTickets: number;
  totalPrice: number;
  source?: 'evento' | 'carrito'; // Para identificar de dónde viene la compra
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private purchaseDataSubject = new BehaviorSubject<PurchaseData | null>(null);
  public purchaseData$ = this.purchaseDataSubject.asObservable();

  constructor() {}

  // Establecer datos de compra desde el componente evento
  setPurchaseDataFromEvent(data: PurchaseData): void {
    this.purchaseDataSubject.next(data);
  }

  // Establecer datos de compra desde el carrito
  setPurchaseDataFromCart(cartItems: CartItem[]): void {
    if (cartItems.length === 0) return;

    // Agrupar items por evento
    const eventGroups = cartItems.reduce((groups, item) => {
      const eventKey = item.eventId || item.title;
      if (!groups[eventKey]) {
        groups[eventKey] = {
          eventInfo: {
            title: item.title,
            date: item.eventDate || '',
            time: item.eventTime || '',
            venue: item.eventVenue || '',
            address: item.eventAddress || '',
            organizer: item.eventOrganizer || '',
            image: item.image
          },
          tickets: [],
          totalTickets: 0,
          totalPrice: 0
        };
      }
      return groups;
    }, {} as { [key: string]: any });

    // Convertir items del carrito a formato de tickets
    cartItems.forEach(item => {
      const eventKey = item.eventId || item.title;
      const group = eventGroups[eventKey];

      group.tickets.push({
        name: item.category,
        price: item.price,
        quantity: item.quantity,
        description: this.getTicketDescription(item.category)
      });

      group.totalTickets += item.quantity;
      group.totalPrice += item.price * item.quantity;
    });

    // Por ahora, tomar el primer evento (se puede extender para múltiples eventos)
    const firstEvent = Object.values(eventGroups)[0] as PurchaseData;
    firstEvent.source = 'carrito';

    this.purchaseDataSubject.next(firstEvent);
  }

  // Obtener datos de compra actuales
  getPurchaseData(): PurchaseData | null {
    return this.purchaseDataSubject.value;
  }

  // Limpiar datos de compra
  clearPurchaseData(): void {
    this.purchaseDataSubject.next(null);
  }

  // Obtener descripción del ticket
  private getTicketDescription(ticketName: string): string {
    const descriptions: { [key: string]: string } = {
      'Platinum': 'Acceso VIP completo, zona preferencial y servicios exclusivos',
      'Vip': 'Zona VIP con servicios premium y vista privilegiada',
      'Tribuna': 'Asientos con buena vista del escenario',
      'General': 'Acceso general al evento'
    };
    return descriptions[ticketName] || 'Entrada estándar al evento';
  }
}
