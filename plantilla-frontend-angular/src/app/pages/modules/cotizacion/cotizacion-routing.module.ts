import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearComponent } from './components/crear/crear.component';
import { ModificarComponent } from './components/modificar/modificar.component';


const routes: Routes = [
  { path: '', redirectTo: 'crear', pathMatch: 'full' },
  { path: 'crear', component: CrearComponent },
  { path: 'modificar', component: ModificarComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizacionRoutingModule { }
