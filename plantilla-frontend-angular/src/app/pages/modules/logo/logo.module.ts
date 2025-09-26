import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './components/inicio/inicio.component';
import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';
import { SharedModule } from 'primeng/api';
import { LogoRoutingModule } from './logo-routing.module';



@NgModule({
  declarations: [
    InicioComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    SharedModule,
    LogoRoutingModule
  ]
})
export class LogoModule { }
