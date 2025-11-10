import { Component, Input, Output, OnInit, TrackByFunction, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../../../../shared/services/cart.service';
import { CarritoService } from '../../../../../../shared/services/carrito.service';
import { MessageService } from 'primeng/api';
import { SessionService } from '../../../../../../shared/services/session.service';
import { PurchaseService } from '../../../../../../shared/services/purchase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carrito-compra',
  standalone: false,
  templateUrl: './carrito-compra.component.html',
  styleUrls: ['./carrito-compra.component.css']
})
export class CarritoCompraComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private cartSubscription: Subscription = new Subscription();
  // Indica si los items fueron cargados desde el servidor (true) o desde el carrito local (false)
  private loadedFromServer = false;

  constructor(
    private router: Router,
  private cartService: CartService,
  private purchaseService: PurchaseService,
  private carritoService: CarritoService,
    private messageService: MessageService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    // Cargar items desde servidor si hay usuario autenticado
    try {
  const user = this.sessionService.getCurrentUser();
  try { console.debug('CarritoCompraComponent: currentUser', user); } catch(e){}
      const idCliente = user?.idUsuario;
      if (idCliente) {
        this.carritoService.getItemsFromServer(idCliente).subscribe({
        next: (resp: any) => {
            // Log raw response to help diagnose structure issues
            try { console.debug('getItemsFromServer raw response:', resp); } catch (e) {}

            // Intentar varias formas de extraer el array de items según diferentes respuestas del backend
            let itemsSource: any = null;
            if (Array.isArray(resp)) {
              itemsSource = resp;
            } else if (Array.isArray(resp?.data)) {
              itemsSource = resp.data;
            } else if (Array.isArray(resp?.data?.items)) {
              itemsSource = resp.data.items;
            } else if (Array.isArray(resp?.items)) {
              itemsSource = resp.items;
            } else if (resp?.data && typeof resp.data === 'object') {
              // A veces backend devuelve { data: { items: [...] } } o { data: [...] }
              // Si data tiene keys numéricas tratamos de convertirlo a array
              const maybeArray = Object.keys(resp.data).map(k => resp.data[k]).filter(Boolean);
              if (maybeArray.length > 0) itemsSource = maybeArray;
            }

            const items = itemsSource || [];
            if (!itemsSource) {
              console.warn('Estructura de respuesta inesperada al cargar carrito, se usará lista vacía');
            }

            this.cartItems = items.map((it: any) => ({
              id: it.idItemCarrito || it.idTipoTicket || Math.floor(Math.random() * 1000000),
              title: it.nombreTicket || it.nombre || it.descripcion || 'Ticket',
              category: it.nombreTicket || it.categoria || '',
              price: it.precioUnitario || it.precio || it.precioVenta || 0,
              quantity: it.cantidad || it.cantidadSeleccionada || 0,
              image: it.imagenUrl || '',
              serverId: it.idItemCarrito || it.id
            }));
            // Marcamos que la lista proviene del servidor
            this.loadedFromServer = true;

            // Sincronizar el CartService para que el header y otras vistas reflejen el conteo real
            try {
              this.cartService.setCartItems(this.cartItems);
            } catch (e) {
              console.warn('No se pudo sincronizar CartService con items del servidor', e);
            }

            console.log('Carrito cargado desde servidor, items:', this.cartItems.length);
            this.cartItems.forEach(it => console.log(`Cart item - localId: ${it.id}, serverId: ${it.serverId}, title: ${it.title}, qty: ${it.quantity}`));
          },
          error: (err: any) => {
            console.error('Error cargando items desde servidor:', err);
            // Fallback: suscribirse al CartService local
            this.loadedFromServer = false;
            this.cartSubscription = this.cartService.getCartItems$().subscribe((items: CartItem[]) => this.cartItems = items);
          }
        });
      } else {
        // No autenticado: usar carrito local
        this.loadedFromServer = false;
        this.cartSubscription = this.cartService.getCartItems$().subscribe((items: CartItem[]) => this.cartItems = items);
      }
    } catch (e) {
      console.error('Error inicializando carrito:', e);
      this.loadedFromServer = false;
      this.cartSubscription = this.cartService.getCartItems$().subscribe((items: CartItem[]) => this.cartItems = items);
    }
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones
    this.cartSubscription.unsubscribe();
  }

  // TrackBy function para mejorar el rendimiento
  trackByFn: TrackByFunction<CartItem> = (index: number, item: CartItem) => item.id;

  // Método para obtener el color de la categoría
  getCategorySeverity(category: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | null {
    switch (category.toLowerCase()) {
      case 'platinum':
        return 'success';
      case 'vip':
        return 'warning';
      case 'general':
        return 'info';
      default:
        return 'secondary';
    }
  }

  // Cálculos del carrito (basados en los items cargados actualmente)
  getSubtotal(): number {
    return this.cartItems.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);
  }

  getTaxes(): number {
    return this.getSubtotal() * 0.16; // 16% de impuestos
  }

  getShipping(): number {
    return this.getSubtotal() > 200 ? 0 : 25; // Envío gratis por compras mayores a $200
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTaxes() + this.getShipping();
  }

  // Getter para mantener compatibilidad
  get total(): number {
    return this.getTotal();
  }

  // Métodos de acciones
  removeItem(item: CartItem): void {
    // Si el item viene del servidor (tiene serverId y cargamos desde servidor), llamar al endpoint DELETE
    const currentUser = this.sessionService.getCurrentUser();
    const idCliente = currentUser?.idUsuario;

    if (this.loadedFromServer && item.serverId && idCliente) {
      // Llamada al backend para eliminar
      this.carritoService.deleteItemOnServer(item.serverId, idCliente).subscribe({
        next: (resp: any) => {
          // Quitar item de la vista/local
          this.cartService.removeLocalOnly(item.id);
          this.cartItems = this.cartItems.filter(i => i.id !== item.id);
          this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Item eliminado del carrito (servidor).' });
        },
        error: (err: any) => {
          console.error('Error eliminando item en servidor:', err);
          const status = err?.status;
          const body = err?.error;
          const message = err?.message || (body && (body.mensaje || body.message)) || JSON.stringify(body) || 'Error desconocido';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `No se pudo eliminar el item en el servidor (${status}): ${message}` });
        }
      });
    } else {
      // Si no hay serverId o no estamos autenticados, eliminar localmente
      this.cartService.removeItem(item.id);
      this.cartItems = this.cartItems.filter(i => i.id !== item.id);
      this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Item removido de la vista.' });
    }
  }

  updateQuantity(id: number, quantity: number): void {
    this.cartService.updateQuantity(id, quantity);
  }

  continueShopping(): void {
    // Navegar de vuelta a la página de eventos
    console.log('Continuar comprando');
    // Aquí podrías usar el Router para navegar
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      console.log('No hay items en el carrito');
      return;
    }

    // Enviar datos del carrito al servicio de compra
    this.purchaseService.setPurchaseDataFromCart(this.cartItems);

    // Navegar al proceso de pago
    this.router.navigate(['/home/compraEntradas']);
    console.log('Proceder al pago');
  }

  exploreEvents(): void {
    // Navegar a la página de exploración de eventos
    console.log('Explorar eventos');
    // Aquí podrías usar el Router para navegar a los eventos
  }
}
