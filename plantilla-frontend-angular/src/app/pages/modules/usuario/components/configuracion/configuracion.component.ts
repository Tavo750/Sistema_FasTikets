import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PerfilPersonalService } from '../../services/perfil-personal.service';
import { SessionService } from '../../../../../shared/services/session.service';
import { EliminarCuentaResponse } from '../../interfaces/perfil-personal/eliminar-cuenta.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../../../../prime-ng/prime-ng.module';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNgModule],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css'],
  // use global MessageService provided in AppModule
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
    private messageService: MessageService,
    private perfilService: PerfilPersonalService,
    private sessionService: SessionService
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
      // Llamada real al servicio para eliminar la cuenta
      const resp$ = this.perfilService.deleteMiCuenta();
      resp$.subscribe({
        next: (response: EliminarCuentaResponse) => {
          if (response?.ok) {
            this.messageService.add({ severity: 'success', summary: 'Cuenta eliminada', detail: response.mensaje || 'Tu cuenta ha sido eliminada exitosamente' });
            // Limpiar sesión y redirigir al home/login
            this.sessionService.clearUser();
            this.cerrarDialogoEliminar();
            this.router.navigate(['/home']);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.mensaje || 'No se pudo eliminar la cuenta' });
          }
        },
        error: (err: any) => {
          const msg = err?.error?.mensaje || err?.message || 'Error en el servidor';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
        }
      });
    }
  }
}