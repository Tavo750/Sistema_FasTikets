import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { UsuarioRoutingModule } from './usuario-routing.module';

import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';
import { MessageService, ConfirmationService } from 'primeng/api';

import { PerfilPersonalComponent } from './components/perfil-personal/perfil-personal.component';
import { MisEntradasComponent } from './components/mis-entradas/mis-entradas.component';
import { BeneficiosComponent } from './components/beneficios/beneficios.component';
import { HistorialComprasComponent } from './components/historial-compras/historial-compras.component';
import { CambiarContrasenaUsuarioComponent } from './components/perfil-personal/cambiar-contrasena-usuario/cambiar-contrasena-usuario.component';



@NgModule({
  declarations: [
    MisEntradasComponent,
    BeneficiosComponent,
    PerfilPersonalComponent,
    CambiarContrasenaUsuarioComponent,
    HistorialComprasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsuarioRoutingModule,
    PrimeNgModule,
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsuarioModule { }
