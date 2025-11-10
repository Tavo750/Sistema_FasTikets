import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  // id asignado por el servidor al persistir el item del carrito (opcional)
  serverId?: number;
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

  constructor() {
    // No usamos localStorage: todo el estado se manejará por BD/servidor.
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
  ): number[] {
    const currentItems = this.cartItemsSubject.value;
    const newItems = [...currentItems];
    const createdLocalIds: number[] = [];

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
          createdLocalIds.push(newItems[existingItemIndex].id);
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
          createdLocalIds.push(newItem.id);
        }
      }
    });

    this.cartItemsSubject.next(newItems);
    // Defensive: ensure no cart-related keys remain in localStorage.
    // Algunos navegadores o versiones antiguas del proyecto pudieron persistir el carrito
    // en localStorage bajo distintas claves. Para evitar que pulsar "Añadir al carrito"
    // vuelva a dejar datos en el storage, limpiamos cualquier clave común relacionada
    // con carrito antes de devolver los ids locales.
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const pattern = /cart|carrito|shopping|cartitems|shopping_cart/i;
        Object.keys(window.localStorage).forEach(key => {
          if (pattern.test(key)) {
            window.localStorage.removeItem(key);
          }
        });
      }
    } catch (e) {
      // No bloquear la operación si el acceso a localStorage falla (p. ej. modo SSR o bloqueo de terceros)
      // Solo registramos en consola para depuración si es necesario.
      // console.warn('No se pudo limpiar localStorage de claves de carrito:', e);
    }
    return createdLocalIds;
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
    // Evitar persistencia accidental en localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const pattern = /cart|carrito|shopping|cartitems|shopping_cart/i;
        Object.keys(window.localStorage).forEach(key => {
          if (pattern.test(key)) {
            window.localStorage.removeItem(key);
          }
        });
      }
    } catch (e) {
      // silently ignore
    }
  }

  // Remover item del carrito
  removeItem(itemId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const filteredItems = currentItems.filter(item => item.id !== itemId);
    this.cartItemsSubject.next(filteredItems);
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
        // no persistence on client; state is managed server-side
      }
    }
  }

  // Limpiar carrito
  clearCart(): void {
    this.cartItemsSubject.next([]);
    // no persistence on client; state is managed server-side
  }

  /**
   * Reemplaza el contenido del carrito en memoria por los items que vienen del servidor.
   * Esto es útil para sincronizar el estado inicial del frontend con la BD cuando el usuario
   * inicia sesión o carga su carrito.
   */
  setCartItems(items: CartItem[]): void {
    // Asegurar ids locales únicos
    items.forEach(item => {
      if (!item.id || typeof item.id !== 'number') {
        item.id = this.nextId++;
      } else {
        // Mantener nextId por encima de cualquier id existente para evitar colisiones
        if (item.id >= this.nextId) this.nextId = item.id + 1;
      }
    });

    this.cartItemsSubject.next([...items]);
  }

  // Remover item del carrito en memoria (actualiza el BehaviorSubject) sin persistencia en cliente
  removeLocalOnly(itemId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const filteredItems = currentItems.filter(item => item.id !== itemId);
    this.cartItemsSubject.next(filteredItems);
    // NOTE: operación en memoria únicamente
  }

  // Establecer el serverId (id del item en la BD) para un item local
  setServerId(localId: number, serverId: number): void {
    const items = this.cartItemsSubject.value;
    const item = items.find(i => i.id === localId);
    if (item) {
      item.serverId = serverId;
      this.cartItemsSubject.next([...items]);
      // actualización en memoria
    }
  }

  // Obtener cantidad total de items
  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  // Obtener precio total
  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Nota: la persistencia del carrito en localStorage fue eliminada; el estado se maneja desde el servidor.
}
