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
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      tipoDocumento: [TipoDocumento.DNI, Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]]
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

      const email = this.registroForm.get('correo')?.value.trim().toLowerCase();

      const usuario: RegistroUsuario = {
        tipoDocumento: this.registroForm.get('tipoDocumento')?.value,
        docIdentidad: this.registroForm.get('numeroDocumento')?.value.trim(),
        nombres: this.registroForm.get('nombres')?.value.trim(),
        apellidos: this.registroForm.get('apellidos')?.value.trim(),
        email: email,
        contrasena: this.registroForm.get('contrasena')?.value,
        telefono: this.registroForm.get('telefono')?.value.trim(),
        fechaNacimiento: fechaFormateada,
        direccion: this.registroForm.get('direccion')?.value.trim(),
        idDistrito: parseInt(this.registroForm.get('distrito')?.value) || 1
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
          if (response.ok && response.data.exito) {
            this.mostrarDialogExitoso();
            this.registroForm.reset();
          } else {
            this.mostrarError(response.data.mensaje || 'Error en el registro');
          }
        },
        error: (error) => {
          console.error('Error completo del endpoint:', error);
          
          // Extraer el mensaje específico del endpoint
          let mensajeError = 'Error en el registro';
          
          if (error.mensaje) {
            // El mensaje que viene del HttpUtilsService
            mensajeError = error?.mensaje;
          } else if (typeof error === 'string') {
            mensajeError = error;
          } else if (error.error?.message) {
            mensajeError = error.error.message;
          } else if (error.error?.mensaje) {
            mensajeError = error.error.mensaje;
          }
          
          console.error('Mensaje de error del endpoint:', mensajeError);
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
          let errorMessage = '';
          if (control.errors['required']) {
            switch(key) {
              case 'nombres':
                errorMessage = 'El campo Nombres es obligatorio';
                break;
              case 'apellidos':
                errorMessage = 'El campo Apellidos es obligatorio';
                break;
              case 'correo':
                errorMessage = 'El campo Correo Electrónico es obligatorio';
                break;
              case 'contrasena':
                errorMessage = 'El campo Contraseña es obligatorio';
                break;
              case 'repitaContrasena':
                errorMessage = 'Debe repetir la contraseña';
                break;
              case 'fechaNacimiento':
                errorMessage = 'La Fecha de Nacimiento es obligatoria';
                break;
              case 'departamento':
                errorMessage = 'Debe seleccionar un Departamento';
                break;
              case 'distrito':
                errorMessage = 'Debe seleccionar un Distrito';
                break;
              case 'direccion':
                errorMessage = 'La Dirección es obligatoria';
                break;
              case 'telefono':
                errorMessage = 'El Número de Teléfono es obligatorio';
                break;
              case 'tipoDocumento':
                errorMessage = 'Debe seleccionar un Tipo de Documento';
                break;
              case 'numeroDocumento':
                errorMessage = 'El Número de Documento es obligatorio';
                break;
              default:
                errorMessage = 'Este campo es obligatorio';
            }
          } else if (control.errors['email']) {
            errorMessage = 'El formato del correo electrónico no es válido';
          } else if (control.errors['pattern']) {
            if (key === 'numeroDocumento') {
              errorMessage = 'El número de documento debe tener exactamente 8 dígitos numéricos';
            } else if (key === 'telefono') {
              errorMessage = 'El número de teléfono debe tener exactamente 9 dígitos numéricos';
            }
          }
          this.mostrarError(errorMessage);
        }
        control?.markAsTouched();
      });
    }
  }

  /**
   * Permite solo números en el input
   * @param event Evento de teclado
   */
  onlyNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    // Permitir: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(charCode) !== -1 ||
        // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (charCode === 65 && event.ctrlKey === true) ||
        (charCode === 67 && event.ctrlKey === true) ||
        (charCode === 86 && event.ctrlKey === true) ||
        (charCode === 88 && event.ctrlKey === true)) {
      return;
    }
    // Asegurar que solo sea un número
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  /**
   * Maneja el evento paste para asegurar solo números
   * @param event Evento de pegado
   * @param fieldName Nombre del campo
   */
  onPaste(event: ClipboardEvent, fieldName: string): void {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text') || '';
    
    // Filtrar solo números
    const numbersOnly = clipboardData.replace(/[^0-9]/g, '');
    
    // Aplicar límite según el campo
    let maxLength = 0;
    if (fieldName === 'telefono') {
      maxLength = 9;
    } else if (fieldName === 'numeroDocumento') {
      maxLength = 8;
    }
    
    const limitedValue = numbersOnly.substring(0, maxLength);
    
    // Actualizar el valor del formulario
    this.registroForm.get(fieldName)?.setValue(limitedValue);
  }


}
