import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilPersonalComponent } from './components/perfil-personal/perfil-personal.component';
import { BeneficiosComponent } from './components/beneficios/beneficios.component';
import { HistorialComprasComponent } from './components/historial-compras/historial-compras.component';
import { HistorialDetalleComponent } from './components/historial-detalle/historial-detalle.component';
import { MisEntradasComponent } from './components/mis-entradas/mis-entradas.component';
import { ConfirmarTransferenciaComponent } from './components/mis-entradas/confirmar-transferencia.component';
import { CambiarContrasenaUsuarioComponent } from './components/perfil-personal/cambiar-contrasena-usuario/cambiar-contrasena-usuario.component';
import { AyudaSoporteComponent } from './components/ayuda-soporte/ayuda-soporte.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { CambiarMiContrasenaClienteComponent } from './components/configuracion/cambiar-mi-contrasena-cliente/cambiar-mi-contrasena-cliente.component';
import { AsuntoSoporteComponent } from './components/ayuda-soporte/asunto-soporte/asunto-soporte.component';

const routes: Routes = [
  { path: '', redirectTo: 'perfilPersonal', pathMatch: 'full' },
  { path: 'perfilPersonal', component: PerfilPersonalComponent },
  { path: 'beneficios', component: BeneficiosComponent },
  { path: 'historialCompras', component: HistorialComprasComponent },
  { path: 'historialCompras/detalle/:id', component: HistorialDetalleComponent },
  { path: 'misEntradas', component: MisEntradasComponent },
  { path: 'confirmarTransferencia', component: ConfirmarTransferenciaComponent },
  { path: 'perfilPersonal/cambiarContra', component: CambiarContrasenaUsuarioComponent },
  { path: 'ayudaSoporte', component: AyudaSoporteComponent },
  { path: 'configuracion', component: ConfiguracionComponent },
  { path: 'configuracion/cambiarContrasena', component: CambiarMiContrasenaClienteComponent },
  {path: 'ayudaSoporte/asuntoSoporte', component: AsuntoSoporteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
