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
  
  // Configuración del límite de entradas por cliente
  maxEntradasPorCliente: number = 10;
  originalMaxEntradas: number = 10;
  
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
    
    // Cargar límite de entradas desde localStorage
    const maxEntradas = localStorage.getItem('max_entradas_por_cliente');
    if (maxEntradas) {
      this.maxEntradasPorCliente = parseInt(maxEntradas, 10);
    }
    this.originalMaxEntradas = this.maxEntradasPorCliente;
    
    this.hasChanges = false;
  }

  /**
   * Detecta cambios en el formulario
   */
  onTimeLimitChange(): void {
    this.checkForChanges();
  }

  /**
   * Detecta cambios en el límite de entradas
   */
  onMaxEntradasChange(): void {
    this.checkForChanges();
  }

  /**
   * Verifica si hay cambios en alguna configuración
   */
  private checkForChanges(): void {
    this.hasChanges = 
      this.cartTimeLimitMinutes !== this.originalTimeLimitMinutes ||
      this.maxEntradasPorCliente !== this.originalMaxEntradas;
  }

  /**
   * Guarda los cambios de configuración
   */
  saveSettings(): void {
    // Validar rango de tiempo límite
    if (this.cartTimeLimitMinutes < 1 || this.cartTimeLimitMinutes > 120) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'El tiempo límite debe estar entre 1 y 120 minutos'
      });
      return;
    }

    // Validar rango de límite de entradas
    if (this.maxEntradasPorCliente < 1 || this.maxEntradasPorCliente > 50) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'El límite de entradas debe estar entre 1 y 50'
      });
      return;
    }

    this.isSaving = true;

    // Guardar configuración del timer
    const success = this.cartTimerService.setTimeLimitMinutes(this.cartTimeLimitMinutes);
    
    // Guardar configuración de límite de entradas en localStorage
    localStorage.setItem('max_entradas_por_cliente', String(this.maxEntradasPorCliente));

    setTimeout(() => {
      this.isSaving = false;
      
      if (success) {
        this.originalTimeLimitMinutes = this.cartTimeLimitMinutes;
        this.originalMaxEntradas = this.maxEntradasPorCliente;
        this.hasChanges = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Configuración guardada',
          detail: `Tiempo límite: ${this.cartTimeLimitMinutes} min | Máx. entradas: ${this.maxEntradasPorCliente}`
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
    this.maxEntradasPorCliente = this.originalMaxEntradas;
    this.hasChanges = false;
  }

  /**
   * Resetea al valor por defecto (15 minutos y 10 entradas)
   */
  resetToDefault(): void {
    this.cartTimeLimitMinutes = 15;
    this.maxEntradasPorCliente = 10;
    this.checkForChanges();
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
