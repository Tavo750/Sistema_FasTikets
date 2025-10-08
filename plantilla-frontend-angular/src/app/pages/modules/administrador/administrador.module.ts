import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdministradorRoutingModule } from './administrador-routing.module';
import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';

import { GestionLocalesComponent } from './components/gestion-locales/gestion-locales.component';
import { GestionEventosComponent } from './components/gestion-eventos/gestion-eventos.component';
import { GestionClientesComponent } from './components/gestion-clientes/gestion-clientes.component';
import { CodigosPromocionalesComponent } from './components/codigos-promocionales/codigos-promocionales.component';
import { LogErroresComponent } from './components/log-errores/log-errores.component';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';
import { PerfilAdministradorComponent } from './components/perfil-administrador/perfil-administrador.component';


@NgModule({
  declarations: [
    GestionLocalesComponent,
    GestionEventosComponent,
    GestionClientesComponent,
    CodigosPromocionalesComponent,
    LogErroresComponent,
    AuditoriaComponent,
    PerfilAdministradorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdministradorRoutingModule,
    PrimeNgModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdministradorModule { }
