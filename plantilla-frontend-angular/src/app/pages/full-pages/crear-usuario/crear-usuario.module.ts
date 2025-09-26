import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CrearUsuarioRoutingModule } from './crear-usuario-routing.module';
import { CrearUsuarioComponent } from './crear-usuario.component';
import { DialogTerminosComponent } from './dialog-terminos/dialog-terminos.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogPoliticaComponent } from './dialog-politica/dialog-politica.component';

@NgModule({
  declarations: [
    CrearUsuarioComponent,
    DialogTerminosComponent,
    DialogPoliticaComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CrearUsuarioRoutingModule,
    ButtonModule,
    DialogModule,
    DynamicDialogModule
  ]
})
export class CrearUsuarioModule { }
