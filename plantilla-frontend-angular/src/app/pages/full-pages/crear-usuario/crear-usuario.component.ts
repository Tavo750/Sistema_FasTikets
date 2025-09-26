import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogTerminosComponent } from './dialog-terminos/dialog-terminos.component';

@Component({
  selector: 'app-crear-usuario',
  standalone: false,
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css',
  providers: [DialogService]
})
export class CrearUsuarioComponent implements OnInit {
  private dialogRef: DynamicDialogRef | undefined;
  registroForm: FormGroup;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {
    this.registroForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      repitaContrasena: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      departamento: ['', Validators.required],
      distrito: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Aquí puedes cargar los datos de departamentos y distritos
  }

  mostrarTerminos(event: Event): void {
    event.preventDefault();
    this.dialogRef = this.dialogService.open(DialogTerminosComponent, {
      
      width: '40%',
      contentStyle: { 'max-height': '500px', 'overflow-y': 'auto' },
      baseZIndex: 10000
    });

    this.dialogRef.onClose.subscribe((acepto: boolean) => {
      if (acepto) {
        console.log('Términos aceptados');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      console.log(this.registroForm.value);
      // Aquí iría la lógica para enviar los datos al servidor
    } else {
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.registroForm.controls).forEach(key => {
        const control = this.registroForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
