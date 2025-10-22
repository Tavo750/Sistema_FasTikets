import { Component , Input, Output, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    // Datos de ejemplo
    this.cartItems = [
      { id: 1, image: '/img/eventos/ub40.jpg', title: 'UB40 Ft. Ali Campbell', category: 'Platinum', price: 410, quantity: 2 },
      { id: 2, image: '/img/eventos/ub40.jpg', title: 'UB40 Ft. Ali Campbell', category: 'VIP',      price: 150, quantity: 2 }
    ];
  }

  get total(): number {
    return this.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
  }

  updateQuantity(id: number, quantity: number): void {
    const it = this.cartItems.find(i => i.id === id);
    if (it) { it.quantity = quantity; }
  }
}