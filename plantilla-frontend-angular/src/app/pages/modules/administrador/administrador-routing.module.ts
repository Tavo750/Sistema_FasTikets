import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilAdministradorComponent } from './components/perfil-administrador/perfil-administrador.component';
import { GestionLocalesComponent } from './components/gestion-locales/gestion-locales.component';
import { GestionEventosComponent } from './components/gestion-eventos/gestion-eventos.component';
import { GestionClientesComponent } from './components/gestion-clientes/gestion-clientes.component';
import { CodigosPromocionalesComponent } from './components/codigos-promocionales/codigos-promocionales.component';
import { LogErroresComponent } from './components/log-errores/log-errores.component';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';
import { CambiarContrasenaAdminComponent } from './components/perfil-administrador/cambiar-contrasena-admin/cambiar-contrasena-admin.component';
import { EditarEventoComponent } from './components/gestion-eventos/editar-evento/editar-evento.component';
import { CrearEventoComponent } from './components/gestion-eventos/crear-evento/crear-evento.component';
const routes: Routes = [
  { path: '', redirectTo: 'perfilAdministrador', pathMatch: 'full' },
  { path: 'perfilAdministrador', component: PerfilAdministradorComponent },
  { path: 'perfilAdministrador/cambiarContra', component: CambiarContrasenaAdminComponent },
  { path: 'gestionLocales', component: GestionLocalesComponent },
  { path: 'gestionEventos', component: GestionEventosComponent },
  { path: 'gestionEventos/editar/:id', component: EditarEventoComponent },
  { path: 'gestionEventos/crear/:id', component: CrearEventoComponent },
  { path: 'gestionClientes', component: GestionClientesComponent },
  { path: 'codigosPromocionales', component: CodigosPromocionalesComponent },
  { path: 'logErrores', component: LogErroresComponent },
  { path: 'auditoria', component: AuditoriaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorRoutingModule { }
