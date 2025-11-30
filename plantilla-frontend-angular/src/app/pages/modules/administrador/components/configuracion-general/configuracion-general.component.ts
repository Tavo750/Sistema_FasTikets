import { Component, OnInit } from '@angular/core';
import { CartTimerService } from '../../../../../shared/services/cart-timer.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-configuracion-general',
  standalone: false,
  templateUrl: './configuracion-general.component.html',
  styleUrl: './configuracion-general.component.css'
})
export class ConfiguracionGeneralComponent implements OnInit {
  
  // Configuración del tiempo límite del carrito
  cartTimeLimitMinutes: number = 15;
  originalTimeLimitMinutes: number = 15;
  
  // Estados
  isSaving: boolean = false;
  hasChanges: boolean = false;

  constructor(
    private cartTimerService: CartTimerService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCurrentSettings();
  }

  /**
   * Carga la configuración actual
   */
  loadCurrentSettings(): void {
    this.cartTimeLimitMinutes = this.cartTimerService.getTimeLimitMinutes();
    this.originalTimeLimitMinutes = this.cartTimeLimitMinutes;
    this.hasChanges = false;
  }

  /**
   * Detecta cambios en el formulario
   */
  onTimeLimitChange(): void {
    this.hasChanges = this.cartTimeLimitMinutes !== this.originalTimeLimitMinutes;
  }

  /**
   * Guarda los cambios de configuración
   */
  saveSettings(): void {
    // Validar rango
    if (this.cartTimeLimitMinutes < 1 || this.cartTimeLimitMinutes > 120) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'El tiempo límite debe estar entre 1 y 120 minutos'
      });
      return;
    }

    this.isSaving = true;

    // Guardar configuración
    const success = this.cartTimerService.setTimeLimitMinutes(this.cartTimeLimitMinutes);

    setTimeout(() => {
      this.isSaving = false;
      
      if (success) {
        this.originalTimeLimitMinutes = this.cartTimeLimitMinutes;
        this.hasChanges = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Configuración guardada',
          detail: `Tiempo límite actualizado a ${this.cartTimeLimitMinutes} minutos`
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar la configuración'
        });
      }
    }, 500);
  }

  /**
   * Cancela los cambios y restaura valores originales
   */
  cancelChanges(): void {
    this.cartTimeLimitMinutes = this.originalTimeLimitMinutes;
    this.hasChanges = false;
  }

  /**
   * Resetea al valor por defecto (15 minutos)
   */
  resetToDefault(): void {
    this.cartTimeLimitMinutes = 15;
    this.hasChanges = this.cartTimeLimitMinutes !== this.originalTimeLimitMinutes;
  }

  /**
   * Incrementa el tiempo en 5 minutos
   */
  increaseTime(): void {
    if (this.cartTimeLimitMinutes < 120) {
      this.cartTimeLimitMinutes = Math.min(120, this.cartTimeLimitMinutes + 5);
      this.onTimeLimitChange();
    }
  }

  /**
   * Decrementa el tiempo en 5 minutos
   */
  decreaseTime(): void {
    if (this.cartTimeLimitMinutes > 1) {
      this.cartTimeLimitMinutes = Math.max(1, this.cartTimeLimitMinutes - 5);
      this.onTimeLimitChange();
    }
  }
}
