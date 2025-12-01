import { Component, Input, Output, OnInit, TrackByFunction, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../../../../shared/services/cart.service';
import { CarritoService } from '../../../../../../shared/services/carrito.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SessionService } from '../../../../../../shared/services/session.service';
import { PurchaseService } from '../../../../../../shared/services/purchase.service';
import { Subscription } from 'rxjs';
import { CartTimerService } from '../../../../../../shared/services/cart-timer.service';
import { LoadingService } from '../../../../../../shared/services/loading.service';
import { ConfiguracionGeneralService } from '../../../../../modules/administrador/services/configuracion-general.service';
import { CodigoPromocionalService, CodigoPromocional } from '../../../../../../shared/services/codigo-promocional.service';

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
  // Configuración de límite de entradas
  private maxEntradasPorCliente: number = 10; // Valor por defecto
  
  // Código promocional
  codigoPromocionalInput: string = '';
  codigoPromocionalAplicado: CodigoPromocional | null = null;
  verificandoCodigo: boolean = false;

  constructor(
    private router: Router,
  private cartService: CartService,
  private purchaseService: PurchaseService,
  private carritoService: CarritoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sessionService: SessionService,
    private cartTimerService: CartTimerService,
    private loadingService: LoadingService,
    private configuracionGeneralService: ConfiguracionGeneralService,
    private codigoPromocionalService: CodigoPromocionalService
  ) {}

  ngOnInit(): void {
    // Cargar configuración de límite de entradas
    this.cargarLimiteEntradasDesdeEndpoint();
    
    // Cargar tiempo límite del carrito desde configuración general
    this.cargarTiempoLimiteCarrito();
    
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
        this.loadingService.show();
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
              // guardar precio base y porcentaje de recargo si vienen desde el backend
              basePrice: (typeof it.precioBase !== 'undefined' && it.precioBase !== null) ? it.precioBase : null,
              surchargePercent: (typeof it.porcentaje !== 'undefined' && it.porcentaje !== null) ? it.porcentaje : 0,
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
            this.loadingService.hide();
          },
          error: (err: any) => {
            console.error('Error cargando items desde servidor:', err);
            // Fallback: suscribirse al CartService local
            this.loadedFromServer = false;
            // Continuar con watcher que manejará la vista
            this.setupCartWatcher();
            this.loadingService.hide();
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
    // Mostrar modal informativo cuando el tiempo expira con overlay completo
    this.confirmationService.confirm({
      key: 'timerExpired',
      header: '⏰ Tiempo Agotado',
      message: 'Lo sentimos, se acabó tu tiempo límite para completar la compra. Tu carrito será vaciado. Por favor, inténtalo otra vez.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Entendido',
      rejectVisible: false,
      acceptButtonStyleClass: 'p-button-danger p-button-lg',
      defaultFocus: 'accept',
      blockScroll: true,
      accept: () => {
        // Cuando el usuario acepta el modal, eliminar items del carrito
        this.deleteAllCartItems();
      },
      reject: () => {
        // Si cierra el modal sin aceptar, también eliminar items
        this.deleteAllCartItems();
      }
    });
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
      this.cartTimerService.clear();
      this.cartService.clearCart();
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

  // Suma de los precios base (precio sin recargo por tiempo)
  getBaseSubtotal(): number {
    return this.cartItems.reduce((sum, it) => {
      const base = (it as any).basePrice != null ? (it as any).basePrice : (it.price || 0);
      return sum + base * (it.quantity || 0);
    }, 0);
  }

  // Calcula el monto total de recargo por tiempo (suma por item)
  getTimeSurchargeAmount(): number {
    return this.cartItems.reduce((sum, it) => {
      const qty = it.quantity || 0;
      const base = (it as any).basePrice != null ? (it as any).basePrice : (it.price || 0);
      const pct = (it as any).surchargePercent || 0;
      // si price y basePrice están disponibles, preferimos la diferencia real
      if ((it.price || 0) > 0 && (it as any).basePrice != null) {
        const diff = (it.price || 0) - base;
        return sum + diff * qty;
      }
      // fallback: calcular por porcentaje sobre base
      return sum + (base * (pct / 100)) * qty;
    }, 0);
  }

  // Si todos los items comparten el mismo porcentaje lo devolvemos, si no devolvemos 'varios'
  getTimeSurchargePercentDisplay(): string {
    const pcts = Array.from(new Set(this.cartItems.map(it => (it as any).surchargePercent || 0)));
    if (pcts.length === 1) return `${pcts[0]}%`;
    // eliminar ceros y si hay uno no cero devolver 'varios' o la lista
    const nonZero = pcts.filter(p => p && p > 0);
    if (nonZero.length === 1) return `${nonZero[0]}%`;
    if (nonZero.length === 0) return '0%';
    return 'Varios';
  }

  getTaxes(): number {
    // Los precios ya incluyen impuestos (16%). Aquí calculamos
    // la porción de impuesto incluida en el subtotal para mostrarla.
    const subtotal = this.getSubtotal();
    if (!subtotal || subtotal === 0) return 0;
    // taxPortion = subtotal - subtotal / (1 + taxRate)
    const taxRate = 0.16;
    const taxPortion = subtotal - (subtotal / (1 + taxRate));
    return Number(taxPortion.toFixed(2));
  }

  getTotal(): number {
    // Como los precios ya incluyen impuestos, el total es simplemente el subtotal
    const subtotal = this.getSubtotal();
    const descuento = this.getDescuentoPromocional();
    return subtotal - descuento;
  }

  // Getter para mantener compatibilidad
  get total(): number {
    return this.getTotal();
  }
  
  /**
   * Calcula el descuento aplicado por código promocional
   */
  getDescuentoPromocional(): number {
    if (!this.codigoPromocionalAplicado) {
      return 0;
    }
    const subtotal = this.getSubtotal();
    return this.codigoPromocionalService.calcularDescuento(this.codigoPromocionalAplicado, subtotal);
  }
  
  /**
   * Verifica y aplica un código promocional
   */
  aplicarCodigoPromocional(): void {
    if (!this.codigoPromocionalInput || this.codigoPromocionalInput.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Código requerido',
        detail: 'Por favor ingresa un código promocional'
      });
      return;
    }

    this.verificandoCodigo = true;
    const codigo = this.codigoPromocionalInput.trim().toUpperCase();

    this.codigoPromocionalService.verificarCodigoPromocional(codigo).subscribe({
      next: (response) => {
        this.verificandoCodigo = false;
        if (response.ok && response.data) {
          // Validar que el código esté activo y tenga stock
          if (!response.data.activo) {
            this.messageService.add({
              severity: 'error',
              summary: 'Código inactivo',
              detail: 'Este código promocional ya no está disponible'
            });
            return;
          }

          if (response.data.stock <= 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Sin stock',
              detail: 'Este código promocional ha alcanzado su límite de uso'
            });
            return;
          }

          // Verificar fecha de expiración
          const fechaFin = new Date(response.data.fechaFin);
          if (fechaFin < new Date()) {
            this.messageService.add({
              severity: 'error',
              summary: 'Código expirado',
              detail: 'Este código promocional ha expirado'
            });
            return;
          }

          // Aplicar código
          this.codigoPromocionalAplicado = response.data;
          const descuentoFormateado = this.codigoPromocionalService.formatearDescuento(response.data);
          this.messageService.add({
            severity: 'success',
            summary: 'Código aplicado',
            detail: `¡Código "${codigo}" aplicado! Descuento: ${descuentoFormateado}`
          });
          console.log('Código promocional aplicado:', response.data);
        }
      },
      error: (error) => {
        this.verificandoCodigo = false;
        console.error('Error verificando código promocional:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Código inválido',
          detail: 'El código promocional ingresado no es válido'
        });
      }
    });
  }
  
  /**
   * Elimina el código promocional aplicado
   */
  eliminarCodigoPromocional(): void {
    this.codigoPromocionalAplicado = null;
    this.codigoPromocionalInput = '';
    this.messageService.add({
      severity: 'info',
      summary: 'Código removido',
      detail: 'El código promocional ha sido removido'
    });
  }

  // Métodos de acciones
  
  /**
   * Obtiene el máximo de entradas configurado por el administrador
   */
  getMaxEntradasPermitidas(): number {
    // Primero intentar obtener desde localStorage (sincronizado por configuración general)
    const maxEntradas = localStorage.getItem('max_entradas_por_cliente');
    if (maxEntradas) {
      const parsed = parseInt(maxEntradas, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 50) {
        return parsed;
      }
    }
    // Si no existe en localStorage, usar el valor cargado desde el endpoint
    return this.maxEntradasPorCliente;
  }
  
  /**
   * Carga el límite de entradas desde el servicio de configuración general
   * y lo sincroniza con localStorage
   */
  private cargarLimiteEntradasDesdeEndpoint(): void {
    try {
      console.debug('CarritoCompraComponent: Cargando límite de entradas desde ConfiguracionGeneralService');
      this.configuracionGeneralService.getConfiguracionPorKey('LIMITE_PERSONAS_COMPRA').subscribe({
        next: (resp) => {
          try {
            if (resp.ok && resp.data) {
              const value = resp.data.value;
              const parsed = value !== null && value !== undefined ? parseFloat(String(value)) : NaN;
              const limite = !isNaN(parsed) ? Math.round(parsed) : NaN;
              
              if (!isNaN(limite) && limite >= 1 && limite <= 50) {
                this.maxEntradasPorCliente = limite;
                // Sincronizar con localStorage para mantener consistencia
                localStorage.setItem('max_entradas_por_cliente', String(limite));
                console.log('Límite de entradas cargado y sincronizado:', limite);
              } else {
                console.info('CarritoCompraComponent: valor de límite no válido, usando valor por defecto', value);
              }
            } else {
              console.warn('No se encontró configuración LIMITE_PERSONAS_COMPRA');
            }
          } catch (e) {
            console.warn('Error procesando respuesta de configuración de límite de entradas', e);
          }
        },
        error: (err) => {
          console.warn('No se pudo obtener configuración de límite de entradas, usando valor por defecto o localStorage', err);
        }
      });
    } catch (e) {
      console.warn('Error iniciando petición de configuración de límite de entradas', e);
    }
  }
  
  /**
   * Carga el tiempo límite del carrito desde el servicio de configuración general
   * Busca en todas las configuraciones la key TIEMPO_CARRO_MINUTOS
   */
  private cargarTiempoLimiteCarrito(): void {
    try {
      console.debug('CarritoCompraComponent: Cargando tiempo límite del carrito desde ConfiguracionGeneralService');
      this.configuracionGeneralService.getConfiguraciones().subscribe({
        next: (resp) => {
          try {
            if (resp.ok && resp.data) {
              // Buscar TIEMPO_CARRO_MINUTOS en la lista de configuraciones
              const configTiempo = resp.data.find((config: any) => config.key === 'TIEMPO_CARRO_MINUTOS');
              
              if (configTiempo) {
                const value = configTiempo.value;
                const parsed = value !== null && value !== undefined ? parseFloat(String(value)) : NaN;
                const minutos = !isNaN(parsed) ? Math.round(parsed) : NaN;
                
                if (!isNaN(minutos) && minutos >= 1 && minutos <= 120) {
                  // Aplicar el tiempo límite al servicio de timer
                  this.cartTimerService.setTimeLimitMinutes(minutos);
                  console.log('Tiempo límite del carrito cargado y aplicado:', minutos, 'minutos');
                } else {
                  console.info('CarritoCompraComponent: valor de tiempo límite no válido, usando valor por defecto del servicio', value);
                }
              } else {
                console.warn('No se encontró configuración TIEMPO_CARRO_MINUTOS en la lista de configuraciones');
              }
            } else {
              console.warn('No se pudieron cargar las configuraciones generales');
            }
          } catch (e) {
            console.warn('Error procesando respuesta de configuraciones para tiempo límite', e);
          }
        },
        error: (err) => {
          console.warn('No se pudo obtener configuraciones generales para tiempo límite, usando valor por defecto del servicio', err);
        }
      });
    } catch (e) {
      console.warn('Error iniciando petición de configuraciones para tiempo límite', e);
    }
  }
  
  /**
   * Calcula el máximo permitido para un item considerando las entradas del mismo evento
   */
  getMaxQuantityForItem(item: CartItem): number {
    const maxGlobal = this.getMaxEntradasPermitidas();
    
    // Calcular cuántas entradas del mismo evento ya están en el carrito (excluyendo este item)
    const entradasDelEvento = this.cartItems
      .filter(i => i.eventId === item.eventId && i.id !== item.id)
      .reduce((sum, i) => sum + i.quantity, 0);
    
    // Retornar el máximo que puede tener este item
    return Math.max(1, maxGlobal - entradasDelEvento);
  }
  
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
    const item = this.cartItems.find(i => i.id === id);
    if (!item) return;
    
    const maxGlobal = this.getMaxEntradasPermitidas();
    
    // Calcular total de entradas del mismo evento
    const entradasOtrosItems = this.cartItems
      .filter(i => i.eventId === item.eventId && i.id !== id)
      .reduce((sum, i) => sum + i.quantity, 0);
    
    const totalEntradas = entradasOtrosItems + quantity;
    
    if (totalEntradas > maxGlobal) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Límite excedido',
        detail: `No puedes tener más de ${maxGlobal} entradas para este evento. Actualmente tienes ${entradasOtrosItems} en otros tipos de entrada.`
      });
      // Restaurar la cantidad máxima permitida
      item.quantity = Math.max(1, maxGlobal - entradasOtrosItems);
      this.cartService.updateQuantity(id, item.quantity);
      return;
    }
    
    this.cartService.updateQuantity(id, quantity);
  }

  continueShopping(): void {
    // Navegar de vuelta a la página principal donde están todos los eventos
    this.router.navigate(['/home/inicio']);
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
    // Navegar a la página principal donde están todos los eventos disponibles
    this.router.navigate(['/home/inicio']);
  }
}
