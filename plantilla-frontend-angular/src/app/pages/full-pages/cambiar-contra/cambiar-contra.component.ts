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
  mostrarCambioContrasena = false;
  
  // Código correcto (en producción esto vendría del backend)
  private codigoCorrecto = '123456';

  constructor(
    public router: Router,
    public dialogService: DialogService,
    private messageService: MessageService // ← INYECTAR
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


}
