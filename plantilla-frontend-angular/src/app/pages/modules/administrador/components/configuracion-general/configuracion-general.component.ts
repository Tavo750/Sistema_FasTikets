import { Component, OnInit } from '@angular/core';
import { CartTimerService } from '../../../../../shared/services/cart-timer.service';
import { MessageService } from 'primeng/api';
import { CodigosPromocionalesService } from '../../services/codigos-promocionales.service';
import { ReglaPuntos, CreateReglaPuntosRequest, UpdateReglaPuntosRequest } from '../../interfaces/reglas-puntos/reglas-puntos.interface';

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

  // Configuración de Reglas de Puntos
  reglasPuntos: ReglaPuntos[] = [];
  loadingReglas: boolean = false;
  editandoRegla: ReglaPuntos | null = null;
  mostrarDialogRegla: boolean = false;
  searchReglas: string = '';
  formularioRegla: CreateReglaPuntosRequest = {
    solesPorPunto: 1,
    tipoRegla: 'COMPRA',
    activo: true,
    estado: 'ACTIVO'
  };
  guardandoRegla: boolean = false;

  constructor(
    private cartTimerService: CartTimerService,
    private messageService: MessageService,
    private codigosPromocionalesService: CodigosPromocionalesService
  ) {}

  ngOnInit(): void {
    this.loadCurrentSettings();
    this.cargarReglasPuntos();
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

  // ==================== REGLAS DE PUNTOS ====================

  /**
   * Carga las reglas de puntos desde el backend
   */
  cargarReglasPuntos(): void {
    this.loadingReglas = true;
    this.codigosPromocionalesService.getReglasPuntos().subscribe({
      next: (response) => {
        this.loadingReglas = false;
        if (response.ok && response.data) {
          this.reglasPuntos = response.data;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensaje || 'No se pudieron cargar las reglas de puntos'
          });
        }
      },
      error: (error) => {
        this.loadingReglas = false;
        console.error('Error al cargar reglas de puntos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las reglas de puntos'
        });
      }
    });
  }

  /**
   * Abre el diálogo para crear una nueva regla
   */
  abrirDialogNuevaRegla(): void {
    this.editandoRegla = null;
    this.formularioRegla = {
      solesPorPunto: 1,
      tipoRegla: 'COMPRA',
      activo: true,
      estado: 'ACTIVO'
    };
    this.mostrarDialogRegla = true;
  }

  /**
   * Abre el diálogo para editar una regla existente
   */
  abrirDialogEditarRegla(regla: ReglaPuntos): void {
    this.editandoRegla = regla;
    this.formularioRegla = {
      solesPorPunto: regla.solesPorPunto,
      tipoRegla: regla.tipoRegla as 'CANJE' | 'COMPRA',
      activo: regla.activo,
      estado: regla.estado
    };
    this.mostrarDialogRegla = true;
  }

  /**
   * Guarda una regla de puntos (crear o actualizar)
   */
  guardarRegla(): void {
    if (this.formularioRegla.solesPorPunto <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'Los soles por punto deben ser mayor a 0'
      });
      return;
    }

    this.guardandoRegla = true;

    if (this.editandoRegla) {
      // Actualizar
      const updateData: UpdateReglaPuntosRequest = {
        solesPorPunto: this.formularioRegla.solesPorPunto,
        tipoRegla: this.formularioRegla.tipoRegla,
        activo: this.formularioRegla.activo,
        estado: this.formularioRegla.estado
      };

      this.codigosPromocionalesService.updateReglaPuntos(this.editandoRegla.idRegla, updateData).subscribe({
        next: (response) => {
          this.guardandoRegla = false;
          if (response.ok) {
            this.messageService.add({
              severity: 'success',
              summary: 'Actualizado',
              detail: 'Regla de puntos actualizada correctamente'
            });
            this.cargarReglasPuntos();
            this.cerrarDialogRegla();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.mensaje || 'No se pudo actualizar la regla'
            });
          }
        },
        error: (error) => {
          this.guardandoRegla = false;
          console.error('Error al actualizar regla:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la regla de puntos'
          });
        }
      });
    } else {
      // Crear
      this.codigosPromocionalesService.createReglaPuntos(this.formularioRegla).subscribe({
        next: (response) => {
          this.guardandoRegla = false;
          if (response.ok) {
            this.messageService.add({
              severity: 'success',
              summary: 'Creado',
              detail: 'Regla de puntos creada correctamente'
            });
            this.cargarReglasPuntos();
            this.cerrarDialogRegla();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.mensaje || 'No se pudo crear la regla'
            });
          }
        },
        error: (error) => {
          this.guardandoRegla = false;
          console.error('Error al crear regla:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear la regla de puntos'
          });
        }
      });
    }
  }

  /**
   * Elimina una regla de puntos
   */
  eliminarRegla(regla: ReglaPuntos): void {
    this.codigosPromocionalesService.deleteReglaPuntos(regla.idRegla).subscribe({
      next: (response) => {
        if (response.ok) {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Regla de puntos eliminada correctamente'
          });
          this.cargarReglasPuntos();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensaje || 'No se pudo eliminar la regla'
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar regla:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar la regla de puntos'
        });
      }
    });
  }

  /**
   * Cierra el diálogo de regla
   */
  cerrarDialogRegla(): void {
    this.mostrarDialogRegla = false;
    this.editandoRegla = null;
  }

  /**
   * Obtiene la etiqueta del tipo de regla
   */
  getTipoReglaLabel(tipo: string): string {
    return tipo === 'COMPRA' ? 'Por Compra' : 'Por Canje';
  }

  /**
   * Obtiene la severidad del badge según el estado
   */
  getEstadoSeverity(activo: boolean): 'success' | 'danger' {
    return activo ? 'success' : 'danger';
  }

  /**
   * Obtiene la severidad del tag según el tipo de regla
   */
  getTipoReglaSeverity(tipo: string): 'info' | 'warning' {
    return tipo === 'COMPRA' ? 'info' : 'warning';
  }

  /**
   * Obtiene la severidad del tag según el estado activo
   */
  getActivoSeverity(activo: boolean): 'success' | 'danger' {
    return activo ? 'success' : 'danger';
  }
}
