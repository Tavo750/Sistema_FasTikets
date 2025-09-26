import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-dialog-politica',
  standalone: false,
  templateUrl: './dialog-politica.component.html',
  styleUrl: './dialog-politica.component.css'
})
export class DialogPoliticaComponent {
    constructor(
      private ref: DynamicDialogRef
    ) { }

    aceptar() {
      this.ref.close(true);
    }

}
