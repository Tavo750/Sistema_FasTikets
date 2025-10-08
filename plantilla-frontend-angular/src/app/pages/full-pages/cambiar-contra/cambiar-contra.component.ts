import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogEnvioComponent } from './dialog-envio/dialog-envio.component';
import { MessageService } from 'primeng/api';

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
    private messageService: MessageService 
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
    this.messageService.add({
      severity: 'warn',
      summary: 'Campo requerido',
      detail: 'Por favor ingrese su correo electrónico',
      life: 3000
    });
    return;
  }
  
  // Validación 2: Eliminar espacios en blanco
  const correoLimpio = correo.trim();
  
  // Validación 3: Longitud mínima
  if (correoLimpio.length < 5) {
    this.messageService.add({
      severity: 'error',
      summary: 'Correo inválido',
      detail: 'El correo electrónico es demasiado corto',
      life: 3000
    });
    return;
  }
  
  // Validación 4: Longitud máxima
  if (correoLimpio.length > 100) {
    this.messageService.add({
      severity: 'error',
      summary: 'Correo inválido',
      detail: 'El correo electrónico es demasiado largo',
      life: 3000
    });
    return;
  }
  
  // Validación 5: Caracteres especiales no permitidos al inicio o final
  if (correoLimpio.startsWith('.') || correoLimpio.endsWith('.') || 
      correoLimpio.startsWith('@') || correoLimpio.endsWith('@')) {
    this.messageService.add({
      severity: 'error',
      summary: 'Correo inválido',
      detail: 'El correo no puede comenzar o terminar con . o @',
      life: 3000
    });
    return;
  }
  
  // Validación 6: Formato de email válido (regex más estricto)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(correoLimpio)) {
    this.messageService.add({
      severity: 'error',
      summary: 'Correo inválido',
      detail: 'Por favor ingrese un correo electrónico válido (ejemplo@correo.com)',
      life: 3000
    });
    return;
  }
  
  // Validación 7: Verificar que tenga un solo @
  const atSymbolCount = (correoLimpio.match(/@/g) || []).length;
  if (atSymbolCount !== 1) {
    this.messageService.add({
      severity: 'error',
      summary: 'Correo inválido',
      detail: 'El correo debe contener solo un símbolo @',
      life: 3000
    });
    return;
  }
  
  // Validación 8: Verificar que no tenga puntos consecutivos
  if (correoLimpio.includes('..')) {
    this.messageService.add({
      severity: 'error',
      summary: 'Correo inválido',
      detail: 'El correo no puede contener puntos consecutivos',
      life: 3000
    });
    return;
  }
  
  // Validación 9: Verificar dominio válido
  const dominio = correoLimpio.split('@')[1];
  if (!dominio || !dominio.includes('.')) {
    this.messageService.add({
      severity: 'error',
      summary: 'Correo inválido',
      detail: 'El dominio del correo no es válido',
      life: 3000
    });
    return;
  }
  
  // Validación 10: Caracteres especiales raros no permitidos
  const caracteresRaros = /[<>()[\]\\,;:\s"]/;
  if (caracteresRaros.test(correoLimpio)) {
    this.messageService.add({
      severity: 'error',
      summary: 'Correo inválido',
      detail: 'El correo contiene caracteres no permitidos',
      life: 3000
    });
    return;
  }
  
  // Si pasa todas las validaciones, guardar y continuar
  this.correoIngresado = correoLimpio;
    
    // Aquí enviarías el correo al backend
    // Simulamos el envío exitoso
    this.messageService.add({
      severity: 'success',
      summary: 'Correo enviado',
      detail: 'Hemos enviado un código de verificación a su correo',
      life: 3000
    });
    
    // Cambiar a la vista de verificación de código
    this.mostrarIngresarCorreo = false;
    this.mostrarVerificarCodigo = true;
    
    // Configurar los inputs después de que se rendericen
    setTimeout(() => {
      this.setupCodeInputs();
    }, 100);
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
      //alert('Por favor ingrese el código completo de 6 dígitos');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor ingrese el código completo de 6 dígitos',
        life: 3000
      });
      return;
    }
    
    if (codigoIngresado === this.codigoCorrecto) {
      // Ocultar vista de verificación
      this.mostrarVerificarCodigo = false;  // ← AGREGA ESTA LÍNEA
      // Mostrar vista de cambio de contraseña
      this.mostrarCambioContrasena = true;
      
      // Toast de éxito
      this.messageService.add({
        severity: 'success',
        summary: 'Código verificado',
        detail: 'Ahora puede cambiar su contraseña',
        life: 3000
      });
    } else {
      // Toast de error
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Código incorrecto. Por favor intente nuevamente.',
        life: 3000
      });
    }
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
      //alert('Por favor complete todos los campos');
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos',
        life: 3000
      });
      return;
    }
    
    if (nuevaContrasena !== repetirContrasena) {
      //alert('Las contraseñas no coinciden');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden',
        life: 3000
      });
      return;
    }
    
    if (nuevaContrasena.length < 6) {
      //alert('La contraseña debe tener al menos 6 caracteres');
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La contraseña debe tener al menos 6 caracteres',
        life: 3000
      });
      return;
    }
    
    // Aquí enviarías la nueva contraseña al backend
    console.log('Contraseña cambiada exitosamente');
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Contraseña cambiada exitosamente',
      life: 3000
    });
    
    // Redirigir al login
    this.router.navigate(['/login']);
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
    this.messageService.add({
      severity: 'info',
      summary: 'Cancelado',
      detail: 'Operación cancelada',
      life: 2000
    });
    
    // Redirigir al login después de un breve momento
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }


}
