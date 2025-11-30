import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilAdministradorComponent } from './components/perfil-administrador/perfil-administrador.component';
import { GestionLocalesComponent } from './components/gestion-locales/gestion-locales.component';
import { GestionEventosComponent } from './components/gestion-eventos/gestion-eventos.component';
import { GestionClientesComponent } from './components/gestion-clientes/gestion-clientes.component';
import { EditarClienteAdmiComponent } from './components/gestion-clientes/editar-cliente-admi/editar-cliente-admi.component'; // ← IMPORTAR
import { VerDetalleClienteAdmiComponent } from './components/gestion-clientes/ver-detalle-cliente-admi/ver-detalle-cliente-admi.component';
import { CambiarAAdminComponent } from './components/gestion-clientes/cambiar-a-admin/cambiar-a-admin.component';
import { CodigosPromocionalesComponent } from './components/codigos-promocionales/codigos-promocionales.component';
import { RegistroCodigosPromoComponent } from './components/codigos-promocionales/registro-codigos-promo/registro-codigos-promo.component';
import { EditarRegistroPromoComponent } from './components/codigos-promocionales/editar-registro-promo/editar-registro-promo.component';
import { DetalleRegistroPromoComponent } from './components/codigos-promocionales/detalle-registro-promo/detalle-registro-promo.component';
import { LogErroresComponent } from './components/log-errores/log-errores.component';
import { RegistrarErrorComponent } from './components/log-errores/registrar-error/registrar-error.component';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';
import { CrearLocalComponent } from './components/gestion-locales/crear-local/crear-local.component';
import { EditarLocalComponent } from './components/gestion-locales/editar-local/editar-local.component';

import { CambiarContrasenaAdminComponent } from './components/perfil-administrador/cambiar-contrasena-admin/cambiar-contrasena-admin.component';
import { EditarEventoComponent } from './components/gestion-eventos/editar-evento/editar-evento.component';
import { CrearEventoComponent } from './components/gestion-eventos/crear-evento/crear-evento.component';
import { GestionAdministadoresComponent } from './components/gestion-administadores/gestion-administadores.component';
import { ConfiguracionGeneralComponent } from './components/configuracion-general/configuracion-general.component';
const routes: Routes = [
  { path: '', redirectTo: 'perfilAdministrador', pathMatch: 'full' },
  { path: 'perfilAdministrador', component: PerfilAdministradorComponent },
  { path: 'perfilAdministrador/cambiarContra', component: CambiarContrasenaAdminComponent },
  { path: 'gestionLocales', component: GestionLocalesComponent },
  { path: 'gestionLocales/crearLocal', component: CrearLocalComponent },
  { path: 'gestionLocales/editarLocal/:id', component: EditarLocalComponent},
  { path: 'gestionEventos', component: GestionEventosComponent },
  { path: 'gestionEventos/editar/:id', component: EditarEventoComponent },
  { path: 'gestionEventos/crear/:id', component: CrearEventoComponent },
  { path: 'gestionClientes', component: GestionClientesComponent },
  { path: 'gestionClientes/editar/:id', component: EditarClienteAdmiComponent }, // ← AGREGAR ESTA LÍNEA
  { path: 'gestionClientes/detalle/:id', component: VerDetalleClienteAdmiComponent }, // ← AGREGAR
  { path: 'gestionClientes/cambiar-a-admin/:id', component: CambiarAAdminComponent },
  { path: 'codigosPromocionales', component: CodigosPromocionalesComponent },
  { path: 'codigosPromocionales/registro', component: RegistroCodigosPromoComponent },
  { path: 'codigosPromocionales/editar/:id', component: EditarRegistroPromoComponent },
  { path: 'codigosPromocionales/detalle/:id', component: DetalleRegistroPromoComponent },
  { path: 'logErrores', component: LogErroresComponent },
  { path: 'logErrores/registrar', component: RegistrarErrorComponent },
  { path: 'auditoria', component: AuditoriaComponent },
  { path: 'gestionAdministradores', component: GestionAdministadoresComponent },
  { path: 'configuracionGeneral', component: ConfiguracionGeneralComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorRoutingModule { }
