import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-dialog-exitoso',
  standalone: false,
  templateUrl: './dialog-exitoso.component.html',
  styleUrl: './dialog-exitoso.component.css'
})
export class DialogExitosoComponent {

  constructor(
    private dialogRef: DynamicDialogRef,
    public router: Router,
  ) {}

  cerrarYRedirigir(): void {
    this.dialogRef.close();
    // Redirigir al login después de cerrar el diálogo
    this.router.navigate(['/login']);
  }
}
