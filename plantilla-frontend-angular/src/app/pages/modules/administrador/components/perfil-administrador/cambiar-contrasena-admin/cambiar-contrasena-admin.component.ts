import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PerfilAdministradorService } from '../../../services/perfil-administrador.service';
import { CambiarContrasenaRequest } from '../../../interfaces/perfil-administrador/cambiar-contraseña.interface';

@Component({
  selector: 'app-cambiar-contrasena-admin',
  standalone: false,
  templateUrl: './cambiar-contrasena-admin.component.html',
  styleUrl: './cambiar-contrasena-admin.component.css'
})
export class CambiarContrasenaAdminComponent implements OnInit {
  cambiarContrasenaForm: FormGroup<any> | undefined;
  cargando = false;
  mensajeError = '';
  mensajeExito = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private perfilAdministradorService: PerfilAdministradorService
  ) {}

  ngOnInit() {
    this.cambiarContrasenaForm = this.fb.group({
      contrasenaActual: ['', Validators.required],
      contrasenaNueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   */
  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const contrasenaNueva = control.get('contrasenaNueva');
    const confirmarContrasena = control.get('confirmarContrasena');
    
    if (contrasenaNueva && confirmarContrasena && contrasenaNueva.value !== confirmarContrasena.value) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.cambiarContrasenaForm && this.cambiarContrasenaForm.valid) {
      this.cargando = true;
      this.mensajeError = '';
      this.mensajeExito = '';

      const formValues = this.cambiarContrasenaForm.value;
      
      const requestData: CambiarContrasenaRequest = {
        contrasenaActual: formValues.contrasenaActual,
        contrasenaNueva: formValues.contrasenaNueva,
        contrasenaConfirmacion: formValues.confirmarContrasena
      };

      this.perfilAdministradorService.putCambiarContrasena(requestData).subscribe({
        next: (response) => {
          this.cargando = false;
          if (response.ok) {
            this.mensajeExito = response.mensaje || 'Contraseña cambiada exitosamente';
            // Limpiar el formulario después del éxito
            this.cambiarContrasenaForm?.reset();
            // Opcional: redirigir después de un tiempo
            setTimeout(() => {
              this.volver();
            }, 2000);
          } else {
            this.mensajeError = response.mensaje || 'Error al cambiar la contraseña';
          }
        },
        error: (error) => {
          this.cargando = false;
          this.mensajeError = this.extractErrorMessage(error);
          console.error('Error al cambiar contraseña:', error);
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores de validación
      this.markFormGroupTouched();
    }
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores de validación
   */
  markFormGroupTouched() {
    if (this.cambiarContrasenaForm) {
      Object.keys(this.cambiarContrasenaForm.controls).forEach(key => {
        const control = this.cambiarContrasenaForm?.get(key);
        control?.markAsTouched();
      });
    }
  }

  cancelarEdicion() {
    // Limpiar el formulario y mensajes
    this.cambiarContrasenaForm?.reset();
    this.mensajeError = '';
    this.mensajeExito = '';
  }

  volver() {
    // Navegar de vuelta al perfil del administrador
    this.router.navigate(['/administrador/perfil']);
  }

  /**
   * Verifica si un campo tiene errores y ha sido tocado
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.cambiarContrasenaForm?.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getFieldErrorMessage(fieldName: string): string {
    const field = this.cambiarContrasenaForm?.get(fieldName);
    
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['minlength']) {
        return 'La contraseña debe tener al menos 6 caracteres';
      }
    }

    // Error de coincidencia de contraseñas
    if (fieldName === 'confirmarContrasena' && this.cambiarContrasenaForm?.errors?.['passwordsMismatch']) {
      return 'Las contraseñas no coinciden';
    }

    return '';
  }

  /**
   * Extrae el mensaje de error del objeto de error retornado por HttpUtilsService
   * @param error Objeto de error procesado por handleError
   * @returns Mensaje de error legible para el usuario
   */
  private extractErrorMessage(error: any): string {
    if (!error) {
      return 'Error de conexión. Intente nuevamente.';
    }

    // Priorizar el mensaje del endpoint
    if (error.message) {
      return error.message;
    }

    // Si hay código de respuesta específico
    if (error.responseCode) {
      switch (error.responseCode) {
        case '400':
          return 'Datos inválidos. Verifique la información ingresada.';
        case '401':
          return 'No tiene permisos para realizar esta acción.';
        case '403':
          return 'Acceso denegado.';
        case '404':
          return 'Servicio no encontrado.';
        case '500':
          return 'Error interno del servidor. Intente más tarde.';
        default:
          return `Error ${error.responseCode}: ${error.statusText || 'Error del servidor'}`;
      }
    }

    // Fallback general
    return 'Error de conexión. Intente nuevamente.';
  }
}
