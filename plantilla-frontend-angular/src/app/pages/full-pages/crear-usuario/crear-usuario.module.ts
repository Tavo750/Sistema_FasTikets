import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CrearUsuarioRoutingModule } from './crear-usuario-routing.module';
import { CrearUsuarioComponent } from './crear-usuario.component';
import { DialogTerminosComponent } from './dialog-terminos/dialog-terminos.component';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogPoliticaComponent } from './dialog-politica/dialog-politica.component';
import { DialogExitosoComponent } from './dialog-exitoso/dialog-exitoso.component';
import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';

@NgModule({
  declarations: [
    CrearUsuarioComponent,
    DialogTerminosComponent,
    DialogPoliticaComponent,
    DialogExitosoComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CrearUsuarioRoutingModule,
    PrimeNgModule
  ],
  providers: [DialogService],
  exports: [
    DialogTerminosComponent,
    DialogPoliticaComponent
  ]
})
export class CrearUsuarioModule { }
