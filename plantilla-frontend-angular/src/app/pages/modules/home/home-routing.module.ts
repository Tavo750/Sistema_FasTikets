import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { CarritoCompraComponent } from './inicio/components/carrito-compra/carrito-compra.component';
import { CompraEntradasComponent } from './inicio/components/compra-entradas/compra-entradas.component';
import { EventoComponent } from './inicio/components/evento/evento.component';



const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'carritoCompra', component: CarritoCompraComponent },
  { path: 'compraEntradas', component: CompraEntradasComponent },
  { path: 'evento', component: EventoComponent },
  { path: 'evento/:id', component: EventoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
