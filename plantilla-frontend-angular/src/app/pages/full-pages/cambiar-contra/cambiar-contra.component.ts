import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogEnvioComponent } from './dialog-envio/dialog-envio.component';
import { MessageService } from '../../../core/services/message.service';
import { CambiarContraService } from '../../../core/services/cambiar-contra.service';

@Component({
  selector: 'app-cambiar-contra',
  standalone: false,
  templateUrl: './cambiar-contra.component.html',
  styleUrl: './cambiar-contra.component.css',
  //providers: [DialogService]
})
export class CambiarContraComponent implements AfterViewInit {
  private dialogRef: DynamicDialogRef | undefined;

  // Flag para controlar qué vista mostrar
  mostrarIngresarCorreo = true;        // Vista 1: Ingresar correo
  mostrarVerificarCodigo = false;      // Vista 2: Verificar código
  mostrarCambioContrasena = false;     // Vista 3: Cambiar contraseña
  mostrarExito = false;               // Vista 4: Confirmación de éxito

  // Código correcto (en producción esto vendría del backend)
  private codigoCorrecto = '123456';
  correoIngresado = '';

  constructor(
    public router: Router,
    public dialogService: DialogService,
    private messageService: MessageService,
    private cambiarContraService: CambiarContraService
  ) { }

  ngAfterViewInit(): void {
    this.setupCodeInputs();
  }

  private setupCodeInputs(): void {
    // Script para manejo de los inputs de código
    const codeInputs = document.querySelectorAll('.code-input') as NodeListOf<HTMLInputElement>;

    codeInputs.forEach((input, index) => {
        // Mover al siguiente input cuando se ingresa un número
        input.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.value.length === 1 && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
        });

        // Mover al input anterior al presionar backspace
        input.addEventListener('keydown', (e) => {
            const target = e.target as HTMLInputElement;
            if (e.key === 'Backspace' && target.value === '' && index > 0) {
                codeInputs[index - 1].focus();
            }
        });

        // Solo permitir números
        input.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/[^0-9]/g, '');
        });
    });
  }

   // Método para enviar correo con validaciones mejoradas
enviarCorreo(event: Event): void {
  event.preventDefault();

  const correo = (document.getElementById('correoElectronico') as HTMLInputElement)?.value;

  // Validación 1: Campo vacío
  if (!correo || correo.trim() === '') {
    this.messageService.warn('Por favor ingrese su correo electrónico', 'Campo requerido');
    return;
  }

  // Validación 2: Eliminar espacios en blanco
  const correoLimpio = correo.trim();

  // Validación 3: Longitud mínima
  if (correoLimpio.length < 5) {
    this.messageService.error('El correo electrónico es demasiado corto', 'Correo inválido');
    return;
  }

  // Validación 4: Longitud máxima
  if (correoLimpio.length > 100) {
    this.messageService.error('El correo electrónico es demasiado largo', 'Correo inválido');
    return;
  }

  // Validación 5: Caracteres especiales no permitidos al inicio o final
  if (correoLimpio.startsWith('.') || correoLimpio.endsWith('.') ||
      correoLimpio.startsWith('@') || correoLimpio.endsWith('@')) {
    this.messageService.error('El correo no puede comenzar o terminar con . o @', 'Correo inválido');
    return;
  }

  // Validación 6: Formato de email válido (regex más estricto)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(correoLimpio)) {
    this.messageService.error('Por favor ingrese un correo electrónico válido (ejemplo@correo.com)', 'Correo inválido');
    return;
  }

  // Validación 7: Verificar que tenga un solo @
  const atSymbolCount = (correoLimpio.match(/@/g) || []).length;
  if (atSymbolCount !== 1) {
    this.messageService.error('El correo debe contener solo un símbolo @', 'Correo inválido');
    return;
  }

  // Validación 8: Verificar que no tenga puntos consecutivos
  if (correoLimpio.includes('..')) {
    this.messageService.error('El correo no puede contener puntos consecutivos', 'Correo inválido');
    return;
  }

  // Validación 9: Verificar dominio válido
  const dominio = correoLimpio.split('@')[1];
  if (!dominio || !dominio.includes('.')) {
    this.messageService.error('El dominio del correo no es válido', 'Correo inválido');
    return;
  }

  // Validación 10: Caracteres especiales raros no permitidos
  const caracteresRaros = /[<>()[\]\\,;:\s"]/;
  if (caracteresRaros.test(correoLimpio)) {
    this.messageService.error('El correo contiene caracteres no permitidos', 'Correo inválido');
    return;
  }

  // Si pasa todas las validaciones, guardar y continuar
  this.correoIngresado = correoLimpio;

    // Llamar al servicio para enviar el correo
    this.cambiarContraService.putOlvidoContrasena(correoLimpio).subscribe({
      next: (response) => {
        if (response.ok) {
          this.messageService.success(
            response.mensaje || 'Hemos enviado un código de verificación a su correo',
            'Correo enviado'
          );

          // Cambiar a la vista de verificación de código
          this.mostrarIngresarCorreo = false;
          this.mostrarVerificarCodigo = true;

          // Configurar los inputs después de que se rendericen
          setTimeout(() => {
            this.setupCodeInputs();
          }, 100);
        } else {
          this.messageService.error(
            response.mensaje || 'No se pudo enviar el correo',
            'Error'
          );
        }
      },
      error: (error) => {
        console.error('Error al enviar correo:', error);
        this.messageService.error(
          'No se pudo enviar el correo. Por favor intente nuevamente.',
          'Error'
        );
      }
    });
  }


  // Método para obtener el código completo
  private obtenerCodigoIngresado(): string {
    const codeInputs = document.querySelectorAll('.code-input') as NodeListOf<HTMLInputElement>;
    let codigo = '';
    codeInputs.forEach(input => {
      codigo += input.value;
    });
    return codigo;
  }


  // Método para validar y continuar
  validarCodigo(event: Event): void {
    event.preventDefault();

    const codigoIngresado = this.obtenerCodigoIngresado();

    if (codigoIngresado.length !== 6) {
      this.messageService.error('Por favor ingrese el código completo de 6 dígitos', 'Error');
      return;
    }

    // Llamar al servicio para validar el código
    this.cambiarContraService.postValidaCodigo(this.correoIngresado, codigoIngresado).subscribe({
      next: (response) => {
        if (response.ok) {
          // Ocultar vista de verificación
          this.mostrarVerificarCodigo = false;
          // Mostrar vista de cambio de contraseña
          this.mostrarCambioContrasena = true;

          // Toast de éxito
          this.messageService.success(
            response.mensaje || 'Ahora puede cambiar su contraseña',
            'Código verificado'
          );
        } else {
          this.messageService.error(
            response.mensaje || 'Código incorrecto',
            'Error'
          );
        }
      },
      error: (error) => {
        console.error('Error al validar código:', error);
        this.messageService.error(
          'No se pudo validar el código. Por favor intente nuevamente.',
          'Error'
        );
      }
    });
  }



  mostrarReenvio(event: Event): void {
      event.preventDefault();
      this.dialogRef = this.dialogService.open(DialogEnvioComponent, {
        width: '20%',
        contentStyle: { 'max-height': '500px', 'overflow-y': 'auto' },
        baseZIndex: 10000
      });

      this.dialogRef.onClose.subscribe((acepto: boolean) => {
        if (acepto) {
          console.log('Términos aceptados');
        }
      });
    }

    // Método para cambiar la contraseña
  cambiarContrasena(event: Event): void {
    event.preventDefault();

    const nuevaContrasena = (document.getElementById('nuevaContrasena') as HTMLInputElement)?.value;
    const repetirContrasena = (document.getElementById('repetirContrasena') as HTMLInputElement)?.value;

    if (!nuevaContrasena || !repetirContrasena) {
      this.messageService.warn('Por favor complete todos los campos', 'Advertencia');
      return;
    }

    if (nuevaContrasena !== repetirContrasena) {
      this.messageService.error('Las contraseñas no coinciden', 'Error');
      return;
    }

    if (nuevaContrasena.length < 6) {
      this.messageService.warn('La contraseña debe tener al menos 6 caracteres', 'Advertencia');
      return;
    }

    // Llamar al servicio para cambiar la contraseña
    this.cambiarContraService.putReset(this.correoIngresado, nuevaContrasena, repetirContrasena).subscribe({
      next: (response) => {
        if (response.ok) {
          this.messageService.success(
            response.mensaje || 'Contraseña cambiada exitosamente',
            'Éxito'
          );

          // Redirigir al login después de un breve momento
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.messageService.error(
            response.mensaje || 'No se pudo cambiar la contraseña',
            'Error'
          );
        }
      },
      error: (error) => {
        console.error('Error al cambiar contraseña:', error);
        this.messageService.error(
          'No se pudo cambiar la contraseña. Por favor intente nuevamente.',
          'Error'
        );
      }
    });
  }

  cancelar(): void {
    // Volver a la pantalla de verificación
    this.mostrarCambioContrasena = false;

    // Limpiar los inputs del código
    const codeInputs = document.querySelectorAll('.code-input') as NodeListOf<HTMLInputElement>;
    codeInputs.forEach(input => {
      input.value = '';
    });

    // Opcional: mostrar mensaje
    this.messageService.info('Operación cancelada', 'Cancelado', 2000);

    // Redirigir al login después de un breve momento
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }


}
