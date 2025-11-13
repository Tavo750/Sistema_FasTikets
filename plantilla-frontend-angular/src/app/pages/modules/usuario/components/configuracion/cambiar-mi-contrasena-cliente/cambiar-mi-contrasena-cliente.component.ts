import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PerfilPersonalService } from '../../../services/perfil-personal.service';
import { CambiarContrasenaUsuarioRequest, CambiarContrasenaUsuarioResponse } from '../../../interfaces/perfil-personal/cambiar-contrasena-usuario.interface';

@Component({
  selector: 'app-cambiar-mi-contrasena-cliente',
  standalone: false,  
  templateUrl: './cambiar-mi-contrasena-cliente.component.html',
  styleUrls: ['./cambiar-mi-contrasena-cliente.component.css'],
  providers: [MessageService]
})
export class CambiarMiContrasenaClienteComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
    , private perfilPersonalService: PerfilPersonalService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      contrasenaActual: ['', Validators.required],
      contrasenaNueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): {[key: string]: boolean} | null {
    const nueva = control.get('contrasenaNueva');
    const confirmar = control.get('confirmarContrasena');

    if (!nueva || !confirmar) {
      return null;
    }

    return nueva.value === confirmar.value ? null : { passwordMismatch: true };
  }

  cambiarContrasena(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor complete todos los campos correctamente'
      });
      return;
    }

    this.loading = true;

    const payload: CambiarContrasenaUsuarioRequest = {
      contrasenaActual: this.form.value.contrasenaActual,
      contrasenaNueva: this.form.value.contrasenaNueva,
      contrasenaConfirmacion: this.form.value.confirmarContrasena
    };

    this.perfilPersonalService.putCambiarContrasena(payload).subscribe({
      next: (response: CambiarContrasenaUsuarioResponse) => {
        this.loading = false;
        if (response && response.ok) {
          this.messageService.add({
            severity: 'success',
            summary: 'Contraseña actualizada',
            detail: response.mensaje || 'Tu contraseña ha sido cambiada exitosamente'
          });
          setTimeout(() => this.volver(), 1500);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje || 'No se pudo cambiar la contraseña'
          });
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error cambiar contraseña:', err);
        const msg = err?.message || err?.error?.mensaje || 'No se pudo cambiar la contraseña';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: msg
        });
      }
    });
  }

  volver(): void {
    this.router.navigate(['/usuario/configuracion']);
  }
}