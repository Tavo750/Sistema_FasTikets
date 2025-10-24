import { Component,Input  } from '@angular/core';

@Component({
  selector: 'app-resumen-carrito-compra',
  standalone: false,
  templateUrl: './resumen-carrito-compra.component.html',
  styleUrls: ['./resumen-carrito-compra.component.css']
})
export class ResumenCarritoCompraComponent {
  @Input() subtotal = 0;
  @Input() additionalCharges = 0;
  @Input() taxes = 0;
  @Input() promoCode = '';
  @Input() discount = 0;
  @Input() total = 0;
  @Input() isPromoValid: boolean | null = null;  // null = not applied yet
}
