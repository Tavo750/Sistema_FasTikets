import { Component, Input, Output, OnInit, TrackByFunction, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../../../../shared/services/cart.service';
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

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del carrito
    this.cartSubscription = this.cartService.getCartItems$().subscribe(
      (items: CartItem[]) => {
        this.cartItems = items;
      }
    );
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

  // Cálculos del carrito
  getSubtotal(): number {
    return this.cartService.getTotalPrice();
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
    this.cartService.removeItem(item.id);
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
    // Navegar al proceso de pago
    this.router.navigate(['/home/compraEntradas']);
    console.log('Proceder al pago');
    // Aquí podrías usar el Router para navegar al checkout
  }

  exploreEvents(): void {
    // Navegar a la página de exploración de eventos
    console.log('Explorar eventos');
    // Aquí podrías usar el Router para navegar a los eventos
  }
}
