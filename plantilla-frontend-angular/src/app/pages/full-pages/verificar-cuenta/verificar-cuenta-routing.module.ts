import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerificarCuentaComponent } from './verificar-cuenta.component';

const routes: Routes = [
  {
    path: ':token',
    component: VerificarCuentaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificarCuentaRoutingModule { }
