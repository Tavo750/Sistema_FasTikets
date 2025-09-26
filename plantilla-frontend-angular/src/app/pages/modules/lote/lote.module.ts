import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';
import { SharedModule } from '../../../shared/shared.module';
import { LoteRoutingModule } from './lote-routing.module';
import { AgregarComponent } from './components/agregar/agregar.component';



@NgModule({
  declarations: [
    AgregarComponent,
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    SharedModule,
    LoteRoutingModule
  ]
})
export class LoteModule { }
