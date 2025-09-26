import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-terminos',
  templateUrl: './dialog-terminos.component.html',
  styleUrls: ['./dialog-terminos.component.css'],
  standalone: true,
  imports: [CommonModule, ButtonModule]
})
export class DialogTerminosComponent {
  constructor(
    private ref: DynamicDialogRef
  ) { }

  aceptar() {
    this.ref.close(true);
  }
}