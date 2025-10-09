import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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
import { CrearLocalComponent } from './components/gestion-locales/crear-local/crear-local.component';
import { EditarLocalComponent } from './components/gestion-locales/editar-local/editar-local.component';
import { EditarEventoComponent } from './components/gestion-eventos/editar-evento/editar-evento.component';
import { CrearEventoComponent } from './components/gestion-eventos/crear-evento/crear-evento.component';

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
    CrearLocalComponent,
    EditarLocalComponent
    CambiarContrasenaAdminComponent,
    EditarEventoComponent,
    CrearEventoComponent
  ],
  imports: [
    CommonModule,
    AdministradorRoutingModule,
    ReactiveFormsModule,
    PrimeNgModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdministradorModule { }
