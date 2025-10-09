import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilPersonalComponent } from './components/perfil-personal/perfil-personal.component';
import { BeneficiosComponent } from './components/beneficios/beneficios.component';
import { HistorialComprasComponent } from './components/historial-compras/historial-compras.component';
import { MisEntradasComponent } from './components/mis-entradas/mis-entradas.component';

const routes: Routes = [
  { path: '', redirectTo: 'perfilPersonal', pathMatch: 'full' },
  { path: 'perfilPersonal', component: PerfilPersonalComponent },
  { path: 'beneficios', component: BeneficiosComponent },
  { path: 'historialCompras', component: HistorialComprasComponent },
  { path: 'misEntradas', component: MisEntradasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
