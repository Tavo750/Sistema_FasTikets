import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { DialogTerminosComponent } from './dialog-terminos/dialog-terminos.component';
import { DialogPoliticaComponent } from './dialog-politica/dialog-politica.component';
import { DialogExitosoComponent } from './dialog-exitoso/dialog-exitoso.component';
import { RegistroUsuarioService } from '../../../core/services/registro-usuario.service';
import { RegistroUsuario, RegistroResponse } from '../../../core/interfaces/registro_usuario.interface';
import { TipoDocumento } from '../../../core/interfaces/tipo-documento.enum';

@Component({
  selector: 'app-crear-usuario',
  standalone: false,
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css',
  providers: [MessageService]
})
export class CrearUsuarioComponent implements OnInit {
  private dialogRef: DynamicDialogRef | undefined;
  registroForm: FormGroup;
  tiposDocumento = Object.values(TipoDocumento);

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private registroUsuarioService: RegistroUsuarioService,
    private messageService: MessageService
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
      tipoDocumento: [TipoDocumento.DNI, Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
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


    mostrarPoliticas(event: Event): void {
    event.preventDefault();
    this.dialogRef = this.dialogService.open(DialogPoliticaComponent, {

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

  private mostrarError(mensaje: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje
    });
  }

  mostrarDialogExitoso(): void {
    this.dialogRef = this.dialogService.open(DialogExitosoComponent, {
      width: '30%',
      contentStyle: { 'max-height': '500px', 'overflow-y': 'auto' },
      baseZIndex: 10000
    });

    this.dialogRef.onClose.subscribe((result: any) => {
      console.log('Dialog exitoso cerrado');
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      // Verificar que las contraseñas coincidan
      if (this.registroForm.get('contrasena')?.value !== this.registroForm.get('repitaContrasena')?.value) {
        this.mostrarError('Las contraseñas no coinciden');
        return;
      }

      // Formatear la fecha de nacimiento a ISO string si es un objeto Date
      const fechaNacimiento = this.registroForm.get('fechaNacimiento')?.value;
      const fechaFormateada = fechaNacimiento instanceof Date ?
        fechaNacimiento.toISOString().split('T')[0] : fechaNacimiento;

      const usuario: RegistroUsuario = {
        docIdentidad: this.registroForm.get('numeroDocumento')?.value.trim(),
        nombres: this.registroForm.get('nombres')?.value.trim(),
        apellidos: this.registroForm.get('apellidos')?.value.trim(),
        telefono: this.registroForm.get('telefono')?.value.trim(),
        email: this.registroForm.get('correo')?.value.trim().toLowerCase(),
        direccion: this.registroForm.get('direccion')?.value.trim(),
        contrasena: this.registroForm.get('contrasena')?.value,
        fechaNacimiento: fechaFormateada,
        tipoDocumento: this.registroForm.get('tipoDocumento')?.value,
        rol: 'CLIENTE'
      };

      // Validar que todos los campos requeridos tengan valor
      for (const [key, value] of Object.entries(usuario)) {
        if (!value && value !== 0) {
          this.mostrarError(`El campo ${key} es requerido`);
          return;
        }
      }

      this.registroUsuarioService.postRegistro(usuario).subscribe({
        next: (response: RegistroResponse) => {
          if (response.exito) {
            this.mostrarDialogExitoso();
            this.registroForm.reset();
          }
        },
        error: (error) => {
          let mensajeError = 'Error en el registro';
          if (error instanceof Error) {
            mensajeError = error.message;
          }
          this.mostrarError(mensajeError);
        },
        complete: () => {
          // Limpieza de recursos si es necesario
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.registroForm.controls).forEach(key => {
        const control = this.registroForm.get(key);
        if (control?.errors) {
          let errorMessage = 'Campo requerido';
          if (control.errors['email']) {
            errorMessage = 'Email inválido';
          }
          this.mostrarError(`Error en ${key}: ${errorMessage}`);
        }
        control?.markAsTouched();
      });
    }
  }


}
