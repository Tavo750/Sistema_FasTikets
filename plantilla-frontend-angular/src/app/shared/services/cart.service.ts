import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from './session.service';

export interface CartItem {
  id: number;
  title: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  eventId?: string;
  ticketType?: string;
  eventDate?: string;
  eventVenue?: string;
}

export interface TicketForCart {
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private nextId = 1;

  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {
    // Cargar datos del localStorage si existen
    this.loadCartFromStorage();
  }

  // Obtener todos los items del carrito
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  // Obtener observable de items del carrito
  getCartItems$(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  // Añadir tickets de un evento al carrito
  addEventTicketsToCart(
    tickets: TicketForCart[],
    eventInfo: {
      title: string;
      image: string;
      date: string;
      venue: string;
      eventId?: string;
    }
  ): void {
    const currentItems = this.cartItemsSubject.value;
    const newItems = [...currentItems];

    tickets.forEach(ticket => {
      if (ticket.quantity > 0) {
        // Verificar si ya existe un item similar en el carrito
        const existingItemIndex = newItems.findIndex(item =>
          item.title === eventInfo.title &&
          item.category === ticket.name
        );

        if (existingItemIndex !== -1) {
          // Si existe, actualizar la cantidad
          newItems[existingItemIndex].quantity += ticket.quantity;
        } else {
          // Si no existe, crear nuevo item
          const newItem: CartItem = {
            id: this.nextId++,
            title: eventInfo.title,
            category: ticket.name,
            price: ticket.price,
            quantity: ticket.quantity,
            image: eventInfo.image,
            eventId: eventInfo.eventId || '',
            ticketType: ticket.name,
            eventDate: eventInfo.date,
            eventVenue: eventInfo.venue
          };
          newItems.push(newItem);
        }
      }
    });

    this.cartItemsSubject.next(newItems);
    this.saveCartToStorage();
  }

  // Añadir un item individual al carrito
  addItem(item: CartItem): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(i =>
      i.title === item.title && i.category === item.category
    );

    if (existingItemIndex !== -1) {
      currentItems[existingItemIndex].quantity += item.quantity;
    } else {
      item.id = this.nextId++;
      currentItems.push(item);
    }

    this.cartItemsSubject.next([...currentItems]);
    this.saveCartToStorage();
  }

  // Remover item del carrito
  removeItem(itemId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const filteredItems = currentItems.filter(item => item.id !== itemId);
    this.cartItemsSubject.next(filteredItems);
    this.saveCartToStorage();
  }

  // Actualizar cantidad de un item
  updateQuantity(itemId: number, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(i => i.id === itemId);

    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
        this.cartItemsSubject.next([...currentItems]);
        this.saveCartToStorage();
      }
    }
  }

  // Limpiar carrito
  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCartToStorage();
  }

  // Obtener cantidad total de items
  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  // Obtener precio total
  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Verificar si el usuario puede proceder al checkout
  canProceedToCheckout(): boolean {
    return this.sessionService.isAuthenticated();
  }

  // Proceder al checkout (redirige al login si es necesario)
  proceedToCheckout(): boolean {
    if (this.canProceedToCheckout()) {
      // El usuario está autenticado, puede proceder
      return true;
    } else {
      // El usuario no está autenticado, redirigir al login
      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: '/usuario/checkout', // o la ruta que corresponda
          message: 'Debes iniciar sesión para completar tu compra'
        }
      });
      return false;
    }
  }

  // Guardar carrito en localStorage
  private saveCartToStorage(): void {
    try {
      const cartData = {
        items: this.cartItemsSubject.value,
        nextId: this.nextId
      };
      localStorage.setItem('fastikets-cart', JSON.stringify(cartData));
    } catch (error) {
      console.error('Error al guardar el carrito en localStorage:', error);
    }
  }

  // Cargar carrito desde localStorage
  private loadCartFromStorage(): void {
    try {
      const savedCart = localStorage.getItem('fastikets-cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        this.cartItemsSubject.next(cartData.items || []);
        this.nextId = cartData.nextId || 1;
      }
    } catch (error) {
      console.error('Error al cargar el carrito desde localStorage:', error);
    }
  }
}
