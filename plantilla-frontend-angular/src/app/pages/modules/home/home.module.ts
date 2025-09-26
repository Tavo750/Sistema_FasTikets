import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';
import { SharedModule } from '../../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { InicioComponent } from './inicio/inicio.component';



@NgModule({
  declarations: [
    InicioComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    SharedModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
