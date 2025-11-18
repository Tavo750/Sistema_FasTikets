import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { CoreModule } from '../../../core/core.module';

import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';
import { MessageService, ConfirmationService } from 'primeng/api';

import { PerfilPersonalComponent } from './components/perfil-personal/perfil-personal.component';
import { MisEntradasComponent } from './components/mis-entradas/mis-entradas.component';
import { BeneficiosComponent } from './components/beneficios/beneficios.component';
import { HistorialComprasComponent } from './components/historial-compras/historial-compras.component';
import { HistorialDetalleComponent } from './components/historial-detalle/historial-detalle.component';
import { CambiarContrasenaUsuarioComponent } from './components/perfil-personal/cambiar-contrasena-usuario/cambiar-contrasena-usuario.component';
import { ConfirmarTransferenciaComponent } from './components/mis-entradas/confirmar-transferencia.component';
import { TransferirEntradaComponent } from './components/transferir-entrada/transferir-entrada.component';

import { ProgressBarModule } from 'primeng/progressbar';
import { AyudaSoporteComponent } from './components/ayuda-soporte/ayuda-soporte.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { CambiarMiContrasenaClienteComponent } from './components/configuracion/cambiar-mi-contrasena-cliente/cambiar-mi-contrasena-cliente.component';
import { AsuntoSoporteComponent } from './components/ayuda-soporte/asunto-soporte/asunto-soporte.component';

@NgModule({
  declarations: [
    TransferirEntradaComponent,
    MisEntradasComponent,
    BeneficiosComponent,
    PerfilPersonalComponent,
    CambiarContrasenaUsuarioComponent,
    HistorialComprasComponent,
  ConfirmarTransferenciaComponent,
  AyudaSoporteComponent,
  CambiarMiContrasenaClienteComponent,
  AsuntoSoporteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsuarioRoutingModule,
    CoreModule,
    PrimeNgModule,
    ProgressBarModule,
    ConfiguracionComponent,
    HistorialDetalleComponent
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsuarioModule { }
