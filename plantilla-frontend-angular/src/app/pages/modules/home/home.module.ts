import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';
import { SharedModule } from '../../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { CarritoCompraComponent } from './inicio/components/carrito-compra/carrito-compra.component';
import { CompraEntradasComponent } from './inicio/components/compra-entradas/compra-entradas.component';
import { EventoComponent } from './inicio/components/evento/evento.component';



@NgModule({
  declarations: [
    InicioComponent,
    CarritoCompraComponent,
    CompraEntradasComponent,
    EventoComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    SharedModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
