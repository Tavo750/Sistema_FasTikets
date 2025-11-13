import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../../../../prime-ng/prime-ng.module';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNgModule],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css'],
  providers: [MessageService]
})
export class ConfiguracionComponent implements OnInit {
  notificaciones = {
    compra: true,
    eventosRecomendados: true,
    transferenciaEntradas: true
  };

  mostrarDialogEliminar = false;
  textoConfirmacion = '';

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // TODO: Cargar preferencias de notificaciones desde el backend
    this.cargarPreferencias();
  }

  cargarPreferencias(): void {
    // TODO: Implementar llamada al servicio
    // this.configuracionService.obtenerPreferencias().subscribe({
    //   next: (response) => {
    //     if (response.ok) {
    //       this.notificaciones = response.data;
    //     }
    //   }
    // });
  }

  irACambiarContrasena(): void {
    this.router.navigate(['/usuario/configuracion/cambiarContrasena']);
  }

  mostrarDialogoEliminar(): void {
    this.mostrarDialogEliminar = true;
    this.textoConfirmacion = '';
  }

  cerrarDialogoEliminar(): void {
    this.mostrarDialogEliminar = false;
    this.textoConfirmacion = '';
  }

  eliminarCuenta(): void {
    if (this.textoConfirmacion.toLowerCase() === 'eliminar') {
      // TODO: Implementar llamada al servicio para eliminar cuenta
      // this.configuracionService.eliminarCuenta().subscribe({
      //   next: (response) => {
      //     if (response.ok) {
      //       this.messageService.add({
      //         severity: 'success',
      //         summary: 'Cuenta eliminada',
      //         detail: 'Tu cuenta ha sido eliminada exitosamente'
      //       });
      //       // Cerrar sesión y redirigir
      //       this.authService.logout();
      //       this.router.navigate(['/home']);
      //     }
      //   },
      //   error: (err) => {
      //     this.messageService.add({
      //       severity: 'error',
      //       summary: 'Error',
      //       detail: 'No se pudo eliminar la cuenta'
      //     });
      //   }
      // });

      // Simulación
      this.messageService.add({
        severity: 'success',
        summary: 'Cuenta eliminada',
        detail: 'Tu cuenta ha sido eliminada exitosamente'
      });
      this.cerrarDialogoEliminar();
    }
  }
}