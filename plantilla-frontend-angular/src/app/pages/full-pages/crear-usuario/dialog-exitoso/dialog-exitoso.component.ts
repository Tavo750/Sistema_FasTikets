import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-dialog-exitoso',
  standalone: false,
  templateUrl: './dialog-exitoso.component.html',
  styleUrl: './dialog-exitoso.component.css'
})
export class DialogExitosoComponent {

  constructor(private dialogRef: DynamicDialogRef) {}

  continuar(): void {
    this.dialogRef.close();
  }

}
