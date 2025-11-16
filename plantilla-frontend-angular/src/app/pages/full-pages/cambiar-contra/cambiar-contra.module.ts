import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CambiarContraRoutingModule } from './cambiar-contra-routing.module';
import { CambiarContraComponent } from './cambiar-contra.component';
import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';


@NgModule({
  declarations: [
    CambiarContraComponent,
  ],
  imports: [
    CommonModule,
    CambiarContraRoutingModule,
    PrimeNgModule
  ]
})
export class CambiarContraModule { }
