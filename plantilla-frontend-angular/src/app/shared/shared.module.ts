import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogoComponent } from './components/dialogo/dialogo.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    DialogoComponent,
    LoadingSpinnerComponent,
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    RouterModule
  ],
  exports: [
    DialogoComponent,
    LoadingSpinnerComponent,
  ]
})
export class SharedModule { }
