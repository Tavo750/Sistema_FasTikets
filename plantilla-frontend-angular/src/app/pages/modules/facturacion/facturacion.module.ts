import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './components/registro/registro.component';
import { FacturacionRoutingModule } from './facturacion-routing.module';
import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';



@NgModule({
  declarations: [
    RegistroComponent,
  ],
  imports: [
    CommonModule,
    FacturacionRoutingModule,
    PrimeNgModule

  ]
})
export class FacturacionModule { }
