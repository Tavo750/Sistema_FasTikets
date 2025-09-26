import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CotizacionRoutingModule } from './cotizacion-routing.module';
import { CrearComponent } from './components/crear/crear.component';
import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModificarComponent } from './components/modificar/modificar.component';


@NgModule({
  declarations: [
    CrearComponent,
    ModificarComponent
  ],
  imports: [
    CommonModule,
    CotizacionRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule
  ]
})
export class CotizacionModule { }
