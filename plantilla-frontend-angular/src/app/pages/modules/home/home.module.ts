import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';
import { SharedModule } from '../../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { CarritoCompraComponent } from './inicio/components/carrito-compra/carrito-compra.component';
import { CompraEntradasComponent } from './inicio/components/compra-entradas/compra-entradas.component';
import { EventoComponent } from './inicio/components/evento/evento.component';
import { CarritoItemComponent }   from './inicio/components/carrito-compra/carrito-item/carrito-item.component';
import { ResumenCarritoCompraComponent } from './inicio/components/carrito-compra/resumen-carrito-compra/resumen-carrito-compra.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    InicioComponent,
    CarritoCompraComponent,
    CompraEntradasComponent,
    EventoComponent,
    CarritoItemComponent,
    ResumenCarritoCompraComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    SharedModule,
    HomeRoutingModule,
    FormsModule,
  ]
})
export class HomeModule { }
