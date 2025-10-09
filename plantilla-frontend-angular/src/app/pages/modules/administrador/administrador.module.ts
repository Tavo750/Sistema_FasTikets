import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdministradorRoutingModule } from './administrador-routing.module';
import { GestionLocalesComponent } from './components/gestion-locales/gestion-locales.component';
import { GestionEventosComponent } from './components/gestion-eventos/gestion-eventos.component';
import { GestionClientesComponent } from './components/gestion-clientes/gestion-clientes.component';
import { CodigosPromocionalesComponent } from './components/codigos-promocionales/codigos-promocionales.component';
import { LogErroresComponent } from './components/log-errores/log-errores.component';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';
import { PerfilAdministradorComponent } from './components/perfil-administrador/perfil-administrador.component';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CambiarContrasenaAdminComponent } from './components/perfil-administrador/cambiar-contrasena-admin/cambiar-contrasena-admin.component';

@NgModule({
  declarations: [
    GestionLocalesComponent,
    GestionEventosComponent,
    GestionClientesComponent,
    CodigosPromocionalesComponent,
    LogErroresComponent,
    AuditoriaComponent,
    PerfilAdministradorComponent,
    CambiarContrasenaAdminComponent
  ],
  imports: [
    CommonModule,
    AdministradorRoutingModule,
    ReactiveFormsModule,
    // PrimeNG
    ButtonModule,
    InputTextModule,
    DropdownModule
  ]
})
export class AdministradorModule { }
