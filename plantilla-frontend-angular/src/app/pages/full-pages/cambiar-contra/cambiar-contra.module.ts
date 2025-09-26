import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CambiarContraRoutingModule } from './cambiar-contra-routing.module';
import { CambiarContraComponent } from './cambiar-contra.component';


@NgModule({
  declarations: [
    CambiarContraComponent,
  ],
  imports: [
    CommonModule,
    CambiarContraRoutingModule
  ]
})
export class CambiarContraModule { }
