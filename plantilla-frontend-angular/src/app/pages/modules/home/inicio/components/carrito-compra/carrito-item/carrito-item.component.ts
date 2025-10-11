import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface CartItem {
  id: number;
  title: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-carrito-item',
  standalone: false,
  templateUrl: './carrito-item.component.html',
  styleUrls: ['./carrito-item.component.css']
})
export class CarritoItemComponent {
  @Input() item!: CartItem;
  @Output() remove = new EventEmitter<CartItem>();
  @Output() updateQuantity = new EventEmitter<{ id: number; quantity: number }>();

  onDecrement(): void {
    if (this.item.quantity > 1) {
      this.changeQuantity(this.item.quantity - 1);
    }
  }

  onIncrement(): void {
    this.changeQuantity(this.item.quantity + 1);
  }

  onRemove(): void {
    this.remove.emit(this.item);
  }

  private changeQuantity(qty: number): void {
    this.item.quantity = qty;
    this.updateQuantity.emit({ id: this.item.id, quantity: qty });
  }
}