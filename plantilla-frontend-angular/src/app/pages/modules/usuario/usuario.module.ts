import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { PerfilPersonalComponent } from './components/perfil-personal/perfil-personal.component';
import { MisEntradasComponent } from './components/mis-entradas/mis-entradas.component';
import { BeneficiosComponent } from './components/beneficios/beneficios.component';
import { HistorialComprasComponent } from './components/historial-compras/historial-compras.component';


@NgModule({
  declarations: [
    PerfilPersonalComponent,
    MisEntradasComponent,
    BeneficiosComponent,
    HistorialComprasComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule
  ]
})
export class UsuarioModule { }
