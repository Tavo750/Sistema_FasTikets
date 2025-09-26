import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-dialog-envio',
  standalone: false,
  templateUrl: './dialog-envio.component.html',
  styleUrl: './dialog-envio.component.css'

})
export class DialogEnvioComponent {
  constructor(
        private ref: DynamicDialogRef
  ) { }

  closeModal() {
    this.ref.close(true);
  }

}
