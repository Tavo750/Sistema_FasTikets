import { Component, Input, Output, OnInit, TrackByFunction, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../../../../shared/services/cart.service';
import { CarritoService } from '../../../../../../shared/services/carrito.service';
import { MessageService } from 'primeng/api';
import { SessionService } from '../../../../../../shared/services/session.service';
import { PurchaseService } from '../../../../../../shared/services/purchase.service';
import { Subscription } from 'rxjs';
import { CartTimerService } from '../../../../../../shared/services/cart-timer.service';

@Component({
  selector: 'app-carrito-compra',
  standalone: false,
  templateUrl: './carrito-compra.component.html',
  styleUrls: ['./carrito-compra.component.css']
})
export class CarritoCompraComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private cartSubscription: Subscription | null = null;
  private timerSubscriptions: Subscription[] = [];
  // Indica si los items fueron cargados desde el servidor (true) o desde el carrito local (false)
  private loadedFromServer = false;
  // Temporizador: delegado al servicio compartido
  showTimer: boolean = false;
  timerDisplay: string = '';

  constructor(
    private router: Router,
  private cartService: CartService,
  private purchaseService: PurchaseService,
  private carritoService: CarritoService,
    private messageService: MessageService,
    private sessionService: SessionService
    ,
    private cartTimerService: CartTimerService
  ) {}

  ngOnInit(): void {
    // Cargar items desde servidor si hay usuario autenticado
    try {
  const user = this.sessionService.getCurrentUser();
  try { console.debug('CarritoCompraComponent: currentUser', user); } catch(e){}
      // Suscribirse al servicio de temporizador para mostrar estado (siempre)
      try {
        this.timerSubscriptions.push(this.cartTimerService.display$.subscribe(d => this.timerDisplay = d));
        this.timerSubscriptions.push(this.cartTimerService.running$.subscribe(r => this.showTimer = r));
        this.timerSubscriptions.push(this.cartTimerService.expired$.subscribe(() => this.handleTimerExpired()));
      } catch (e) { console.warn('No se pudo suscribir a cartTimerService', e); }
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

            // Iniciar temporizador centralizado si hay items
            try {
              const userId = this.sessionService.getCurrentUser()?.idUsuario;
              if (this.cartItems && this.cartItems.length > 0) {
                this.cartTimerService.startIfNotStarted(userId);
              }
            } catch (e) {
              console.warn('No se pudo inicializar temporizador tras carga desde servidor', e);
            }

            console.log('Carrito cargado desde servidor, items:', this.cartItems.length);
            this.cartItems.forEach(it => console.log(`Cart item - localId: ${it.id}, serverId: ${it.serverId}, title: ${it.title}, qty: ${it.quantity}`));
            // Inicializar el watcher del carrito para controlar el temporizador
            this.setupCartWatcher();
            // Suscribirse al servicio de temporizador para mostrar estado
            try {
              this.timerSubscriptions.push(this.cartTimerService.display$.subscribe(d => this.timerDisplay = d));
              this.timerSubscriptions.push(this.cartTimerService.running$.subscribe(r => this.showTimer = r));
              this.timerSubscriptions.push(this.cartTimerService.expired$.subscribe(() => this.handleTimerExpired()));
            } catch (e) { console.warn('No se pudo suscribir a cartTimerService', e); }
          },
          error: (err: any) => {
            console.error('Error cargando items desde servidor:', err);
            // Fallback: suscribirse al CartService local
            this.loadedFromServer = false;
            // Continuar con watcher que manejará la vista
            this.setupCartWatcher();
          }
        });
      } else {
        // No autenticado: usar carrito local
        this.loadedFromServer = false;
        this.setupCartWatcher();
      }
    } catch (e) {
      console.error('Error inicializando carrito:', e);
      this.loadedFromServer = false;
      this.setupCartWatcher();
    }
  }

  /**
   * Configura la suscripción al CartService para detectar cambios y controlar el temporizador.
   */
  private setupCartWatcher(): void {
    // Evitar suscribir varias veces
    if (this.cartSubscription && !this.cartSubscription.closed) return;

    this.cartSubscription = this.cartService.getCartItems$().subscribe((items: CartItem[]) => {
      const prevCount = this.cartItems?.length || 0;
      this.cartItems = items;
      const newCount = items?.length || 0;

      // Si antes no había items y ahora sí: iniciar temporizador centralizado
      const userId = this.sessionService.getCurrentUser()?.idUsuario;
      if (prevCount === 0 && newCount > 0) {
        this.cartTimerService.startIfNotStarted(userId);
      }

      // Si ahora no hay items: limpiar temporizador
      if (newCount === 0) {
        this.cartTimerService.clear();
      }
    });
  }

  // Timer lifecycle now handled by CartTimerService

  private handleTimerExpired(): void {
    // Cuando el temporizador expira el servicio se encarga de limpiar storage;
    // aquí únicamente eliminamos los items del carrito en el servidor/local.
    this.deleteAllCartItems();
  }

  private deleteAllCartItems(): void {
    const currentUser = this.sessionService.getCurrentUser();
    const idCliente = currentUser?.idUsuario;
    if (this.loadedFromServer && idCliente) {
      // Eliminar cada item por serverId
      const itemsToDelete = this.cartItems.filter(i => i.serverId).map(i => i.serverId) as number[];
      if (itemsToDelete.length === 0) {
        // no hay server ids: limpiar local
        this.cartService.clearCart();
        this.messageService.add({ severity: 'info', summary: 'Carrito', detail: 'Carrito limpiado.' });
        return;
      }

      let deletedCount = 0;
      itemsToDelete.forEach(idItemCarrito => {
        this.carritoService.deleteItemOnServer(idItemCarrito, idCliente).subscribe({
          next: () => {
            deletedCount++;
            // remover localmente
            // buscar local item con ese serverId
            const local = this.cartItems.find(ci => ci.serverId === idItemCarrito);
            if (local) this.cartService.removeLocalOnly(local.id);
            if (deletedCount === itemsToDelete.length) {
              this.messageService.add({ severity: 'warn', summary: 'Tiempo agotado', detail: 'Tiempo de reserva vencido. Carrito eliminado.' });
              // limpiar cualquier remanente
              this.cartService.clearCart();
              this.cartTimerService.clear();
            }
          },
          error: (err) => {
            console.error('Error eliminando item del carrito por temporizador:', err);
            // continuar intentando con los demás
            deletedCount++;
            if (deletedCount === itemsToDelete.length) {
              this.cartService.clearCart();
            }
          }
        });
      });
    } else {
        this.messageService.add({ severity: 'warn', summary: 'Tiempo agotado', detail: 'Tiempo de reserva vencido. Carrito eliminado.' });
        this.cartTimerService.clear();
      this.cartService.clearCart();
      this.messageService.add({ severity: 'warn', summary: 'Tiempo agotado', detail: 'Tiempo de reserva vencido. Carrito eliminado.' });
    }
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones
    if (this.cartSubscription) {
      try { this.cartSubscription.unsubscribe(); } catch (e) { console.warn('Error unsubscribing cartSubscription', e); }
    }
    try {
      this.timerSubscriptions.forEach(s => { try { s.unsubscribe(); } catch (e) {} });
    } catch (e) {}
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
