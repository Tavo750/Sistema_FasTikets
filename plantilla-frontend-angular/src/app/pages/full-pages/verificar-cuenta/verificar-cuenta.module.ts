import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerificarCuentaRoutingModule } from './verificar-cuenta-routing.module';
import { VerificarCuentaComponent } from './verificar-cuenta.component';


@NgModule({
  declarations: [
    VerificarCuentaComponent
  ],
  imports: [
    CommonModule,
    VerificarCuentaRoutingModule
  ]
})
export class VerificarCuentaModule { }
