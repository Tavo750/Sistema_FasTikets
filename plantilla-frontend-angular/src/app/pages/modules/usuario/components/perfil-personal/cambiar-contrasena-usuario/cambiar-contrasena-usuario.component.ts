import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PerfilPersonalService } from '../../../services/perfil-personal.service';
import { MessageService } from '../../../../../../core/services/message.service';
import { CambiarContrasenaUsuarioRequest } from '../../../interfaces/perfil-personal/cambiar-contrasena-usuario.interface';

@Component({
  selector: 'app-cambiar-contrasena-usuario',
  standalone: false,
  templateUrl: './cambiar-contrasena-usuario.component.html',
  styleUrls: ['./cambiar-contrasena-usuario.component.css']
})
export class CambiarContrasenaUsuarioComponent implements OnInit {
  cambiarContrasenaForm: FormGroup;
  mensajeExito: string = '';
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private perfilPersonalService: PerfilPersonalService,
    private messageService: MessageService
  ) {
    this.cambiarContrasenaForm = this.fb.group({
      contrasenaActual: ['', Validators.required],
      contrasenaNueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   */
  private passwordMatchValidator(form: FormGroup) {
    const contrasenaNueva = form.get('contrasenaNueva');
    const confirmarContrasena = form.get('confirmarContrasena');
    
    if (contrasenaNueva && confirmarContrasena && contrasenaNueva.value !== confirmarContrasena.value) {
      confirmarContrasena.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.cambiarContrasenaForm.valid) {
      this.cargando = true;
      this.mensajeError = '';
      this.mensajeExito = '';

      const formValue = this.cambiarContrasenaForm.value;
      
      // Verificar que las contraseñas coincidan
      if (formValue.contrasenaNueva !== formValue.confirmarContrasena) {
        this.mensajeError = 'Las contraseñas no coinciden';
        this.messageService.error('Las contraseñas no coinciden', 'Error');
        this.cargando = false;
        return;
      }

      const request: CambiarContrasenaUsuarioRequest = {
        contrasenaActual: formValue.contrasenaActual,
        contrasenaNueva: formValue.contrasenaNueva,
        contrasenaConfirmacion: formValue.confirmarContrasena
      };

      this.perfilPersonalService.putCambiarContrasena(request).subscribe({
        next: (response) => {
          this.cargando = false;
          if (response.ok) {
            this.mensajeExito = response.mensaje || 'Contraseña cambiada exitosamente';
            this.messageService.success(this.mensajeExito, 'Éxito');
            
            // Limpiar el formulario
            this.cambiarContrasenaForm.reset();
            
            // Opcional: redirigir después de un delay
            setTimeout(() => {
              this.onVolver();
            }, 2000);
          } else {
            this.mensajeError = response.mensaje || 'Error al cambiar la contraseña';
            this.messageService.error(this.mensajeError, 'Error');
          }
        },
        error: (error) => {
          this.cargando = false;
          this.mensajeError = error.mensaje || 'Error al cambiar la contraseña. Inténtalo de nuevo.';
          this.messageService.error(this.mensajeError, 'Error');
          console.error('Error al cambiar contraseña:', error);
        }
      });
    } else {
      this.messageService.warn('Por favor completa todos los campos requeridos', 'Advertencia');
      
      // Marcar todos los campos como tocados para mostrar errores de validación
      Object.keys(this.cambiarContrasenaForm.controls).forEach(key => {
        this.cambiarContrasenaForm.get(key)?.markAsTouched();
      });
    }
  }

  onVolver(): void {
    this.router.navigate(['/usuario/perfilPersonal']);
  }

  /**
   * Verifica si un campo específico tiene errores y ha sido tocado
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.cambiarContrasenaForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getFieldErrorMessage(fieldName: string): string {
    const field = this.cambiarContrasenaForm.get(fieldName);
    
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['passwordMismatch']) {
        return 'Las contraseñas no coinciden';
      }
    }
    
    return '';
  }

  /**
   * Verifica si las contraseñas coinciden
   */
  get passwordsMatch(): boolean {
    const contrasenaNueva = this.cambiarContrasenaForm.get('contrasenaNueva')?.value;
    const confirmarContrasena = this.cambiarContrasenaForm.get('confirmarContrasena')?.value;
    
    return contrasenaNueva === confirmarContrasena;
  }
}
