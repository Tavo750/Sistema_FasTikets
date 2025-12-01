import { Component, OnInit } from '@angular/core';
import { CartTimerService } from '../../../../../shared/services/cart-timer.service';
import { MessageService } from 'primeng/api';
import { CodigosPromocionalesService } from '../../services/codigos-promocionales.service';
import { ReglaPuntos, CreateReglaPuntosRequest, UpdateReglaPuntosRequest } from '../../interfaces/reglas-puntos/reglas-puntos.interface';
import { ConfiguracionGeneralService } from '../../services/configuracion-general.service';
import { ConfiguracionItem, ConfiguracionRequest } from '../../interfaces/configuracion-general/configuracion-general.interface';

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
  maxEntradasPorCliente: number = 4;
  originalMaxEntradas: number = 4;
  hasChangesEntradas: boolean = false;
  isSavingEntradas: boolean = false;
  
  // Configuración del límite de transferencias de tickets
  maxTransferenciasTicket: number = 3;
  originalMaxTransferencias: number = 3;
  hasChangesTransferencias: boolean = false;
  isSavingTransferencias: boolean = false;
  
  // Estados globales (deprecated - se mantienen por compatibilidad)
  get isSaving(): boolean {
    return this.isSavingTimer || this.isSavingEntradas || this.isSavingTransferencias;
  }
  
  get hasChanges(): boolean {
    return this.hasChangesTimer || this.hasChangesEntradas || this.hasChangesTransferencias;
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

  // Configuraciones Generales (desde backend)
  configuraciones: ConfiguracionItem[] = [];
  loadingConfiguraciones: boolean = false;
  editandoConfiguracion: ConfiguracionItem | null = null;
  mostrarDialogConfiguracion: boolean = false;
  searchConfiguraciones: string = '';
  formularioConfiguracion: ConfiguracionRequest = {
    key: '',
    value: '',
    descripcion: '',
    valueType: 'string'
  };
  guardandoConfiguracion: boolean = false;
  tiposValor: { label: string; value: string }[] = [
    { label: 'Texto', value: 'string' },
    { label: 'Número', value: 'number' },
    { label: 'Booleano', value: 'boolean' },
    { label: 'JSON', value: 'json' }
  ];

  constructor(
    private cartTimerService: CartTimerService,
    private messageService: MessageService,
    private codigosPromocionalesService: CodigosPromocionalesService,
    private configuracionGeneralService: ConfiguracionGeneralService
  ) {}

  ngOnInit(): void {
    this.loadCurrentSettings();
    this.cargarReglasPuntos();
    this.cargarConfiguraciones();
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
    
    // Cargar límite de transferencias desde localStorage
    const maxTransferencias = localStorage.getItem('max_transferencias_ticket');
    if (maxTransferencias) {
      this.maxTransferenciasTicket = parseInt(maxTransferencias, 10);
    }
    this.originalMaxTransferencias = this.maxTransferenciasTicket;
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
   * Detecta cambios en el límite de transferencias
   */
  onMaxTransferenciasChange(): void {
    this.hasChangesTransferencias = this.maxTransferenciasTicket !== this.originalMaxTransferencias;
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

    if (success) {
      // Actualizar también en configuraciones generales
      this.sincronizarTiempoCarroConfiguracion(this.cartTimeLimitMinutes);
    } else {
      this.isSavingTimer = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo guardar el tiempo límite'
      });
    }
  }

  /**
   * Sincroniza el tiempo del carrito con la configuración general TIEMPO_CARRO_MINUTOS
   */
  private sincronizarTiempoCarroConfiguracion(minutos: number): void {
    const configRequest: ConfiguracionRequest = {
      key: 'TIEMPO_CARRO_MINUTOS',
      value: String(minutos),
      descripcion: 'Tiempo máximo en minutos que un cliente tiene para completar su compra',
      valueType: 'number'
    };

    // Primero intentar actualizar, si no existe, crear
    this.configuracionGeneralService.updateConfiguracion('TIEMPO_CARRO_MINUTOS', configRequest).subscribe({
      next: (response) => {
        this.isSavingTimer = false;
        if (response.ok) {
          this.originalTimeLimitMinutes = this.cartTimeLimitMinutes;
          this.hasChangesTimer = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: `Tiempo límite actualizado a ${this.cartTimeLimitMinutes} minutos`
          });
          // Recargar configuraciones para reflejar el cambio
          this.cargarConfiguraciones();
        }
      },
      error: (error) => {
        // Si falla porque no existe, intentar crear
        this.configuracionGeneralService.createConfiguracion(configRequest).subscribe({
          next: (response) => {
            this.isSavingTimer = false;
            if (response.ok) {
              this.originalTimeLimitMinutes = this.cartTimeLimitMinutes;
              this.hasChangesTimer = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Guardado',
                detail: `Tiempo límite actualizado a ${this.cartTimeLimitMinutes} minutos`
              });
              this.cargarConfiguraciones();
            }
          },
          error: () => {
            this.isSavingTimer = false;
            this.messageService.add({
              severity: 'warning',
              summary: 'Guardado parcial',
              detail: 'Tiempo guardado localmente, pero no se pudo sincronizar con configuración general'
            });
          }
        });
      }
    });
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

    // Actualizar también en configuraciones generales
    this.sincronizarLimiteEntradasConfiguracion(this.maxEntradasPorCliente);
  }

  /**
   * Sincroniza el límite de entradas con la configuración general LIMITE_PERSONAS_COMPRA
   */
  private sincronizarLimiteEntradasConfiguracion(limite: number): void {
    const configRequest: ConfiguracionRequest = {
      key: 'LIMITE_PERSONAS_COMPRA',
      value: String(limite),
      descripcion: 'Número máximo de entradas que un cliente puede comprar por evento',
      valueType: 'number'
    };

    // Primero intentar actualizar, si no existe, crear
    this.configuracionGeneralService.updateConfiguracion('LIMITE_PERSONAS_COMPRA', configRequest).subscribe({
      next: (response) => {
        this.isSavingEntradas = false;
        if (response.ok) {
          this.originalMaxEntradas = this.maxEntradasPorCliente;
          this.hasChangesEntradas = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: `Límite de entradas actualizado a ${this.maxEntradasPorCliente}`
          });
          // Recargar configuraciones para reflejar el cambio
          this.cargarConfiguraciones();
        }
      },
      error: (error) => {
        // Si falla porque no existe, intentar crear
        this.configuracionGeneralService.createConfiguracion(configRequest).subscribe({
          next: (response) => {
            this.isSavingEntradas = false;
            if (response.ok) {
              this.originalMaxEntradas = this.maxEntradasPorCliente;
              this.hasChangesEntradas = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Guardado',
                detail: `Límite de entradas actualizado a ${this.maxEntradasPorCliente}`
              });
              this.cargarConfiguraciones();
            }
          },
          error: () => {
            this.isSavingEntradas = false;
            this.messageService.add({
              severity: 'warning',
              summary: 'Guardado parcial',
              detail: 'Límite guardado localmente, pero no se pudo sincronizar con configuración general'
            });
          }
        });
      }
    });
  }

  /**
   * Guarda solo la configuración del límite de transferencias
   */
  saveTransferenciasSettings(): void {
    if (this.maxTransferenciasTicket < 0 || this.maxTransferenciasTicket > 20) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'El límite de transferencias debe estar entre 0 y 20'
      });
      return;
    }

    this.isSavingTransferencias = true;
    localStorage.setItem('max_transferencias_ticket', String(this.maxTransferenciasTicket));

    // Actualizar también en configuraciones generales
    this.sincronizarLimiteTransferenciasConfiguracion(this.maxTransferenciasTicket);
  }

  /**
   * Sincroniza el límite de transferencias con la configuración general LIMITE_TRANSFERENCIAS_TICKET
   */
  private sincronizarLimiteTransferenciasConfiguracion(limite: number): void {
    const configRequest: ConfiguracionRequest = {
      key: 'LIMITE_TRANSFERENCIAS_TICKET',
      value: String(limite),
      descripcion: 'Número máximo de veces que una persona puede transferir un ticket',
      valueType: 'number'
    };

    // Primero intentar actualizar, si no existe, crear
    this.configuracionGeneralService.updateConfiguracion('LIMITE_TRANSFERENCIAS_TICKET', configRequest).subscribe({
      next: (response) => {
        this.isSavingTransferencias = false;
        if (response.ok) {
          this.originalMaxTransferencias = this.maxTransferenciasTicket;
          this.hasChangesTransferencias = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: `Límite de transferencias actualizado a ${this.maxTransferenciasTicket}`
          });
          // Recargar configuraciones para reflejar el cambio
          this.cargarConfiguraciones();
        }
      },
      error: (error) => {
        // Si falla porque no existe, intentar crear
        this.configuracionGeneralService.createConfiguracion(configRequest).subscribe({
          next: (response) => {
            this.isSavingTransferencias = false;
            if (response.ok) {
              this.originalMaxTransferencias = this.maxTransferenciasTicket;
              this.hasChangesTransferencias = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Guardado',
                detail: `Límite de transferencias actualizado a ${this.maxTransferenciasTicket}`
              });
              this.cargarConfiguraciones();
            }
          },
          error: () => {
            this.isSavingTransferencias = false;
            this.messageService.add({
              severity: 'warning',
              summary: 'Guardado parcial',
              detail: 'Límite guardado localmente, pero no se pudo sincronizar con configuración general'
            });
          }
        });
      }
    });
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
   * Cancela los cambios del límite de transferencias
   */
  cancelTransferenciasChanges(): void {
    this.maxTransferenciasTicket = this.originalMaxTransferencias;
    this.hasChangesTransferencias = false;
  }

  /**
   * Cancela los cambios y restaura valores originales (método legacy)
   */
  cancelChanges(): void {
    this.cancelTimerChanges();
    this.cancelEntradasChanges();
    this.cancelTransferenciasChanges();
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
   * Resetea el límite de transferencias por defecto (3 transferencias)
   */
  resetTransferenciasToDefault(): void {
    this.maxTransferenciasTicket = 3;
    this.hasChangesTransferencias = this.maxTransferenciasTicket !== this.originalMaxTransferencias;
  }

  /**
   * Resetea al valor por defecto (15 minutos, 10 entradas y 3 transferencias) - método legacy
   */
  resetToDefault(): void {
    this.resetTimerToDefault();
    this.resetEntradasToDefault();
    this.resetTransferenciasToDefault();
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

  /**
   * Incrementa el límite de transferencias en 1
   */
  increaseMaxTransferencias(): void {
    if (this.maxTransferenciasTicket < 20) {
      this.maxTransferenciasTicket = Math.min(20, this.maxTransferenciasTicket + 1);
      this.onMaxTransferenciasChange();
    }
  }

  /**
   * Decrementa el límite de transferencias en 1
   */
  decreaseMaxTransferencias(): void {
    if (this.maxTransferenciasTicket > 0) {
      this.maxTransferenciasTicket = Math.max(0, this.maxTransferenciasTicket - 1);
      this.onMaxTransferenciasChange();
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

  /**
   * Obtiene un ejemplo de conversión de puntos
   * Muestra cuántos puntos se obtienen o necesitan según el tipo de regla
   */
  getEjemploConversion(regla: ReglaPuntos): string {
    if (regla.tipoRegla === 'COMPRA') {
      // Por compra: muestra cuántos soles necesitas gastar para obtener 1 punto
      return `Por cada S/ ${regla.solesPorPunto.toFixed(2)} en compras = 1 punto`;
    } else {
      // Por canje: muestra cuánto descuento obtienes por 1 punto
      return `1 punto = S/ ${regla.solesPorPunto.toFixed(2)} de descuento`;
    }
  }

  /**
   * Obtiene ejemplos múltiples de conversión
   */
  getEjemplosMultiples(regla: ReglaPuntos): string[] {
    const ejemplos: string[] = [];
    
    if (regla.tipoRegla === 'COMPRA') {
      // Ejemplos de acumulación
      ejemplos.push(`S/ ${(regla.solesPorPunto * 10).toFixed(2)} → 10 puntos`);
      ejemplos.push(`S/ ${(regla.solesPorPunto * 50).toFixed(2)} → 50 puntos`);
      ejemplos.push(`S/ ${(regla.solesPorPunto * 100).toFixed(2)} → 100 puntos`);
    } else {
      // Ejemplos de canje
      ejemplos.push(`10 puntos → S/ ${(regla.solesPorPunto * 10).toFixed(2)} desc.`);
      ejemplos.push(`50 puntos → S/ ${(regla.solesPorPunto * 50).toFixed(2)} desc.`);
      ejemplos.push(`100 puntos → S/ ${(regla.solesPorPunto * 100).toFixed(2)} desc.`);
    }
    
    return ejemplos;
  }

  // ==================== CONFIGURACIONES GENERALES ====================

  /**
   * Carga las configuraciones generales desde el backend
   */
  cargarConfiguraciones(): void {
    this.loadingConfiguraciones = true;
    this.configuracionGeneralService.getConfiguraciones().subscribe({
      next: (response) => {
        this.loadingConfiguraciones = false;
        if (response.ok && response.data) {
          this.configuraciones = response.data;
          
          // Sincronizar TIEMPO_CARRO_MINUTOS con CartTimerService si existe
          const tiempoCarroConfig = response.data.find(c => c.key === 'TIEMPO_CARRO_MINUTOS');
          if (tiempoCarroConfig) {
            const minutos = parseInt(tiempoCarroConfig.value, 10);
            if (!isNaN(minutos) && minutos >= 1 && minutos <= 120) {
              this.cartTimerService.setTimeLimitMinutes(minutos);
              this.cartTimeLimitMinutes = minutos;
              this.originalTimeLimitMinutes = minutos;
              this.hasChangesTimer = false;
            }
          }

          // Sincronizar LIMITE_PERSONAS_COMPRA con localStorage si existe
          const limiteEntradasConfig = response.data.find(c => c.key === 'LIMITE_PERSONAS_COMPRA');
          if (limiteEntradasConfig) {
            const limite = parseInt(limiteEntradasConfig.value, 10);
            if (!isNaN(limite) && limite >= 1 && limite <= 50) {
              localStorage.setItem('max_entradas_por_cliente', String(limite));
              this.maxEntradasPorCliente = limite;
              this.originalMaxEntradas = limite;
              this.hasChangesEntradas = false;
            }
          }

          // Sincronizar LIMITE_TRANSFERENCIAS_TICKET con localStorage si existe
          const limiteTransferenciasConfig = response.data.find(c => c.key === 'LIMITE_TRANSFERENCIAS_TICKET');
          if (limiteTransferenciasConfig) {
            const limite = parseInt(limiteTransferenciasConfig.value, 10);
            if (!isNaN(limite) && limite >= 0 && limite <= 20) {
              localStorage.setItem('max_transferencias_ticket', String(limite));
              this.maxTransferenciasTicket = limite;
              this.originalMaxTransferencias = limite;
              this.hasChangesTransferencias = false;
            }
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensaje || 'No se pudieron cargar las configuraciones'
          });
        }
      },
      error: (error) => {
        this.loadingConfiguraciones = false;
        console.error('Error al cargar configuraciones:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las configuraciones generales'
        });
      }
    });
  }

  /**
   * Abre el diálogo para crear una nueva configuración
   */
  abrirDialogNuevaConfiguracion(): void {
    this.editandoConfiguracion = null;
    this.formularioConfiguracion = {
      key: '',
      value: '',
      descripcion: '',
      valueType: 'string'
    };
    this.mostrarDialogConfiguracion = true;
  }

  /**
   * Abre el diálogo para editar una configuración existente
   */
  abrirDialogEditarConfiguracion(config: ConfiguracionItem): void {
    this.editandoConfiguracion = config;
    this.formularioConfiguracion = {
      key: config.key,
      value: config.value,
      descripcion: config.descripcion,
      valueType: config.valueType
    };
    this.mostrarDialogConfiguracion = true;
  }

  /**
   * Guarda una configuración (crear o actualizar)
   */
  guardarConfiguracion(): void {
    // Validaciones
    if (!this.formularioConfiguracion.key || !this.formularioConfiguracion.key.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'La clave es requerida'
      });
      return;
    }

    if (!this.formularioConfiguracion.value || !this.formularioConfiguracion.value.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'El valor es requerido'
      });
      return;
    }

    this.guardandoConfiguracion = true;

    if (this.editandoConfiguracion) {
      // Actualizar
      this.configuracionGeneralService.updateConfiguracion(this.editandoConfiguracion.key, this.formularioConfiguracion).subscribe({
        next: (response) => {
          this.guardandoConfiguracion = false;
          if (response.ok) {
            // Si se actualizó TIEMPO_CARRO_MINUTOS, sincronizar con CartTimerService
            if (this.editandoConfiguracion!.key === 'TIEMPO_CARRO_MINUTOS') {
              const minutos = parseInt(this.formularioConfiguracion.value, 10);
              if (!isNaN(minutos) && minutos >= 1 && minutos <= 120) {
                this.cartTimerService.setTimeLimitMinutes(minutos);
                this.cartTimeLimitMinutes = minutos;
                this.originalTimeLimitMinutes = minutos;
                this.hasChangesTimer = false;
              }
            }
            // Si se actualizó LIMITE_PERSONAS_COMPRA, sincronizar con localStorage
            if (this.editandoConfiguracion!.key === 'LIMITE_PERSONAS_COMPRA') {
              const limite = parseInt(this.formularioConfiguracion.value, 10);
              if (!isNaN(limite) && limite >= 1 && limite <= 50) {
                localStorage.setItem('max_entradas_por_cliente', String(limite));
                this.maxEntradasPorCliente = limite;
                this.originalMaxEntradas = limite;
                this.hasChangesEntradas = false;
              }
            }
            // Si se actualizó LIMITE_TRANSFERENCIAS_TICKET, sincronizar con localStorage
            if (this.editandoConfiguracion!.key === 'LIMITE_TRANSFERENCIAS_TICKET') {
              const limite = parseInt(this.formularioConfiguracion.value, 10);
              if (!isNaN(limite) && limite >= 0 && limite <= 20) {
                localStorage.setItem('max_transferencias_ticket', String(limite));
                this.maxTransferenciasTicket = limite;
                this.originalMaxTransferencias = limite;
                this.hasChangesTransferencias = false;
              }
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Actualizado',
              detail: 'Configuración actualizada correctamente'
            });
            this.cargarConfiguraciones();
            this.cerrarDialogConfiguracion();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.mensaje || 'No se pudo actualizar la configuración'
            });
          }
        },
        error: (error) => {
          this.guardandoConfiguracion = false;
          console.error('Error al actualizar configuración:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la configuración'
          });
        }
      });
    } else {
      // Crear
      this.configuracionGeneralService.createConfiguracion(this.formularioConfiguracion).subscribe({
        next: (response) => {
          this.guardandoConfiguracion = false;
          if (response.ok) {
            this.messageService.add({
              severity: 'success',
              summary: 'Creado',
              detail: 'Configuración creada correctamente'
            });
            this.cargarConfiguraciones();
            this.cerrarDialogConfiguracion();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.mensaje || 'No se pudo crear la configuración'
            });
          }
        },
        error: (error) => {
          this.guardandoConfiguracion = false;
          console.error('Error al crear configuración:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear la configuración'
          });
        }
      });
    }
  }

  /**
   * Elimina una configuración
   */
  eliminarConfiguracion(config: ConfiguracionItem): void {
    this.configuracionGeneralService.deleteConfiguracion(config.key).subscribe({
      next: (response) => {
        if (response.ok) {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Configuración eliminada correctamente'
          });
          this.cargarConfiguraciones();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensaje || 'No se pudo eliminar la configuración'
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar configuración:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar la configuración'
        });
      }
    });
  }

  /**
   * Cierra el diálogo de configuración
   */
  cerrarDialogConfiguracion(): void {
    this.mostrarDialogConfiguracion = false;
    this.editandoConfiguracion = null;
  }

  /**
   * Obtiene la etiqueta del tipo de valor
   */
  getTipoValorLabel(tipo: string): string {
    const tipos: { [key: string]: string } = {
      'string': 'Texto',
      'number': 'Número',
      'boolean': 'Booleano',
      'json': 'JSON'
    };
    return tipos[tipo] || tipo;
  }

  /**
   * Obtiene la severidad del tag según el tipo de valor
   */
  getTipoValorSeverity(tipo: string): 'success' | 'info' | 'warning' | 'danger' {
    const severities: { [key: string]: 'success' | 'info' | 'warning' | 'danger' } = {
      'string': 'info',
      'number': 'success',
      'boolean': 'warning',
      'json': 'danger'
    };
    return severities[tipo] || 'info';
  }
}
