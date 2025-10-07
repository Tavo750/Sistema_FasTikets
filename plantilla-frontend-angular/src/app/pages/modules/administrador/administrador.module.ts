import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministradorRoutingModule } from './administrador-routing.module';
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
    AdministradorRoutingModule
  ]
})
export class AdministradorModule { }
