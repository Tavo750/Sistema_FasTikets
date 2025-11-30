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
  hasChangesTimer: boolean = false;
  isSavingTimer: boolean = false;
  
  // Configuración del límite de entradas por cliente
  maxEntradasPorCliente: number = 10;
  originalMaxEntradas: number = 10;
  hasChangesEntradas: boolean = false;
  isSavingEntradas: boolean = false;
  
  // Estados globales (deprecated - se mantienen por compatibilidad)
  get isSaving(): boolean {
    return this.isSavingTimer || this.isSavingEntradas;
  }
  
  get hasChanges(): boolean {
    return this.hasChangesTimer || this.hasChangesEntradas;
  }

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
    
    // Cargar límite de entradas desde localStorage
    const maxEntradas = localStorage.getItem('max_entradas_por_cliente');
    if (maxEntradas) {
      this.maxEntradasPorCliente = parseInt(maxEntradas, 10);
    }
    this.originalMaxEntradas = this.maxEntradasPorCliente;
  }

  /**
   * Detecta cambios en el formulario
   */
  onTimeLimitChange(): void {
    this.hasChangesTimer = this.cartTimeLimitMinutes !== this.originalTimeLimitMinutes;
  }

  /**
   * Detecta cambios en el límite de entradas
   */
  onMaxEntradasChange(): void {
    this.hasChangesEntradas = this.maxEntradasPorCliente !== this.originalMaxEntradas;
  }

  /**
   * Guarda solo la configuración del tiempo límite
   */
  saveTimerSettings(): void {
    if (this.cartTimeLimitMinutes < 1 || this.cartTimeLimitMinutes > 120) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'El tiempo límite debe estar entre 1 y 120 minutos'
      });
      return;
    }

    this.isSavingTimer = true;
    const success = this.cartTimerService.setTimeLimitMinutes(this.cartTimeLimitMinutes);

    setTimeout(() => {
      this.isSavingTimer = false;
      
      if (success) {
        this.originalTimeLimitMinutes = this.cartTimeLimitMinutes;
        this.hasChangesTimer = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: `Tiempo límite actualizado a ${this.cartTimeLimitMinutes} minutos`
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el tiempo límite'
        });
      }
    }, 500);
  }

  /**
   * Guarda solo la configuración del límite de entradas
   */
  saveEntradasSettings(): void {
    if (this.maxEntradasPorCliente < 1 || this.maxEntradasPorCliente > 50) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'El límite de entradas debe estar entre 1 y 50'
      });
      return;
    }

    this.isSavingEntradas = true;
    localStorage.setItem('max_entradas_por_cliente', String(this.maxEntradasPorCliente));

    setTimeout(() => {
      this.isSavingEntradas = false;
      this.originalMaxEntradas = this.maxEntradasPorCliente;
      this.hasChangesEntradas = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Guardado',
        detail: `Límite de entradas actualizado a ${this.maxEntradasPorCliente}`
      });
    }, 500);
  }

  /**
   * Cancela los cambios del tiempo límite
   */
  cancelTimerChanges(): void {
    this.cartTimeLimitMinutes = this.originalTimeLimitMinutes;
    this.hasChangesTimer = false;
  }

  /**
   * Cancela los cambios del límite de entradas
   */
  cancelEntradasChanges(): void {
    this.maxEntradasPorCliente = this.originalMaxEntradas;
    this.hasChangesEntradas = false;
  }

  /**
   * Cancela los cambios y restaura valores originales (método legacy)
   */
  cancelChanges(): void {
    this.cancelTimerChanges();
    this.cancelEntradasChanges();
  }

  /**
   * Resetea el tiempo límite por defecto (15 minutos)
   */
  resetTimerToDefault(): void {
    this.cartTimeLimitMinutes = 15;
    this.hasChangesTimer = this.cartTimeLimitMinutes !== this.originalTimeLimitMinutes;
  }

  /**
   * Resetea el límite de entradas por defecto (10 entradas)
   */
  resetEntradasToDefault(): void {
    this.maxEntradasPorCliente = 10;
    this.hasChangesEntradas = this.maxEntradasPorCliente !== this.originalMaxEntradas;
  }

  /**
   * Resetea al valor por defecto (15 minutos y 10 entradas) - método legacy
   */
  resetToDefault(): void {
    this.resetTimerToDefault();
    this.resetEntradasToDefault();
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

  /**
   * Incrementa el límite de entradas en 5
   */
  increaseMaxEntradas(): void {
    if (this.maxEntradasPorCliente < 50) {
      this.maxEntradasPorCliente = Math.min(50, this.maxEntradasPorCliente + 5);
      this.onMaxEntradasChange();
    }
  }

  /**
   * Decrementa el límite de entradas en 5
   */
  decreaseMaxEntradas(): void {
    if (this.maxEntradasPorCliente > 1) {
      this.maxEntradasPorCliente = Math.max(1, this.maxEntradasPorCliente - 5);
      this.onMaxEntradasChange();
    }
  }
}
