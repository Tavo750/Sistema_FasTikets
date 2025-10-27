import { Component, Input, Output, OnInit, TrackByFunction } from '@angular/core';
import { Router } from '@angular/router';

export interface CartItem {
  id: number;
  title: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-carrito-compra',
  standalone: false,
  templateUrl: './carrito-compra.component.html',
  styleUrls: ['./carrito-compra.component.css']
})
export class CarritoCompraComponent implements OnInit {
  cartItems: CartItem[] = [];
  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    // Datos de ejemplo
    this.cartItems = [
      {
        id: 1,
        image: 'https://via.placeholder.com/150x150/3498db/ffffff?text=UB40',
        title: 'UB40 Ft. Ali Campbell - Concierto en Vivo',
        category: 'Platinum',
        price: 410,
        quantity: 2
      },
      {
        id: 2,
        image: 'https://via.placeholder.com/150x150/e74c3c/ffffff?text=EVENTO',
        title: 'Festival de Rock Internacional 2025',
        category: 'VIP',
        price: 150,
        quantity: 1
      },
      {
        id: 3,
        image: 'https://via.placeholder.com/150x150/2ecc71/ffffff?text=CONCIERTO',
        title: 'Noche de Jazz en el Teatro Nacional',
        category: 'General',
        price: 85,
        quantity: 3
      }
    ];
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
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
  }

  updateQuantity(id: number, quantity: number): void {
    const item = this.cartItems.find(i => i.id === id);
    if (item) {
      item.quantity = quantity;
    }
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
