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
import { RegistrarErrorComponent } from './components/log-errores/registrar-error/registrar-error.component';
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

// PrimeNG Services
import { ConfirmationService, MessageService } from 'primeng/api';
import { EditarClienteAdmiComponent } from './components/gestion-clientes/editar-cliente-admi/editar-cliente-admi.component';
import { VerDetalleClienteAdmiComponent } from './components/gestion-clientes/ver-detalle-cliente-admi/ver-detalle-cliente-admi.component';
import { RegistroCodigosPromoComponent } from './components/codigos-promocionales/registro-codigos-promo/registro-codigos-promo.component';
import { EditarRegistroPromoComponent } from './components/codigos-promocionales/editar-registro-promo/editar-registro-promo.component';
import { DetalleRegistroPromoComponent } from './components/codigos-promocionales/detalle-registro-promo/detalle-registro-promo.component';
import { GestionAdministadoresComponent } from './components/gestion-administadores/gestion-administadores.component';
import { CambiarAAdminComponent } from './components/gestion-clientes/cambiar-a-admin/cambiar-a-admin.component';
import { ConfiguracionGeneralComponent } from './components/configuracion-general/configuracion-general.component';

@NgModule({
  declarations: [
    GestionLocalesComponent,
    GestionEventosComponent,
    GestionClientesComponent,
    CodigosPromocionalesComponent,
    LogErroresComponent,
    RegistrarErrorComponent,
    AuditoriaComponent,
    PerfilAdministradorComponent,
    CrearLocalComponent,
    EditarLocalComponent,
    CambiarContrasenaAdminComponent,
    EditarEventoComponent,
    CrearEventoComponent,
    EditarClienteAdmiComponent,
    VerDetalleClienteAdmiComponent,
    RegistroCodigosPromoComponent,
    EditarRegistroPromoComponent,
    DetalleRegistroPromoComponent,
    GestionAdministadoresComponent,
    CambiarAAdminComponent,
    ConfiguracionGeneralComponent
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
  providers: [
    ConfirmationService,
    MessageService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdministradorModule { }
